import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

export interface Incident {
  id: string;
  alertId: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'investigating';
  timestamp: Date;
  location?: string;
  category: string;
  source: string;
  updates: IncidentUpdate[];
  notificationsSent: number;
  affectedAreas?: string[];
}

export interface IncidentUpdate {
  id: string;
  timestamp: Date;
  message: string;
  author: string;
  type: 'update' | 'escalation' | 'resolution';
}

interface IncidentsState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
}

export const useIncidents = (maxResults: number = 50) => {
  const [state, setState] = useState<IncidentsState>({
    incidents: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const incidentsQuery = query(
      collection(db, 'incidents'),
      orderBy('timestamp', 'desc'),
      limit(maxResults)
    );

    const unsubscribe = onSnapshot(
      incidentsQuery,
      (snapshot) => {
        const incidents: Incident[] = [];
        const seenAlertIds = new Set<string>();

        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const incident: Incident = {
            id: doc.id,
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

          // Merge and dedupe by alertId - keep the most recent
          if (!seenAlertIds.has(incident.alertId)) {
            incidents.push(incident);
            seenAlertIds.add(incident.alertId);
          } else {
            // Find existing incident and merge if this one is more recent
            const existingIndex = incidents.findIndex(i => i.alertId === incident.alertId);
            if (existingIndex !== -1 && incident.timestamp > incidents[existingIndex].timestamp) {
              incidents[existingIndex] = {
                ...incidents[existingIndex],
                ...incident,
                updates: [
                  ...incidents[existingIndex].updates,
                  ...incident.updates
                ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
              };
            }
          }
        });

        setState({
          incidents: incidents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()),
          loading: false,
          error: null,
        });
      },
      (error) => {
        setState(prev => ({
          ...prev,
          loading: false,
          error: error.message,
        }));
      }
    );

    return unsubscribe;
  }, [maxResults]);

  const getActiveIncidents = () => {
    return state.incidents.filter(incident => incident.status === 'active');
  };

  const getIncidentsBySeverity = (severity: Incident['severity']) => {
    return state.incidents.filter(incident => incident.severity === severity);
  };

  const getIncidentsByCategory = (category: string) => {
    return state.incidents.filter(incident => incident.category === category);
  };

  return {
    incidents: state.incidents,
    loading: state.loading,
    error: state.error,
    getActiveIncidents,
    getIncidentsBySeverity,
    getIncidentsByCategory,
  };
};