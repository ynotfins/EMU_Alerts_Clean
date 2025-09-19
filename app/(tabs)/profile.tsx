import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

export default function ProfileScreen() {
  const { user, signOut, loading } = useAuth();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [locationTracking, setLocationTracking] = useState(true);
  const [paymentExpanded, setPaymentExpanded] = useState(false);
  const [cashAppHandle, setCashAppHandle] = useState('');
  const [venmoHandle, setVenmoHandle] = useState('');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* User Profile Section */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userRole}>Emergency Responder</Text>
        <Text style={styles.userOrg}>Miami-Dade Fire Rescue</Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Alerts{'\n'}Responded</Text>
          <Text style={styles.statSubtext}>(Track Icon{'\n'}Clicks)</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Alerts with{'\n'}Notes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>18</Text>
          <Text style={styles.statLabel}>Days Active</Text>
        </View>
      </View>

      {/* Employee Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Employee Information</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>John Doe</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>1234 Main St, Miami, FL 33101</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>john.doe@miamidade.gov</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}></Text>
          </View>
        </View>
      </View>

      {/* ID Verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ID Verification</Text>
        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="camera" size={20} color="#007AFF" />
          <Text style={styles.uploadButtonText}>Upload ID for Verification</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceContainer}>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="notifications" size={24} color="#FF9500" />
              <Text style={styles.preferenceText}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
          <View style={styles.preferenceRow}>
            <View style={styles.preferenceLeft}>
              <Ionicons name="location" size={24} color="#34C759" />
              <Text style={styles.preferenceText}>Location Tracking</Text>
            </View>
            <Switch
              value={locationTracking}
              onValueChange={setLocationTracking}
              trackColor={{ false: '#E5E5EA', true: '#34C759' }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>
      </View>

      {/* Emergency Payment Info */}
      <View style={styles.section}>
        <TouchableOpacity 
          style={styles.paymentHeader}
          onPress={() => setPaymentExpanded(!paymentExpanded)}
        >
          <View style={styles.paymentHeaderLeft}>
            <Ionicons name="card" size={24} color="#8E8E93" />
            <Text style={styles.paymentHeaderText}>Emergency Payment Info</Text>
          </View>
          <Ionicons 
            name={paymentExpanded ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#8E8E93" 
          />
        </TouchableOpacity>
        
        {paymentExpanded && (
          <View style={styles.paymentContent}>
            <View style={styles.warningBox}>
              <Ionicons name="lock-closed" size={16} color="#FF9500" />
              <Text style={styles.warningText}>
                ID verification required to add payment information
              </Text>
            </View>
            <Text style={styles.paymentDescription}>
              Set up payment methods for emergency fund transfers to assist homeowners in critical situations. This enables rapid financial assistance when families need immediate help during emergencies.
            </Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>CashApp Handle (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="$YourCashAppHandle"
                value={cashAppHandle}
                onChangeText={setCashAppHandle}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Venmo Handle (Optional)</Text>
              <TextInput
                style={styles.textInput}
                placeholder="@YourVenmoHandle"
                value={venmoHandle}
                onChangeText={setVenmoHandle}
              />
            </View>
            
            <TouchableOpacity style={styles.saveButton} disabled>
              <Text style={styles.saveButtonText}>Save Payment Info</Text>
            </TouchableOpacity>
            
            <Text style={styles.paymentStatus}>Payment info status: Not configured</Text>
            <Text style={styles.paymentDisclaimer}>
              This information is encrypted and only used for emergency fund transfers to help homeowners during critical situations.
            </Text>
          </View>
        )}
      </View>

      {/* Help & Support */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="help-circle" size={24} color="#007AFF" />
          <Text style={styles.menuItemText}>Help & Support</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>

      {/* Terms & Privacy */}
      <TouchableOpacity style={styles.menuItem}>
        <View style={styles.menuItemLeft}>
          <Ionicons name="document-text" size={24} color="#007AFF" />
          <Text style={styles.menuItemText}>Terms & Privacy</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Ionicons name="log-out" size={20} color="#FF3B30" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Alerts with Saved Notes */}
      <View style={styles.savedNotesSection}>
        <Text style={styles.savedNotesTitle}>Alerts with Saved Notes (0)</Text>
        <View style={styles.savedNotesEmpty}>
          <Ionicons name="document" size={48} color="#C7C7CC" />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#000000',
  },
  settingsButton: {
    padding: 4,
  },
  userSection: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 24,
    marginTop: 8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 2,
  },
  userOrg: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginTop: 8,
    paddingVertical: 16,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#C6C6C8',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 14,
  },
  statSubtext: {
    fontSize: 10,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 2,
    lineHeight: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  infoContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 8,
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  infoLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000000',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  uploadButtonText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
  },
  preferenceContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#C6C6C8',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  preferenceText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  paymentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  paymentHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentHeaderText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  paymentContent: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    fontSize: 14,
    color: '#FF9500',
    marginLeft: 8,
    flex: 1,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#C6C6C8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#C6C6C8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  paymentDisclaimer: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  signOutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
  },
  savedNotesSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    borderRadius: 8,
    paddingVertical: 16,
  },
  savedNotesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  savedNotesEmpty: {
    alignItems: 'center',
    paddingVertical: 24,
  },
});