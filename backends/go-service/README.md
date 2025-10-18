# Go Backend Service

High-performance backend service for real-time leaderboard updates and fitness tracking.

## Features
- Real-time WebSocket connections for leaderboard updates
- Redis-based caching and pub/sub
- JWT validation with Supabase
- High concurrency handling
- HTTP/2 support

## Prerequisites
- Go 1.21+
- Redis
- PostgreSQL (via Supabase)

## Installation

```bash
cd backends/go-service
go mod download
```

## Configuration

Create `.env` file:
```env
PORT=8080
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

## Running

```bash
# Development
go run cmd/server/main.go

# Production build
go build -o bin/server cmd/server/main.go
./bin/server
```

## API Endpoints

### Leaderboard
- `GET /api/v1/leaderboard/:competitionId` - Get current rankings
- `WS /ws/leaderboard/:competitionId` - Real-time updates

### Fitness Tracking
- `POST /api/v1/fitness/sync` - Sync fitness data
- `GET /api/v1/fitness/stats/:userId` - Get user statistics

### Health
- `GET /health` - Health check

## Architecture

```
cmd/
  server/
    main.go           # Entry point
internal/
  handlers/
    leaderboard.go    # Leaderboard HTTP handlers
    fitness.go        # Fitness tracking handlers
    websocket.go      # WebSocket handlers
  services/
    leaderboard.go    # Business logic
    fitness.go
    cache.go          # Redis operations
  middleware/
    auth.go           # JWT validation
    cors.go
  models/
    types.go          # Data structures
  config/
    config.go         # Configuration
pkg/
  utils/
    logger.go         # Logging utilities
```

## WebSocket Protocol

### Connect
```javascript
ws://localhost:8080/ws/leaderboard/comp-123?token=<jwt>
```

### Messages
```json
// Server -> Client: Leaderboard Update
{
  "type": "leaderboard_update",
  "data": {
    "competitionId": "comp-123",
    "rankings": [
      {"userId": "user-1", "score": 15000, "rank": 1},
      {"userId": "user-2", "score": 14500, "rank": 2}
    ],
    "timestamp": "2024-01-01T12:00:00Z"
  }
}

// Client -> Server: Subscribe
{
  "type": "subscribe",
  "competitionId": "comp-123"
}
```

## Testing

```bash
# Unit tests
go test ./...

# With coverage
go test -cover ./...

# Load testing
go run scripts/loadtest.go
```
