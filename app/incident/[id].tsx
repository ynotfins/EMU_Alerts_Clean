import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useIncident } from '../../hooks/useIncident';
import { IncidentUpdate } from '../../hooks/useIncidents';

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

const UpdateTypeIcons = {
  update: 'information-circle',
  escalation: 'warning',
  resolution: 'checkmark-circle',
} as const;

const UpdateTypeColors = {
  update: '#3b82f6',
  escalation: '#f59e0b',
  resolution: '#10b981',
} as const;

export default function IncidentDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { incident, timeline, loading, error } = useIncident(id as string);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTimelineItem = (update: IncidentUpdate, index: number) => {
    const isLast = index === timeline.length - 1;
    
    return (
      <View key={update.id} style={styles.timelineItem}>
        <View style={styles.timelineLeft}>
          <View style={[
            styles.timelineIcon,
            { backgroundColor: UpdateTypeColors[update.type] }
          ]}>
            <Ionicons 
              name={UpdateTypeIcons[update.type] as any} 
              size={16} 
              color="#ffffff" 
            />
          </View>
          {!isLast && <View style={styles.timelineLine} />}
        </View>
        
        <View style={[styles.timelineContent, { marginBottom: isLast ? 0 : 20 }]}>
          <View style={styles.timelineHeader}>
            <Text style={styles.timelineType}>
              {update.type.charAt(0).toUpperCase() + update.type.slice(1)}
            </Text>
            <Text style={styles.timelineTime}>
              {formatTime(update.timestamp)}
            </Text>
          </View>
          <Text style={styles.timelineMessage}>{update.message}</Text>
          <Text style={styles.timelineAuthor}>— {update.author}</Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ef4444" />
        <Text style={styles.loadingText}>Loading incident details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#ef4444" />
        <Text style={styles.errorTitle}>Unable to Load Incident</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!incident) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="document" size={64} color="#9ca3af" />
        <Text style={styles.errorTitle}>Incident Not Found</Text>
        <Text style={styles.errorText}>
          The requested incident could not be found.
        </Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.incidentTitle}>{incident.title}</Text>
          <View style={styles.badges}>
            <View style={[
              styles.severityBadge, 
              { backgroundColor: SeverityColors[incident.severity] }
            ]}>
              <Text style={styles.badgeText}>
                {incident.severity.toUpperCase()}
              </Text>
            </View>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: StatusColors[incident.status] }
            ]}>
              <Text style={styles.badgeText}>
                {incident.status.toUpperCase()}
              </Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.incidentDescription}>
          {incident.description}
        </Text>

        <View style={styles.metaInfo}>
          <View style={styles.metaRow}>
            <Ionicons name="time" size={16} color="#6b7280" />
            <Text style={styles.metaText}>
              {formatDate(incident.timestamp)} at {formatTime(incident.timestamp)}
            </Text>
          </View>
          
          {incident.location && (
            <View style={styles.metaRow}>
              <Ionicons name="location" size={16} color="#6b7280" />
              <Text style={styles.metaText}>{incident.location}</Text>
            </View>
          )}
          
          <View style={styles.metaRow}>
            <Ionicons name="pricetag" size={16} color="#6b7280" />
            <Text style={styles.metaText}>{incident.category}</Text>
          </View>
          
          <View style={styles.metaRow}>
            <Ionicons name="radio" size={16} color="#6b7280" />
            <Text style={styles.metaText}>{incident.source}</Text>
          </View>

          {incident.affectedAreas && incident.affectedAreas.length > 0 && (
            <View style={styles.metaRow}>
              <Ionicons name="map" size={16} color="#6b7280" />
              <Text style={styles.metaText}>
                {incident.affectedAreas.join(', ')}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Statistics Section */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Impact</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{incident.notificationsSent}</Text>
            <Text style={styles.statLabel}>Notifications Sent</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{timeline.length}</Text>
            <Text style={styles.statLabel}>Timeline Updates</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {incident.affectedAreas?.length || 0}
            </Text>
            <Text style={styles.statLabel}>Affected Areas</Text>
          </View>
        </View>
      </View>

      {/* Timeline Section */}
      <View style={styles.timelineSection}>
        <Text style={styles.sectionTitle}>Timeline</Text>
        {timeline.length > 0 ? (
          <View style={styles.timeline}>
            {timeline.map((update, index) => renderTimelineItem(update, index))}
          </View>
        ) : (
          <View style={styles.emptyTimeline}>
            <Ionicons name="time" size={32} color="#9ca3af" />
            <Text style={styles.emptyTimelineText}>No timeline updates available</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  incidentTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 12,
    lineHeight: 28,
  },
  badges: {
    flexDirection: 'row',
    gap: 6,
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ffffff',
  },
  incidentDescription: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    marginBottom: 20,
  },
  metaInfo: {
    gap: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
    flex: 1,
  },
  statsSection: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ef4444',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  timelineSection: {
    backgroundColor: '#ffffff',
    padding: 20,
  },
  timeline: {
    paddingTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  timelineTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  timelineMessage: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
    marginBottom: 4,
  },
  timelineAuthor: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  emptyTimeline: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTimelineText: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 8,
  },
});