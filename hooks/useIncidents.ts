import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, where, limit } from 'firebase/firestore';
import { db } from '../firebase.config';

// Check if we're in demo mode
const isDemoMode = !process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

// Import demo data if needed
const mockIncidents = isDemoMode ? [
  {
    id: '1',
    alertId: 'ALERT-2024-001',
    title: 'Campus Safety Inspection',
    description: 'Routine safety inspection in progress at Student Center. Building remains open. No cause for concern.',
    severity: 'low' as const,
    status: 'active' as const,
    timestamp: new Date(),
    location: 'Student Center, EMU Campus',
    category: 'Safety Inspection',
    source: 'Campus Security',
    updates: [],
    notificationsSent: 150,
    affectedAreas: ['Student Center'],
  },
  {
    id: '2',
    alertId: 'ALERT-2024-002',
    title: 'Severe Weather Advisory',
    description: 'Severe thunderstorm warning in effect until 8:00 PM. Seek shelter if thunder is heard within 30 seconds of lightning.',
    severity: 'medium' as const,
    status: 'active' as const,
    timestamp: new Date(Date.now() - 3600000),
    location: 'Campus Wide',
    category: 'Weather',
    source: 'Emergency Management',
    updates: [],
    notificationsSent: 2500,
    affectedAreas: ['All Campus Buildings', 'Parking Areas', 'Athletic Fields'],
  },
  {
    id: '3',
    alertId: 'ALERT-2024-003',
    title: 'Maintenance Complete - Library HVAC',
    description: 'Scheduled HVAC maintenance in the Halle Library has been completed successfully. All systems are operational.',
    severity: 'low' as const,
    status: 'resolved' as const,
    timestamp: new Date(Date.now() - 7200000),
    location: 'Halle Library',
    category: 'Maintenance',
    source: 'Facilities Management',
    updates: [],
    notificationsSent: 800,
    affectedAreas: ['Halle Library'],
  },
  {
    id: '4',
    alertId: 'ALERT-2024-004',
    title: 'CRITICAL: Fire Alarm Test - Pray-Harrold',
    description: 'Fire alarm system test in Pray-Harrold Building. This is a scheduled test. Do not evacuate unless directed by emergency personnel.',
    severity: 'critical' as const,
    status: 'investigating' as const,
    timestamp: new Date(Date.now() - 1800000),
    location: 'Pray-Harrold Building',
    category: 'Fire Safety',
    source: 'Fire Safety Office',
    updates: [],
    notificationsSent: 1200,
    affectedAreas: ['Pray-Harrold Building', 'Adjacent Walkways'],
  }
] : [];

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
    if (isDemoMode) {
      // Demo mode - use mock data
      console.log('📊 Incidents running in DEMO MODE');
      setTimeout(() => {
        setState({
          incidents: mockIncidents.slice(0, maxResults),
          loading: false,
          error: null,
        });
      }, 1000);
      return () => {}; // No cleanup needed for demo
    }

    // Production mode - use Firestore
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
            const existingIncident = incidents[existingIndex];
            if (existingIndex !== -1 && existingIncident && incident.timestamp > existingIncident.timestamp) {
              incidents[existingIndex] = {
                ...existingIncident,
                ...incident,
                updates: [
                  ...existingIncident.updates,
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
