# Health Competition App - React Native

A comprehensive health competition app for company employees that tracks daily steps using Google Fit and organizes wellness competitions with prize distribution.

## 🏆 App Overview

This React Native app enables companies to organize health competitions where employees can:
- Join step-tracking competitions (weekly/monthly)
- Pay minimal entry fees (₹50)
- Compete using Google Fit step data
- Win cash prizes for top 3 positions
- Track progress and achievements

## 📱 App Screenshots

Here's a visual preview of the Health Competition App interface:

### Main Screens

| Dashboard | Competition Screen | Leaderboard | Payment Screen |
|-----------|-------------------|-------------|----------------|
| ![Dashboard Screenshot](screenshots/dashboard.png) | ![Competition Screenshot](screenshots/compete.png) | ![Leaderboard Screenshot](screenshots/leaderboard.png) | ![Payment Screenshot](screenshots/payment.png) |

### Authentication Flow

| Login Screen | Registration Screen | Google Fit Integration |
|-------------|-------------------|----------------------|
| ![Login Screenshot](screenshots/login.png) | ![Register Screenshot](screenshots/register.png) | ![Google Fit Screenshot](screenshots/google-fit.png) |

### Key Features in Action

| Step Tracking | Competition Details | Prize Distribution | Profile Management |
|--------------|-------------------|-------------------|-------------------|
| ![Step Tracking](screenshots/step-tracking.png) | ![Competition Details](screenshots/competition-details.png) | ![Prize Distribution](screenshots/prizes.png) | ![Profile Screenshot](screenshots/profile.png) |

*To add your own screenshots:*
1. Run the app using `npm start`
2. Take screenshots of the key screens listed above
3. Save them as PNG files in the `screenshots/` directory
4. Replace the placeholder paths in this README with your actual screenshot files

## 🏗️ System Architecture & Flow Diagram

This section contains **interactive Mermaid diagrams** that illustrate the complete system architecture and data flows. Mermaid diagrams render beautifully on GitHub and other platforms that support them.

### 📋 **Visual Diagram Gallery**

All diagrams are provided as **Mermaid syntax** that renders automatically:

| Diagram | Type | Description |
|---------|------|-------------|
| **🏗️ System Architecture** | `mermaid` | Complete system components and data flow |
| **🗄️ Database Schema** | `mermaid` | Table relationships and structure |
| **👤 User Registration Flow** | `mermaid` | Step-by-step registration process |
| **⚡ Real-time Updates** | `mermaid` | Live data synchronization workflow |
| **🏆 Prize Distribution** | `mermaid` | Winnings calculation and payout process |
| **🔧 Error Handling** | `mermaid` | Error recovery and state management |
| **🗺️ User Journey** | `mermaid` | Complete user experience phases |

### 🚀 **Mermaid Diagram Features**

✅ **GitHub Native** - Renders perfectly on GitHub without external files  
✅ **Interactive** - Zoomable and clickable when viewed on supported platforms  
✅ **Version Control** - Diagrams are part of your README, tracked in git  
✅ **No External Dependencies** - Works anywhere Markdown is supported  
✅ **Easy to Edit** - Simple text syntax for quick modifications  

### 📖 **Text-Based Overviews** (Universal Fallback)

For platforms that don't support Mermaid rendering, here are text-based representations:

#### System Architecture Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Mobile App    │───▶│  Authentication  │───▶│   Firebase      │
│   (React Native)│    │  (JWT Tokens)    │    │   Auth & DB     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│ Google Fit API  │◀───│   Real-time      │───▶│   Supabase      │
│ (Step Tracking) │    │   Updates        │    │   Database      │
└─────────────────┘    │   (WebSocket)    │    │   (PostgreSQL)  │
                       └──────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌──────────────────┐    ┌─────────────────┐
                       │  Payment Gateway │    │ Push Notifications│
                       │  (Razorpay/UPI)  │    │   (FCM/APNs)    │
                       └──────────────────┘    └─────────────────┘
```

#### Database Relationships
```
USERS ──┬── COMPETITIONS (creates)
        ├── USER_COMPETITIONS (joins)
        ├── STEP_DATA (tracks)
        ├── PAYMENTS (makes)
        └── NOTIFICATIONS (receives)

COMPETITIONS ──┬── USER_COMPETITIONS (has)
               ├── STEP_DATA (measures)
               └── PAYMENTS (collects)

USER_COMPETITIONS ──┬── PAYMENTS (requires)
                   └── STEP_DATA (generates)

PAYMENTS ── NOTIFICATIONS (triggers)
STEP_DATA ── NOTIFICATIONS (generates)
```

#### Core Data Flows
1. **User Registration**: Registration Form → Firebase Auth → Email Verification → Supabase Profile
2. **Google Fit Integration**: OAuth Authorization → Daily Step Sync → Real-time Updates
3. **Competition Lifecycle**: Create Competition → User Enrollment → Daily Tracking → Prize Distribution
4. **Payment Processing**: Payment Gateway → Transaction Recording → Winner Payout

### 📁 **File Structure**
```
diagrams/
└── README.txt                   # Guide for creating external visual diagrams
```

*Note: Mermaid diagrams render perfectly on GitHub. If you're viewing this in a local markdown viewer, the diagrams may appear as code blocks.*

### 🏗️ **System Architecture**

```mermaid
graph TB
    A[Mobile App] --> B[Authentication]
    B --> C[Firebase Auth]
    C --> D[User Registration]

    A --> E[Google Fit Integration]
    E --> F[OAuth Authorization]
    F --> G[Step Data Sync]

    G --> H[Supabase Database]
    H --> I[Users Table]
    H --> J[Competitions Table]
    H --> K[Step Data Table]
    H --> L[Payments Table]
    H --> M[Notifications Table]

    D --> I
    G --> K
    A --> N[Competition Management]
    N --> J
    J --> O[Prize Calculation]

    A --> P[Payment Processing]
    P --> Q[Payment Gateway]
    Q --> L
    L --> O

    O --> R[Prize Distribution]
    R --> S[Winner Notifications]
    S --> M

    H --> T[Real-time Updates]
    T --> U[Push Notifications]
    T --> V[Live Leaderboards]

    style A fill:#e1f5fe
    style H fill:#f3e5f5
    style O fill:#e8f5e8
```

### 🗄️ **Database Schema Relationships**

```mermaid
erDiagram
    USERS ||--o{ COMPETITIONS : creates
    USERS ||--o{ USER_COMPETITIONS : joins
    USERS ||--o{ STEP_DATA : tracks
    USERS ||--o{ PAYMENTS : makes
    USERS ||--o{ NOTIFICATIONS : receives

    COMPETITIONS ||--o{ USER_COMPETITIONS : has
    COMPETITIONS ||--o{ STEP_DATA : measures
    COMPETITIONS ||--o{ PAYMENTS : collects

    USER_COMPETITIONS ||--o{ PAYMENTS : requires
    USER_COMPETITIONS ||--o{ STEP_DATA : generates

    PAYMENTS ||--o{ NOTIFICATIONS : triggers
    STEP_DATA ||--o{ NOTIFICATIONS : generates
```

### 👤 **User Registration & Authentication Flow**

```mermaid
sequenceDiagram
    participant U as User
    participant A as App
    participant F as Firebase Auth
    participant S as Supabase
    participant E as Email Service

    U->>A: Click Register Button
    A->>U: Show Registration Form
    U->>A: Enter Details (Name, Email, Password, Company)
    A->>F: Create Account Request
    F-->>A: Account Created + Email Verification
    A->>E: Send Welcome Email
    E-->>U: Welcome Email Sent

    U->>A: Verify Email Link
    A->>F: Verify Email Token
    F-->>A: Email Verified

    A->>S: Create User Profile
    S-->>A: Profile Created
    A->>U: Registration Complete
```

### ⚡ **Real-time Update Mechanism**

```mermaid
flowchart TD
    A[Step Data Update] --> B{Trigger Type}
    B --> C[Daily Sync]
    B --> D[Manual Refresh]
    B --> E[Competition Start/End]

    C --> F[Google Fit API Call]
    D --> F
    E --> F

    F --> G{Data Valid?}
    G -->|Yes| H[Supabase Update]
    G -->|No| I[Error Handling]

    H --> J[Real-time Subscription]
    J --> K[WebSocket Broadcast]
    K --> L[Connected Clients]
    L --> M[Live UI Updates]
    M --> N[Leaderboard Refresh]
    M --> O[Notification Trigger]

    I --> P[Retry Logic]
    P --> Q{Max Retries?}
    Q -->|No| F
    Q -->|Yes| R[Log Error & Notify]
```

### 🏆 **Prize Distribution Process**

```mermaid
flowchart TD
    A[Competition Ends] --> B[Calculate Final Rankings]
    B --> C[Determine Winners]

    C --> D{Top 3 Positions}
    D --> E[1st Place: 60%]
    D --> F[2nd Place: 30%]
    D --> G[3rd Place: 10%]

    E --> H[Calculate Prize Amount]
    F --> I[Calculate Prize Amount]
    G --> J[Calculate Prize Amount]

    H --> K[Supabase Prize Record]
    I --> L[Supabase Prize Record]
    J --> M[Supabase Prize Record]

    K --> N[Winner Notification]
    L --> O[Winner Notification]
    M --> P[Winner Notification]

    N --> Q[Payment Processing]
    O --> R[Payment Processing]
    P --> S[Payment Processing]

    Q --> T{Payment Success?}
    R --> U{Payment Success?}
    S --> V{Payment Success?}

    T -->|Yes| W[Mark as Paid]
    U -->|Yes| X[Mark as Paid]
    V -->|Yes| Y[Mark as Paid]

    W --> Z[Transaction Complete]
    X --> AA[Transaction Complete]
    Y --> BB[Transaction Complete]

    T -->|No| CC[Retry Payment]
    U -->|No| DD[Retry Payment]
    V -->|No| EE[Retry Payment]
```

### 🔧 **Error Handling & Recovery Workflow**

```mermaid
stateDiagram-v2
    [*] --> Monitoring

    Monitoring --> API_Error: API Call Fails
    Monitoring --> Auth_Error: Authentication Fails
    Monitoring --> Network_Error: Network Issues
    Monitoring --> Data_Error: Data Validation Fails

    API_Error --> Retry_Logic: Auto Retry
    Retry_Logic --> [*]: Success
    Retry_Logic --> Error_Log: Max Retries Exceeded

    Auth_Error --> Token_Refresh: Refresh Token
    Token_Refresh --> [*]: Success
    Token_Refresh --> Re_Auth: Refresh Failed
    Re_Auth --> Login_Screen: Force Re-login

    Network_Error --> Offline_Mode: Enable Offline
    Offline_Mode --> Queue_Actions: Queue Operations
    Offline_Mode --> [*]: Connection Restored

    Data_Error --> Validation_Rules: Check Rules
    Validation_Rules --> Correction_UI: Show Error to User
    Correction_UI --> [*]: User Fixes Data

    Error_Log --> Admin_Alert: Critical Errors
    Admin_Alert --> [*]: Admin Notified
```

### 🗺️ **Complete User Journey Map**

```mermaid
journey
    title Complete User Experience Journey

    section Registration
        Visit App: 5: User
        Create Account: 4: User, Firebase
        Verify Email: 3: User, Email Service
        Complete Profile: 4: User, Supabase

    section Onboarding
        Connect Google Fit: 5: User, Google Fit API
        First Step Sync: 4: System
        Tutorial Complete: 3: User

    section Active Usage
        Browse Competitions: 4: User, App
        Join Competition: 5: User, Payment Gateway
        Daily Step Tracking: 5: Google Fit, Supabase
        Check Rankings: 4: User, Real-time Updates

    section Competition End
        Final Rankings: 5: System
        Prize Calculation: 5: Supabase
        Winner Notification: 5: Push Notifications
        Prize Claiming: 4: User, Payment Gateway

    section Long-term
        Achievement Tracking: 4: User, Analytics
        Multiple Competitions: 5: User
        Social Features: 3: User, Planned
```

## 📱 Core Features

### 1. Authentication System
- **Login/Register** with email and password
- Company and department information
- Secure Firebase authentication
- User profile management

### 2. Google Fit Integration
- **Step Tracking**: Automatic daily step count sync
- **Historical Data**: Weekly and monthly step analytics
- **Real-time Updates**: Live step counter with progress
- **Authorization**: Secure OAuth integration

### 3. Competition Management
- **Create Competitions**: Admin can create weekly/monthly competitions
- **Join Competitions**: Employees can join with entry fee payment
- **Competition Types**: Weekly and monthly duration options
- **Prize Distribution**: Automatic prize pool calculation (60% to winners)

### 4. Payment System
- **Multiple Payment Methods**: UPI, Credit/Debit Cards, Net Banking
- **Secure Processing**: Encrypted payment handling
- **Entry Fee Collection**: ₹50 standard fee with convenience charges
- **Payment History**: Transaction records and receipts

### 5. Dashboard & Analytics
- **Daily Progress**: Real-time step tracking with goals
- **Weekly Charts**: Visual step history with line charts
- **Achievement Stats**: Calories, distance, and time tracking
- **Active Competitions**: Quick access to ongoing challenges

### 6. Leaderboard System
- **Real-time Rankings**: Live competition standings
- **Top Three Display**: Special podium visualization
- **Personal Ranking**: Highlight user's current position
- **Filter Options**: Search and filter participants

### 7. Rewards & Prizes
- **Prize Calculation**: Automatic distribution based on position
- **Claim System**: Secure reward claiming process
- **Earnings Tracking**: Total winnings and pending claims
- **Achievement Badges**: Visual representation of wins

### 8. Notifications
- **Push Notifications**: Real-time updates and reminders
- **Competition Alerts**: New competitions and deadline reminders
- **Achievement Notifications**: Milestone celebrations
- **Smart Filtering**: Unread/read notification management

### 9. Profile Management
- **Personal Information**: Editable profile details
- **Statistics Dashboard**: Personal health metrics
- **Settings Management**: Privacy and notification preferences
- **Achievement History**: Competition participation record

## 🏗️ Architecture & Components

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── GoogleFitCard.tsx
│   └── NotificationsContainer.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx
│   ├── CompetitionContext.tsx
│   └── ThemeContext.tsx
├── screens/            # Main app screens
│   ├── Auth/
│   ├── Dashboard/
│   ├── Competition/
│   ├── Profile/
│   ├── Leaderboard/
│   ├── Payment/
│   ├── Rewards/
│   └── Settings/
├── services/           # Business logic and APIs
│   └── GoogleFitService.ts
├── types/              # TypeScript type definitions
│   └── index.ts
└── utils/              # Helper functions
```

### Key Components Explained

#### 1. Authentication Components
- **LoginScreen**: User login with email/password
- **RegisterScreen**: New user registration with company details
- **AuthContext**: Global authentication state management

#### 2. Google Fit Components
- **GoogleFitService**: Complete Google Fit API integration
- **GoogleFitCard**: Real-time step tracking UI component
- Features: Daily steps, weekly progress, goal tracking

#### 3. Competition Components
- **CompetitionScreen**: Browse and join competitions
- **CreateCompetitionScreen**: Admin competition creation
- **CompetitionContext**: Competition state management

#### 4. Dashboard Components
- **DashboardScreen**: Main user dashboard with analytics
- Features: Step charts, active competitions, quick actions
- Real-time data updates and progress tracking

#### 5. Payment Components
- **PaymentScreen**: Multi-method payment processing
- Features: UPI, cards, net banking integration
- Secure transaction handling

#### 6. Leaderboard Components
- **LeaderboardScreen**: Real-time competition rankings
- Features: Top three podium, search/filter, personal ranking
- Animated rank updates and achievement badges

#### 7. Profile Components
- **ProfileScreen**: User profile management
- Features: Edit profile, statistics, settings
- Image upload and privacy controls

#### 8. Rewards Components
- **RewardsScreen**: Prize management and claiming
- Features: Earnings tracking, achievement summary
- Secure reward claiming process

#### 9. Settings Components
- **SettingsScreen**: Comprehensive app settings
- Features: Notifications, privacy, data management
- Account management and support options

## 🔧 Technical Implementation

### State Management
- **React Context**: Global state for auth, competitions, theme
- **Local State**: Component-specific state with useState
- **Async Storage**: Persistent settings and preferences

### Database Schema
```typescript
// User Schema
interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  department: string;
  totalSteps: number;
  competitionsWon: number;
  joinedDate: Date;
}

// Competition Schema
interface Competition {
  id: string;
  name: string;
  description: string;
  type: 'weekly' | 'monthly';
  entryFee: number;
  prizePool: number;
  startDate: Date;
  endDate: Date;
  participants: string[];
  status: 'upcoming' | 'active' | 'completed';
  createdBy: string;
  rules: string[];
  prizes: {
    first: number;
    second: number;
    third: number;
  };
}

// Step Data Schema
interface StepData {
  userId: string;
  competitionId: string;
  date: string;
  steps: number;
  timestamp: Date;
}
```

### API Integration
- **Firebase**: Authentication and Firestore database
- **Google Fit API**: Step tracking and health data
- **Payment Gateway**: Multi-method payment processing
- **Push Notifications**: Real-time user engagement

### Security Features
- **OAuth 2.0**: Secure Google Fit authorization
- **Encrypted Payments**: PCI-compliant payment processing
- **Data Privacy**: User consent and privacy controls
- **Secure Authentication**: Firebase security rules

## 🚀 Getting Started

### Prerequisites
- React Native development environment
- Firebase project setup
- Google Fit API credentials
- Payment gateway integration

### Installation
```bash
# Clone the repository
git clone <repository-url>

# Install dependencies
npm install

# iOS setup
cd ios && pod install

# Run the app
npm run android  # or npm run ios
```

### Configuration
1. **Firebase Setup**:
   - Create Firebase project
   - Configure Authentication
   - Set up Firestore database
   - Add Firebase config to app

2. **Google Fit Setup**:
   - Enable Google Fit API in Google Cloud Console
   - Configure OAuth credentials
   - Add SHA-1 fingerprint

3. **Payment Gateway**:
   - Set up payment provider account
   - Configure API keys
   - Test payment methods

## 💰 Monetization & Business Model

### Revenue Streams
1. **Entry Fees**: ₹50 per competition per participant
2. **Convenience Fees**: ₹2 per transaction
3. **Premium Features**: Advanced analytics and personal training
4. **Corporate Plans**: Company-wide wellness programs

### Prize Distribution
- **First Place**: 60% of prize pool
- **Second Place**: 30% of prize pool  
- **Third Place**: 10% of prize pool
- **Platform Fee**: Remaining amount for platform maintenance

### Example Calculation
For a competition with 100 participants:
- Total Collection: ₹5,000 (₹50 × 100)
- Prize Pool: ₹3,000 (60% distribution)
  - 1st Place: ₹1,800
  - 2nd Place: ₹900
  - 3rd Place: ₹300
- Platform Revenue: ₹2,000

## 🎯 User Journey

### New User Flow
1. **Registration**: Sign up with company details
2. **Profile Setup**: Complete personal information
3. **Google Fit Connect**: Authorize step tracking
4. **Browse Competitions**: View available challenges
5. **Join Competition**: Pay entry fee and participate
6. **Track Progress**: Monitor daily steps and ranking
7. **Win Prizes**: Claim rewards for top positions

### Admin Flow
1. **Create Competition**: Set up new challenges
2. **Manage Participants**: Monitor join requests
3. **Track Progress**: View competition analytics
4. **Distribute Prizes**: Process winner payments
5. **Generate Reports**: Export competition data

## 🔮 Future Enhancements

### Planned Features
1. **Multi-Device Support**: Wear OS and iOS integration
2. **Advanced Analytics**: AI-powered health insights
3. **Social Features**: Team competitions and challenges
4. **Corporate Dashboard**: Company-wide wellness metrics
5. **Integration Partners**: Health apps and wearable devices

### Scalability Considerations
- **Cloud Infrastructure**: Auto-scaling backend services
- **Data Analytics**: Real-time competition metrics
- **Machine Learning**: Personalized health recommendations
- **Global Expansion**: Multi-language and currency support

## 📄 License & Legal

This project is licensed under the MIT License. See LICENSE file for details.

### Compliance
- **GDPR Compliant**: Data protection and privacy
- **HIPAA Compliant**: Health data security
- **PCI DSS**: Payment card industry standards
- **Accessibility**: WCAG 2.1 compliance

## 🤝 Contributing

We welcome contributions! Please see CONTRIBUTING.md for guidelines.

### Development Guidelines
- Follow React Native best practices
- Write comprehensive tests
- Maintain code quality standards
- Document new features

---

**Built with ❤️ for promoting workplace wellness and healthy competition**