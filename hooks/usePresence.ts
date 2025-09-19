import { useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { updatePresence } from '../services/presence';
import { useAuth } from './useAuth';

export function usePresence(active:boolean){
  const { user } = useAuth();
  const timer = useRef<NodeJS.Timeout|null>(null);
  
  useEffect(()=>{
    if (!user) return;
    let mounted = true;
    
    async function tick(){
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        if (!mounted) return;
        if (user?.uid) {
          await updatePresence(user.uid, pos.coords.latitude, pos.coords.longitude);
        }
      } catch (error) {
        console.log('Presence update failed:', error);
      }
    }
    
    // First ping
    tick();
    
    // Interval ping only if active (responding)
    if (active) {
      timer.current = setInterval(tick, 20000) as any; // 20 seconds
    }
    
    return ()=>{ 
      mounted = false; 
      if (timer.current) {
        clearInterval(timer.current);
        timer.current = null;
      }
    };
  }, [active, user?.uid]);
}