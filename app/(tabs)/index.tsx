import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Button,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIncidents, Incident } from '../../hooks/useIncidents';
// DEV ONLY: Test notifications
import * as Notifications from 'expo-notifications';
import { SchedulableTriggerInputTypes } from 'expo-notifications/build/Notifications.types';
// DEV ONLY: Test Firestore writes
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';

const SeverityColors = {
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#dc2626',
} as const;

const StatusColors = {
  active: '#ef4444',
  investigating: '#f59e0b',
  resolved: '#10b981',
} as const;

export default function NFAAlertsList() {
  const { incidents, loading, error, getActiveIncidents } = useIncidents();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const router = useRouter();

  // Mock NFA Alerts data to match screenshots
  const mockNFAAlerts = [
    {
      id: '1',
      timestamp: '01/15/2025 02:35 PM',
      location: 'FL · Miami-Dade · Miami',
      address: '1425 Brickell Avenue',
      type: 'Structure Fire',
      description: 'High-rise residential fire reported on 15th floor. Multiple units responding. Evacuation in progress.',
      distance: null,
      severity: 'high' as const,
    },
    {
      id: '2', 
      timestamp: '01/15/2025 03:15 PM',
      location: 'FL · Hillsborough · Tampa',
      address: '2901 W Kennedy Boulevard',
      type: 'Vehicle Accident',
      description: 'Multi-vehicle collision at Kennedy & Dale Mabry intersection. Traffic control needed.',
      distance: '209.2 mi',
      severity: 'medium' as const,
    },
    {
      id: '3',
      timestamp: '01/15/2025 04:02 PM', 
      location: 'FL · Orange · Orlando',
      address: '8967 International Drive',
      type: 'Medical Emergency',
      description: 'Cardiac arrest reported at hotel lobby. AED in use, paramedics requested.',
      distance: '200.2 mi',
      severity: 'critical' as const,
    },
    {
      id: '4',
      timestamp: '01/15/2025 04:30 PM',
      location: 'FL · Duval · Jacksonville', 
      address: '1234 Heckscher Drive',
      type: 'Hazmat Incident',
      description: 'Chemical spill at industrial facility. Evacuation zone established 500ft radius.',
      distance: '332.7 mi',
      severity: 'high' as const,
    },
    {
      id: '5',
      timestamp: '01/15/2025 05:10 PM',
      location: 'FL · Broward · Fort Lauderdale',
      address: '3456 Las Olas Boulevard', 
      type: 'Water Rescue',
      description: 'Boat taking on water near Intracoastal Waterway. Two persons aboard.',
      distance: '25.2 mi',
      severity: 'medium' as const,
    },
  ];

  const displayAlerts = mockNFAAlerts;

  const onRefresh = async () => {
    setRefreshing(true);
    // The useIncidents hook handles real-time updates, so we just need to simulate refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const getFilteredIncidents = (): Incident[] => {
    switch (filter) {
      case 'active':
        return getActiveIncidents();
      case 'critical':
        return incidents.filter(incident => incident.severity === 'critical');
      default:
        return incidents;
    }
  };

  const handleIncidentPress = (incident: Incident) => {
    router.push(`/incident/${incident.id}`);
  };

  // DEV ONLY: Test notification function
  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: { 
          title: 'EMU Alerts Test', 
          body: 'Test local notification - notifications are working! 🚨' 
        },
        trigger: { type: SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 5 },
      });
      Alert.alert('Test Scheduled', 'You should see a notification in 5 seconds!');
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule notification');
    }
  };

  // DEV ONLY: Test Firestore write function
  async function writeTestIncident() {
    try {
      const ref = await addDoc(collection(db, 'incidents'), {
        alertId: 'ALERT-TEST-' + Math.floor(Math.random()*100000),
        timestamp: serverTimestamp(),
        alertType: 'Test Alert',
        state: 'MI', county: 'Washtenaw', city: 'Ypsilanti',
        address: '123 Main St',
        message: 'This is a test incident from the device.',
        status: 'active', priority: 'medium',
        coordinates: { latitude: 42.241, longitude: -83.613 },
      });
      console.log('WROTE TEST INCIDENT', ref.id);
      Alert.alert('Success', 'Wrote test incident: ' + ref.id);
    } catch (e: any) {
      console.error('WRITE FAILED', e);
      Alert.alert('Write failed', e?.message ?? String(e));
    }
  }

  const formatTimestamp = (date: Date): string => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const getIncidentTypeColor = (type: string): string => {
    const typeColors: { [key: string]: string } = {
      'Structure Fire': '#FF3B30',
      'Vehicle Accident': '#FF9500',
      'Medical Emergency': '#FF3B30',
      'Hazmat Incident': '#007AFF',
      'Water Rescue': '#007AFF',
    };
    return typeColors[type] || '#007AFF';
  };

  const renderNFAAlert = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text style={styles.alertTimestamp}>{item.timestamp}</Text>
        <View style={styles.heartContainer}>
          <Ionicons name="heart-outline" size={16} color="#C7C7CC" />
          <Text style={styles.heartCount}>0</Text>
        </View>
      </View>
      
      <Text style={styles.alertLocation}>{item.location}</Text>
      <Text style={styles.alertAddress}>{item.address}</Text>
      
      <View style={styles.alertContent}>
        <Text style={[styles.alertType, { color: getIncidentTypeColor(item.type) }]}>
          {item.type}
        </Text>
        <Text style={styles.alertDescription}>{item.description}</Text>
      </View>
      
      {item.distance && (
        <Text style={styles.alertDistance}>{item.distance}</Text>
      )}
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="shield-checkmark" size={64} color="#9ca3af" />
      <Text style={styles.emptyTitle}>No incidents at this time</Text>
      <Text style={styles.emptyText}>
        {filter === 'all' 
          ? 'All systems are running normally'
          : `No ${filter} incidents found`}
      </Text>
    </View>
  );

  if (error) {
    Alert.alert('Error', error);
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="search" size={24} color="#007AFF" />
        <Text style={styles.headerTitle}>NFA Alerts</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={displayAlerts}
        renderItem={renderNFAAlert}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  // DEV ONLY: Test button styles
  testContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#ef4444',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  listContent: {
    backgroundColor: '#FFFFFF',
    paddingTop: 0,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertTimestamp: {
    fontSize: 14,
    color: '#000000',
    fontWeight: '500',
  },
  heartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartCount: {
    fontSize: 12,
    color: '#C7C7CC',
    marginLeft: 4,
  },
  alertLocation: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  alertAddress: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
    marginBottom: 6,
  },
  alertContent: {
    marginBottom: 4,
  },
  alertType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  alertDescription: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 18,
  },
  alertDistance: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
    marginTop: 4,
  },
  incidentCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  incidentTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  severityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  incidentDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  incidentFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: '#6b7280',
    marginLeft: 4,
  },
  metaIcon: {
    marginLeft: 12,
  },
  updatesCount: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});