import { Platform } from 'react-native';

// Lazy load firebase config to avoid bundling issues
let auth: any;
let firestore: any;

if (Platform.OS !== 'web') {
  const firebase = require('../config/firebase');
  auth = firebase.auth;
  firestore = firebase.firestore;
}

// Platform-agnostic Firebase helpers
export const firebaseHelpers = {
  // Auth helpers
  auth: {
    onAuthStateChanged: (callback: (user: any) => void) => {
      if (Platform.OS === 'web') {
        const { onAuthStateChanged } = require('firebase/auth');
        return onAuthStateChanged(auth, callback);
      } else {
        return auth().onAuthStateChanged(callback);
      }
    },
    signInWithEmailAndPassword: async (email: string, password: string) => {
      if (Platform.OS === 'web') {
        const { signInWithEmailAndPassword } = require('firebase/auth');
        return signInWithEmailAndPassword(auth, email, password);
      } else {
        return auth().signInWithEmailAndPassword(email, password);
      }
    },
    createUserWithEmailAndPassword: async (email: string, password: string) => {
      if (Platform.OS === 'web') {
        const { createUserWithEmailAndPassword } = require('firebase/auth');
        return createUserWithEmailAndPassword(auth, email, password);
      } else {
        return auth().createUserWithEmailAndPassword(email, password);
      }
    },
    signOut: async () => {
      if (Platform.OS === 'web') {
        const { signOut } = require('firebase/auth');
        return signOut(auth);
      } else {
        return auth().signOut();
      }
    },
  },

  // Firestore helpers
  firestore: {
    collection: (collectionName: string) => {
      if (Platform.OS === 'web') {
        const { collection } = require('firebase/firestore');
        return collection(firestore, collectionName);
      } else {
        return firestore().collection(collectionName);
      }
    },
    doc: (collectionName: string, docId: string) => {
      if (Platform.OS === 'web') {
        const { doc } = require('firebase/firestore');
        return doc(firestore, collectionName, docId);
      } else {
        return firestore().collection(collectionName).doc(docId);
      }
    },
    getDoc: async (collectionName: string, docId: string) => {
      if (Platform.OS === 'web') {
        const { doc, getDoc } = require('firebase/firestore');
        const docRef = doc(firestore, collectionName, docId);
        return getDoc(docRef);
      } else {
        return firestore().collection(collectionName).doc(docId).get();
      }
    },
    setDoc: async (collectionName: string, docId: string, data: any) => {
      if (Platform.OS === 'web') {
        const { doc, setDoc } = require('firebase/firestore');
        const docRef = doc(firestore, collectionName, docId);
        return setDoc(docRef, data);
      } else {
        return firestore().collection(collectionName).doc(docId).set(data);
      }
    },
    updateDoc: async (collectionName: string, docId: string, data: any) => {
      if (Platform.OS === 'web') {
        const { doc, updateDoc } = require('firebase/firestore');
        const docRef = doc(firestore, collectionName, docId);
        return updateDoc(docRef, data);
      } else {
        return firestore().collection(collectionName).doc(docId).update(data);
      }
    },
    addDoc: async (collectionName: string, data: any) => {
      if (Platform.OS === 'web') {
        const { collection, addDoc } = require('firebase/firestore');
        const collectionRef = collection(firestore, collectionName);
        return addDoc(collectionRef, data);
      } else {
        return firestore().collection(collectionName).add(data);
      }
    },
    onSnapshot: (collectionName: string, callback: (snapshot: any) => void) => {
      if (Platform.OS === 'web') {
        const { collection, onSnapshot } = require('firebase/firestore');
        const collectionRef = collection(firestore, collectionName);
        return onSnapshot(collectionRef, callback);
      } else {
        return firestore().collection(collectionName).onSnapshot(callback);
      }
    },
    query: (collectionName: string, ...queryConstraints: any[]) => {
      if (Platform.OS === 'web') {
        const { collection, query } = require('firebase/firestore');
        const collectionRef = collection(firestore, collectionName);
        return query(collectionRef, ...queryConstraints);
      } else {
        let ref = firestore().collection(collectionName);
        queryConstraints.forEach(constraint => {
          if (constraint.type === 'where') {
            ref = ref.where(constraint.field, constraint.operator, constraint.value);
          }
        });
        return ref;
      }
    },
    getDocs: async (queryRef: any) => {
      if (Platform.OS === 'web') {
        const { getDocs } = require('firebase/firestore');
        return getDocs(queryRef);
      } else {
        return queryRef.get();
      }
    },
  },
};
