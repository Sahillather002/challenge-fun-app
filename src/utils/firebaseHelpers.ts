import { auth, firestore } from '../config/firebase';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  addDoc,
  onSnapshot,
  query,
  getDocs
} from 'firebase/firestore';

export const firebaseHelpers = {
  auth: {
    onAuthStateChanged: (callback: (user: any) => void) => {
      return onAuthStateChanged(auth, callback);
    },
    signInWithEmailAndPassword: async (email: string, password: string) =>
      signInWithEmailAndPassword(auth, email, password),
    createUserWithEmailAndPassword: async (email: string, password: string) =>
      createUserWithEmailAndPassword(auth, email, password),
    signOut: async () => signOut(auth),
  },

  firestore: {
    collection: (collectionName: string) => collection(firestore, collectionName),
    doc: (collectionName: string, docId: string) => doc(firestore, collectionName, docId),
    getDoc: async (collectionName: string, docId: string) => {
      const docRef = doc(firestore, collectionName, docId);
      return getDoc(docRef);
    },
    setDoc: async (collectionName: string, docId: string, data: any) => {
      const docRef = doc(firestore, collectionName, docId);
      return setDoc(docRef, data);
    },
    updateDoc: async (collectionName: string, docId: string, data: any) => {
      const docRef = doc(firestore, collectionName, docId);
      return updateDoc(docRef, data);
    },
    addDoc: async (collectionName: string, data: any) => {
      const collectionRef = collection(firestore, collectionName);
      return addDoc(collectionRef, data);
    },
    onSnapshot: (collectionName: string, callback: (snapshot: any) => void) => {
      const collectionRef = collection(firestore, collectionName);
      return onSnapshot(collectionRef, callback);
    },
    query: (collectionName: string, ...queryConstraints: any[]) => {
      const collectionRef = collection(firestore, collectionName);
      return query(collectionRef, ...queryConstraints);
    },
    getDocs: async (queryRef: any) => getDocs(queryRef),
  },
};
