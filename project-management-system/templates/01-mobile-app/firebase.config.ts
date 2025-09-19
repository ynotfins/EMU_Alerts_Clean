import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration - replace with your project's config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// Connect to emulators in development
if (__DEV__) {
  const hostname = 'localhost';
  
  try {
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, hostname, 8080);
  } catch (error) {
    // Emulator already connected
  }
  
  try {
    // Connect to Auth emulator
    connectAuthEmulator(auth, `http://${hostname}:9099`);
  } catch (error) {
    // Emulator already connected
  }
  
  try {
    // Connect to Storage emulator
    connectStorageEmulator(storage, hostname, 9199);
  } catch (error) {
    // Emulator already connected
  }
  
  try {
    // Connect to Functions emulator
    connectFunctionsEmulator(functions, hostname, 5001);
  } catch (error) {
    // Emulator already connected
  }
}

export default app;
