import { useState, useEffect } from 'react';
import { doc, onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Incident, IncidentUpdate } from './useIncidents';

interface IncidentState {
  incident: Incident | null;
  timeline: IncidentUpdate[];
  loading: boolean;
  error: string | null;
}

export const useIncident = (incidentId: string) => {
  const [state, setState] = useState<IncidentState>({
    incident: null,
    timeline: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!incidentId) {
      setState({
        incident: null,
        timeline: [],
        loading: false,
        error: 'No incident ID provided',
      });
      return;
    }

    // Subscribe to the main incident document
    const incidentRef = doc(db, 'incidents', incidentId);
    const unsubscribeIncident = onSnapshot(
      incidentRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const incident: Incident = {
            id: snapshot.id,
            alertId: data.alertId,
            title: data.title,
            description: data.description,
            severity: data.severity,
            status: data.status,
            timestamp: data.timestamp?.toDate() || new Date(),
            location: data.location,
            category: data.category,
            source: data.source,
            updates: data.updates?.map((update: any) => ({
              ...update,
              timestamp: update.timestamp?.toDate() || new Date(),
            })) || [],
            notificationsSent: data.notificationsSent || 0,
            affectedAreas: data.affectedAreas || [],
          };

          setState(prev => ({
            ...prev,
            incident,
            loading: false,
            error: null,
          }));
        } else {
          setState(prev => ({
            ...prev,
            incident: null,
            loading: false,
            error: 'Incident not found',
          }));
        }
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    );

    // Subscribe to related incidents with the same alertId for timeline
    const timelineQuery = query(
      collection(db, 'incidents'),
      where('alertId', '==', state.incident?.alertId || ''),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeTimeline = onSnapshot(
      timelineQuery,
      (snapshot) => {
        const timeline: IncidentUpdate[] = [];
        
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          // Add the initial incident as a timeline entry
          timeline.push({
            id: doc.id,
            timestamp: data.timestamp?.toDate() || new Date(),
            message: data.description,
            author: data.source,
            type: 'update',
          });

          // Add all updates from this incident
          if (data.updates) {
            data.updates.forEach((update: any) => {
              timeline.push({
                ...update,
                timestamp: update.timestamp?.toDate() || new Date(),
              });
            });
          }
        });

        // Sort timeline by timestamp
        timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

        setState(prev => ({
          ...prev,
          timeline,
        }));
      },
      (error) => {
        console.warn('Timeline subscription error:', error);
      }
    );

    return () => {
      unsubscribeIncident();
      unsubscribeTimeline();
    };
  }, [incidentId, state.incident?.alertId]);

  const getLatestUpdate = (): IncidentUpdate | null => {
    if (state.timeline.length === 0) return null;
    return state.timeline[state.timeline.length - 1] || null;
  };

  const getUpdatesByType = (type: IncidentUpdate['type']): IncidentUpdate[] => {
    return state.timeline.filter(update => update.type === type);
  };

  return {
    incident: state.incident,
    timeline: state.timeline,
    loading: state.loading,
    error: state.error,
    getLatestUpdate,
    getUpdatesByType,
  };
};
