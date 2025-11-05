# Production Deployment Guide

This guide covers deploying the Go service to production with best practices for performance, security, and reliability.

## Table of Contents
1. [Pre-deployment Checklist](#pre-deployment-checklist)
2. [Performance Optimizations](#performance-optimizations)
3. [Security Hardening](#security-hardening)
4. [Monitoring & Observability](#monitoring--observability)
5. [Deployment Strategies](#deployment-strategies)
6. [Scaling Guidelines](#scaling-guidelines)
7. [Disaster Recovery](#disaster-recovery)

## Pre-deployment Checklist

### Code Quality
- [ ] All tests passing (unit, integration, e2e)
- [ ] Code coverage >80%
- [ ] Linter passing (golangci-lint)
- [ ] Security scan completed (gosec)
- [ ] Dependency audit (go mod verify)
- [ ] Performance benchmarks meet targets

### Configuration
- [ ] Environment variables documented
- [ ] Secrets stored securely (not in code)
- [ ] Database migrations tested
- [ ] Connection pools configured
- [ ] Timeouts configured appropriately
- [ ] Rate limits configured

### Infrastructure
- [ ] Load balancer configured
- [ ] SSL/TLS certificates installed
- [ ] DNS records configured
- [ ] Firewall rules set
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

## Performance Optimizations

### 1. Connection Pooling

#### Database Connection Pool
```go
// cmd/server/main.go
db.SetMaxOpenConns(25)           // Maximum open connections
db.SetMaxIdleConns(5)            // Maximum idle connections
db.SetConnMaxLifetime(5 * time.Minute)  // Connection lifetime
db.SetConnMaxIdleTime(10 * time.Minute) // Idle connection timeout
```

**Tuning Guidelines:**
- `MaxOpenConns`: 2-3x number of CPU cores
- `MaxIdleConns`: 20-30% of MaxOpenConns
- Monitor connection usage and adjust

#### Redis Connection Pool
```go
// internal/services/redis.go
redis.NewClient(&redis.Options{
    PoolSize:     10,              // Connection pool size
    MinIdleConns: 5,               // Minimum idle connections
    MaxRetries:   3,               // Retry failed commands
    PoolTimeout:  4 * time.Second, // Pool timeout
})
```

### 2. Caching Strategy

#### Multi-level Caching
```go
// 1. In-memory cache (fastest)
var memCache = sync.Map{}

// 2. Redis cache (shared across instances)
func GetWithCache(key string) (interface{}, error) {
    // Check memory cache
    if val, ok := memCache.Load(key); ok {
        return val, nil
    }
    
    // Check Redis
    val, err := redis.Get(ctx, key).Result()
    if err == nil {
        memCache.Store(key, val)
        return val, nil
    }
    
    // Fetch from database
    val, err = db.Query(...)
    if err == nil {
        redis.Set(ctx, key, val, 5*time.Minute)
        memCache.Store(key, val)
    }
    
    return val, err
}
```

#### Cache Invalidation
```go
// Invalidate on update
func UpdateScore(req *ScoreUpdateRequest) error {
    // Update database
    err := db.Update(...)
    
    // Invalidate cache
    redis.Del(ctx, fmt.Sprintf("leaderboard:%s", req.CompetitionID))
    memCache.Delete(fmt.Sprintf("leaderboard:%s", req.CompetitionID))
    
    return err
}
```

### 3. Request Optimization

#### Batch Operations
```go
// Instead of multiple single operations
for _, user := range users {
    redis.ZAdd(ctx, key, redis.Z{Score: user.Score, Member: user.ID})
}

// Use pipeline
pipe := redis.Pipeline()
for _, user := range users {
    pipe.ZAdd(ctx, key, redis.Z{Score: user.Score, Member: user.ID})
}
pipe.Exec(ctx)
```

#### Response Compression
```go
// Add compression middleware
import "github.com/gorilla/handlers"

r.Use(handlers.CompressHandler)
```

### 4. Goroutine Management

#### Worker Pool Pattern
```go
type WorkerPool struct {
    tasks   chan Task
    workers int
}

func NewWorkerPool(workers int) *WorkerPool {
    wp := &WorkerPool{
        tasks:   make(chan Task, workers*2),
        workers: workers,
    }
    
    for i := 0; i < workers; i++ {
        go wp.worker()
    }
    
    return wp
}

func (wp *WorkerPool) worker() {
    for task := range wp.tasks {
        task.Execute()
    }
}
```

## Security Hardening

### 1. Input Validation

#### Request Validation Middleware
```go
// pkg/utils/validator.go
type Validator struct {
    maxRequestSize int64
    allowedOrigins []string
}

func (v *Validator) ValidateRequest(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Check request size
        if r.ContentLength > v.maxRequestSize {
            http.Error(w, "Request too large", http.StatusRequestEntityTooLarge)
            return
        }
        
        // Validate content type
        if r.Method == "POST" || r.Method == "PUT" {
            ct := r.Header.Get("Content-Type")
            if !strings.HasPrefix(ct, "application/json") {
                http.Error(w, "Invalid content type", http.StatusUnsupportedMediaType)
                return
            }
        }
        
        next.ServeHTTP(w, r)
    })
}
```

#### Input Sanitization
```go
import "html"

func SanitizeInput(input string) string {
    // Remove HTML tags
    input = html.EscapeString(input)
    
    // Trim whitespace
    input = strings.TrimSpace(input)
    
    // Limit length
    if len(input) > 1000 {
        input = input[:1000]
    }
    
    return input
}
```

### 2. Security Headers

```go
// internal/middleware/security.go
func SecurityHeadersMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Prevent clickjacking
        w.Header().Set("X-Frame-Options", "DENY")
        
        // Prevent MIME sniffing
        w.Header().Set("X-Content-Type-Options", "nosniff")
        
        // XSS protection
        w.Header().Set("X-XSS-Protection", "1; mode=block")
        
        // HSTS
        w.Header().Set("Strict-Transport-Security", "max-age=31536000; includeSubDomains")
        
        // CSP
        w.Header().Set("Content-Security-Policy", "default-src 'self'")
        
        // Referrer policy
        w.Header().Set("Referrer-Policy", "strict-origin-when-cross-origin")
        
        next.ServeHTTP(w, r)
    })
}
```

### 3. Rate Limiting

#### Per-endpoint Rate Limits
```go
// Configure different limits for different endpoints
rateLimiter := middleware.NewPerEndpointRateLimiter(100, 200)

// Stricter limits for write operations
rateLimiter.SetEndpointLimit("/api/v1/leaderboard/update", 10, 20)

// Relaxed limits for read operations
rateLimiter.SetEndpointLimit("/api/v1/leaderboard/*", 100, 200)
```

### 4. Secrets Management

#### Using Environment Variables
```bash
# Never commit secrets to git
# Use secret management services

# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id prod/go-service/jwt-secret

# Kubernetes Secrets
kubectl create secret generic go-service-secrets \
  --from-literal=jwt-secret=your-secret \
  --from-literal=db-password=your-password
```

#### Rotating Secrets
```go
// Support multiple JWT secrets for rotation
type Config struct {
    JWTSecrets []string // Primary and backup secrets
}

func ValidateToken(tokenString string, secrets []string) (*jwt.Token, error) {
    var lastErr error
    
    for _, secret := range secrets {
        token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
            return []byte(secret), nil
        })
        
        if err == nil && token.Valid {
            return token, nil
        }
        lastErr = err
    }
    
    return nil, lastErr
}
```

## Monitoring & Observability

### 1. Metrics Collection

#### Prometheus Integration
```go
// Expose metrics endpoint
r.Handle("/metrics", promhttp.Handler())

// Custom business metrics
metrics.LeaderboardUpdates.Inc()
metrics.WebSocketConnections.Set(float64(activeConnections))
metrics.CacheHits.Inc()
```

#### Key Metrics to Monitor
- **Request rate**: requests/second
- **Error rate**: errors/total requests
- **Response time**: P50, P95, P99
- **Active connections**: WebSocket, DB, Redis
- **Cache hit rate**: hits/(hits+misses)
- **Queue depth**: pending jobs
- **Resource usage**: CPU, memory, disk

### 2. Structured Logging

```go
// Use structured logging
logger.WithFields(map[string]interface{}{
    "user_id":        userID,
    "competition_id": competitionID,
    "score":          score,
    "duration_ms":    duration.Milliseconds(),
}).Info("Score updated")

// Log levels
logger.Debug("Detailed debugging information")
logger.Info("General informational messages")
logger.Warn("Warning messages")
logger.Error("Error messages")
logger.Fatal("Fatal errors")
```

### 3. Distributed Tracing

```go
// OpenTelemetry integration
import (
    "go.opentelemetry.io/otel"
    "go.opentelemetry.io/otel/trace"
)

func ProcessRequest(ctx context.Context) error {
    tracer := otel.Tracer("go-service")
    ctx, span := tracer.Start(ctx, "ProcessRequest")
    defer span.End()
    
    // Add attributes
    span.SetAttributes(
        attribute.String("user.id", userID),
        attribute.Int64("score", score),
    )
    
    // Call other services with context
    err := callExternalAPI(ctx)
    if err != nil {
        span.RecordError(err)
        return err
    }
    
    return nil
}
```

### 4. Alerting Rules

```yaml
# Prometheus alerting rules
groups:
  - name: go-service-alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        annotations:
          summary: "High error rate detected"
          
      - alert: HighResponseTime
        expr: histogram_quantile(0.95, http_request_duration_seconds) > 0.5
        for: 5m
        annotations:
          summary: "High response time detected"
          
      - alert: DatabaseConnectionPoolExhausted
        expr: db_connections_active >= db_connections_max * 0.9
        for: 2m
        annotations:
          summary: "Database connection pool nearly exhausted"
```

## Deployment Strategies

### 1. Blue-Green Deployment

```bash
# Deploy new version (green)
kubectl apply -f k8s/deployment-green.yaml

# Wait for health checks
kubectl wait --for=condition=ready pod -l version=green

# Switch traffic
kubectl patch service go-service -p '{"spec":{"selector":{"version":"green"}}}'

# Monitor for issues
# If problems, rollback:
kubectl patch service go-service -p '{"spec":{"selector":{"version":"blue"}}}'
```

### 2. Canary Deployment

```yaml
# Istio VirtualService for canary
apiVersion: networking.istio.io/v1beta1
kind: VirtualService
metadata:
  name: go-service
spec:
  hosts:
    - go-service
  http:
    - match:
        - headers:
            canary:
              exact: "true"
      route:
        - destination:
            host: go-service
            subset: v2
    - route:
        - destination:
            host: go-service
            subset: v1
          weight: 90
        - destination:
            host: go-service
            subset: v2
          weight: 10
```

### 3. Rolling Update

```yaml
# Kubernetes Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: go-service
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: go-service
          image: go-service:v1.2.0
          readinessProbe:
            httpGet:
              path: /health/ready
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health/live
              port: 8080
            initialDelaySeconds: 15
            periodSeconds: 20
```

## Scaling Guidelines

### Horizontal Scaling

#### Auto-scaling Configuration
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: go-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: go-service
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
    - type: Pods
      pods:
        metric:
          name: http_requests_per_second
        target:
          type: AverageValue
          averageValue: "1000"
```

### Vertical Scaling

#### Resource Limits
```yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "2000m"
```

### Database Scaling

#### Read Replicas
```go
// Configure read replicas
type DBCluster struct {
    primary  *sql.DB
    replicas []*sql.DB
    current  int
}

func (dbc *DBCluster) Read() *sql.DB {
    // Round-robin load balancing
    dbc.current = (dbc.current + 1) % len(dbc.replicas)
    return dbc.replicas[dbc.current]
}

func (dbc *DBCluster) Write() *sql.DB {
    return dbc.primary
}
```

## Disaster Recovery

### 1. Backup Strategy

```bash
# Database backups
# Daily full backup
pg_dump -h localhost -U postgres -d healthcomp > backup_$(date +%Y%m%d).sql

# Continuous WAL archiving
archive_mode = on
archive_command = 'cp %p /backup/wal/%f'

# Redis backups
redis-cli BGSAVE
redis-cli --rdb /backup/redis/dump.rdb
```

### 2. Recovery Procedures

```bash
# Database recovery
psql -h localhost -U postgres -d healthcomp < backup_20240101.sql

# Redis recovery
redis-cli SHUTDOWN SAVE
cp /backup/redis/dump.rdb /var/lib/redis/
redis-server
```

### 3. Failover Strategy

```yaml
# Multi-region deployment
regions:
  - us-east-1 (primary)
  - us-west-2 (standby)
  - eu-west-1 (standby)

# Automatic failover with Route53
health_check_interval: 30s
failure_threshold: 3
failover_time: <60s
```

## Production Checklist

### Before Deployment
- [ ] Run full test suite
- [ ] Perform load testing
- [ ] Review security scan results
- [ ] Update documentation
- [ ] Notify stakeholders
- [ ] Prepare rollback plan

### During Deployment
- [ ] Monitor error rates
- [ ] Check response times
- [ ] Verify health checks
- [ ] Monitor resource usage
- [ ] Check logs for errors

### After Deployment
- [ ] Verify all features working
- [ ] Check monitoring dashboards
- [ ] Review logs
- [ ] Update runbooks
- [ ] Document any issues
- [ ] Send deployment notification

## Troubleshooting

### High Memory Usage
```bash
# Check memory usage
go tool pprof http://localhost:8080/debug/pprof/heap

# Analyze goroutines
go tool pprof http://localhost:8080/debug/pprof/goroutine
```

### High CPU Usage
```bash
# Profile CPU
go tool pprof http://localhost:8080/debug/pprof/profile?seconds=30
```

### Connection Leaks
```bash
# Check open connections
netstat -an | grep ESTABLISHED | wc -l

# Check database connections
SELECT count(*) FROM pg_stat_activity;
```

## Best Practices Summary

1. **Always use connection pooling**
2. **Implement circuit breakers for external calls**
3. **Use structured logging with correlation IDs**
4. **Monitor everything (metrics, logs, traces)**
5. **Implement graceful shutdown**
6. **Use health checks (liveness + readiness)**
7. **Rate limit all endpoints**
8. **Validate and sanitize all inputs**
9. **Use TLS everywhere**
10. **Regular security audits**
11. **Automated backups**
12. **Test disaster recovery procedures**
13. **Document everything**
14. **Use infrastructure as code**
15. **Implement blue-green or canary deployments**
