# NestJS Backend Service

Backend service built with NestJS for TypeScript enthusiasts and React developers.

## Features
- NestJS framework with TypeScript
- WebSocket Gateway for real-time updates
- Redis integration
- JWT validation with Supabase
- Dependency injection
- Modular architecture
- Excellent for API gateway orchestration

## Prerequisites
- Node.js 18+
- npm or yarn
- Redis
- PostgreSQL (via Supabase)

## Installation

```bash
cd backends/nestjs-service
npm install
# or
yarn install
```

## Configuration

Create `.env` file:
```env
PORT=8083
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NODE_ENV=development
```

## Running

```bash
# Development
npm run start:dev

# Production build
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## API Endpoints

### Leaderboard
- `GET /api/v1/leaderboard/:competitionId` - Get current rankings
- `POST /api/v1/leaderboard/update` - Update score
- `WS /ws/leaderboard/:competitionId` - Real-time updates

### Fitness Tracking
- `POST /api/v1/fitness/sync` - Sync fitness data
- `GET /api/v1/fitness/stats/:userId` - Get user statistics

### Prize Distribution
- `POST /api/v1/prizes/calculate/:competitionId` - Calculate winners
- `POST /api/v1/prizes/distribute/:competitionId` - Distribute prizes

### Health
- `GET /health` - Health check

## Project Structure

```
src/
  main.ts                    # Entry point
  app.module.ts              # Root module
  config/
    configuration.ts         # Configuration
  common/
    decorators/              # Custom decorators
    filters/                 # Exception filters
    guards/                  # Auth guards
    interceptors/            # Interceptors
  modules/
    leaderboard/
      leaderboard.module.ts
      leaderboard.controller.ts
      leaderboard.service.ts
      leaderboard.gateway.ts # WebSocket
    fitness/
      fitness.module.ts
      fitness.controller.ts
      fitness.service.ts
    cache/
      cache.module.ts
      cache.service.ts
  types/
    interfaces.ts            # TypeScript interfaces
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Key Features

### Dependency Injection
NestJS provides powerful DI out of the box, making code testable and maintainable.

### Decorators
Use TypeScript decorators for routing, validation, and more.

### Guards & Interceptors
Built-in support for authentication, authorization, and request/response transformation.

### WebSocket Gateway
Easy WebSocket integration with decorators and event-driven architecture.

### API Gateway Pattern
Perfect for orchestrating requests across multiple microservices.
