import { useEffect, useState } from 'react';
import { db } from '../firebase.config';
import { doc, onSnapshot } from 'firebase/firestore';
import { useAuth } from './useAuth';

export function useUserProfile(){
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    if (!user) { 
      setProfile(null); 
      setLoading(false); 
      return; 
    }
    
    const ref = doc(db, 'users', user.uid);
    const unsub = onSnapshot(ref, snap => { 
      setProfile(snap.data() || null); 
      setLoading(false); 
    });
    
    return () => unsub();
  }, [user]);
  
  return { profile, loading };
}