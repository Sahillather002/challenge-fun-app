# Backend Services Integration Guide

This guide explains how to integrate the React Native frontend with the backend services.

## Table of Contents
1. [Quick Start](#quick-start)
2. [Service Selection](#service-selection)
3. [Frontend Integration](#frontend-integration)
4. [API Endpoints](#api-endpoints)
5. [WebSocket Integration](#websocket-integration)
6. [Authentication](#authentication)
7. [Deployment](#deployment)

## Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Supabase Configuration (shared across all services)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret

# Optional: Database
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
```

### 2. Start All Services with Docker

```bash
# Build and start all services
docker-compose up --build

# Or start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Start Individual Services (Development)

**Go Service:**
```bash
cd backends/go-service
go mod download
go run cmd/server/main.go
```

**Rust Service:**
```bash
cd backends/rust-service
cargo run
```

**Python Service:**
```bash
cd backends/python-service
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8082
```

**NestJS Service:**
```bash
cd backends/nestjs-service
npm install
npm run start:dev
```

## Service Selection

Each service runs on a different port:

| Service | Port | Best For | Language |
|---------|------|----------|----------|
| Go | 8080 | Real-time leaderboard, High concurrency | Go |
| Rust | 8081 | Prize calculations, Heavy compute | Rust |
| Python | 8082 | Data analytics, ML integration | Python |
| NestJS | 8083 | API Gateway, TypeScript integration | TypeScript |

**Recommendation:** Use **NestJS (8083)** as your primary service for React Native integration since it's TypeScript-based and most familiar to React developers.

## Frontend Integration

### 1. Install HTTP Client

```bash
cd src
npm install axios
# or
npm install @tanstack/react-query axios
```

### 2. Create API Service

Create `src/services/BackendService.ts`:

```typescript
import axios from 'axios';
import { supabase } from './supabaseClient';

// Choose your backend service
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:8083/api/v1'  // NestJS in development
  : 'https://your-production-url.com/api/v1';

class BackendService {
  private api;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    // Add auth interceptor
    this.api.interceptors.request.use(async (config) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }
      return config;
    });
  }

  // Leaderboard
  async getLeaderboard(competitionId: string, limit = 100) {
    const response = await this.api.get(`/leaderboard/${competitionId}`, {
      params: { limit },
    });
    return response.data;
  }

  async updateScore(data: {
    user_id: string;
    competition_id: string;
    steps: number;
    distance: number;
    calories: number;
  }) {
    const response = await this.api.post('/leaderboard/update', data);
    return response.data;
  }

  // Fitness Data
  async syncFitnessData(data: {
    user_id: string;
    competition_id: string;
    steps: number;
    distance: number;
    calories: number;
    active_minutes: number;
    source: string;
    date: string;
  }) {
    const response = await this.api.post('/fitness/sync', data);
    return response.data;
  }

  async getUserStats(userId: string, competitionId: string) {
    const response = await this.api.get(`/fitness/stats/${userId}`, {
      params: { competition_id: competitionId },
    });
    return response.data;
  }

  // Prizes
  async calculatePrizes(competitionId: string, prizePool: number) {
    const response = await this.api.post(
      `/prizes/calculate/${competitionId}`,
      { prize_pool: prizePool }
    );
    return response.data;
  }
}

export const backendService = new BackendService();
```

### 3. Update Competition Screen

```typescript
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { backendService } from '../services/BackendService';

export const CompetitionScreen = ({ route }) => {
  const { competitionId } = route.params;
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [competitionId]);

  const loadLeaderboard = async () => {
    try {
      const data = await backendService.getLeaderboard(competitionId);
      setLeaderboard(data.data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  // Render UI...
};
```

## API Endpoints

All services expose the same REST API endpoints:

### Leaderboard

```
GET    /api/v1/leaderboard/:competitionId?limit=100
POST   /api/v1/leaderboard/update
POST   /api/v1/prizes/calculate/:competitionId
POST   /api/v1/prizes/distribute/:competitionId
```

### Fitness

```
POST   /api/v1/fitness/sync
GET    /api/v1/fitness/stats/:userId?competition_id=xxx
```

### Health Check

```
GET    /health
```

## WebSocket Integration

### Install Socket.IO Client

```bash
npm install socket.io-client
```

### Create WebSocket Service

Create `src/services/WebSocketService.ts`:

```typescript
import io, { Socket } from 'socket.io-client';
import { supabase } from './supabaseClient';

class WebSocketService {
  private socket: Socket | null = null;

  async connect(competitionId: string) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    // Connect to WebSocket (NestJS)
    this.socket = io('http://localhost:8083/ws/leaderboard', {
      transports: ['websocket'],
      auth: {
        token: session.access_token,
      },
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
      // Subscribe to competition updates
      this.socket?.emit('subscribe', { competition_id: competitionId });
    });

    return this.socket;
  }

  onLeaderboardUpdate(callback: (data: any) => void) {
    this.socket?.on('leaderboard_update', callback);
  }

  onScoreUpdate(callback: (data: any) => void) {
    this.socket?.on('score_update', callback);
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const wsService = new WebSocketService();
```

### Use in Component

```typescript
import React, { useEffect } from 'react';
import { wsService } from '../services/WebSocketService';

export const LeaderboardScreen = ({ competitionId }) => {
  useEffect(() => {
    // Connect to WebSocket
    const connectWS = async () => {
      const socket = await wsService.connect(competitionId);

      // Listen for updates
      wsService.onScoreUpdate((data) => {
        console.log('Score updated:', data);
        // Update UI
      });
    };

    connectWS();

    return () => {
      wsService.disconnect();
    };
  }, [competitionId]);

  // Rest of component...
};
```

## Authentication

All backend services validate Supabase JWT tokens. The authentication flow:

1. User signs in via Supabase (handled in React Native app)
2. Supabase returns a JWT token
3. Frontend includes token in Authorization header: `Bearer <token>`
4. Backend validates token using `SUPABASE_JWT_SECRET`
5. Backend extracts user ID from token claims

**No additional authentication setup needed!** Just include the Supabase token.

## Deployment

### Option 1: Cloud Run (Recommended)

**Deploy each service:**

```bash
# Go Service
gcloud run deploy health-competition-go \
  --source ./backends/go-service \
  --region us-central1 \
  --allow-unauthenticated

# Python Service
gcloud run deploy health-competition-python \
  --source ./backends/python-service \
  --region us-central1 \
  --allow-unauthenticated
```

### Option 2: AWS ECS

Use the provided Dockerfiles with AWS ECS or Fargate.

### Option 3: VPS (DigitalOcean, Linode)

```bash
# On your server
git clone your-repo
cd your-repo
docker-compose up -d
```

### Environment Variables in Production

Set these environment variables in your deployment platform:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_JWT_SECRET`
- `REDIS_URL` (use managed Redis like AWS ElastiCache or Redis Cloud)
- `PORT`

## Testing the Integration

### 1. Health Check

```bash
curl http://localhost:8083/health
```

### 2. Test Leaderboard

```bash
curl http://localhost:8083/api/v1/leaderboard/comp-123?limit=10 \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

### 3. Test Fitness Sync

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

## Next Steps

1. **Choose your primary backend service** (recommend NestJS for TypeScript familiarity)
2. **Integrate the BackendService** into your React Native app
3. **Add WebSocket** for real-time leaderboard updates
4. **Test locally** before deploying
5. **Deploy to production** (Cloud Run, AWS, or VPS)

## Troubleshooting

**CORS Issues:**
- All services have CORS enabled by default
- Configure allowed origins in production

**WebSocket Connection Fails:**
- Check firewall rules
- Ensure WebSocket transport is enabled
- Verify JWT token is valid

**Redis Connection Failed:**
- Ensure Redis is running: `docker-compose up redis`
- Check REDIS_URL environment variable

For more help, see individual service READMEs in `backends/*/README.md`
