# Quick Start Guide - Production Improvements

## 🚀 Get Started in 5 Minutes

### 1. Update Dependencies
```bash
cd backends/go-service
go mod tidy
```

### 2. Run Tests
```bash
# Quick test
go test ./internal/services -v

# Full test suite
go test ./... -cover
```

### 3. Start the Service
```bash
# Make sure Redis is running
docker run -d -p 6379:6379 redis:7-alpine

# Start the service
go run cmd/server/main.go
```

### 4. Verify Health
```bash
# Check basic health
curl http://localhost:8080/health

# Check detailed health
curl http://localhost:8080/health/detailed | jq

# View metrics
curl http://localhost:8080/metrics
```

## 🎯 Key Features to Test

### 1. Rate Limiting
```bash
# Send rapid requests to test rate limiting
for i in {1..150}; do
  curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8080/health
done
# You should see some 429 (Too Many Requests) responses
```

### 2. Health Checks
```bash
# Liveness (always returns 200 if service is running)
curl http://localhost:8080/health/live

# Readiness (checks dependencies)
curl http://localhost:8080/health/ready

# Detailed (full component status)
curl http://localhost:8080/health/detailed
```

### 3. Metrics
```bash
# View all metrics
curl http://localhost:8080/metrics

# Filter specific metrics
curl http://localhost:8080/metrics | grep http_requests_total
curl http://localhost:8080/metrics | grep leaderboard_updates
```

### 4. API Testing with Authentication
```bash
# Set your JWT token
export TOKEN="your-jwt-token"

# Update leaderboard
curl -X POST http://localhost:8080/api/v1/leaderboard/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test-user-1",
    "competition_id": "test-comp-1",
    "steps": 10000,
    "distance": 8.5,
    "calories": 500
  }'

# Get leaderboard
curl http://localhost:8080/api/v1/leaderboard/test-comp-1 \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Monitor Performance

### Using Prometheus (if installed)
```bash
# Add to prometheus.yml
scrape_configs:
  - job_name: 'go-service'
    static_configs:
      - targets: ['localhost:8080']
    metrics_path: '/metrics'
```

### Using Grafana
1. Add Prometheus as data source
2. Import dashboard for Go applications
3. View real-time metrics

## 🧪 Run Load Tests

### Simple Load Test
```bash
# Install Apache Bench
# Ubuntu: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Run 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:8080/health
```

### Custom Load Test
```go
// Create cmd/loadtest/main.go
package main

import (
    "fmt"
    "time"
    "github.com/yourusername/health-competition-go/tests/load"
)

func main() {
    config := load.LoadTestConfig{
        BaseURL:         "http://localhost:8080",
        NumUsers:        50,
        RequestsPerUser: 10,
        ConcurrentUsers: 10,
        RampUpTime:      2 * time.Second,
        AuthToken:       "your-test-token",
        CompetitionID:   "load-test",
    }
    
    tester := load.NewLoadTester(config)
    results, _ := tester.Run()
    tester.PrintResults()
    
    // Check performance targets
    if results.RequestsPerSec < 100 {
        fmt.Println("⚠️  Performance below target!")
    } else {
        fmt.Println("✅ Performance meets target!")
    }
}
```

```bash
# Run load test
go run cmd/loadtest/main.go
```

## 🔍 Debugging Tips

### Check Logs
```bash
# Run with debug logging
LOG_LEVEL=debug go run cmd/server/main.go
```

### Profile Performance
```bash
# CPU profiling
go test -cpuprofile=cpu.prof -bench=. ./internal/services
go tool pprof cpu.prof

# Memory profiling
go test -memprofile=mem.prof -bench=. ./internal/services
go tool pprof mem.prof
```

### Check Connections
```bash
# Database connections
curl http://localhost:8080/health/detailed | jq '.components.database'

# Redis connections
curl http://localhost:8080/health/detailed | jq '.components.redis'
```

## 📈 Performance Targets

### Expected Metrics
- **Requests/sec**: >100
- **Response time (P50)**: <10ms
- **Response time (P95)**: <50ms
- **Response time (P99)**: <100ms
- **Error rate**: <1%
- **Memory usage**: <100MB under load

### Check Current Performance
```bash
# Watch metrics in real-time
watch -n 1 'curl -s http://localhost:8080/metrics | grep -E "(http_requests_total|http_request_duration)"'
```

## 🛠️ Troubleshooting

### Service Won't Start
```bash
# Check if port is in use
lsof -i :8080

# Check Redis connection
redis-cli ping

# Check environment variables
env | grep -E "(REDIS_URL|DATABASE_URL|SUPABASE)"
```

### Tests Failing
```bash
# Clean and rebuild
go clean -testcache
go test ./...

# Run specific test with verbose output
go test -v -run TestLeaderboardService_UpdateScore ./internal/services
```

### High Memory Usage
```bash
# Check for goroutine leaks
curl http://localhost:8080/debug/pprof/goroutine

# Profile memory
go tool pprof http://localhost:8080/debug/pprof/heap
```

## 📚 Next Steps

1. **Read Full Documentation**
   - `ARCHITECTURE.md` - Understand the system design
   - `TESTING_GUIDE.md` - Learn testing strategies
   - `PRODUCTION_GUIDE.md` - Deploy to production

2. **Explore Code**
   - `pkg/utils/metrics.go` - Metrics implementation
   - `pkg/utils/circuit_breaker.go` - Circuit breaker pattern
   - `pkg/utils/health.go` - Health check system
   - `internal/middleware/ratelimit.go` - Rate limiting

3. **Run All Tests**
   ```bash
   # Unit tests
   go test ./internal/... -v
   
   # Integration tests
   go test ./tests/integration/... -v
   
   # Coverage report
   go test -coverprofile=coverage.out ./...
   go tool cover -html=coverage.out
   ```

4. **Set Up Monitoring**
   - Configure Prometheus
   - Set up Grafana dashboards
   - Configure alerts

5. **Deploy to Production**
   - Follow `PRODUCTION_GUIDE.md`
   - Set up CI/CD pipeline
   - Configure auto-scaling

## 🎉 You're Ready!

The Go service now has:
- ✅ Production-grade reliability
- ✅ Comprehensive monitoring
- ✅ Performance optimization
- ✅ Security hardening
- ✅ Full test coverage

**Start building amazing features on this solid foundation!**
