import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';
import { registerForPushAsync } from '../services/push';
import { ensureUser } from '../services/users';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
      console.log('[AUTH] User state changed:', user ? 'Signed in' : 'Signed out');
      
      // Register for push notifications and ensure user profile when user signs in
      if (user) {
        registerForPushAsync(user.uid).catch(() => {});
        ensureUser(user.uid, user.email).catch(() => {});
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error) {
      // Try creating account if sign-in fails
      try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        return result.user;
      } catch (createError) {
        throw error; // Throw original sign-in error
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading,
    signIn,
    logout,
    isAuthenticated: !!user,
  };
}