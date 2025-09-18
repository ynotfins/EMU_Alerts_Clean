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
// DEV ONLY: Test Firestore writes
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase.config';

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

export default function IncidentsScreen() {
  const { incidents, loading, error, getActiveIncidents } = useIncidents();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'critical'>('all');
  const router = useRouter();

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
        trigger: { seconds: 5 },
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

  const renderIncident = ({ item }: { item: Incident }) => (
    <TouchableOpacity
      style={[
        styles.incidentCard,
        { borderLeftColor: SeverityColors[item.severity] }
      ]}
      onPress={() => handleIncidentPress(item)}
    >
      <View style={styles.incidentHeader}>
        <Text style={styles.incidentTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={styles.badges}>
          <View style={[styles.severityBadge, { backgroundColor: SeverityColors[item.severity] }]}>
            <Text style={styles.badgeText}>{item.severity.toUpperCase()}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: StatusColors[item.status] }]}>
            <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.incidentDescription} numberOfLines={3}>
        {item.description}
      </Text>

      <View style={styles.incidentFooter}>
        <View style={styles.metaInfo}>
          <Ionicons name="time" size={14} color="#6b7280" />
          <Text style={styles.metaText}>{formatTimestamp(item.timestamp)}</Text>
          {item.location && (
            <>
              <Ionicons name="location" size={14} color="#6b7280" style={styles.metaIcon} />
              <Text style={styles.metaText}>{item.location}</Text>
            </>
          )}
        </View>
        <Text style={styles.updatesCount}>
          {item.updates.length} update{item.updates.length !== 1 ? 's' : ''}
        </Text>
      </View>
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
      {/* DEV ONLY: Test buttons */}
      <View style={{ paddingHorizontal: 12, paddingBottom: 8, flexDirection: 'row', gap: 8 }}>
        <Button title="Write Test Incident" onPress={writeTestIncident} />
      </View>
      <View style={styles.testContainer}>
        <Button 
          title="🔔 Test Notification (5s)" 
          onPress={testNotification}
          color="#ef4444"
        />
      </View>
      
      <View style={styles.filterContainer}>
        {(['all', 'active', 'critical'] as const).map((filterType) => (
          <TouchableOpacity
            key={filterType}
            style={[
              styles.filterButton,
              filter === filterType && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterType)}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive,
              ]}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && incidents.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#ef4444" />
          <Text style={styles.loadingText}>Loading incidents...</Text>
        </View>
      ) : (
        <FlatList
          data={getFilteredIncidents()}
          renderItem={renderIncident}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#ef4444"
            />
          }
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
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
    padding: 16,
    flexGrow: 1,
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