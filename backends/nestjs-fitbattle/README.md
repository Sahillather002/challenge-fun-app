# FitBattle Backend - README

## Overview
NestJS backend API for FitBattle - a habit-forming fitness competition app.

## Tech Stack
- **Framework**: NestJS (Node.js + TypeScript)
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT + Passport
- **Validation**: class-validator

## Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Installation
```bash
npm install
```

### Environment Configuration
Copy `.env.example` to `.env` and update:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fitbattle"
JWT_SECRET="your-secret-key"
```

### Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Open Prisma Studio
npx prisma studio
```

### Running the Server
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Server runs on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login

### User
- `GET /user/profile` - Get current user
- `PUT /user/profile` - Update profile
- `GET /user/stats` - Get user statistics

### Workouts
- `POST /workouts` - Log workout
- `GET /workouts` - Get recent workouts
- `GET /workouts/history` - Get workout history

### Streak
- `GET /streak` - Get streak info
- `POST /streak/checkin` - Daily check-in
- `POST /streak/freeze` - Use streak freeze

### Competitions
- `GET /competitions` - List competitions
- `POST /competitions/:id/join` - Join competition
- `GET /competitions/:id/leaderboard` - Get leaderboard

### Friends
- `GET /friends` - List friends
- `POST /friends/add/:friendId` - Add friend
- `POST /friends/accept/:friendshipId` - Accept request

### Achievements
- `GET /achievements` - All achievements
- `GET /achievements/me` - User's achievements

## Protected Routes
Most endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## License
MIT
