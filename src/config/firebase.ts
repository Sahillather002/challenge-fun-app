import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "your-app-id"
};

let auth: any;
let firestore: any;

if (Platform.OS === 'web') {
  // Web Firebase SDK
  try {
    const { initializeApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    
    const app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
  } catch (error) {
    console.warn('Firebase Web SDK not initialized:', error);
    // Provide mock implementations for development
    auth = null;
    firestore = null;
  }
} else {
  // React Native Firebase - only load on native platforms
  try {
    auth = require('@react-native-firebase/auth').default;
    firestore = require('@react-native-firebase/firestore').default;
  } catch (error) {
    console.warn('React Native Firebase not available');
    auth = null;
    firestore = null;
  }
}

export { auth, firestore };
