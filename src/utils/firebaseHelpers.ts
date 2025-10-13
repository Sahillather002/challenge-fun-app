import { auth, firestore, storage } from '../config/firebase';
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
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';

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
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await getDoc(docRef);
      } catch (error: any) {
        console.error('Firestore getDoc error:', error);
        throw error;
      }
    },
    setDoc: async (collectionName: string, docId: string, data: any) => {
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await setDoc(docRef, data, { merge: true });
      } catch (error: any) {
        console.error('Firestore setDoc error:', error);
        throw error;
      }
    },
    updateDoc: async (collectionName: string, docId: string, data: any) => {
      try {
        const docRef = doc(firestore, collectionName, docId);
        return await updateDoc(docRef, data);
      } catch (error: any) {
        console.error('Firestore updateDoc error:', error);
        throw error;
      }
    },
    addDoc: async (collectionName: string, data: any) => {
      try {
        const collectionRef = collection(firestore, collectionName);
        return await addDoc(collectionRef, data);
      } catch (error: any) {
        console.error('Firestore addDoc error:', error);
        throw error;
      }
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

  storage: {
    uploadImage: async (uri: string, path: string): Promise<string> => {
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
      try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
      } catch (error: any) {
        console.error('Storage delete error:', error);
        throw error;
      }
    },
    getDownloadURL: async (path: string): Promise<string> => {
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
