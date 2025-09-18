import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, TextInput } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { router } from 'expo-router';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.config';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { colors, radii, spacing } from '../../ui/theme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { profile } = useUserProfile();
  const [cashApp, setCashApp] = useState(profile?.cashApp || '');
  const [venmo, setVenmo] = useState(profile?.venmo || '');

  const writeTestIncident = async () => {
    try {
      const testIncident = {
        title: `Test Incident ${new Date().getTime()}`,
        description: 'This is a test incident created for verification',
        alertType: 'Emergency Response',
        address: '123 Campus Drive, Ypsilanti, MI',
        city: 'Ypsilanti',
        county: 'Washtenaw',
        state: 'MI',
        priority: 'high',
        message: 'Emergency response needed for campus incident. Please respond immediately.',
        coordinates: {
          latitude: 42.241,
          longitude: -83.613
        },
        timestamp: new Date(),
        location: 'EMU Campus',
        severity: 'High',
        type: 'Test'
      };

      await addDoc(collection(db, 'incidents'), testIncident);
      Alert.alert('Success', 'Test incident with coordinates created successfully!');
    } catch (error) {
      console.error('Error creating test incident:', error);
      Alert.alert('Error', `Failed to create test incident: ${(error as Error).message}`);
    }
  };

  const showPushToken = async () => {
    try {
      const token = await Notifications.getExpoPushTokenAsync();
      Alert.alert('Push Token', JSON.stringify(token), [
        { text: 'Copy Token', onPress: () => console.log('Token:', token.data) },
        { text: 'OK' }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to get push token: ' + (error as Error).message);
    }
  };

  const savePaymentHandles = async () => {
    if (!user?.uid) return;
    try {
      const cleanCashApp = cashApp.trim().startsWith('$') ? cashApp.trim() : '';
      const cleanVenmo = venmo.trim().startsWith('@') ? venmo.trim() : '';
      
      await updateDoc(doc(db, 'users', user.uid), {
        cashApp: cleanCashApp,
        venmo: cleanVenmo,
        payoutsActive: !!(cleanCashApp || cleanVenmo)
      });
      
      Alert.alert('Success', 'Payment handles saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save payment handles: ' + (error as Error).message);
    }
  };

  const testCashApp = () => {
    if (cashApp.trim()) {
      Linking.openURL(`https://cash.app/${cashApp.trim()}`);
    }
  };

  const testVenmo = () => {
    if (venmo.trim()) {
      const handle = venmo.trim().replace('@', '');
      Linking.openURL(`venmo://users/${handle}`).catch(() => {
        Linking.openURL(`https://venmo.com/${venmo.trim()}`);
      });
    }
  };

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

          {profile && (
            <Text style={styles.roleInfo}>
              👤 Role: {profile.role.toUpperCase()} 
              {profile.department && ` | ${profile.department}`}
            </Text>
          )}
        </View>
      )}

      {/* Payment Handles Section */}
      <View style={[styles.userInfo, { marginBottom: spacing.lg }]}>
        <Text style={[styles.testTitle, { color: colors.text }]}>Payment Information</Text>
        
        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.userEmail}>Cash App Handle:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radii.button,
              padding: spacing.md,
              marginTop: spacing.xs,
              backgroundColor: colors.card
            }}
            placeholder="$username"
            value={cashApp}
            onChangeText={setCashApp}
          />
        </View>

        <View style={{ marginBottom: spacing.md }}>
          <Text style={styles.userEmail}>Venmo Handle:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: colors.border,
              borderRadius: radii.button,
              padding: spacing.md,
              marginTop: spacing.xs,
              backgroundColor: colors.card
            }}
            placeholder="@username"
            value={venmo}
            onChangeText={setVenmo}
          />
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.primary, flex: 1 }]} 
            onPress={savePaymentHandles}
          >
            <Text style={styles.logoutButtonText}>Save Payment Info</Text>
          </TouchableOpacity>
        </View>

        {/* Test Payment Buttons */}
        {__DEV__ && (
          <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm }}>
            {cashApp.trim() && (
              <TouchableOpacity 
                style={[styles.logoutButton, { backgroundColor: '#00D632', flex: 1 }]} 
                onPress={testCashApp}
              >
                <Text style={styles.logoutButtonText}>Test Cash App</Text>
              </TouchableOpacity>
            )}
            {venmo.trim() && (
              <TouchableOpacity 
                style={[styles.logoutButton, { backgroundColor: '#3396CD', flex: 1 }]} 
                onPress={testVenmo}
              >
                <Text style={styles.logoutButtonText}>Test Venmo</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <View style={{
          backgroundColor: profile?.payoutsActive ? colors.success : colors.warn,
          padding: spacing.sm,
          borderRadius: radii.badge,
          marginTop: spacing.md,
          alignItems: 'center'
        }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>
            Payment Status: {profile?.payoutsActive ? 'Active' : 'Not Set'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Test Buttons for Development */}
      {__DEV__ && (
        <View>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#007AFF', marginBottom: 8 }]} onPress={writeTestIncident}>
            <Text style={styles.logoutButtonText}>Create Test Incident</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.logoutButton, { backgroundColor: '#34C759', marginBottom: 16 }]} onPress={showPushToken}>
            <Text style={styles.logoutButtonText}>Show Push Token</Text>
          </TouchableOpacity>
        </View>
      )}

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
  roleInfo: {
    fontSize: 12,
    color: '#9C27B0',
    marginTop: 4,
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