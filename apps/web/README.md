# 🌐 Health Competition - Web Application

A beautiful, modern web application for fitness competitions built with Next.js 14, TypeScript, and Tailwind CSS.

## ✨ Features

### 🎨 Beautiful UI
- Modern gradient designs
- Dark mode support
- Smooth animations
- Responsive layout (mobile, tablet, desktop)
- Glass morphism effects
- Custom scrollbars

### 🔐 Authentication
- Email/password login
- User registration
- Protected routes
- Session management with Supabase

### 📊 Dashboard
- Real-time stats (steps, calories, rank)
- Weekly activity charts
- Recent activity feed
- Active competitions overview

### 🏆 Competitions
- Browse all competitions
- Filter by status (active, upcoming, completed)
- Search functionality
- Create new competitions
- View competition details
- Join/leave competitions
- Real-time leaderboards

### 📈 Leaderboard
- Global rankings
- Real-time updates
- Top 3 podium display
- Performance tracking
- Streak tracking

### 👤 Profile
- User profile management
- Edit profile information
- Achievement badges
- Performance statistics
- Activity history

### ⚙️ Settings
- Theme customization (light/dark/system)
- Notification preferences
- Privacy settings
- Password management
- Account security

### 💰 Transactions
- Payment history
- Prize earnings
- Entry fees tracking
- Withdrawal management
- Payment methods

### 🏃 Activity Tracker
- Real-time step counting
- Live activity tracking
- Daily progress goals
- Weekly overview charts
- Recent activities log

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn
- Supabase account (for authentication)

### Installation

1. **Navigate to the web app directory:**
```bash
cd apps/web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create `.env.local` file in the `apps/web` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8083/api/v1
```

4. **Run the development server:**
```bash
npm run dev
```

5. **Open your browser:**
```
http://localhost:3000
```

## 📁 Project Structure

```
apps/web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── auth/              # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Dashboard pages
│   │   │   ├── activity/
│   │   │   ├── competitions/
│   │   │   ├── leaderboard/
│   │   │   ├── profile/
│   │   │   ├── settings/
│   │   │   ├── transactions/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx          # Landing page
│   │
│   ├── components/            # React components
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   └── sidebar.tsx
│   │   ├── ui/               # UI components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── toast.tsx
│   │   │   └── toaster.tsx
│   │   └── providers.tsx
│   │
│   ├── lib/                  # Utilities
│   │   ├── api-client.ts
│   │   ├── supabase.ts
│   │   └── utils.ts
│   │
│   └── hooks/                # Custom hooks
│       ├── use-auth.ts
│       └── use-toast.ts
│
├── public/                   # Static assets
├── next.config.js           # Next.js config
├── tailwind.config.ts       # Tailwind config
├── tsconfig.json            # TypeScript config
└── package.json
```

## 🎨 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + shadcn/ui
- **Icons:** Lucide React
- **State Management:** TanStack Query (React Query)
- **Authentication:** Supabase
- **Theme:** next-themes
- **HTTP Client:** Axios

## 📖 Available Pages

### Public Pages
- `/` - Landing page with features and CTA
- `/auth/login` - User login
- `/auth/register` - User registration

### Protected Pages (Dashboard)
- `/dashboard` - Dashboard home with stats
- `/dashboard/competitions` - Browse competitions
- `/dashboard/competitions/create` - Create competition
- `/dashboard/competitions/[id]` - Competition details
- `/dashboard/leaderboard` - Global leaderboard
- `/dashboard/profile` - User profile
- `/dashboard/settings` - App settings
- `/dashboard/transactions` - Payment history
- `/dashboard/activity` - Activity tracker

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type check
npm run type-check
```

## 🎯 Key Features Implementation

### Real-Time Step Tracking
The activity page uses device motion sensors to track steps in real-time:
- Uses Web DeviceMotion API
- Calculates distance and calories
- Tracks active minutes
- Live progress updates

### Dark Mode
Automatically syncs with system preferences:
- Light theme
- Dark theme
- System preference

### Responsive Design
Works perfectly on:
- Mobile phones (320px+)
- Tablets (768px+)
- Laptops (1024px+)
- Desktops (1280px+)

## 🎨 Design System

### Colors
- Primary: Blue-purple gradient
- Success: Green
- Warning: Orange
- Danger: Red
- Muted: Gray

### Typography
- Font: Inter
- Headings: Bold, various sizes
- Body: Regular, 14-16px

### Spacing
- Uses Tailwind's spacing scale
- Consistent padding/margins
- Grid-based layouts

## 🚧 Future Enhancements

- [ ] WebSocket for real-time updates
- [ ] Payment integration (Stripe)
- [ ] Social sharing features
- [ ] Advanced analytics
- [ ] PWA support
- [ ] Push notifications
- [ ] Admin dashboard
- [ ] Multi-language support

## 📝 Notes

- All mock data will be replaced with actual API calls
- Supabase handles authentication
- Backend API integration ready
- Mobile-first responsive design

## 🤝 Contributing

1. Follow existing code patterns
2. Use TypeScript for type safety
3. Follow Tailwind CSS conventions
4. Test on multiple devices
5. Ensure dark mode compatibility

## 📄 License

Part of the Health Competition monorepo project.

---

**Built with ❤️ using Next.js and TypeScript**
