import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Mock NFA Alerts data to match the screenshot
const mockAlerts = [
  {
    id: '1',
    timestamp: '01/15/2025 02:35 PM',
    location: 'FL Miami-Dade Miami',
    distance: '0 mi',
    type: 'Structure Fire',
    address: '1425 Brickell Avenue',
    description: 'High-rise residential fire reported on 15th floor. Multiple units responding. Evacuation in progress.',
    isFavorite: false,
  },
  {
    id: '2', 
    timestamp: '01/15/2025 03:15 PM',
    location: 'FL Hillsborough Tampa',
    distance: '209.2 mi',
    type: 'Vehicle Accident',
    address: '2901 W Kennedy Boulevard',
    description: 'Multi-vehicle collision at Kennedy & Dale Mabry intersection. Traffic control needed.',
    isFavorite: false,
  },
  {
    id: '3',
    timestamp: '01/15/2025 04:02 PM',
    location: 'FL Orange Orlando',
    distance: '200.2 mi',
    type: 'Medical Emergency',
    address: '8967 International Drive',
    description: 'Cardiac arrest reported at hotel lobby. AED in use, paramedics requested.',
    isFavorite: false,
  },
  {
    id: '4',
    timestamp: '01/15/2025 04:30 PM',
    location: 'FL Duval Jacksonville',
    distance: '332.7 mi',
    type: 'Hazmat Incident',
    address: '1234 Heckscher Drive',
    description: 'Chemical spill at industrial facility. Evacuation zone established 500ft radius.',
    isFavorite: false,
  },
  {
    id: '5',
    timestamp: '01/15/2025 05:10 PM',
    location: 'FL Broward Fort Lauderdale',
    distance: '25.2 mi',
    type: 'Water Rescue',
    address: '3456 Las Olas Boulevard',
    description: 'Boat taking on water near Intracoastal Waterway. Two persons aboard.',
    isFavorite: false,
  },
];

export default function IncidentsScreen() {
  const [alerts, setAlerts] = useState(mockAlerts);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const toggleFavorite = (id: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === id 
          ? { ...alert, isFavorite: !alert.isFavorite }
          : alert
      )
    );
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'Structure Fire': return '#FF3B30';
      case 'Vehicle Accident': return '#FF9500';
      case 'Medical Emergency': return '#FF2D92';
      case 'Hazmat Incident': return '#5856D6';
      case 'Water Rescue': return '#007AFF';
      default: return '#8E8E93';
    }
  };

  const renderAlert = ({ item }: { item: any }) => (
    <View style={styles.alertCard}>
      <View style={styles.alertHeader}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons 
            name={item.isFavorite ? "heart" : "heart-outline"} 
            size={20} 
            color={item.isFavorite ? "#FF3B30" : "#8E8E93"} 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.alertLocation}>
        <Text style={styles.locationText}>{item.location}</Text>
        <Text style={styles.distanceText}>{item.distance}</Text>
      </View>
      
      <View style={styles.alertType}>
        <View style={[styles.typeIndicator, { backgroundColor: getTypeColor(item.type) }]} />
        <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>
          {item.type}
        </Text>
      </View>
      
      <Text style={styles.address}>{item.address}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>NFA Alerts</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-vertical" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Alerts List */}
      <FlatList
        data={alerts}
        renderItem={renderAlert}
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
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 48, // Account for status bar
  },
  searchButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  menuButton: {
    padding: 8,
  },
  listContent: {
    paddingVertical: 8,
  },
  alertCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginVertical: 4,
    padding: 16,
    borderRadius: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  alertHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  favoriteButton: {
    padding: 4,
  },
  alertLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  distanceText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  alertType: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  typeText: {
    fontSize: 16,
    fontWeight: '600',
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#000000',
    lineHeight: 20,
  },
});