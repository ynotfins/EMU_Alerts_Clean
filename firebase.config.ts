import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, type Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ---- Config from .env (expo reads EXPO_PUBLIC_* on boot) ----
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase config is complete
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

let app: any;
let auth: any;
let db: any;

if (!isFirebaseConfigured) {
  console.warn('🚨 Firebase not configured - switching to DEMO MODE');
  console.log('📝 To use real Firebase, configure environment variables in .env file');
  
  // Use demo configuration
  app = { name: 'demo' };
  
  // Mock auth for demo
  auth = {
    currentUser: { uid: 'demo-user', email: 'demo@emualerts.com' },
    onAuthStateChanged: (callback: Function) => {
      setTimeout(() => callback({ uid: 'demo-user', email: 'demo@emualerts.com' }), 1000);
      return () => {};
    },
    signInWithEmailAndPassword: async () => ({ user: { uid: 'demo-user' } }),
    createUserWithEmailAndPassword: async () => ({ user: { uid: 'demo-user' } }),
    signOut: async () => {},
  };
  
  // Mock database for demo
  db = {
    // This will be handled by the demo hooks
  };
  
} else {
  console.log('🔥 Firebase configured - using production mode');
  app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
  
  // Auth: RN uses initializeAuth + AsyncStorage; Web uses getAuth()
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    try {
      // For React Native, we'll use the default persistence
      auth = initializeAuth(app);
    } catch {
      // initializeAuth throws if already created; fall back to existing instance
      auth = getAuth(app);
    }
  }
  
  db = getFirestore(app);
}

// TEMP DEBUG (remove later): verify env is loaded
console.log('[ENV CHECK]', {
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  hasMapsKey: !!process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
});

export { app, auth, db };