import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, Pressable, Platform, ActionSheetIOS, Alert, Image } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as ImagePicker from 'expo-image-picker';
import { useIncident } from '../../hooks/useIncident';
import { useAuth } from '../../hooks/useAuth';
import { openDirections } from '../../utils/navigation';
import { logResponse, updateIncidentStatus } from '../../utils/response';
import { uploadIncidentMedia } from '../../services/storage';
import { RoleGate } from '../../components/RoleGate';
import { useState } from 'react';

export default function IncidentDetail(){
  const { id, source } = useLocalSearchParams<{id:string; source?:'alerts'|'incidents'}>();
  const { incident, updates, loading } = useIncident(id!, source);
  const { user } = useAuth();
  const [responding, setResponding] = useState(false);
  const [uploading, setUploading] = useState(false);

  if (loading) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Loading…</Text></View>;
  }
  if (!incident) {
    return <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><Text>Not found.</Text></View>;
  }

  const coords = incident.coordinates;
  const priorityColor =
    incident.priority === 'critical' ? '#FF3B30' :
    incident.priority === 'high'     ? '#FF9500' :
    incident.priority === 'medium'   ? '#FFCC00' : '#34C759';

  return (
    <ScrollView style={{ flex:1, backgroundColor:'#fff' }}>
      {/* Map section (top third) */}
      <View style={{ height: 260, backgroundColor:'#E5E5EA' }}>
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
              position:'absolute', top:12, left:12,
              backgroundColor: priorityColor, borderRadius:8, paddingHorizontal:8, paddingVertical:4,
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
                  position:'absolute', top:12, right:12,
                  backgroundColor: pressed ? '#2E7D32' : '#34C759',
                  flexDirection:'row', alignItems:'center',
                  paddingHorizontal:12, paddingVertical:8, borderRadius:12,
                  shadowColor:'#000', shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:4, elevation:4
                })}
              >
                <Ionicons name="car" size={16} color="#fff" style={{ marginRight:6 }} />
                <Text style={{ color:'#fff', fontWeight:'700' }}>
                  {responding ? 'RESPONDING…' : (Platform.OS === 'web' ? 'OPEN MAPS' : 'RESPOND')}
                </Text>
              </Pressable>
            </RoleGate>
          </View>
        ) : (
          <View style={{ flex:1, alignItems:'center', justifyContent:'center' }}>
            <Ionicons name="location-outline" size={40} color="#8E8E93" />
            <Text style={{ color:'#8E8E93', marginTop:6 }}>Location pending</Text>
          </View>
        )}
      </View>

      {/* Incident summary */}
      <View style={{ padding:16 }}>
        <Text style={{ fontSize:20, fontWeight:'700' }}>{incident.alertType}</Text>
        <Text style={{ color:'#3A3A3C', marginTop:4 }}>{incident.state} | {incident.county} | {incident.city}</Text>
        <Text style={{ fontWeight:'700', marginTop:8 }}>{incident.address}</Text>
      </View>

      {/* Media Actions */}
      <View style={{ paddingHorizontal:16, marginBottom:8, flexDirection:'row', gap:12 }}>
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
              backgroundColor: pressed ? '#eee' : '#fff',
              borderWidth:1, borderColor:'#E5E5EA', paddingHorizontal:12, paddingVertical:10, borderRadius:12
            })}
          >
            <Text style={{ fontWeight:'600' }}>{uploading ? 'Uploading…' : 'Add Photo'}</Text>
          </Pressable>
        </RoleGate>
      </View>

      {/* Timeline */}
      <View style={{ paddingHorizontal:16, paddingBottom:24 }}>
        <Text style={{ fontSize:16, fontWeight:'700', marginBottom:8 }}>Timeline & Updates</Text>
        
        {/* Media Gallery */}
        {(incident as any)?.media?.length ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:10 }}>
            {(incident as any).media.map((m:any, idx:number)=>(
              <Image key={idx} source={{ uri: m.url }} style={{ width:120, height:90, borderRadius:10, marginRight:8, backgroundColor:'#eee' }}/>
            ))}
          </ScrollView>
        ) : null}
        
        {updates.map((u: any) => (
          <View key={`${u.source}:${u.id}`} style={{ paddingVertical:10, borderBottomWidth:1, borderBottomColor:'#eee' }}>
            <View style={{ flexDirection:'row', alignItems:'center', marginBottom:4 }}>
              <View style={{ width:8, height:8, borderRadius:4, backgroundColor:'#007AFF', marginRight:8 }} />
              <Text style={{ fontWeight:'600' }}>{u.alertType}</Text>
            </View>
            <Text numberOfLines={4} style={{ color:'#3A3A3C' }}>{u.message}</Text>
          </View>
        ))}
        {updates.length === 0 && <Text style={{ color:'#8E8E93' }}>No updates yet.</Text>}
      </View>
    </ScrollView>
  );
}