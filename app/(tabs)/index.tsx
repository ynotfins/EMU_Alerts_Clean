import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase.config';

interface Incident {
  id: string;
  title: string;
  description: string;
  timestamp: any;
  location: string;
  severity: string;
}

export default function IncidentsScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'incidents'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const incidentList: Incident[] = [];
      querySnapshot.forEach((doc) => {
        incidentList.push({
          id: doc.id,
          ...doc.data()
        } as Incident);
      });
      setIncidents(incidentList);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching incidents:', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const writeTestIncident = async () => {
    try {
      const testIncident = {
        title: `Test Incident ${new Date().getTime()}`,
        description: 'This is a test incident created for verification',
        timestamp: new Date(),
        location: 'Test Location',
        severity: 'Low',
        type: 'Test'
      };

      await addDoc(collection(db, 'incidents'), testIncident);
      Alert.alert('Success', 'Test incident created successfully!');
    } catch (error) {
      console.error('Error creating test incident:', error);
      Alert.alert('Error', `Failed to create test incident: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>EMU Alerts - Incidents</Text>
      
      {/* Test Button for Data Pipeline (Development Only) */}
      {__DEV__ && (
        <TouchableOpacity style={styles.testButton} onPress={writeTestIncident}>
          <Text style={styles.testButtonText}>Write Test Incident</Text>
        </TouchableOpacity>
      )}

      {loading ? (
        <Text style={styles.loadingText}>Loading incidents...</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {incidents.length === 0 ? (
            <Text style={styles.noIncidentsText}>No incidents found</Text>
          ) : (
            incidents.map((incident) => (
              <View key={incident.id} style={styles.incidentCard}>
                <Text style={styles.incidentTitle}>{incident.title}</Text>
                <Text style={styles.incidentDescription}>{incident.description}</Text>
                <Text style={styles.incidentMeta}>
                  {incident.location} • {incident.severity}
                </Text>
                <Text style={styles.incidentTimestamp}>
                  {incident.timestamp?.toDate?.()?.toLocaleString() || 'No timestamp'}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  testButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  testButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  noIncidentsText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
  scrollView: {
    flex: 1,
  },
  incidentCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  incidentDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  incidentMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  incidentTimestamp: {
    fontSize: 12,
    color: '#999',
  },
});