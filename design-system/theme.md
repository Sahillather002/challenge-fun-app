# Dark Theme Design System

## Overview
This design system creates an elegant, consistent dark-themed UI for the health competition app. The design features deep blues, greens, and purple accents with glass-morphism effects for a modern, professional look.

## Color Palette

### Primary Colors
- **Background**: #0a0e27 (Deep dark blue with subtle warmth)
- **Surface**: #1a1f3a (Dark blue-gray)
- **Card**: #161b33 (Slightly lighter than background)
- **Border**: rgba(255, 255, 255, 0.1)
- **Foreground**: #ffffff (White)

### Accent Colors
- **Primary Green**: #00ff9d (Vibrant green for primary actions)
- **Secondary Blue**: #4a90d9 (Calm blue for secondary actions)
- **Accent Purple**: #7b61ff (Purple for special elements)
- **Warning Orange**: #ff7d00 (Orange for warnings)
- **Danger Red**: #ff4757 (Red for errors)

### Gradients
- **Primary Gradient**: from-green-500 to-cyan-500
- **Secondary Gradient**: from-blue-600 to-purple-600
- **Success Gradient**: from-green-400 to-emerald-500
- **Warning Gradient**: from-orange-400 to-red-500

## Typography

### Font Family
- **Primary**: Inter (system font stack fallback)
- **Secondary**: Roboto (for mobile)

### Font Weights
- **Thin**: 100
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700
- **ExtraBold**: 800
- **Black**: 900

### Font Sizes
- **H1**: 3rem (48px)
- **H2**: 2.25rem (36px)
- **H3**: 1.875rem (30px)
- **H4**: 1.5rem (24px)
- **H5**: 1.25rem (20px)
- **H6**: 1.125rem (18px)
- **Body**: 1rem (16px)
- **Small**: 0.875rem (14px)
- **Caption**: 0.75rem (12px)

## Spacing System

### Base Units
- **0.5**: 0.125rem (2px)
- **1**: 0.25rem (4px)
- **1.5**: 0.375rem (6px)
- **2**: 0.5rem (8px)
- **3**: 0.75rem (12px)
- **4**: 1rem (16px)
- **5**: 1.25rem (20px)
- **6**: 1.5rem (24px)
- **8**: 2rem (32px)
- **10**: 2.5rem (40px)
- **12**: 3rem (48px)
- **16**: 4rem (64px)
- **20**: 5rem (80px)
- **24**: 6rem (96px)

## Components

### Buttons
- **Primary**: Green gradient with white text
- **Secondary**: Transparent with white border
- **Destructive**: Red gradient
- **Outline**: Transparent with border
- **Ghost**: Transparent hover effect

### Cards
- **Glass**: Semi-transparent with backdrop blur
- **Elevated**: Shadow and gradient border
- **Flat**: Minimal styling

### Inputs
- **Default**: Dark background with white text
- **Focused**: Green border with shadow
- **Disabled**: Grayed out

### Navigation
- **Tab**: Bottom navigation with icons and text
- **Drawer**: Side menu for settings
- **Header**: Top bar with user info

## Effects

### Shadows
- **Sm**: 0 1px 2px 0 rgba(0, 0, 0, 0.3)
- **Md**: 0 4px 6px -1px rgba(0, 0, 0, 0.4)
- **Lg**: 0 10px 15px -3px rgba(0, 0, 0, 0.5)
- **Xl**: 0 20px 25px -5px rgba(0, 0, 0, 0.6)

### Blur Effects
- **Sm**: backdrop-filter: blur(4px)
- **Md**: backdrop-filter: blur(8px)
- **Lg**: backdrop-filter: blur(12px)

## Page Layouts

### Dashboard
- Hero section with greeting and quick stats
- Stats grid with cards showing steps, calories, competitions, rank
- Recent activity feed
- Quick actions panel

### Competitions
- List view with competition cards
- Filter and search functionality
- Competition details with participants and progress

### Fitness Tracker
- Activity chart showing steps over time
- Daily goals progress
- Calories burned and active time
- Exercise history

### Payments
- Payment methods list
- Transaction history
- Payment form with security features

### Profile
- User information card
- Activity statistics
- Settings and preferences

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Design Principles
- Mobile-first approach
- Touch-friendly elements (minimum 48px)
- Adaptive layouts for different screen sizes
- Consistent spacing and typography

## Accessibility

### Contrast Ratios
- Text vs Background: Minimum 4.5:1
- Icons vs Background: Minimum 3:1

### Focus Indicators
- Clear focus states for interactive elements
- High contrast focus rings

### Keyboard Navigation
- All interactive elements accessible via keyboard
- Logical tab order
- ARIA labels for screen readers
