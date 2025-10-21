// Firebase configuration - only initialize when needed
let firebaseInitialized = false;
let auth: any = null;
let firestore: any = null;
let storage: any = null;

// Import supabase helpers for database operations
import { supabaseHelpers } from '../config/supabase';

// Lazy initialization function
const initializeFirebase = () => {
  if (firebaseInitialized) return;

  try {
    const { initializeApp, getApps, getApp } = require('firebase/app');
    const { getAuth } = require('firebase/auth');
    const { getFirestore } = require('firebase/firestore');
    const { getStorage } = require('firebase/storage');

    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    console.log('🔥 Initializing Firebase for storage...');

    // Initialize Firebase only if not already initialized
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);

    firebaseInitialized = true;
    console.log('✅ Firebase storage initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize Firebase:', error);
  }
};

// Firebase Auth helpers (keeping these for backward compatibility)
export const firebaseHelpers = {
  auth: {
    onAuthStateChanged: (callback: (user: any) => void) => {
      initializeFirebase();
      const { onAuthStateChanged } = require('firebase/auth');
      return onAuthStateChanged(auth, callback);
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      initializeFirebase();
      const { signInWithEmailAndPassword } = require('firebase/auth');
      return signInWithEmailAndPassword(auth, email, password);
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      initializeFirebase();
      const { createUserWithEmailAndPassword } = require('firebase/auth');
      return createUserWithEmailAndPassword(auth, email, password);
    },
    signOut: async () => {
      initializeFirebase();
      const { signOut } = require('firebase/auth');
      return signOut(auth);
    },
  },

  firestore: {
    collection: (collectionName: string) => {
      initializeFirebase();
      const { collection } = require('firebase/firestore');
      return collection(firestore, collectionName);
    },
    doc: (collectionName: string, docId: string) => {
      initializeFirebase();
      const { doc } = require('firebase/firestore');
      return doc(firestore, collectionName, docId);
    },
    getDoc: async (collectionName: string, docId: string) => {
      initializeFirebase();
      const { getDoc, doc } = require('firebase/firestore');
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await getDoc(docRef);
      } catch (error: any) {
        console.error('Firestore getDoc error:', error);
        throw error;
      }
    },
    setDoc: async (collectionName: string, docId: string, data: any) => {
      initializeFirebase();
      const { setDoc, doc } = require('firebase/firestore');
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await setDoc(docRef, data, { merge: true });
      } catch (error: any) {
        console.error('Firestore setDoc error:', error);
        throw error;
      }
    },
    updateDoc: async (collectionName: string, docId: string, data: any) => {
      initializeFirebase();
      const { updateDoc, doc } = require('firebase/firestore');
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await updateDoc(docRef, data);
      } catch (error: any) {
        console.error('Firestore updateDoc error:', error);
        throw error;
      }
    },
    addDoc: async (collectionName: string, data: any) => {
      initializeFirebase();
      const { addDoc, collection } = require('firebase/firestore');
      try {
        const collectionRef = collection(firestore, collectionName);
        return await addDoc(collectionRef, data);
      } catch (error: any) {
        console.error('Firestore addDoc error:', error);
        throw error;
      }
    },
    onSnapshot: (collectionName: string, callback: (snapshot: any) => void) => {
      initializeFirebase();
      const { onSnapshot, collection } = require('firebase/firestore');
      const collectionRef = collection(firestore, collectionName);
      return onSnapshot(collectionRef, callback);
    },
    query: (collectionName: string, ...queryConstraints: any[]) => {
      initializeFirebase();
      const { query, collection } = require('firebase/firestore');
      const collectionRef = collection(firestore, collectionName);
      return query(collectionRef, ...queryConstraints);
    },
    getDocs: async (queryRef: any) => {
      initializeFirebase();
      const { getDocs } = require('firebase/firestore');
      return getDocs(queryRef);
    },
  },

  storage: {
    uploadImage: async (uri: string, path: string): Promise<string> => {
      initializeFirebase();
      const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

      try {
        // Convert URI to blob for web
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL;
      } catch (error: any) {
        console.error('Storage upload error:', error);
        throw error;
      }
    },
    deleteImage: async (path: string) => {
      initializeFirebase();
      const { ref, deleteObject } = require('firebase/storage');

      try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      } catch (error: any) {
        console.error('Storage delete error:', error);
        throw error;
      }
    },
    getDownloadURL: async (path: string): Promise<string> => {
      initializeFirebase();
      const { ref, getDownloadURL } = require('firebase/storage');

      try {
        const storageRef = ref(storage, path);
        return await getDownloadURL(storageRef);
      } catch (error: any) {
        console.error('Storage getDownloadURL error:', error);
        throw error;
      }
    },
  },
};

// Supabase database helpers (new)
export const databaseHelpers = {
  // User operations using Supabase
  users: {
    async getById(id: string) {
      try {
        return await supabaseHelpers.users.getById(id);
      } catch (error: any) {
        console.error('Supabase users.getById error:', error);
        throw error;
      }
    },

    async create(userData: any) {
      try {
        return await supabaseHelpers.users.create(userData);
      } catch (error: any) {
        console.error('Supabase users.create error:', error);
        throw error;
      }
    },

    async update(id: string, userData: any) {
      try {
        return await supabaseHelpers.users.update(id, userData);
      } catch (error: any) {
        console.error('Supabase users.update error:', error);
        throw error;
      }
    },

    async getAll() {
      try {
        return await supabaseHelpers.users.getAll();
      } catch (error: any) {
        console.error('Supabase users.getAll error:', error);
        throw error;
      }
    }
  },

  // Competition operations using Supabase
  competitions: {
    async getAll() {
      try {
        return await supabaseHelpers.competitions.getAll();
      } catch (error: any) {
        console.error('Supabase competitions.getAll error:', error);
        throw error;
      }
    },

    async create(competitionData: any) {
      try {
        return await supabaseHelpers.competitions.create(competitionData);
      } catch (error: any) {
        console.error('Supabase competitions.create error:', error);
        throw error;
      }
    },

    async update(id: string, competitionData: any) {
      try {
        return await supabaseHelpers.competitions.update(id, competitionData);
      } catch (error: any) {
        console.error('Supabase competitions.update error:', error);
        throw error;
      }
    },

    async getById(id: string) {
      try {
        return await supabaseHelpers.competitions.getById(id);
      } catch (error: any) {
        console.error('Supabase competitions.getById error:', error);
        throw error;
      }
    }
  },

  // Step data operations using Supabase
  steps: {
    async getByUserAndCompetition(userId: string, competitionId: string) {
      try {
        return await supabaseHelpers.steps.getByUserAndCompetition(userId, competitionId);
      } catch (error: any) {
        console.error('Supabase steps.getByUserAndCompetition error:', error);
        throw error;
      }
    },

    async create(stepData: any) {
      try {
        return await supabaseHelpers.steps.create(stepData);
      } catch (error: any) {
        console.error('Supabase steps.create error:', error);
        throw error;
      }
    },

    async update(id: string, stepData: any) {
      try {
        return await supabaseHelpers.steps.update(id, stepData);
      } catch (error: any) {
        console.error('Supabase steps.update error:', error);
        throw error;
      }
    }
  },

  // Payment operations using Supabase
  payments: {
    async getByUser(userId: string) {
      try {
        return await supabaseHelpers.payments.getByUser(userId);
      } catch (error: any) {
        console.error('Supabase payments.getByUser error:', error);
        throw error;
      }
    },

    async create(paymentData: any) {
      try {
        return await supabaseHelpers.payments.create(paymentData);
      } catch (error: any) {
        console.error('Supabase payments.create error:', error);
        throw error;
      }
    }
  },

  // Reward operations using Supabase
  rewards: {
    async getByUser(userId: string) {
      try {
        return await supabaseHelpers.rewards.getByUser(userId);
      } catch (error: any) {
        console.error('Supabase rewards.getByUser error:', error);
        throw error;
      }
    },

    async create(rewardData: any) {
      try {
        return await supabaseHelpers.rewards.create(rewardData);
      } catch (error: any) {
        console.error('Supabase rewards.create error:', error);
        throw error;
      }
    },

    async claimReward(id: string) {
      try {
        return await supabaseHelpers.rewards.claimReward(id);
      } catch (error: any) {
        console.error('Supabase rewards.claimReward error:', error);
        throw error;
      }
    }
  }
};
