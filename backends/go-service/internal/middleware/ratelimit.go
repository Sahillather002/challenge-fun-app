package middleware

import (
	"net/http"
	"sync"
	"time"

	"golang.org/x/time/rate"
)

// RateLimiter implements token bucket rate limiting
type RateLimiter struct {
	visitors map[string]*rate.Limiter
	mu       sync.RWMutex
	rate     rate.Limit
	burst    int
}

// NewRateLimiter creates a new rate limiter
// rate: requests per second
// burst: maximum burst size
func NewRateLimiter(r rate.Limit, b int) *RateLimiter {
	return &RateLimiter{
		visitors: make(map[string]*rate.Limiter),
		rate:     r,
		burst:    b,
	}
}

// getVisitor returns the rate limiter for a specific visitor
func (rl *RateLimiter) getVisitor(key string) *rate.Limiter {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	limiter, exists := rl.visitors[key]
	if !exists {
		limiter = rate.NewLimiter(rl.rate, rl.burst)
		rl.visitors[key] = limiter
	}

	return limiter
}

// cleanupVisitors removes old visitors periodically
func (rl *RateLimiter) cleanupVisitors() {
	ticker := time.NewTicker(5 * time.Minute)
	defer ticker.Stop()

	for range ticker.C {
		rl.mu.Lock()
		// Clear all visitors (simple approach)
		// In production, track last access time and remove only inactive ones
		rl.visitors = make(map[string]*rate.Limiter)
		rl.mu.Unlock()
	}
}

// RateLimitMiddleware creates a rate limiting middleware
func RateLimitMiddleware(rl *RateLimiter) func(http.Handler) http.Handler {
	// Start cleanup goroutine
	go rl.cleanupVisitors()

	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Use user ID from context if available, otherwise use IP
			key := r.RemoteAddr
			if userID, ok := r.Context().Value(UserIDKey).(string); ok && userID != "" {
				key = userID
			}

			limiter := rl.getVisitor(key)
			if !limiter.Allow() {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("X-RateLimit-Limit", "100")
				w.Header().Set("X-RateLimit-Remaining", "0")
				w.Header().Set("Retry-After", "60")
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error":"Too Many Requests","message":"Rate limit exceeded. Please try again later.","code":429}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}

// PerEndpointRateLimiter provides different rate limits per endpoint
type PerEndpointRateLimiter struct {
	limiters       map[string]*RateLimiter
	mu             sync.RWMutex
	defaultLimiter *RateLimiter
}

// NewPerEndpointRateLimiter creates a new per-endpoint rate limiter
func NewPerEndpointRateLimiter(defaultRate rate.Limit, defaultBurst int) *PerEndpointRateLimiter {
	return &PerEndpointRateLimiter{
		limiters:       make(map[string]*RateLimiter),
		defaultLimiter: NewRateLimiter(defaultRate, defaultBurst),
	}
}

// SetEndpointLimit sets a custom rate limit for a specific endpoint
func (pel *PerEndpointRateLimiter) SetEndpointLimit(endpoint string, r rate.Limit, burst int) {
	pel.mu.Lock()
	defer pel.mu.Unlock()
	pel.limiters[endpoint] = NewRateLimiter(r, burst)
}

// Middleware returns the rate limiting middleware
func (pel *PerEndpointRateLimiter) Middleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			pel.mu.RLock()
			limiter, exists := pel.limiters[r.URL.Path]
			pel.mu.RUnlock()

			if !exists {
				limiter = pel.defaultLimiter
			}

			// Use user ID from context if available, otherwise use IP
			key := r.RemoteAddr
			if userID, ok := r.Context().Value(UserIDKey).(string); ok && userID != "" {
				key = userID
			}

			visitor := limiter.getVisitor(key)
			if !visitor.Allow() {
				w.Header().Set("Content-Type", "application/json")
				w.Header().Set("X-RateLimit-Limit", "100")
				w.Header().Set("X-RateLimit-Remaining", "0")
				w.Header().Set("Retry-After", "60")
				w.WriteHeader(http.StatusTooManyRequests)
				w.Write([]byte(`{"error":"Too Many Requests","message":"Rate limit exceeded. Please try again later.","code":429}`))
				return
			}

			next.ServeHTTP(w, r)
		})
	}
}
