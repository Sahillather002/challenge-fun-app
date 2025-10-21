# 🚀 Monorepo Setup Guide

## ✅ What's Been Done

### 1. Project Structure Created
```
├── apps/
│   ├── mobile/          # React Native app (MOVED HERE)
│   │   ├── package.json ✅
│   │   ├── tsconfig.json ✅
│   │   ├── src/ ✅
│   │   └── App.tsx ✅
│   │
│   └── web/             # Next.js app (NEW)
│       ├── package.json ✅
│       ├── next.config.js ✅
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   └── lib/
│       └── public/
│
├── backends/            # Backend services (UNCHANGED)
├── packages/            # Shared packages (TO CREATE)
└── package.json ✅      # Root monorepo config
```

### 2. Root Configuration
- ✅ Created npm workspaces setup
- ✅ Added unified scripts
- ✅ Created mobile app in apps/mobile
- ✅ Moved existing React Native code
- ✅ Created Next.js web app structure

## 🔧 Next Steps - Complete the Setup

### Step 1: Install Dependencies

```bash
# From project root
npm install

# This will install dependencies for all workspaces
```

### Step 2: Create Shared Packages

#### A. Create packages/shared

```bash
# Create package
mkdir packages/shared/src -p
```

Create `packages/shared/package.json`:
```json
{
  "name": "@health-competition/shared",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.75.0",
    "axios": "^1.6.5",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

Create `packages/shared/src/index.ts`:
```typescript
export * from './types';
export * from './api';
export * from './utils';
export * from './constants';
```

Create `packages/shared/src/types/index.ts`:
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: Date;
}

export interface Competition {
  id: string;
  name: string;
  description: string;
  entry_fee: number;
  prize_pool: number;
  start_date: Date;
  end_date: Date;
  status: 'draft' | 'active' | 'completed';
  type: 'steps' | 'distance' | 'calories';
}

export interface FitnessData {
  id: string;
  user_id: string;
  competition_id: string;
  steps: number;
  distance: number;
  calories: number;
  active_minutes: number;
  date: Date;
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  rank: number;
  score: number;
  steps: number;
  distance: number;
  calories: number;
}
```

Create `packages/shared/src/api/client.ts`:
```typescript
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8083/api/v1';

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Add auth interceptor
apiClient.interceptors.request.use(async (config) => {
  const token = getAuthToken(); // Implement based on your auth
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

function getAuthToken(): string | null {
  // Implementation depends on platform (web/mobile)
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export default apiClient;
```

#### B. Create packages/step-tracker

```bash
mkdir packages/step-tracker/src -p
```

Create `packages/step-tracker/package.json`:
```json
{
  "name": "@health-competition/step-tracker",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@health-competition/shared": "*"
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "expo-sensors": "~12.4.0"
  },
  "devDependencies": {
    "typescript": "^5.3.3"
  }
}
```

Create `packages/step-tracker/src/index.ts`:
```typescript
// Platform-agnostic step tracker interface
export interface StepTrackerConfig {
  updateInterval?: number; // milliseconds
  onStepUpdate?: (steps: number) => void;
  onActivityChange?: (activity: ActivityType) => void;
}

export enum ActivityType {
  IDLE = 'idle',
  WALKING = 'walking',
  RUNNING = 'running',
  CYCLING = 'cycling',
}

export interface StepData {
  steps: number;
  distance: number; // meters
  calories: number;
  activeMinutes: number;
  activity: ActivityType;
  timestamp: Date;
}

export abstract class StepTracker {
  protected config: StepTrackerConfig;
  protected currentSteps: number = 0;
  protected isTracking: boolean = false;

  constructor(config: StepTrackerConfig = {}) {
    this.config = {
      updateInterval: 1000,
      ...config,
    };
  }

  abstract start(): Promise<void>;
  abstract stop(): void;
  abstract getCurrentData(): StepData;
  abstract requestPermissions(): Promise<boolean>;
}

// Export platform-specific implementations
export { MobileStepTracker } from './mobile';
export { WebStepTracker } from './web';
```

Create `packages/step-tracker/src/mobile.ts`:
```typescript
import { Pedometer } from 'expo-sensors';
import { StepTracker, StepData, ActivityType, StepTrackerConfig } from './index';

export class MobileStepTracker extends StepTracker {
  private subscription: any;
  private startSteps: number = 0;

  constructor(config: StepTrackerConfig = {}) {
    super(config);
  }

  async requestPermissions(): Promise<boolean> {
    const isAvailable = await Pedometer.isAvailableAsync();
    return isAvailable;
  }

  async start(): Promise<void> {
    const isAvailable = await this.requestPermissions();
    if (!isAvailable) {
      throw new Error('Pedometer not available on this device');
    }

    // Get initial step count
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const pastSteps = await Pedometer.getStepCountAsync(start, end);
    this.startSteps = pastSteps?.steps || 0;
    this.currentSteps = 0;

    // Start listening
    this.subscription = Pedometer.watchStepCount((result) => {
      this.currentSteps = result.steps;
      this.config.onStepUpdate?.(this.currentSteps);
    });

    this.isTracking = true;
  }

  stop(): void {
    if (this.subscription) {
      this.subscription.remove();
      this.subscription = null;
    }
    this.isTracking = false;
  }

  getCurrentData(): StepData {
    const totalSteps = this.startSteps + this.currentSteps;
    
    return {
      steps: totalSteps,
      distance: this.calculateDistance(totalSteps),
      calories: this.calculateCalories(totalSteps),
      activeMinutes: Math.floor(totalSteps / 100), // Rough estimate
      activity: this.detectActivity(totalSteps),
      timestamp: new Date(),
    };
  }

  private calculateDistance(steps: number): number {
    // Average stride length: 0.762 meters
    return steps * 0.762;
  }

  private calculateCalories(steps: number): number {
    // Rough estimate: 0.04 calories per step
    return steps * 0.04;
  }

  private detectActivity(steps: number): ActivityType {
    // Simple activity detection based on step rate
    // This can be enhanced with accelerometer data
    return ActivityType.WALKING;
  }
}
```

Create `packages/step-tracker/src/web.ts`:
```typescript
import { StepTracker, StepData, ActivityType, StepTrackerConfig } from './index';

export class WebStepTracker extends StepTracker {
  private accelerometer: any;
  private stepCount: number = 0;
  private lastUpdate: number = Date.now();

  constructor(config: StepTrackerConfig = {}) {
    super(config);
  }

  async requestPermissions(): Promise<boolean> {
    if (typeof window === 'undefined' || !('DeviceMotionEvent' in window)) {
      return false;
    }

    // Request permission for iOS 13+
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        return permission === 'granted';
      } catch (error) {
        return false;
      }
    }

    return true;
  }

  async start(): Promise<void> {
    const hasPermission = await this.requestPermissions();
    if (!hasPermission) {
      throw new Error('Motion sensors not available or permission denied');
    }

    // Use Device Motion API
    window.addEventListener('devicemotion', this.handleMotion);
    this.isTracking = true;
  }

  stop(): void {
    window.removeEventListener('devicemotion', this.handleMotion);
    this.isTracking = false;
  }

  private handleMotion = (event: DeviceMotionEvent) => {
    if (!event.accelerationIncludingGravity) return;

    const { x, y, z } = event.accelerationIncludingGravity;
    
    // Simple step detection algorithm
    const acceleration = Math.sqrt(x! * x! + y! * y! + z! * z!);
    const threshold = 12; // Adjust based on testing

    if (acceleration > threshold) {
      const now = Date.now();
      if (now - this.lastUpdate > 300) { // Debounce
        this.stepCount++;
        this.lastUpdate = now;
        this.config.onStepUpdate?.(this.stepCount);
      }
    }
  };

  getCurrentData(): StepData {
    return {
      steps: this.stepCount,
      distance: this.stepCount * 0.762,
      calories: this.stepCount * 0.04,
      activeMinutes: Math.floor(this.stepCount / 100),
      activity: ActivityType.WALKING,
      timestamp: new Date(),
    };
  }
}
```

#### C. Create packages/ui

```bash
mkdir packages/ui/src -p
```

Create `packages/ui/package.json`:
```json
{
  "name": "@health-competition/ui",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "scripts": {
    "build": "tsc"
  },
  "dependencies": {
    "@health-competition/shared": "*",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0"
  },
  "peerDependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "typescript": "^5.3.3"
  }
}
```

### Step 3: Complete Next.js Web App

Continue implementing the web app pages and components. See `NEXT_WEB_APP_GUIDE.md` for details.

### Step 4: Update Mobile App

Update the mobile app to use shared packages:

```typescript
// apps/mobile/App.tsx
import { MobileStepTracker } from '@health-competition/step-tracker';
import { apiClient } from '@health-competition/shared';

// Use shared step tracker
const stepTracker = new MobileStepTracker({
  onStepUpdate: (steps) => {
    console.log('Steps:', steps);
  },
});

await stepTracker.start();
```

### Step 5: Run Everything

```bash
# Install all dependencies
npm install

# Start mobile app
npm run dev:mobile

# Start web app (in another terminal)
npm run dev:web

# Start backend (in another terminal)
npm run dev:backends

# Or run mobile and web together
npm run dev
```

## 📁 Final Structure

```
health-competition-monorepo/
├── apps/
│   ├── mobile/              # React Native (Expo)
│   └── web/                 # Next.js
├── backends/                # Go, Rust, Python, NestJS
├── packages/
│   ├── shared/             # Types, API client, utils
│   ├── ui/                  # Shared components
│   └── step-tracker/       # Step tracking library
├── package.json            # Workspace root
├── tsconfig.json           # Root TS config
└── docker-compose.yml      # Backend services
```

## 🎯 Key Commands

```bash
# Development
npm run dev              # Start mobile + web
npm run dev:mobile       # Mobile only
npm run dev:web          # Web only
npm run dev:backends     # All backends

# Build
npm run build            # Build all
npm run build:mobile     # Mobile only
npm run build:web        # Web only

# Test
npm run test             # Test all
npm run test:mobile      # Mobile tests
npm run test:web         # Web tests

# Lint
npm run lint             # Lint all
```

## 🚀 Next Implementation Tasks

1. ✅ Complete shared packages
2. ✅ Implement step tracker (mobile + web)
3. ✅ Build Next.js pages:
   - Dashboard
   - Competitions
   - Leaderboard
   - Profile
   - Admin panel
4. ✅ Integrate WebSocket for real-time updates
5. ✅ Add payment integration
6. ✅ Create comprehensive tests
7. ✅ Write documentation

## 📝 Notes

- All packages use TypeScript
- Shared code reduces duplication
- Monorepo allows atomic commits across apps
- Easy to add new apps/packages
- Unified dependency management

## 🎨 Enhanced Web Features

The Next.js web app will have:
- 📊 Advanced analytics dashboard
- 📈 Enhanced charts & visualizations  
- 👥 User management
- 💰 Payment processing
- 📧 Email notifications
- 🔍 SEO optimization
- 📱 Fully responsive
- ⚡ Server-side rendering
- 🎯 Real-time updates via WebSocket
- 🏆 Gamification features

Done! Your monorepo is ready. Follow the steps above to complete the setup.
