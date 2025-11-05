package utils

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
)

// HealthStatus represents the health status of a component
type HealthStatus string

const (
	StatusHealthy   HealthStatus = "healthy"
	StatusUnhealthy HealthStatus = "unhealthy"
	StatusDegraded  HealthStatus = "degraded"
)

// ComponentHealth represents the health of a single component
type ComponentHealth struct {
	Status      HealthStatus      `json:"status"`
	Message     string            `json:"message,omitempty"`
	LastChecked time.Time         `json:"last_checked"`
	Metadata    map[string]string `json:"metadata,omitempty"`
}

// HealthCheck represents the overall health check response
type HealthCheck struct {
	Status     HealthStatus               `json:"status"`
	Version    string                     `json:"version"`
	Uptime     time.Duration              `json:"uptime"`
	Timestamp  time.Time                  `json:"timestamp"`
	Components map[string]ComponentHealth `json:"components"`
}

// HealthChecker performs health checks on various components
type HealthChecker struct {
	db          *sql.DB
	redis       *redis.Client
	startTime   time.Time
	version     string
	checkCache  map[string]ComponentHealth
	cacheMutex  sync.RWMutex
	cacheTTL    time.Duration
}

// NewHealthChecker creates a new health checker
func NewHealthChecker(db *sql.DB, redis *redis.Client, version string) *HealthChecker {
	return &HealthChecker{
		db:         db,
		redis:      redis,
		startTime:  time.Now(),
		version:    version,
		checkCache: make(map[string]ComponentHealth),
		cacheTTL:   5 * time.Second, // Cache health checks for 5 seconds
	}
}

// Check performs a comprehensive health check
func (hc *HealthChecker) Check(ctx context.Context) HealthCheck {
	components := make(map[string]ComponentHealth)

	// Check database
	if hc.db != nil {
		components["database"] = hc.checkDatabase(ctx)
	}

	// Check Redis
	if hc.redis != nil {
		components["redis"] = hc.checkRedis(ctx)
	}

	// Determine overall status
	overallStatus := StatusHealthy
	for _, comp := range components {
		if comp.Status == StatusUnhealthy {
			overallStatus = StatusUnhealthy
			break
		}
		if comp.Status == StatusDegraded && overallStatus == StatusHealthy {
			overallStatus = StatusDegraded
		}
	}

	return HealthCheck{
		Status:     overallStatus,
		Version:    hc.version,
		Uptime:     time.Since(hc.startTime),
		Timestamp:  time.Now(),
		Components: components,
	}
}

// checkDatabase checks database connectivity
func (hc *HealthChecker) checkDatabase(ctx context.Context) ComponentHealth {
	// Check cache first
	if cached := hc.getCachedHealth("database"); cached != nil {
		return *cached
	}

	health := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]string),
	}

	// Set timeout for database check
	checkCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	start := time.Now()
	err := hc.db.PingContext(checkCtx)
	duration := time.Since(start)

	if err != nil {
		health.Status = StatusUnhealthy
		health.Message = "Database connection failed: " + err.Error()
	} else {
		health.Status = StatusHealthy
		health.Message = "Database is responsive"
		health.Metadata["response_time_ms"] = strconv.FormatInt(duration.Milliseconds(), 10)

		// Get connection stats
		stats := hc.db.Stats()
		health.Metadata["open_connections"] = strconv.Itoa(stats.OpenConnections)
		health.Metadata["in_use"] = strconv.Itoa(stats.InUse)
		health.Metadata["idle"] = strconv.Itoa(stats.Idle)

		// Check if we're running low on connections
		if stats.OpenConnections >= stats.MaxOpenConnections-5 {
			health.Status = StatusDegraded
			health.Message = "Database connection pool nearly exhausted"
		}
	}

	hc.cacheHealth("database", health)
	return health
}

// checkRedis checks Redis connectivity
func (hc *HealthChecker) checkRedis(ctx context.Context) ComponentHealth {
	// Check cache first
	if cached := hc.getCachedHealth("redis"); cached != nil {
		return *cached
	}

	health := ComponentHealth{
		LastChecked: time.Now(),
		Metadata:    make(map[string]string),
	}

	// Set timeout for Redis check
	checkCtx, cancel := context.WithTimeout(ctx, 2*time.Second)
	defer cancel()

	start := time.Now()
	_, err := hc.redis.Ping(checkCtx).Result()
	duration := time.Since(start)

	if err != nil {
		health.Status = StatusUnhealthy
		health.Message = "Redis connection failed: " + err.Error()
	} else {
		health.Status = StatusHealthy
		health.Message = "Redis is responsive"
		health.Metadata["response_time_ms"] = strconv.FormatInt(duration.Milliseconds(), 10)

		// Get Redis info
		_, err := hc.redis.Info(checkCtx, "memory").Result()
		if err == nil {
			health.Metadata["memory_info"] = "available"
		}

		// Check response time
		if duration > 100*time.Millisecond {
			health.Status = StatusDegraded
			health.Message = "Redis response time is slow"
		}
	}

	hc.cacheHealth("redis", health)
	return health
}

// getCachedHealth retrieves cached health check result
func (hc *HealthChecker) getCachedHealth(component string) *ComponentHealth {
	hc.cacheMutex.RLock()
	defer hc.cacheMutex.RUnlock()

	if health, exists := hc.checkCache[component]; exists {
		if time.Since(health.LastChecked) < hc.cacheTTL {
			return &health
		}
	}
	return nil
}

// cacheHealth caches health check result
func (hc *HealthChecker) cacheHealth(component string, health ComponentHealth) {
	hc.cacheMutex.Lock()
	defer hc.cacheMutex.Unlock()
	hc.checkCache[component] = health
}

// LivenessHandler returns a simple liveness probe handler
func (hc *HealthChecker) LivenessHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(map[string]string{
			"status": "alive",
		})
	}
}

// ReadinessHandler returns a readiness probe handler
func (hc *HealthChecker) ReadinessHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		health := hc.Check(r.Context())

		w.Header().Set("Content-Type", "application/json")

		if health.Status == StatusHealthy {
			w.WriteHeader(http.StatusOK)
		} else {
			w.WriteHeader(http.StatusServiceUnavailable)
		}

		json.NewEncoder(w).Encode(health)
	}
}

// DetailedHealthHandler returns a detailed health check handler
func (hc *HealthChecker) DetailedHealthHandler() http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		health := hc.Check(r.Context())

		w.Header().Set("Content-Type", "application/json")

		statusCode := http.StatusOK
		if health.Status == StatusUnhealthy {
			statusCode = http.StatusServiceUnavailable
		} else if health.Status == StatusDegraded {
			statusCode = http.StatusOK // Still return 200 for degraded
		}

		w.WriteHeader(statusCode)
		json.NewEncoder(w).Encode(health)
	}
}
