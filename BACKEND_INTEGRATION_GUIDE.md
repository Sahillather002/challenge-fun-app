# Backend Integration Guide

## Overview
This guide documents the integration of the Go backend service with the Next.js web application, replacing all dummy data with real API calls.

## ✅ Completed Work

### 1. Go Backend Service Enhancements

#### New Handlers Added
- **`internal/handlers/competition.go`** - Competition management
  - `GetCompetitions` - List all competitions with filtering
  - `GetCompetition` - Get single competition details
  - `CreateCompetition` - Create new competition
  - `JoinCompetition` - Join a competition
  - `GetUserCompetitions` - Get user's competitions

- **`internal/handlers/user.go`** - User management and statistics
  - `GetDashboardStats` - Comprehensive dashboard statistics
  - `GetUserProfile` - User profile information
  - `UpdateUserProfile` - Update user profile
  - `GetUserActivity` - Daily activity data
  - `GetUserTransactions` - Transaction history

#### New Services Added
- **`internal/services/competition.go`** - Competition business logic
- **`internal/services/user.go`** - User statistics and profile logic

#### Enhanced Models
- **`internal/models/types.go`** - Added new types:
  - `CreateCompetitionRequest`
  - `UserCompetition`
  - `DashboardStats`
  - `DailyActivity`
  - `ActivityLog`
  - `UserProfile`
  - `UpdateProfileRequest`
  - `Transaction`

#### Updated Main Server
- **`cmd/server/main.go`**
  - Added PostgreSQL database connection
  - Integrated new handlers and services
  - Added comprehensive API routes

### 2. Web App Integration

#### New API Client
- **`apps/web/src/lib/api.ts`** - Comprehensive API client with:
  - Axios instance with auth interceptor
  - TypeScript interfaces for all data types
  - API methods organized by domain:
    - `api.competitions.*` - Competition operations
    - `api.user.*` - User operations
    - `api.leaderboard.*` - Leaderboard operations
    - `api.fitness.*` - Fitness data sync
    - `api.prizes.*` - Prize calculations
  - WebSocket helper for real-time updates

#### Updated Pages
- **`apps/web/src/app/dashboard/page.tsx`** - Dashboard now uses real data:
  - Loads dashboard stats from API
  - Displays user's active competitions
  - Shows weekly activity chart from real data
  - Displays recent activity logs
  - Real-time percentage changes for metrics

### 3. API Endpoints Summary

```
Base URL: http://localhost:8080/api/v1

Authentication: Bearer token in Authorization header

## Competitions
GET    /competitions                   - List competitions (filter: status, limit, offset)
POST   /competitions                   - Create competition
GET    /competitions/:id               - Get competition details
POST   /competitions/:id/join          - Join competition
GET    /users/:userId/competitions     - Get user's competitions

## User & Dashboard
GET    /users/:userId/dashboard        - Get dashboard stats
GET    /users/:userId/profile          - Get user profile
PUT    /users/:userId/profile          - Update user profile
GET    /users/:userId/activity         - Get activity history
GET    /users/:userId/transactions     - Get transactions

## Leaderboard
GET    /leaderboard/:competitionId     - Get leaderboard
POST   /leaderboard/update             - Update user score
WS     /ws/leaderboard/:competitionId  - Real-time updates

## Fitness
POST   /fitness/sync                   - Sync fitness data
GET    /fitness/stats/:userId          - Get fitness statistics

## Prizes
POST   /prizes/calculate/:competitionId - Calculate prize distribution
POST   /prizes/distribute/:competitionId - Distribute prizes

## Health
GET    /health                          - Health check (public)
```

## 🔧 Required Setup

### 1. Database Schema

You need to create the following PostgreSQL tables:

```sql
-- Users table (managed by Supabase Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    avatar TEXT,
    bio TEXT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Competitions table
CREATE TABLE competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entry_fee DECIMAL(10, 2) NOT NULL,
    prize_pool DECIMAL(10, 2) NOT NULL,
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('upcoming', 'active', 'completed')),
    type VARCHAR(50) NOT NULL,
    creator_id UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Competition participants
CREATE TABLE competition_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(competition_id, user_id)
);

-- Fitness data
CREATE TABLE fitness_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    steps BIGINT NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    active_minutes INTEGER NOT NULL DEFAULT 0,
    source VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    synced_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, competition_id, date)
);

-- Activity logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    steps BIGINT NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Leaderboard entries
CREATE TABLE leaderboard_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    score BIGINT NOT NULL DEFAULT 0,
    rank INTEGER NOT NULL,
    steps BIGINT NOT NULL DEFAULT 0,
    distance DECIMAL(10, 2) NOT NULL DEFAULT 0,
    calories DECIMAL(10, 2) NOT NULL DEFAULT 0,
    last_synced_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, competition_id)
);

-- Prizes
CREATE TABLE prizes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competition_id UUID REFERENCES competitions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rank INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'distributed', 'failed')),
    distributed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES competitions(id) ON DELETE SET NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('entry_fee', 'prize', 'refund')),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'completed', 'failed')),
    description TEXT,
    payment_method VARCHAR(50),
    transaction_ref VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_competitions_status ON competitions(status);
CREATE INDEX idx_competitions_dates ON competitions(start_date, end_date);
CREATE INDEX idx_comp_participants_user ON competition_participants(user_id);
CREATE INDEX idx_comp_participants_comp ON competition_participants(competition_id);
CREATE INDEX idx_fitness_data_user_date ON fitness_data(user_id, date DESC);
CREATE INDEX idx_fitness_data_comp ON fitness_data(competition_id);
CREATE INDEX idx_leaderboard_comp_rank ON leaderboard_entries(competition_id, rank);
CREATE INDEX idx_activity_logs_user ON activity_logs(user_id, created_at DESC);
CREATE INDEX idx_transactions_user ON transactions(user_id, created_at DESC);
```

### 2. Environment Variables

#### Go Service (`.env` in `backends/go-service/`)
```env
PORT=8080
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost:5432/health_competition
LOG_LEVEL=info
ENVIRONMENT=development
```

#### Web App (`.env.local` in `apps/web/`)
```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Dependencies

#### Go Service
```bash
cd backends/go-service
go get github.com/lib/pq  # PostgreSQL driver
go mod tidy
```

## 📋 Remaining Tasks

### High Priority

1. **Update Competitions Page** (`apps/web/src/app/dashboard/competitions/page.tsx`)
   - Replace mock data with `api.competitions.getAll()`
   - Implement real-time filtering and search
   - Add loading states

2. **Update Competition Details Page** (`apps/web/src/app/dashboard/competitions/[id]/page.tsx`)
   - Load competition data from API
   - Implement real-time leaderboard with WebSocket
   - Add join competition functionality

3. **Remove Live Tracking from Web**
   - Remove step tracking UI from web dashboard
   - Add message directing users to mobile app for tracking
   - Update documentation

4. **Mobile App Integration**
   - Implement Google Fit integration in mobile app
   - Add step tracking service
   - Sync data to backend API

### Medium Priority

5. **Update Profile Page** (`apps/web/src/app/dashboard/profile/page.tsx`)
   - Load profile from `api.user.getProfile()`
   - Implement profile update
   - Add avatar upload

6. **Update Transactions Page** (`apps/web/src/app/dashboard/transactions/page.tsx`)
   - Load transactions from `api.user.getTransactions()`
   - Display transaction history
   - Add filters

7. **Update Leaderboard Page** (`apps/web/src/app/dashboard/leaderboard/page.tsx`)
   - Load leaderboard from API
   - Add real-time updates via WebSocket
   - Implement pagination

### Low Priority

8. **Error Handling**
   - Add global error boundary
   - Improve error messages
   - Add retry logic for failed API calls

9. **Loading States**
   - Add skeleton loaders
   - Improve UX during data fetching
   - Add optimistic updates

10. **Testing**
    - Unit tests for API client
    - Integration tests for backend
    - E2E tests for critical flows

## 🚀 Running the Application

### 1. Start PostgreSQL and Redis
```bash
# Using Docker
docker-compose up -d postgres redis
```

### 2. Run Database Migrations
```bash
# Apply the schema from above
psql -h localhost -U your_user -d health_competition -f db/schema.sql
```

### 3. Start Go Backend
```bash
cd backends/go-service
go run cmd/server/main.go
```

### 4. Start Web App
```bash
cd apps/web
npm run dev
```

### 5. Start Mobile App (for tracking)
```bash
cd apps/mobile
npm start
```

## 🧪 Testing the Integration

### 1. Test Dashboard
1. Login to web app
2. Dashboard should show real stats (may be 0 if no data yet)
3. Check browser console for API calls

### 2. Create Competition
1. Go to competitions page
2. Click "Create Competition"
3. Fill form and submit
4. Should appear in competitions list

### 3. Test Mobile Tracking
1. Open mobile app
2. Start step tracking
3. Data should sync to backend
4. Check web dashboard for updated stats

## 📝 Notes

- **Authentication**: All API endpoints (except `/health`) require JWT token from Supabase
- **CORS**: Currently set to allow all origins (`*`) - update for production
- **WebSocket**: Use for real-time leaderboard updates
- **Caching**: Redis is used for leaderboard caching and pub/sub
- **Database**: PostgreSQL via Supabase (use connection string from Supabase dashboard)

## 🔒 Security Considerations

1. Update CORS settings for production
2. Add rate limiting
3. Validate all user inputs
4. Sanitize database queries (already using parameterized queries)
5. Add request size limits
6. Implement proper error handling without exposing sensitive data

## 📞 Support

For issues or questions:
1. Check server logs: `backends/go-service/logs`
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure database schema is up to date
