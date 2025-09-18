import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="chatbubbles" size={64} color="#3b82f6" />
        <Text style={styles.title}>Emergency Chat</Text>
        <Text style={styles.description}>
          Real-time communication during emergencies. This feature will provide:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Incident-specific chat rooms</Text>
          <Text style={styles.feature}>• Direct messaging with emergency personnel</Text>
          <Text style={styles.feature}>• File and image sharing</Text>
          <Text style={styles.feature}>• Live updates and coordination</Text>
          <Text style={styles.feature}>• Emergency contact integration</Text>
        </View>
        <Text style={styles.comingSoon}>Coming Soon</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 20,
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featureList: {
    alignSelf: 'stretch',
    marginBottom: 32,
  },
  feature: {
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
    paddingLeft: 8,
  },
  comingSoon: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});