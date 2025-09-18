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
import { colors, radii, shadowCard, spacing } from '../../ui/theme';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
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
  
  // Track location when responding
  usePresence(responding);

  // Initialize contact info when incident loads
  useEffect(() => {
    if (incident?.contact) {
      setContactName(incident.contact.name || '');
      setContactPhone(incident.contact.phone || '');
    }
  }, [incident]);

  const saveContact = async () => {
    if (!user?.uid || !incident) return;
    try {
      await updateDoc(doc(db, (incident.source || 'incidents') as 'incidents'|'alerts', incident.id), {
        contact: { name: contactName.trim(), phone: contactPhone.trim() }
      });
      Alert.alert('Success', 'Contact information saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save contact: ' + (error as Error).message);
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
                        if (idx===1) await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'active'); // arrived => active
                        if (idx===2) await updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'resolved');
                      }
                    );
                  } else {
                    Alert.alert('Update Status','Choose an action',[
                      { text:'Mark Arrived', onPress:()=>updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'active') },
                      { text:'Mark Completed', onPress:()=>updateIncidentStatus(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', 'resolved') },
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
                await uploadIncidentMedia(incident.id, (incident.source || 'incidents') as 'incidents'|'alerts', pick.assets[0].uri);
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