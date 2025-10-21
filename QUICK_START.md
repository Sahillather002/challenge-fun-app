# 🚀 Quick Start Guide - Monorepo

## What's New?

Your project is now a **monorepo** with:
- ✅ **Mobile App** (React Native) in `apps/mobile`
- ✅ **Web App** (Next.js) in `apps/web`
- ✅ **Backend Services** (Go, Rust, Python, NestJS) in `backends/`
- ✅ **Shared Packages** in `packages/`
- ✅ **Built-in Step Tracker** (no external dependency!)

## 🏃 Get Started in 3 Steps

### 1️⃣ Run Setup Script

```powershell
# Run the automated setup
.\setup-monorepo.ps1
```

### 2️⃣ Install Dependencies

```bash
npm install
```

This installs dependencies for:
- Root workspace
- Mobile app
- Web app
- All shared packages

### 3️⃣ Start Development

```bash
# Start both mobile and web
npm run dev

# Or start individually:
npm run dev:mobile    # Mobile app only
npm run dev:web       # Web app only
npm run dev:backends  # Backend services
```

## 📱 Mobile App (React Native/Expo)

Located in `apps/mobile/`

```bash
# Start mobile app
cd apps/mobile
npm start

# Or from root:
npm run dev:mobile
```

**New Features:**
- ✅ Built-in step tracker (uses device sensors)
- ✅ Real-time step counting
- ✅ No dependency on Google Fit
- ✅ Works offline

**Access:**
- iOS: Scan QR with Camera app
- Android: Scan QR with Expo Go app
- Web: Press 'w' to open in browser

## 🌐 Web App (Next.js 14)

Located in `apps/web/`

```bash
# Start web app
cd apps/web
npm run dev

# Or from root:
npm run dev:web
```

**Features:**
- ✅ Modern Next.js 14 with App Router
- ✅ Server-side rendering
- ✅ Web-based step tracking
- ✅ Advanced analytics dashboard
- ✅ Real-time leaderboards
- ✅ Admin panel
- ✅ Payment integration

**Access:**
- http://localhost:3000

## 🔧 Backend Services

Located in `backends/`

### Start All Backends (Docker)
```bash
npm run dev:backends
# or
docker-compose up
```

### Start Individual Service

**Go Service (Port 8080):**
```bash
npm run dev:go
```

**NestJS Service (Port 8083):**
```bash
npm run dev:nest
```

**Access:**
- Go: http://localhost:8080
- Rust: http://localhost:8081
- Python: http://localhost:8082
- NestJS: http://localhost:8083

## 📦 Shared Packages

### packages/shared
Common types, utilities, API client

```typescript
import { apiClient, User, Competition } from '@health-competition/shared';
```

### packages/ui
Shared React components

```typescript
import { Button, Card } from '@health-competition/ui';
```

### packages/step-tracker
Built-in step tracking

```typescript
// Mobile
import { MobileStepTracker } from '@health-competition/step-tracker';

const tracker = new MobileStepTracker({
  onStepUpdate: (steps) => console.log(steps),
});

await tracker.start();

// Web
import { WebStepTracker } from '@health-competition/step-tracker';

const tracker = new WebStepTracker({
  onStepUpdate: (steps) => console.log(steps),
});

await tracker.start();
```

## 🎯 Key Commands

```bash
# Development
npm run dev              # Mobile + Web
npm run dev:mobile       # Mobile only
npm run dev:web          # Web only
npm run dev:backends     # All backends
npm run dev:go           # Go service only
npm run dev:nest         # NestJS service only

# Build
npm run build            # Build all
npm run build:mobile     # Build mobile
npm run build:web        # Build web

# Test
npm run test             # Test all
npm run test:mobile      # Test mobile
npm run test:web         # Test web

# Lint
npm run lint             # Lint all
```

## 📂 Project Structure

```
health-competition-monorepo/
├── apps/
│   ├── mobile/              # 📱 React Native App
│   │   ├── src/
│   │   ├── App.tsx
│   │   └── package.json
│   │
│   └── web/                 # 🌐 Next.js Web App
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       └── package.json
│
├── backends/                # 🔧 Backend Services
│   ├── go-service/         # Port 8080
│   ├── rust-service/       # Port 8081
│   ├── python-service/     # Port 8082
│   └── nestjs-service/     # Port 8083
│
├── packages/               # 📦 Shared Code
│   ├── shared/            # Types, API, Utils
│   ├── ui/                # UI Components
│   └── step-tracker/      # Step Tracking
│
├── package.json           # Root config
└── docker-compose.yml     # Backend services
```

## 🎨 Step Tracker Features

### Mobile (React Native)
- Uses **expo-sensors** (Pedometer API)
- Access to device's hardware step counter
- Background tracking
- Battery efficient
- Accurate step counting

### Web (Browser)
- Uses **DeviceMotion API**
- Accelerometer-based detection
- Works on mobile browsers
- Requires HTTPS in production
- User permission required

### Usage Example

```typescript
import { MobileStepTracker, WebStepTracker } from '@health-competition/step-tracker';

// Detect platform
const StepTracker = Platform.OS === 'web' ? WebStepTracker : MobileStepTracker;

const tracker = new StepTracker({
  updateInterval: 1000,
  onStepUpdate: (steps) => {
    console.log('Current steps:', steps);
  },
  onActivityChange: (activity) => {
    console.log('Activity changed:', activity);
  },
});

// Request permissions
const hasPermission = await tracker.requestPermissions();

if (hasPermission) {
  await tracker.start();
  
  // Get current data
  const data = tracker.getCurrentData();
  console.log({
    steps: data.steps,
    distance: data.distance,
    calories: data.calories,
    activeMinutes: data.activeMinutes,
  });
  
  // Stop tracking
  tracker.stop();
}
```

## 🔌 API Integration

Both mobile and web apps connect to the same backends:

```typescript
import { apiClient } from '@health-competition/shared';

// Get leaderboard
const { data } = await apiClient.get('/leaderboard/comp-123');

// Sync fitness data
await apiClient.post('/fitness/sync', {
  user_id: 'user-123',
  competition_id: 'comp-123',
  steps: 10000,
  distance: 8000,
  calories: 500,
  active_minutes: 60,
  date: new Date(),
});
```

## 🌟 What's Different?

### Before (Single App)
- ❌ Everything in root folder
- ❌ No code sharing
- ❌ No web version
- ❌ Dependent on Google Fit
- ❌ Hard to manage

### After (Monorepo)
- ✅ Clean separation (apps/mobile, apps/web)
- ✅ Shared code (packages/)
- ✅ Full web version
- ✅ Built-in step tracker
- ✅ Easy to manage and scale

## 📚 Documentation

- **MONOREPO_SETUP_GUIDE.md** - Complete setup instructions
- **MONOREPO_RESTRUCTURE_PLAN.md** - Architecture overview
- **INTEGRATION_GUIDE.md** - Backend integration
- **BACKEND_SETUP.md** - Backend services setup

## 🆘 Troubleshooting

### "Cannot find module '@health-competition/shared'"
```bash
npm install
```

### "Expo module not found"
```bash
cd apps/mobile
npm install
```

### "Next.js not starting"
```bash
cd apps/web
npm install
npm run dev
```

### Backend not connecting
1. Check if Redis is running: `docker-compose up redis`
2. Check backend is running on correct port
3. Verify `.env` file has correct values

## 🎉 You're All Set!

```bash
# Start everything
npm run dev
```

- Mobile app: Expo Dev Tools
- Web app: http://localhost:3000
- Backends: http://localhost:8080-8083

Happy coding! 🚀
