# 🎯 Monorepo Restructuring Plan

## New Project Structure

```
challenge-fun-app-zai2/
├── apps/
│   ├── mobile/              # React Native (Expo) - Mobile App
│   │   ├── src/
│   │   ├── app.json
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── web/                 # Next.js - Web Application
│       ├── src/
│       ├── public/
│       ├── package.json
│       └── next.config.js
│
├── backends/                # Backend Services
│   ├── go-service/         # Port 8080
│   ├── rust-service/       # Port 8081
│   ├── python-service/     # Port 8082
│   └── nestjs-service/     # Port 8083
│
├── packages/               # Shared Code
│   ├── shared/            # Shared utilities, types, constants
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/                # Shared UI components
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── step-tracker/      # Built-in Step Tracking Library
│       ├── src/
│       ├── native/        # React Native implementation
│       ├── web/           # Web implementation
│       ├── package.json
│       └── README.md
│
├── package.json           # Root workspace config
├── tsconfig.json          # Root TypeScript config
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Features to Implement

### 1. **Mobile App** (apps/mobile)
- ✅ Existing React Native/Expo app
- ✅ Built-in step tracker (no dependency on Google Fit)
- ✅ Real-time step counting
- ✅ Activity tracking
- ✅ Competition features
- ✅ Prize distribution

### 2. **Web App** (apps/web - Next.js)
- 🆕 Modern Next.js 14 with App Router
- 🆕 Server-side rendering
- 🆕 Enhanced admin dashboard
- 🆕 Advanced analytics & charts
- 🆕 Real-time leaderboards with WebSocket
- 🆕 Web-based step tracking (using device sensors)
- 🆕 Responsive design
- 🆕 SEO optimized
- 🆕 Enhanced features:
  - Competition management
  - User analytics
  - Payment integration
  - Export/reporting features
  - Social sharing

### 3. **Shared Packages**

#### packages/shared
- TypeScript types & interfaces
- API client
- Utilities
- Constants
- Validation schemas

#### packages/ui
- Shared React components
- Design system
- Theme configuration
- Icons

#### packages/step-tracker
- **Mobile**: Native sensors (accelerometer, pedometer)
- **Web**: Web sensors API
- Real-time step counting
- Activity detection (walking, running, idle)
- Calorie calculation
- Distance tracking
- Data persistence
- Sync with backend

### 4. **Backend Services** (unchanged)
- Go Service (8080)
- Rust Service (8081)
- Python Service (8082)
- NestJS Service (8083)

## Migration Steps

### Phase 1: Setup Monorepo
1. Create new root package.json with workspaces
2. Create folder structure
3. Move existing mobile app to apps/mobile
4. Update import paths

### Phase 2: Create Web App
1. Initialize Next.js in apps/web
2. Set up shared UI components
3. Implement core pages
4. Add step tracking
5. Connect to backends

### Phase 3: Create Shared Packages
1. Extract shared code
2. Create packages/shared
3. Create packages/ui
4. Create packages/step-tracker

### Phase 4: Implement Step Tracker
1. Mobile: Use expo-sensors
2. Web: Use Web Sensors API
3. Unified API
4. Backend sync

### Phase 5: Testing & Documentation
1. Update all documentation
2. Test mobile app
3. Test web app
4. Test step tracker
5. Integration tests

## Unified Scripts

```json
{
  "scripts": {
    "dev": "Run all services in development",
    "dev:mobile": "Start mobile app",
    "dev:web": "Start web app",
    "dev:backends": "Start all backend services",
    "build": "Build all apps",
    "test": "Run all tests",
    "lint": "Lint all code"
  }
}
```

## Technology Stack

### Mobile (React Native)
- Expo 49
- React Navigation
- Expo Sensors (for step tracking)
- TypeScript

### Web (Next.js)
- Next.js 14
- React 18
- TailwindCSS
- shadcn/ui
- Framer Motion
- Chart.js/Recharts
- Socket.io (WebSocket)
- TypeScript

### Shared
- TypeScript
- Zod (validation)
- Date-fns
- Axios

### Step Tracker
- expo-sensors (mobile)
- Web Sensors API (web)
- Background processing
- Data persistence

## Next Steps

1. Execute restructuring
2. Create apps/mobile (move existing)
3. Create apps/web (Next.js)
4. Create shared packages
5. Implement step tracker
6. Update documentation
