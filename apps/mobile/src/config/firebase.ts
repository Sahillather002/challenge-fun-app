// Firebase configuration - only initialize when explicitly needed
// This file no longer auto-initializes Firebase to prevent unwanted API calls

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Export config for use in firebaseHelpers (lazy initialization)
export { firebaseConfig };

// This function initializes Firebase only when called explicitly
export const initializeFirebaseApp = () => {
  console.log('🔥 Initializing Firebase App...');

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  // Initialize services
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  const storage = getStorage(app);

  // Enable offline persistence for Firestore (web only)
  if (typeof window !== 'undefined') {
    enableIndexedDbPersistence(firestore).catch((err) => {
      if (err.code === 'failed-precondition') {
        console.warn('⚠️ Firestore persistence failed: Multiple tabs open');
      } else if (err.code === 'unimplemented') {
        console.warn('⚠️ Firestore persistence not available in this browser');
      }
    });
  }

  console.log('✅ Firebase App initialized successfully');
  return { app, auth, firestore, storage };
};

// Export services for backward compatibility (will be undefined until initializeFirebaseApp is called)
export let auth: any = null;
export let firestore: any = null;
export let storage: any = null;
export let app: any = null;

// Initialize function for when Firebase is actually needed
export const ensureFirebaseInitialized = () => {
  if (!auth) {
    const services = initializeFirebaseApp();
    auth = services.auth;
    firestore = services.firestore;
    storage = services.storage;
    app = services.app;
  }
};
