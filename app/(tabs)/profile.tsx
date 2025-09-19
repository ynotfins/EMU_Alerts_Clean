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
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);
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

  // Mock user data - in real app this would come from your database
  const userData = {
    name: 'John Doe',
    role: 'Emergency Responder',
    department: 'Miami-Dade Fire Rescue',
    alertsResponded: 0,
    alertsWithNotes: 0,
    daysActive: 18,
    email: 'john.doe@miamidade.gov',
    address: '1234 Main St, Miami, FL 33101'
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.settingsButton}>
          <Ionicons name="settings" size={24} color="#007AFF" />
        </View>
      </View>

      {/* User Profile Card */}
      <View style={styles.userCard}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userRole}>{userData.role}</Text>
        <Text style={styles.userDepartment}>{userData.department}</Text>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.alertsResponded}</Text>
            <Text style={styles.statLabel}>Alerts{'\n'}Responded</Text>
            <Text style={styles.statSubtext}>(Track Icon{'\n'}Clicks)</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.alertsWithNotes}</Text>
            <Text style={styles.statLabel}>Alerts with{'\n'}Notes</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.daysActive}</Text>
            <Text style={styles.statLabel}>Days Active</Text>
          </View>
        </View>

        {/* Employee Information */}
        <View style={styles.employeeInfo}>
          <Text style={styles.sectionTitle}>Employee Information</Text>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Name</Text>
            <Text style={styles.infoValue}>{userData.name}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Address</Text>
            <Text style={styles.infoValue}>{userData.address}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{userData.email}</Text>
          </View>
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
          </View>
        </View>
      </View>

      {/* ID Verification */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>ID Verification</Text>
        <TouchableOpacity style={styles.idVerification}>
          <Ionicons name="cloud-upload" size={24} color="#007AFF" />
          <Text style={styles.idVerificationText}>Upload ID for Verification</Text>
        </TouchableOpacity>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="notifications" size={20} color="#FF9500" />
            <Text style={styles.preferenceText}>Push Notifications</Text>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceLeft}>
            <Ionicons name="location" size={20} color="#34C759" />
            <Text style={styles.preferenceText}>Location Tracking</Text>
          </View>
          <Switch
            value={locationTracking}
            onValueChange={setLocationTracking}
            trackColor={{ false: '#E5E5EA', true: '#34C759' }}
            thumbColor="#FFFFFF"
          />
        </View>
        
        {/* Emergency Payment Info */}
        <TouchableOpacity 
          style={styles.preferenceItem}
          onPress={() => setShowPaymentInfo(!showPaymentInfo)}
        >
          <View style={styles.preferenceLeft}>
            <Ionicons name="card" size={20} color="#8E8E93" />
            <Text style={[styles.preferenceText, { color: '#8E8E93' }]}>Emergency Payment Info</Text>
          </View>
          <Ionicons 
            name={showPaymentInfo ? "chevron-up" : "chevron-down"} 
            size={20} 
            color="#8E8E93" 
          />
        </TouchableOpacity>

        {showPaymentInfo && (
          <View style={styles.paymentInfo}>
            <View style={styles.paymentWarning}>
              <Ionicons name="lock-closed" size={16} color="#FF9500" />
              <Text style={styles.paymentWarningText}>
                ID verification required to add payment information
              </Text>
            </View>
            <Text style={styles.paymentDescription}>
              Set up payment methods for emergency fund transfers to assist homeowners in 
              critical situations. This enables rapid financial assistance when families need immediate 
              help during emergencies.
            </Text>
            
            <Text style={styles.inputLabel}>CashApp Handle (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={cashAppHandle}
              onChangeText={setCashAppHandle}
              placeholder="$YourCashAppHandle"
              placeholderTextColor="#C7C7CC"
            />
            
            <Text style={styles.inputLabel}>Venmo Handle (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={venmoHandle}
              onChangeText={setVenmoHandle}
              placeholder="@YourVenmoHandle"
              placeholderTextColor="#C7C7CC"
            />
            
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Payment Info</Text>
            </TouchableOpacity>
            
            <Text style={styles.paymentStatus}>
              Payment info status: Not configured
            </Text>
            <Text style={styles.paymentDisclaimer}>
              This information is encrypted and only used for emergency fund transfers to help homeowners 
              during critical situations.
            </Text>
          </View>
        )}
      </View>

      {/* Menu Items */}
      <View style={styles.menuSection}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle" size={20} color="#007AFF" />
          <Text style={styles.menuText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="document-text" size={20} color="#007AFF" />
          <Text style={styles.menuText}>Terms & Privacy</Text>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleSignOut}>
          <Ionicons name="log-out" size={20} color="#FF3B30" />
          <Text style={[styles.menuText, { color: '#FF3B30' }]}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Alerts with Saved Notes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alerts with Saved Notes (0)</Text>
        <View style={styles.emptyState}>
          <Ionicons name="document-outline" size={48} color="#C7C7CC" />
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
  content: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  settingsButton: {
    marginLeft: 'auto',
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  avatarContainer: {
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
  userDepartment: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 10,
    color: '#C7C7CC',
    textAlign: 'center',
    lineHeight: 12,
  },
  employeeInfo: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingTop: 20,
  },
  infoItem: {
    marginBottom: 12,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  idVerification: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderStyle: 'dashed',
  },
  idVerificationText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 8,
    fontWeight: '500',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 1,
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceText: {
    fontSize: 16,
    color: '#000000',
    marginLeft: 12,
  },
  paymentInfo: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 8,
    marginTop: -1,
  },
  paymentWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  paymentWarningText: {
    fontSize: 14,
    color: '#856404',
    marginLeft: 8,
    flex: 1,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
    marginBottom: 8,
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#8E8E93',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  paymentStatus: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  paymentDisclaimer: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  menuSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  menuText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 12,
    flex: 1,
  },
  emptyState: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    paddingVertical: 40,
    alignItems: 'center',
    borderRadius: 12,
  },
});