import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyB8lgEtRrt24I-5jf9n89vk8F5Dk1nqXhY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "challenge-fun-app-98e01.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "challenge-fun-app-98e01",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "challenge-fun-app-98e01.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1082606877069",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1082606877069:web:5c8052854655393cdba5c4",
};

console.log('Initializing Firebase...', firebaseConfig);

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const firestore = getFirestore(app);

console.log('Firebase initialized successfully');

export { auth, firestore, app };
