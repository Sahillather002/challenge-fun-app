# Backend Services Architecture

## Overview
This document outlines the multi-backend architecture for the Health Competition App. The app uses dedicated backend services for performance-critical operations while keeping Supabase for authentication.

## Architecture Principles

### Core Services
- **Authentication**: Handled by Supabase (existing)
- **Real-time Fitness Tracking**: Sync data from Google Fit and other platforms
- **Leaderboard Management**: Real-time updates and ranking calculations
- **Prize Distribution**: Contest rewards and payment processing
- **Competition Management**: Contest lifecycle and participant tracking

### Technology Stack
We provide implementations in multiple languages for learning and comparison:

1. **Go (Golang)** - `backends/go-service/`
   - High performance, excellent concurrency
   - Native HTTP/2 and WebSocket support
   - Best for: Real-time leaderboard updates

2. **Rust** - `backends/rust-service/`
   - Maximum performance and safety
   - Zero-cost abstractions
   - Best for: Heavy computational tasks, prize calculations

3. **Python (FastAPI)** - `backends/python-service/`
   - Rapid development, extensive ML libraries
   - Best for: Data analytics, fitness insights

4. **NestJS (TypeScript)** - `backends/nestjs-service/`
   - Familiar for React developers
   - Excellent TypeScript integration
   - Best for: Main API gateway, orchestration

## Folder Structure

```
challenge-fun-app-zai2/
├── src/                          # React Native frontend (existing)
├── backends/
│   ├── go-service/               # Go backend
│   │   ├── cmd/
│   │   ├── internal/
│   │   ├── pkg/
│   │   ├── go.mod
│   │   └── README.md
│   │
│   ├── rust-service/             # Rust backend
│   │   ├── src/
│   │   ├── Cargo.toml
│   │   └── README.md
│   │
│   ├── python-service/           # Python FastAPI backend
│   │   ├── app/
│   │   ├── requirements.txt
│   │   ├── pyproject.toml
│   │   └── README.md
│   │
│   ├── nestjs-service/           # NestJS backend
│   │   ├── src/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── shared/
│       ├── proto/                # gRPC definitions (optional)
│       ├── schemas/              # Shared data schemas
│       └── docs/                 # API documentation
│
└── docker-compose.yml            # Orchestrate all services
```

## Service Communication

### API Gateway Pattern
- NestJS acts as the main API gateway
- Routes requests to appropriate services
- Handles authentication validation (Supabase JWT)

### Real-time Communication
- WebSocket connections for live updates
- Server-Sent Events (SSE) for one-way streaming
- Redis pub/sub for inter-service messaging

### Database Strategy
- **Supabase PostgreSQL**: User profiles, authentication
- **Redis**: Caching, real-time leaderboard, session management
- **MongoDB** (optional): Activity logs, analytics data
- **TimescaleDB** (optional): Time-series fitness data

## Service Endpoints

### 1. Fitness Tracking Service
```
POST   /api/v1/fitness/sync          # Sync Google Fit data
GET    /api/v1/fitness/stats/:userId # Get user stats
WS     /ws/fitness                   # Real-time fitness updates
```

### 2. Leaderboard Service
```
GET    /api/v1/leaderboard/:competitionId  # Get rankings
WS     /ws/leaderboard/:competitionId      # Real-time updates
POST   /api/v1/leaderboard/update          # Update participant score
```

### 3. Prize Distribution Service
```
POST   /api/v1/prizes/calculate/:competitionId  # Calculate winners
POST   /api/v1/prizes/distribute/:competitionId # Distribute prizes
GET    /api/v1/prizes/history/:userId           # User prize history
```

### 4. Competition Service
```
POST   /api/v1/competitions              # Create competition
GET    /api/v1/competitions/:id          # Get competition details
POST   /api/v1/competitions/:id/join     # Join competition
GET    /api/v1/competitions/:id/participants
```

## Authentication Flow

1. User authenticates via Supabase (frontend)
2. Frontend receives JWT token from Supabase
3. Each backend request includes: `Authorization: Bearer <supabase-jwt>`
4. Backend services validate JWT with Supabase public key
5. Extract user ID from validated JWT

## Real-time Update Flow

### Fitness Data Sync
```
User Device (Google Fit)
    ↓
React Native App
    ↓ (HTTP POST)
Fitness Tracking Service
    ↓ (Pub/Sub)
Leaderboard Service
    ↓ (WebSocket)
All Connected Clients (Real-time Update)
```

### Leaderboard Updates
```
Fitness Update Event
    ↓
Calculate New Rankings (Redis Sorted Set)
    ↓
Publish Update (Redis Pub/Sub)
    ↓
WebSocket Broadcast (All Competition Participants)
```

## Deployment Strategy

### Development
```bash
docker-compose up
```

### Production
- **Go**: Single binary, deploy to Cloud Run / ECS
- **Rust**: Single binary, deploy to Cloud Run / ECS
- **Python**: Docker container, deploy to Cloud Run / ECS
- **NestJS**: Docker container, deploy to Cloud Run / ECS
- **Redis**: Managed Redis (AWS ElastiCache, Redis Cloud)

## Performance Considerations

### Leaderboard Optimization
- Use Redis Sorted Sets for O(log N) ranking operations
- Cache top 100 rankings
- Paginate large leaderboards

### Fitness Data Sync
- Batch operations for bulk inserts
- Queue-based processing for reliability
- Rate limiting per user (avoid abuse)

### WebSocket Scaling
- Redis pub/sub for multi-instance synchronization
- Connection pooling
- Automatic reconnection handling

## Security

1. **JWT Validation**: All services validate Supabase JWT
2. **Rate Limiting**: Prevent abuse of expensive operations
3. **Input Validation**: Strict schema validation
4. **CORS**: Configure allowed origins
5. **API Keys**: For service-to-service communication

## Monitoring & Observability

- **Logs**: Structured logging (JSON)
- **Metrics**: Prometheus + Grafana
- **Tracing**: OpenTelemetry
- **Health Checks**: `/health` endpoints on all services

## Getting Started

See individual service READMEs:
- [Go Service](./backends/go-service/README.md)
- [Rust Service](./backends/rust-service/README.md)
- [Python Service](./backends/python-service/README.md)
- [NestJS Service](./backends/nestjs-service/README.md)
