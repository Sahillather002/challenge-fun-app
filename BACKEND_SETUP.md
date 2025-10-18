# Backend Services Setup Guide

Complete guide to setting up and running all backend services for the Health Competition App.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running Services](#running-services)
5. [Testing](#testing)
6. [Integration with React Native](#integration-with-react-native)

## Prerequisites

### Required Software

**Option 1: Using Docker (Recommended)**
- Docker Desktop 20.10+
- Docker Compose 2.0+

**Option 2: Native Installation**
- Go 1.21+ (for Go service)
- Rust 1.70+ with Cargo (for Rust service)
- Python 3.11+ (for Python service)
- Node.js 18+ (for NestJS service)
- Redis 7.0+

### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Note down:
   - Project URL
   - Anon/Public Key
   - JWT Secret

## Installation

### 1. Clone and Navigate
```bash
cd challenge-fun-app-zai2
```

### 2. Setup Environment Variables
```bash
# Copy the environment template
cp ENV_VARIABLES.md .env

# Edit .env with your Supabase credentials
# See ENV_VARIABLES.md for details
```

### 3. Install Dependencies

**Using Docker:**
```bash
# No additional installation needed
# Docker will handle all dependencies
```

**Native Installation:**

**Go Service:**
```bash
cd backends/go-service
go mod download
cd ../..
```

**Rust Service:**
```bash
cd backends/rust-service
cargo build
cd ../..
```

**Python Service:**
```bash
cd backends/python-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ../..
```

**NestJS Service:**
```bash
cd backends/nestjs-service
npm install
cd ../..
```

## Configuration

### 1. Configure Redis

**Using Docker Compose:**
Redis is automatically configured and started.

**Native Installation:**
```bash
# Install Redis
# macOS:
brew install redis

# Ubuntu/Debian:
sudo apt-get install redis-server

# Windows:
# Download from https://redis.io/download

# Start Redis
redis-server
```

### 2. Configure Services

All services read from `.env` file. See [ENV_VARIABLES.md](./ENV_VARIABLES.md) for complete configuration guide.

## Running Services

### Option A: Docker Compose (All Services)

**Start all services:**
```bash
docker-compose up --build
```

**Start specific services:**
```bash
# Only Go and Redis
docker-compose up go-service redis

# Only NestJS and Redis
docker-compose up nestjs-service redis
```

**Run in background:**
```bash
docker-compose up -d
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f nestjs-service
```

**Stop services:**
```bash
docker-compose down
```

### Option B: Individual Services

**Go Service:**
```bash
cd backends/go-service
go run cmd/server/main.go
# Running on http://localhost:8080
```

**Rust Service:**
```bash
cd backends/rust-service
cargo run
# Running on http://localhost:8081
```

**Python Service:**
```bash
cd backends/python-service
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8082
# Running on http://localhost:8082
```

**NestJS Service:**
```bash
cd backends/nestjs-service
npm run start:dev
# Running on http://localhost:8083
```

## Testing

### 1. Health Checks

Test each service:
```bash
# Go Service
curl http://localhost:8080/health

# Rust Service
curl http://localhost:8081/health

# Python Service
curl http://localhost:8082/health

# NestJS Service
curl http://localhost:8083/health
```

Expected response:
```json
{
  "status": "healthy",
  "service": "service-name"
}
```

### 2. Test API Endpoints

**Get Leaderboard:**
```bash
curl "http://localhost:8083/api/v1/leaderboard/comp-123?limit=10" \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

**Sync Fitness Data:**
```bash
curl -X POST http://localhost:8083/api/v1/fitness/sync \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "competition_id": "comp-123",
    "steps": 10000,
    "distance": 8000,
    "calories": 500,
    "active_minutes": 60,
    "source": "google_fit",
    "date": "2024-01-01T00:00:00Z"
  }'
```

**Update Score:**
```bash
curl -X POST http://localhost:8083/api/v1/leaderboard/update \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user-123",
    "competition_id": "comp-123",
    "steps": 15000,
    "distance": 12000,
    "calories": 750
  }'
```

### 3. Test WebSocket Connection

**Using JavaScript:**
```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:8083/ws/leaderboard', {
  transports: ['websocket'],
  query: { token: 'YOUR_SUPABASE_JWT' }
});

socket.on('connect', () => {
  console.log('Connected!');
  socket.emit('subscribe', { competition_id: 'comp-123' });
});

socket.on('leaderboard_update', (data) => {
  console.log('Update:', data);
});
```

### 4. Run Unit Tests

**Go Service:**
```bash
cd backends/go-service
go test ./...
```

**Rust Service:**
```bash
cd backends/rust-service
cargo test
```

**Python Service:**
```bash
cd backends/python-service
pytest
```

**NestJS Service:**
```bash
cd backends/nestjs-service
npm test
```

## Integration with React Native

### 1. Install Required Packages

```bash
cd src  # Your React Native project
npm install axios socket.io-client
```

### 2. Create Backend Service

Create `src/services/api.ts`:
```typescript
import axios from 'axios';
import { supabase } from './supabaseClient';

const API_URL = __DEV__ 
  ? 'http://localhost:8083/api/v1'  // NestJS
  : 'https://your-production-url.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth interceptor
api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

export default api;
```

### 3. Use in Components

```typescript
import api from '../services/api';

// In your component
const loadLeaderboard = async (competitionId: string) => {
  try {
    const { data } = await api.get(`/leaderboard/${competitionId}`);
    console.log('Leaderboard:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

const syncFitness = async (fitnessData) => {
  try {
    const { data } = await api.post('/fitness/sync', fitnessData);
    console.log('Synced:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};
```

For complete integration guide, see [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md)

## Service Selection Guide

**Choose NestJS if:**
- You're comfortable with TypeScript
- You want familiar React-like architecture
- You need rapid development

**Choose Go if:**
- You need maximum concurrency
- Real-time features are critical
- You want low memory usage

**Choose Rust if:**
- You need absolute best performance
- Memory safety is critical
- You have compute-heavy tasks

**Choose Python if:**
- You need data analytics
- You want to integrate ML models
- You need rapid prototyping

**Or run multiple services:**
- NestJS as API Gateway (8083)
- Go for real-time leaderboard (8080)
- Python for analytics (8082)

## Common Issues

### Service won't start
1. Check if port is already in use
2. Verify `.env` file exists and has correct values
3. Ensure Redis is running
4. Check logs: `docker-compose logs service-name`

### Cannot connect to Redis
1. Start Redis: `docker-compose up redis -d`
2. Test connection: `redis-cli ping`
3. Check `REDIS_URL` in `.env`

### JWT validation fails
1. Verify `SUPABASE_JWT_SECRET` matches your Supabase project
2. Check token is not expired
3. Ensure correct Authorization header format

### CORS errors
1. Check allowed origins in service configuration
2. In development, CORS is open by default
3. In production, configure specific origins

## Next Steps

1. ✅ Choose your primary backend service
2. ✅ Start the service (Docker or native)
3. ✅ Test API endpoints
4. ✅ Integrate with React Native app
5. ✅ Deploy to production

## Additional Resources

- [Backend Architecture](./BACKEND_ARCHITECTURE.md)
- [Environment Variables](./ENV_VARIABLES.md)
- [Integration Guide](./INTEGRATION_GUIDE.md)
- [Individual Service READMEs](./backends/)

## Support

For service-specific help:
- [Go Service](./backends/go-service/README.md)
- [Rust Service](./backends/rust-service/README.md)
- [Python Service](./backends/python-service/README.md)
- [NestJS Service](./backends/nestjs-service/README.md)

Happy coding! 🚀
