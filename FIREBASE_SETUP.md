# Firebase Setup Instructions

## Prerequisites
You need a Firebase project to use authentication and Firestore in this app.

## Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard

## Step 2: Enable Authentication
1. In your Firebase project, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication

## Step 3: Create Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Choose "Start in test mode" for development (update security rules later)

## Step 4: Get Firebase Configuration
1. Go to **Project Settings** (gear icon) → **General**
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`) to add a web app
4. Register your app and copy the configuration

## Step 5: Create `.env` File
Create a `.env` file in the project root with your Firebase credentials:

```env
# Firebase Web Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your-api-key-here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 6: Restart the Development Server
After creating the `.env` file, restart your Expo development server:

```bash
npm start
```

## For Production
Make sure to:
1. Update Firestore security rules
2. Set up proper authentication flows
3. Add environment variables to your hosting platform
4. Enable only necessary Firebase services

## Troubleshooting
- **"Firebase auth not initialized"**: Make sure your `.env` file exists and contains valid Firebase credentials
- **Authentication errors**: Verify that Email/Password authentication is enabled in Firebase Console
- **Firestore errors**: Ensure Firestore database is created and has appropriate security rules
