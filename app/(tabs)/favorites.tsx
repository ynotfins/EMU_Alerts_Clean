import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FavoritesScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="heart" size={64} color="#ef4444" />
        <Text style={styles.title}>Favorites</Text>
        <Text style={styles.description}>
          Save important incidents and alerts for quick access. This feature will allow you to:
        </Text>
        <View style={styles.featureList}>
          <Text style={styles.feature}>• Bookmark critical incidents</Text>
          <Text style={styles.feature}>• Quick access to saved alerts</Text>
          <Text style={styles.feature}>• Personal watchlist</Text>
          <Text style={styles.feature}>• Custom notifications</Text>
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
    color: '#ef4444',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
});