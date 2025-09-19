import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

// Check if we're in demo mode
const isDemoMode = !process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - auto authenticate after delay
      console.log('🎭 Auth running in DEMO MODE');
      setTimeout(() => {
        setState({
          user: { uid: 'demo-user', email: 'demo@emualerts.com' } as User,
          loading: false,
          error: null,
        });
      }, 1500);
      return () => {}; // No cleanup needed for demo
    }

    // Production mode - use Firebase auth
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
        error: null,
      }));
    }, (error) => {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (isDemoMode) {
      // Demo mode - simulate sign in
      setTimeout(() => {
        setState({
          user: { uid: 'demo-user', email } as User,
          loading: false,
          error: null,
        });
      }, 1000);
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign in failed' 
      }));
    }
  };

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (isDemoMode) {
      // Demo mode - simulate sign up
      setTimeout(() => {
        setState({
          user: { uid: 'demo-user-new', email } as User,
          loading: false,
          error: null,
        });
      }, 1000);
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign up failed' 
      }));
    }
  };

  const logOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    if (isDemoMode) {
      // Demo mode - simulate sign out
      setTimeout(() => {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }, 500);
      return;
    }
    
    try {
      await signOut(auth);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Sign out failed' 
      }));
    }
  };

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut: logOut,
  };
};