import { useState, useEffect } from 'react';
import { doc, onSnapshot, query, collection, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Incident, IncidentUpdate } from './useIncidents';

// Check if we're in demo mode
const isDemoMode = !process.env.EXPO_PUBLIC_FIREBASE_API_KEY;

// Mock incident details for demo mode
const mockIncidentDetails: { [key: string]: { incident: Incident; timeline: IncidentUpdate[] } } = {
  '1': {
    incident: {
      id: '1',
      alertId: 'ALERT-2024-001',
      title: 'Campus Safety Inspection',
      description: 'Routine safety inspection in progress at Student Center. Building remains open. No cause for concern.',
      severity: 'low',
      status: 'active',
      timestamp: new Date(),
      location: 'Student Center, EMU Campus',
      category: 'Safety Inspection',
      source: 'Campus Security',
      updates: [],
      notificationsSent: 150,
      affectedAreas: ['Student Center'],
    },
    timeline: [
      {
        id: 'u1',
        timestamp: new Date(Date.now() - 600000),
        message: 'Inspection team arrived and began safety checks.',
        author: 'Security Coordinator',
        type: 'update'
      }
    ]
  },
  '2': {
    incident: {
      id: '2',
      alertId: 'ALERT-2024-002',
      title: 'Severe Weather Advisory',
      description: 'Severe thunderstorm warning in effect until 8:00 PM. Seek shelter if thunder is heard within 30 seconds of lightning.',
      severity: 'medium',
      status: 'active',
      timestamp: new Date(Date.now() - 3600000),
      location: 'Campus Wide',
      category: 'Weather',
      source: 'Emergency Management',
      updates: [],
      notificationsSent: 2500,
      affectedAreas: ['All Campus Buildings'],
    },
    timeline: [
      {
        id: 'u2',
        timestamp: new Date(Date.now() - 1800000),
        message: 'Storm system approaching from the west.',
        author: 'Weather Service',
        type: 'update'
      },
      {
        id: 'u3',
        timestamp: new Date(Date.now() - 900000),
        message: 'All outdoor activities postponed.',
        author: 'Emergency Coordinator',
        type: 'escalation'
      }
    ]
  },
  '3': {
    incident: {
      id: '3',
      alertId: 'ALERT-2024-003',
      title: 'Maintenance Complete - Library HVAC',
      description: 'Scheduled HVAC maintenance in the Halle Library has been completed successfully.',
      severity: 'low',
      status: 'resolved',
      timestamp: new Date(Date.now() - 7200000),
      location: 'Halle Library',
      category: 'Maintenance',
      source: 'Facilities Management',
      updates: [],
      notificationsSent: 800,
      affectedAreas: ['Halle Library'],
    },
    timeline: [
      {
        id: 'u4',
        timestamp: new Date(Date.now() - 3600000),
        message: 'HVAC system restoration complete.',
        author: 'Facilities Team',
        type: 'resolution'
      }
    ]
  },
  '4': {
    incident: {
      id: '4',
      alertId: 'ALERT-2024-004',
      title: 'CRITICAL: Fire Alarm Test - Pray-Harrold',
      description: 'Fire alarm system test in Pray-Harrold Building. This is a scheduled test.',
      severity: 'critical',
      status: 'investigating',
      timestamp: new Date(Date.now() - 1800000),
      location: 'Pray-Harrold Building',
      category: 'Fire Safety',
      source: 'Fire Safety Office',
      updates: [],
      notificationsSent: 1200,
      affectedAreas: ['Pray-Harrold Building'],
    },
    timeline: [
      {
        id: 'u5',
        timestamp: new Date(Date.now() - 900000),
        message: 'Test sequence initiated. All alarms functioning normally.',
        author: 'Fire Safety Technician',
        type: 'update'
      }
    ]
  }
};

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

    if (isDemoMode) {
      // Demo mode - use mock data
      console.log('🔍 Incident detail running in DEMO MODE');
      setTimeout(() => {
        const mockData = mockIncidentDetails[incidentId];
        if (mockData) {
          setState({
            incident: mockData.incident,
            timeline: mockData.timeline,
            loading: false,
            error: null,
          });
        } else {
          setState({
            incident: null,
            timeline: [],
            loading: false,
            error: 'Incident not found',
          });
        }
      }, 500);
      return () => {}; // No cleanup needed for demo
    }

    // Production mode - use Firestore
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
  }, [incidentId]);

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
