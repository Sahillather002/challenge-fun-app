# Testing Guide for Go Service

This guide covers all aspects of testing the Go service, from unit tests to load testing.

## Table of Contents
1. [Setup](#setup)
2. [Unit Tests](#unit-tests)
3. [Integration Tests](#integration-tests)
4. [Load Testing](#load-testing)
5. [Manual API Testing](#manual-api-testing)
6. [CI/CD Integration](#cicd-integration)

## Setup

### Prerequisites
```bash
# Install Go 1.21+
go version

# Install dependencies
go mod download

# Install testing tools
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest
```

### Environment Setup
```bash
# Copy environment template
cp env.template .env

# Configure test environment variables
export REDIS_URL="redis://localhost:6379"
export SUPABASE_JWT_SECRET="your-test-secret"
export LOG_LEVEL="debug"
```

## Unit Tests

### Running All Unit Tests
```bash
# Run all tests
go test ./...

# Run with verbose output
go test -v ./...

# Run with coverage
go test -cover ./...

# Generate coverage report
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out -o coverage.html
```

### Running Specific Tests
```bash
# Test specific package
go test ./internal/services

# Test specific function
go test -run TestLeaderboardService_UpdateScore ./internal/services

# Run tests matching pattern
go test -run Leaderboard ./...
```

### Test Structure

#### Service Tests
```go
// internal/services/leaderboard_test.go
func TestLeaderboardService_UpdateScore(t *testing.T) {
    // Setup
    client, mr := setupTestRedis(t)
    defer mr.Close()
    
    service := NewLeaderboardService(...)
    
    // Execute
    err := service.UpdateScore(ctx, req)
    
    // Assert
    assert.NoError(t, err)
}
```

#### Handler Tests
```go
// internal/handlers/leaderboard_test.go
func TestLeaderboardHandler_GetLeaderboard(t *testing.T) {
    // Create test request
    req := httptest.NewRequest("GET", "/api/v1/leaderboard/comp-1", nil)
    w := httptest.NewRecorder()
    
    // Execute
    handler.GetLeaderboard(w, req)
    
    // Assert
    assert.Equal(t, http.StatusOK, w.Code)
}
```

### Benchmark Tests
```bash
# Run benchmarks
go test -bench=. ./...

# Run specific benchmark
go test -bench=BenchmarkLeaderboardService_UpdateScore ./internal/services

# With memory profiling
go test -bench=. -benchmem ./...

# Generate CPU profile
go test -bench=. -cpuprofile=cpu.prof ./...
go tool pprof cpu.prof
```

## Integration Tests

### Running Integration Tests
```bash
# Run integration tests
go test ./tests/integration/...

# With verbose output
go test -v ./tests/integration/...

# Run specific integration test
go test -run TestAPI_LeaderboardUpdate ./tests/integration
```

### Integration Test Features
- Full HTTP server setup
- Mock Redis (miniredis)
- JWT token generation
- End-to-end API testing
- Concurrent request testing

### Example Integration Test
```go
func TestAPI_LeaderboardUpdate(t *testing.T) {
    ts := setupTestServer(t)
    defer ts.Close()
    
    // Generate auth token
    token := ts.generateToken("user-1")
    
    // Make API request
    req := httptest.NewRequest("POST", "/api/v1/leaderboard/update", body)
    req.Header.Set("Authorization", "Bearer "+token)
    
    w := httptest.NewRecorder()
    ts.router.ServeHTTP(w, req)
    
    assert.Equal(t, http.StatusOK, w.Code)
}
```

## Load Testing

### Running Load Tests

#### Option 1: Using Built-in Load Tester
```bash
# Create load test script
cat > cmd/loadtest/main.go << 'EOF'
package main

import (
    "github.com/yourusername/health-competition-go/tests/load"
    "time"
)

func main() {
    config := load.LoadTestConfig{
        BaseURL:         "http://localhost:8080",
        NumUsers:        100,
        RequestsPerUser: 10,
        ConcurrentUsers: 20,
        RampUpTime:      5 * time.Second,
        AuthToken:       "your-jwt-token",
        CompetitionID:   "load-test-comp",
    }
    
    tester := load.NewLoadTester(config)
    tester.Run()
    tester.PrintResults()
}
EOF

# Run load test
go run cmd/loadtest/main.go
```

#### Option 2: Using Apache Bench (ab)
```bash
# Install Apache Bench
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: brew install httpd

# Simple load test
ab -n 1000 -c 10 http://localhost:8080/health

# With authentication
ab -n 1000 -c 10 -H "Authorization: Bearer YOUR_TOKEN" \
   http://localhost:8080/api/v1/leaderboard/comp-1
```

#### Option 3: Using wrk
```bash
# Install wrk
# Ubuntu: sudo apt-get install wrk
# macOS: brew install wrk

# Run load test
wrk -t12 -c400 -d30s http://localhost:8080/health

# With custom script
cat > wrk-script.lua << 'EOF'
wrk.method = "POST"
wrk.body   = '{"user_id":"user-1","competition_id":"comp-1","steps":10000}'
wrk.headers["Content-Type"] = "application/json"
wrk.headers["Authorization"] = "Bearer YOUR_TOKEN"
EOF

wrk -t12 -c400 -d30s -s wrk-script.lua \
    http://localhost:8080/api/v1/leaderboard/update
```

### Load Test Metrics to Monitor
- **Requests per second**: Target >100 req/s
- **Average response time**: Target <100ms
- **P95 response time**: Target <200ms
- **P99 response time**: Target <500ms
- **Error rate**: Target <1%

### Performance Benchmarks
```
Expected Performance (on modern hardware):
- Throughput: 100k+ requests/second
- Latency P50: <10ms
- Latency P95: <50ms
- Latency P99: <100ms
- Memory: ~20MB base, ~100MB under load
- Concurrent connections: 10k+
```

## Manual API Testing

### Using cURL

#### Health Checks
```bash
# Basic health check
curl http://localhost:8080/health

# Liveness probe
curl http://localhost:8080/health/live

# Readiness probe
curl http://localhost:8080/health/ready

# Detailed health check
curl http://localhost:8080/health/detailed

# Metrics
curl http://localhost:8080/metrics
```

#### Authenticated Endpoints
```bash
# Set your JWT token
export TOKEN="your-jwt-token-here"

# Update leaderboard score
curl -X POST http://localhost:8080/api/v1/leaderboard/update \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-1",
    "competition_id": "comp-1",
    "steps": 10000,
    "distance": 8.5,
    "calories": 500
  }'

# Get leaderboard
curl http://localhost:8080/api/v1/leaderboard/comp-1 \
  -H "Authorization: Bearer $TOKEN"

# Sync fitness data
curl -X POST http://localhost:8080/api/v1/fitness/sync \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-1",
    "competition_id": "comp-1",
    "steps": 10000,
    "distance": 8.5,
    "calories": 500,
    "source": "google_fit"
  }'

# Get user stats
curl "http://localhost:8080/api/v1/fitness/stats/user-1?competition_id=comp-1" \
  -H "Authorization: Bearer $TOKEN"
```

### Using Postman

1. **Import Collection**
   - Create a new collection
   - Add environment variables: `BASE_URL`, `TOKEN`
   - Import requests from examples above

2. **Setup Environment**
   ```json
   {
     "BASE_URL": "http://localhost:8080",
     "TOKEN": "your-jwt-token"
   }
   ```

3. **Run Collection**
   - Use Collection Runner for automated testing
   - Set up pre-request scripts for token generation
   - Add tests for response validation

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Go Service Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'
      
      - name: Install dependencies
        run: go mod download
      
      - name: Run tests
        run: go test -v -race -coverprofile=coverage.out ./...
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage.out
      
      - name: Run linter
        run: golangci-lint run
      
      - name: Build
        run: go build -v ./cmd/server
```

### GitLab CI Example
```yaml
test:
  image: golang:1.21
  services:
    - redis:7-alpine
  variables:
    REDIS_URL: "redis://redis:6379"
  script:
    - go mod download
    - go test -v -race -coverprofile=coverage.out ./...
    - go tool cover -func=coverage.out
  coverage: '/total:.*?(\d+\.\d+)%/'
```

## Test Coverage Goals

### Target Coverage
- **Overall**: >80%
- **Services**: >90%
- **Handlers**: >85%
- **Middleware**: >90%
- **Utils**: >95%

### Generate Coverage Report
```bash
# Generate coverage
go test -coverprofile=coverage.out ./...

# View coverage by package
go tool cover -func=coverage.out

# Generate HTML report
go tool cover -html=coverage.out -o coverage.html

# Open in browser
open coverage.html  # macOS
xdg-open coverage.html  # Linux
```

## Continuous Testing

### Watch Mode (using entr)
```bash
# Install entr
# Ubuntu: sudo apt-get install entr
# macOS: brew install entr

# Watch for changes and run tests
find . -name '*.go' | entr -c go test ./...
```

### Pre-commit Hook
```bash
# Create .git/hooks/pre-commit
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
echo "Running tests..."
go test ./...
if [ $? -ne 0 ]; then
    echo "Tests failed. Commit aborted."
    exit 1
fi

echo "Running linter..."
golangci-lint run
if [ $? -ne 0 ]; then
    echo "Linter failed. Commit aborted."
    exit 1
fi
EOF

chmod +x .git/hooks/pre-commit
```

## Troubleshooting

### Common Issues

#### Redis Connection Failed
```bash
# Check Redis is running
redis-cli ping

# Start Redis
docker run -d -p 6379:6379 redis:7-alpine
```

#### Database Connection Failed
```bash
# Check PostgreSQL is running
psql -h localhost -U postgres -c "SELECT 1"

# Start PostgreSQL
docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:15
```

#### Test Timeout
```bash
# Increase timeout
go test -timeout 30s ./...

# Run with race detector (slower)
go test -race -timeout 60s ./...
```

## Best Practices

1. **Write tests first** (TDD approach)
2. **Keep tests isolated** (no shared state)
3. **Use table-driven tests** for multiple scenarios
4. **Mock external dependencies**
5. **Test error cases** as well as happy paths
6. **Use meaningful test names**
7. **Keep tests fast** (<1s per test)
8. **Clean up resources** (defer cleanup)
9. **Use test helpers** to reduce duplication
10. **Document complex test scenarios**

## Next Steps

1. Add more edge case tests
2. Implement contract testing
3. Add mutation testing
4. Set up continuous performance testing
5. Implement chaos engineering tests
6. Add security testing (OWASP)
