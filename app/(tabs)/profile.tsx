import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      
      {user && (
        <View style={styles.userInfo}>
          <Text style={styles.userEmail}>Signed in as:</Text>
          <Text style={styles.emailText}>{user.email}</Text>
          
          <Text style={styles.authStatus}>
            Auth Status: ✅ Authenticated
          </Text>
          
          <Text style={styles.persistenceInfo}>
            🔒 Auth persistence is enabled with AsyncStorage
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.testInfo}>
        <Text style={styles.testTitle}>Auth Persistence Test:</Text>
        <Text style={styles.testDescription}>
          1. Sign in with any credentials{'\n'}
          2. Close and reopen the app{'\n'}
          3. You should remain signed in{'\n'}
          4. Check for persistence warnings in logs
        </Text>
      </View>
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
    marginBottom: 24,
    textAlign: 'center',
  },
  userInfo: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  authStatus: {
    fontSize: 14,
    color: '#4CAF50',
    marginBottom: 8,
  },
  persistenceInfo: {
    fontSize: 12,
    color: '#2196F3',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testInfo: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFEAA7',
  },
  testTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#856404',
  },
  testDescription: {
    fontSize: 14,
    color: '#856404',
    lineHeight: 20,
  },
});