import { useState, useEffect } from 'react';
import { doc, onSnapshot, collection, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

interface Incident {
  id: string;
  source?: string;
  alertType: string;
  address: string;
  city: string;
  county: string;
  state: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  timestamp: any;
  message?: string;
}

interface IncidentUpdate {
  id: string;
  source: string;
  alertType: string;
  message: string;
  timestamp: any;
}

export function useIncident(incidentId: string, source?: 'alerts' | 'incidents') {
  const [incident, setIncident] = useState<Incident | null>(null);
  const [updates, setUpdates] = useState<IncidentUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }

    // Listen to the main incident document
    const incidentRef = doc(db, 'incidents', incidentId);
    const unsubscribeIncident = onSnapshot(
      incidentRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setIncident({
            id: docSnapshot.id,
            source: source || 'incidents',
            ...docSnapshot.data()
          } as Incident);
        } else {
          setIncident(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching incident:', error);
        setIncident(null);
        setLoading(false);
      }
    );

    // Listen to related updates/alerts for this incident
    // This is a simplified version - you might want to query by location proximity or other criteria
    const updatesQuery = query(
      collection(db, 'incidents'),
      where('alertType', '==', 'update'), // or however you identify updates
      orderBy('timestamp', 'desc')
    );

    const unsubscribeUpdates = onSnapshot(
      updatesQuery,
      (querySnapshot) => {
        const updatesList: IncidentUpdate[] = [];
        querySnapshot.forEach((doc) => {
          updatesList.push({
            id: doc.id,
            source: 'incidents', // or determine from doc data
            ...doc.data()
          } as IncidentUpdate);
        });
        setUpdates(updatesList.slice(0, 10)); // Limit to 10 most recent
      },
      (error) => {
        console.error('Error fetching updates:', error);
        setUpdates([]);
      }
    );

    return () => {
      unsubscribeIncident();
      unsubscribeUpdates();
    };
  }, [incidentId, source]);

  return {
    incident,
    updates,
    loading
  };
}