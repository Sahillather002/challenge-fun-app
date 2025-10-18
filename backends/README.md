# Backend Services

This directory contains multiple backend implementations for the Health Competition App.

## Available Services

### 1. Go Service (`go-service/`)
- **Port:** 8080
- **Language:** Go 1.21+
- **Best For:** Real-time leaderboard updates, high concurrency
- **Features:**
  - Native HTTP/2 support
  - Excellent concurrency with goroutines
  - Fast WebSocket connections
  - Low memory footprint

[See Go Service README](./go-service/README.md)

### 2. Rust Service (`rust-service/`)
- **Port:** 8081
- **Language:** Rust 1.70+
- **Best For:** Prize calculations, heavy computational tasks
- **Features:**
  - Maximum performance
  - Memory safety without garbage collection
  - Zero-cost abstractions
  - Async runtime with Tokio

[See Rust Service README](./rust-service/README.md)

### 3. Python FastAPI Service (`python-service/`)
- **Port:** 8082
- **Language:** Python 3.11+
- **Best For:** Data analytics, ML integration, rapid development
- **Features:**
  - Fast development cycle
  - Extensive data science libraries
  - Easy ML model integration
  - Type hints with Pydantic

[See Python Service README](./python-service/README.md)

### 4. NestJS Service (`nestjs-service/`)
- **Port:** 8083
- **Language:** TypeScript (Node.js 18+)
- **Best For:** API Gateway, TypeScript integration, React developers
- **Features:**
  - Familiar to React/TypeScript developers
  - Excellent dependency injection
  - Built-in WebSocket Gateway
  - Modular architecture

[See NestJS Service README](./nestjs-service/README.md)

## Why Multiple Implementations?

### Learning & Practice
Each implementation helps you learn different programming paradigms and ecosystems:
- **Go:** Learn concurrent programming
- **Rust:** Master memory safety and zero-cost abstractions
- **Python:** Practice data analytics and ML integration
- **NestJS:** Deepen TypeScript knowledge

### Production Use Cases
Choose the right tool for specific tasks:
- **High Traffic:** Go or Rust for maximum throughput
- **Data Analytics:** Python for ML and data processing
- **Rapid Development:** Python or NestJS for quick iterations
- **Type Safety:** Rust or NestJS for compile-time guarantees

### Microservices Architecture
You can run multiple services simultaneously:
- **NestJS** as API Gateway (port 8083)
- **Go** for real-time leaderboard (port 8080)
- **Rust** for prize calculations (port 8081)
- **Python** for analytics dashboard (port 8082)

## Quick Start

### Using Docker Compose (All Services)

```bash
# From project root
docker-compose up --build

# Access services:
# Go:     http://localhost:8080
# Rust:   http://localhost:8081
# Python: http://localhost:8082
# NestJS: http://localhost:8083
```

### Run Individual Service

See each service's README for specific instructions.

## Shared Infrastructure

All services share:

### Redis
- **Purpose:** Caching, real-time leaderboards, pub/sub
- **Port:** 6379
- **Data Structures:**
  - Sorted Sets for leaderboards
  - Key-value for caching
  - Pub/Sub for real-time updates

### Supabase
- **Purpose:** Authentication (JWT validation)
- **Services use:** JWT secret to validate tokens
- **No direct database access:** Services use Redis for performance

## API Compatibility

All services implement the same REST API:

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/leaderboard/:id` | GET | Get leaderboard |
| `/api/v1/leaderboard/update` | POST | Update score |
| `/api/v1/fitness/sync` | POST | Sync fitness data |
| `/api/v1/fitness/stats/:userId` | GET | Get user stats |
| `/api/v1/prizes/calculate/:id` | POST | Calculate prizes |
| `/ws/leaderboard/:id` | WS | Real-time updates |

## Performance Comparison

Approximate performance on modern hardware:

| Service | Requests/sec | Memory Usage | Build Time | Hot Reload |
|---------|--------------|--------------|------------|------------|
| Go | 100k+ | ~20MB | <5s | No |
| Rust | 150k+ | ~15MB | ~30s | No |
| Python | 10k+ | ~50MB | N/A | Yes |
| NestJS | 15k+ | ~80MB | ~10s | Yes |

*Note: Actual performance depends on workload and configuration.*

## Development Workflow

### Recommended Approach

1. **Start with NestJS** (familiar TypeScript, fast development)
2. **Add Go** when you need high concurrency
3. **Add Rust** for compute-intensive tasks
4. **Add Python** for analytics and ML

### Testing

Each service has its own testing setup:

```bash
# Go
cd go-service && go test ./...

# Rust
cd rust-service && cargo test

# Python
cd python-service && pytest

# NestJS
cd nestjs-service && npm test
```

## Monitoring

### Logs

```bash
# View all service logs
docker-compose logs -f

# View specific service
docker-compose logs -f nestjs-service
```

### Health Checks

```bash
# Check all services
curl http://localhost:8080/health
curl http://localhost:8081/health
curl http://localhost:8082/health
curl http://localhost:8083/health
```

## Deployment

Each service can be deployed independently:

- **Docker:** Use provided Dockerfiles
- **Cloud Run:** Direct source deployment
- **AWS ECS:** Container deployment
- **VPS:** Docker or native binary

See [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md) for deployment details.

## Contributing

When adding features:

1. Implement in your primary service first
2. Test thoroughly
3. Optionally port to other services
4. Update API documentation
5. Keep interfaces consistent across services

## Support

For service-specific questions, see individual READMEs:
- [Go Service](./go-service/README.md)
- [Rust Service](./rust-service/README.md)
- [Python Service](./python-service/README.md)
- [NestJS Service](./nestjs-service/README.md)

For integration help, see [INTEGRATION_GUIDE.md](../INTEGRATION_GUIDE.md)
