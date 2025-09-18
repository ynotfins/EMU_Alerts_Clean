import { useLocalSearchParams, router } from 'expo-router';
import { ScrollView, Text, View, Pressable, Platform, ActionSheetIOS, Alert, Image, TextInput } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { useIncident } from '../../hooks/useIncident';
import { useAuth } from '../../hooks/useAuth';
import { openDirections } from '../../utils/navigation';
import { logResponse, updateIncidentStatus } from '../../utils/response';
import { uploadIncidentMedia, uploadIncidentDoc } from '../../services/storage';
import { RoleGate } from '../../components/RoleGate';
import { usePresence } from '../../hooks/usePresence';
import { logCaseEvent } from '../../services/timeline';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.config';
import { useState, useEffect } from 'react';

export default function IncidentDetail(){
  const { id, source } = useLocalSearchParams<{id:string; source?:'alerts'|'incidents'}>();
  const { incident, updates, loading } = useIncident(id!, source);
  const { user } = useAuth();
  const [responding, setResponding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [etaMins, setEtaMins] = useState('');
  const [onSceneReport, setOnSceneReport] = useState('');
  const [contactAttempted, setContactAttempted] = useState(false);
  const [secondaryPhone, setSecondaryPhone] = useState('');
  
  // Track location when responding
  usePresence(responding);

  // Initialize contact info and employee inputs when incident loads
  useEffect(() => {
    if (incident?.contact) {
      setContactName(incident.contact.name || '');
      setContactPhone(incident.contact.phone || '');
    }
    
    // Initialize employee inputs if they exist
    if (incident?.employeeInputs && user?.uid) {
      const userInputs = incident.employeeInputs[user.uid];
      if (userInputs) {
        setEtaMins(userInputs.etaMins?.toString() || '');
        setOnSceneReport(userInputs.onSceneReport || '');
        setContactAttempted(userInputs.contactAttempted || false);
        setSecondaryPhone(userInputs.secondaryPhone || '');
      }
    }
  }, [incident, user?.uid]);

  const saveContact = async () => {
    if (!user?.uid || !incident) return;
    try {
      await updateDoc(doc(db, (incident.source || 'incidents') as 'incidents'|'alerts', incident.id), {
        contact: { name: contactName.trim(), phone: contactPhone.trim() }
      });
      // Log to case timeline
      await logCaseEvent(incident.id, 'homeowner', { 
        name: contactName.trim(), 
        phone: contactPhone.trim(),
        updatedBy: user.uid 
      });
      Alert.alert('Success', 'Contact information saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact: ' + (error as Error).message);
    }
  };

  const saveEmployeeInputs = async () => {
    if (!user?.uid || !incident) return;
    try {
      const employeeData = {
        etaMins: etaMins ? parseInt(etaMins) : undefined,
        onSceneReport: onSceneReport.trim() || undefined,
        contactAttempted,
        secondaryPhone: secondaryPhone.trim() || undefined,
        updatedAt: serverTimestamp()
      };

      // Filter out undefined values
      const cleanData = Object.fromEntries(
        Object.entries(employeeData).filter(([_, v]) => v !== undefined)
      );

      await updateDoc(doc(db, (incident.source || 'incidents') as 'incidents'|'alerts', incident.id), {
        [`employeeInputs.${user.uid}`]: cleanData
      });
      
      // Log to case timeline
      await logCaseEvent(incident.id, 'employee-input', { 
        employeeUid: user.uid,
        fields: Object.keys(cleanData).filter(k => k !== 'updatedAt')
      });
      
      Alert.alert('Success', 'Your information saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save information: ' + (error as Error).message);
    }
  };

  const uploadDocument = async () => {
    if (!incident) return;
    try {
      const pick = await DocumentPicker.getDocumentAsync({ type: ['application/pdf'] });
      if (pick.canceled || !pick.assets?.length) return;
      
      setUploadingDoc(true);
      const { url, name } = await uploadIncidentDoc(
        incident.id, 
        (incident.source || 'incidents') as 'incidents'|'alerts', 
        pick.assets[0].uri, 
        pick.assets[0].name || 'document.pdf'
      );
      
      await updateDoc(doc(db, (incident.source || 'incidents') as 'incidents'|'alerts', incident.id), { 
        docs: arrayUnion({ url, name }) 
      });
      
      // Log to case timeline
      await logCaseEvent(incident.id, 'document', { 
        name, 
        url, 
        uploadedBy: user?.uid 
      });
      
      Alert.alert('Success', 'Document uploaded!');
    } catch (error) {
      Alert.alert('Error', 'Upload failed: ' + (error as Error).message);
    } finally {
      setUploadingDoc(false);
    }
  };

  if (loading) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Loading…</Text></View>;
  }
  if (!incident) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Not found.</Text></View>;
  }

  const coords = incident.coordinates;
  const priorityColor =
    incident.priority === 'critical' ? colors.danger :
    incident.priority === 'high'     ? colors.warn :
    incident.priority === 'medium'   ? '#FFCC00' : colors.success;

  return (
    <ScrollView style={{ flex:1, backgroundColor:colors.card }}>
      {/* Map section (top third) */}
      <View style={{ height: 260, backgroundColor:colors.border }}>
        {coords ? (
          <View style={{ flex:1 }}>
            <MapView
              style={{ flex:1 }}
              provider={PROVIDER_GOOGLE}
              initialRegion={{
                latitude: coords.latitude,
                longitude: coords.longitude,
                latitudeDelta: 0.015,
                longitudeDelta: 0.015,
              }}
              showsUserLocation
              showsCompass
            >
              <Marker
                coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
                title={incident.alertType}
                description={incident.address}
              />
            </MapView>

            {/* Priority Badge (top-left overlay) */}
            <View style={{
              position:'absolute', top:spacing.md, left:spacing.md,
              backgroundColor: priorityColor, borderRadius:radii.badge, paddingHorizontal:spacing.sm, paddingVertical:spacing.xs,
              shadowColor:'#000', shadowOffset:{width:0,height:1}, shadowOpacity:0.2, shadowRadius:3, elevation:3
            }}>
              <Text style={{ color:'#fff', fontWeight:'700', fontSize:10 }}>
                {incident.priority.toUpperCase()}
              </Text>
            </View>

            {/* RESPOND button (top-right overlay) */}
            <RoleGate allow={['employee','supervisor']}>
              <Pressable
                onPress={async ()=>{
                  if (!coords) return;
                  try {
                    if (!user?.uid) { Alert.alert('Sign in required','Please sign in to respond.'); return; }
                    setResponding(true);
                    await logResponse(incident.id, user.uid, 'responding');
                    await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'en-route');
                    // Log to case timeline
                    await logCaseEvent(incident.id, 'response', { status: 'responding', employeeUid: user.uid });
                    openDirections(coords.latitude, coords.longitude, incident.alertType || 'Incident');
                  } catch(e:any) {
                    Alert.alert('Failed to log response', e?.message ?? String(e));
                    setResponding(false);
                  }
                }}
                onLongPress={()=>{
                  if (Platform.OS === 'ios') {
                    ActionSheetIOS.showActionSheetWithOptions(
                      { options:['Cancel','Mark Arrived','Mark Completed'], cancelButtonIndex:0, destructiveButtonIndex:2 },
                      async (idx)=>{
                        if (idx===1) {
                          await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'active'); // arrived => active
                          await logCaseEvent(incident.id, 'response', { status: 'arrived', employeeUid: user?.uid });
                        }
                        if (idx===2) {
                          await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'resolved');
                          await logCaseEvent(incident.id, 'response', { status: 'completed', employeeUid: user?.uid });
                        }
                      }
                    );
                  } else {
                    Alert.alert('Update Status','Choose an action',[
                      { 
                        text:'Mark Arrived', 
                        onPress: async ()=> {
                          await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'active');
                          await logCaseEvent(incident.id, 'response', { status: 'arrived', employeeUid: user?.uid });
                        }
                      },
                      { 
                        text:'Mark Completed', 
                        onPress: async ()=> {
                          await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'resolved');
                          await logCaseEvent(incident.id, 'response', { status: 'completed', employeeUid: user?.uid });
                        }
                      },
                      { text:'Cancel', style:'cancel' }
                    ]);
                  }
                }}
                style={({pressed})=>({
                  position:'absolute', top:spacing.md, right:spacing.md,
                  backgroundColor: pressed ? '#2E7D32' : colors.success,
                  flexDirection:'row', alignItems:'center',
                  paddingHorizontal:spacing.md, paddingVertical:spacing.sm, borderRadius:radii.button,
                  shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:4, elevation:4
                })}
              >
                <Ionicons name="car" size={16} color="#fff" style={{ marginRight:spacing.xs }} />
                <Text style={{ color:'#fff', fontWeight:'700' }}>
                  {responding ? 'RESPONDING…' : (Platform.OS === 'web' ? 'OPEN MAPS' : 'RESPOND')}
                </Text>
              </Pressable>
            </RoleGate>
          </View>
        ) : (
          <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
            <Ionicons name="location-outline" size={40} color={colors.textTertiary} />
            <Text style={{ color:colors.textTertiary, marginTop:spacing.xs }}>Location pending</Text>
          </View>
        )}
      </View>

      {/* Incident summary */}
      <View style={{ padding:spacing.lg }}>
        <Text style={{ fontSize:20, fontWeight:'700', color:colors.text }}>{incident.alertType}</Text>
        <Text style={{ color:colors.textSecondary, marginTop:spacing.xs }}>{incident.state} | {incident.county} | {incident.city}</Text>
        <Text style={{ fontWeight:'700', marginTop:spacing.sm, color:colors.text }}>{incident.address}</Text>
      </View>

      {/* Supervisor Contact Management */}
      <RoleGate allow={['supervisor']}>
        <View style={{ paddingHorizontal:spacing.lg, marginBottom:spacing.md }}>
          <Text style={{ fontSize:16, fontWeight:'700', marginBottom:spacing.sm, color:colors.text }}>Contact Information</Text>
          
          <View style={{ flexDirection:'row', gap:spacing.sm, marginBottom:spacing.sm }}>
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.button,
                padding: spacing.md,
                backgroundColor: colors.card
              }}
              placeholder="Contact Name"
              value={contactName}
              onChangeText={setContactName}
            />
            <TextInput
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.button,
                padding: spacing.md,
                backgroundColor: colors.card
              }}
              placeholder="Phone Number"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
          </View>
          
          <View style={{ flexDirection:'row', gap:spacing.sm }}>
            <Pressable
              onPress={saveContact}
              style={({pressed})=>({
                backgroundColor: pressed ? '#1976D2' : colors.primary,
                borderRadius: radii.button,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                flex: 1,
                alignItems: 'center'
              })}
            >
              <Text style={{ color:'#fff', fontWeight:'700' }}>Save Contact</Text>
            </Pressable>
            
            <Pressable
              onPress={uploadDocument}
              style={({pressed})=>({
                backgroundColor: pressed ? '#eee' : colors.card,
                borderWidth:1, 
                borderColor:colors.border, 
                borderRadius: radii.button,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                flex: 1,
                alignItems: 'center'
              })}
            >
              <Text style={{ fontWeight:'600', color:colors.text }}>
                {uploadingDoc ? 'Uploading...' : 'Upload PDF'}
              </Text>
            </Pressable>
          </View>
        </View>
      </RoleGate>

      {/* Employee Information Panel */}
      <RoleGate allow={['employee','supervisor']}>
        <View style={{ paddingHorizontal:spacing.lg, marginBottom:spacing.md }}>
          <Text style={{ fontSize:16, fontWeight:'700', marginBottom:spacing.sm, color:colors.text }}>
            Employee Information
          </Text>
          
          <View style={{ flexDirection:'row', gap:spacing.sm, marginBottom:spacing.sm }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color:colors.textSecondary, marginBottom:spacing.xs }}>ETA (minutes)</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radii.button,
                  padding: spacing.md,
                  backgroundColor: colors.card
                }}
                placeholder="30"
                value={etaMins}
                onChangeText={setEtaMins}
                keyboardType="numeric"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color:colors.textSecondary, marginBottom:spacing.xs }}>Secondary Phone</Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: radii.button,
                  padding: spacing.md,
                  backgroundColor: colors.card
                }}
                placeholder="(555) 123-4567"
                value={secondaryPhone}
                onChangeText={setSecondaryPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={{ marginBottom:spacing.sm }}>
            <Text style={{ color:colors.textSecondary, marginBottom:spacing.xs }}>On-Scene Report</Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderColor: colors.border,
                borderRadius: radii.button,
                padding: spacing.md,
                backgroundColor: colors.card,
                minHeight: 80,
                textAlignVertical: 'top'
              }}
              placeholder="Describe current situation, actions taken, additional resources needed..."
              value={onSceneReport}
              onChangeText={setOnSceneReport}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={{ flexDirection:'row', alignItems:'center', marginBottom:spacing.md }}>
            <Pressable 
              onPress={() => setContactAttempted(!contactAttempted)}
              style={{ 
                flexDirection:'row', 
                alignItems:'center',
                flex: 1
              }}
            >
              <View style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                borderWidth: 2,
                borderColor: contactAttempted ? colors.success : colors.border,
                backgroundColor: contactAttempted ? colors.success : colors.card,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: spacing.sm
              }}>
                {contactAttempted && <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>✓</Text>}
              </View>
              <Text style={{ color:colors.text, fontWeight:'600' }}>Contact Attempted</Text>
            </Pressable>
            
            <Pressable
              onPress={saveEmployeeInputs}
              style={({pressed})=>({
                backgroundColor: pressed ? '#1976D2' : colors.primary,
                borderRadius: radii.button,
                paddingHorizontal: spacing.lg,
                paddingVertical: spacing.sm,
                alignItems: 'center'
              })}
            >
              <Text style={{ color:'#fff', fontWeight:'700' }}>Save Info</Text>
            </Pressable>
          </View>

          {/* Show existing employee inputs */}
          {incident?.employeeInputs && Object.keys(incident.employeeInputs).length > 0 && (
            <View style={{ 
              backgroundColor: colors.favorite, 
              padding: spacing.md, 
              borderRadius: radii.button,
              borderWidth: 1,
              borderColor: '#FFCC00'
            }}>
              <Text style={{ fontWeight:'700', color:colors.text, marginBottom:spacing.sm }}>
                Employee Reports
              </Text>
              {Object.entries(incident.employeeInputs).map(([uid, inputs]: [string, any]) => (
                <View key={uid} style={{ marginBottom:spacing.sm }}>
                  <Text style={{ fontWeight:'600', color:colors.textSecondary }}>
                    Employee {uid.slice(-4)}:
                  </Text>
                  {inputs.etaMins && <Text style={{ color:colors.text }}>• ETA: {inputs.etaMins} minutes</Text>}
                  {inputs.onSceneReport && <Text style={{ color:colors.text }}>• Report: {inputs.onSceneReport}</Text>}
                  {inputs.contactAttempted && <Text style={{ color:colors.text }}>• Contact attempted: Yes</Text>}
                  {inputs.secondaryPhone && <Text style={{ color:colors.text }}>• Secondary: {inputs.secondaryPhone}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>
      </RoleGate>

      {/* Media Actions */}
      <View style={{ paddingHorizontal:spacing.lg, marginBottom:spacing.sm, flexDirection:'row', gap:spacing.md }}>
        <RoleGate allow={['employee','supervisor']}>
          <Pressable
            onPress={async ()=>{
              const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!perm.granted) { Alert.alert('Permission required','Allow photo library access.'); return; }
              const pick = await ImagePicker.launchImageLibraryAsync({ 
                mediaTypes: ImagePicker.MediaTypeOptions.Images, 
                quality:0.8 
              });
              if (pick.canceled || !pick.assets?.length) return;
              setUploading(true);
              try {
                const mediaUrl = await uploadIncidentMedia(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', pick.assets[0].uri);
                // Log to case timeline
                await logCaseEvent(incident.id, 'media', { 
                  type: 'photo',
                  url: mediaUrl,
                  uploadedBy: user?.uid 
                });
                Alert.alert('Uploaded','Photo attached to incident.');
              } catch(e:any){ 
                Alert.alert('Upload failed', e?.message ?? String(e)); 
              }
              finally { 
                setUploading(false); 
              }
            }}
            style={({pressed})=>({
              backgroundColor: pressed ? '#eee' : colors.card,
              borderWidth:1, borderColor:colors.border, paddingHorizontal:spacing.md, paddingVertical:spacing.sm, borderRadius:radii.button
            })}
          >
            <Text style={{ fontWeight:'600', color:colors.text }}>{uploading ? 'Uploading…' : 'Add Photo'}</Text>
          </Pressable>
        </RoleGate>

        <Pressable
          onPress={()=>router.push(`/chat/${incident.id}` as any)}
          style={({pressed})=>({
            backgroundColor: pressed ? '#eee' : colors.card,
            borderWidth:1, borderColor:colors.border, paddingHorizontal:spacing.md, paddingVertical:spacing.sm, borderRadius:radii.button
          })}
        >
          <Text style={{ fontWeight:'600', color:colors.text }}>💬 Chat</Text>
        </Pressable>
      </View>

      {/* Timeline */}
      <View style={{ paddingHorizontal:spacing.lg, paddingBottom:spacing.xl }}>
        <Text style={{ fontSize:16, fontWeight:'700', marginBottom:spacing.sm, color:colors.text }}>Timeline & Updates</Text>
        
        {/* Media Gallery */}
        {(incident as any)?.media?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:spacing.sm }}>
            {(incident as any).media.map((m:any, idx:number)=>(
              <Image key={idx} source={{ uri: m.url }} style={{ width:120, height:90, borderRadius:radii.badge, marginRight:spacing.sm, backgroundColor:colors.border }}/>
            ))}
          </ScrollView>
        ) : null}
        
        {updates.map((u: any) => (
          <View key={`${u.source}:${u.id}`} style={{ paddingVertical:spacing.sm, borderBottomWidth:1, borderBottomColor:colors.border }}>
            <View style={{ flexDirection:'row', alignItems:'center', marginBottom:spacing.xs }}>
              <View style={{ width:8, height:8, borderRadius:4, backgroundColor:colors.info, marginRight:spacing.sm }} />
              <Text style={{ fontWeight:'600', color:colors.text }}>{u.alertType}</Text>
            </View>
            <Text numberOfLines={4} style={{ color:colors.textSecondary }}>{u.message}</Text>
          </View>
        ))}
        {updates.length === 0 && <Text style={{ color:colors.textTertiary }}>No updates yet.</Text>}
      </View>
    </ScrollView>
  );
}