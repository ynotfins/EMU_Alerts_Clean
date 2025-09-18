import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

interface Incident {
  id: string;
  source: string;
  title?: string;
  alertType: string;
  address: string;
  city: string;
  county: string;
  state: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status?: string;
  message: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: any;
}

export function useIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'));
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const incidentsList: Incident[] = [];
        querySnapshot.forEach((doc) => {
          incidentsList.push({
            id: doc.id,
            source: 'incidents', // default source
            ...doc.data()
          } as Incident);
        });
        
        setIncidents(incidentsList);
        setLoading(false);
        setOnline(true); // If we get data, we're online
      },
      (error) => {
        console.error('Error fetching incidents:', error);
        setLoading(false);
        setOnline(false); // Error likely means we're offline
      }
    );

    return () => unsubscribe();
  }, []);

  return {
    incidents,
    loading,
    online
  };
}