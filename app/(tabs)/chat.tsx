import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This would initiate an emergency call to the dispatch center.',
      [{ text: 'OK' }]
    );
  };

  const handlePushToTalk = () => {
    Alert.alert(
      'Push to Talk',
      'This would activate push-to-talk communication with the emergency team.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Communications</Text>
        <View style={styles.onlineIndicator}>
          <View style={styles.onlineDot} />
          <Text style={styles.onlineText}>Online</Text>
        </View>
      </View>

      <View style={styles.content}>
        {/* Chat Coming Soon Section */}
        <View style={styles.chatSection}>
          <Ionicons name="chatbubbles" size={80} color="#C7C7CC" />
          <Text style={styles.title}>Chat Feature Coming Soon</Text>
          <Text style={styles.description}>
            Real-time chat with supervisors and team members will be available in the next update
          </Text>
        </View>

        {/* Emergency Action Buttons */}
        <View style={styles.emergencyButtons}>
          <TouchableOpacity style={styles.emergencyCallButton} onPress={handleEmergencyCall}>
            <Ionicons name="call" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.pushToTalkButton} onPress={handlePushToTalk}>
            <Ionicons name="radio" size={24} color="#FFFFFF" />
            <Text style={styles.emergencyButtonText}>Push to Talk</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
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
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  onlineIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  onlineText: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  chatSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  emergencyButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  emergencyCallButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginRight: 8,
  },
  pushToTalkButton: {
    backgroundColor: '#FF3B30',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    flex: 1,
    marginLeft: 8,
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});