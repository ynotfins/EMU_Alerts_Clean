import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '../../firebase.config';
import { collectionGroup, onSnapshot } from 'firebase/firestore';
import { colors, spacing } from '../../ui/theme';
import { RoleGate } from '../../components/RoleGate';

type Ping = { uid:string; lat:number; lng:number; updatedAt?:any };

export default function Supervise(){
  const [pings, setPings] = useState<Ping[]>([]);
  
  useEffect(()=>{
    const cg = collectionGroup(db, 'presence');
    const unsub = onSnapshot(cg, snap=>{
      const out: Ping[] = [];
      snap.forEach(doc=>{
        const data = doc.data() as any;
        const uid = doc.ref.parent.parent?.id || 'unknown';
        if (data?.lat != null && data?.lng != null) {
          out.push({ uid, lat:data.lat, lng:data.lng, updatedAt:data.updatedAt });
        }
      });
      setPings(out);
    });
    return ()=>unsub();
  },[]);
  
  const region = pings[0]
    ? { latitude:pings[0].lat, longitude:pings[0].lng, latitudeDelta:0.2, longitudeDelta:0.2 }
    : { latitude: 42.241, longitude: -83.613, latitudeDelta: 0.5, longitudeDelta: 0.5 }; // EMU campus default

  return (
    <RoleGate allow={['supervisor']}>
      <View style={{ flex:1 }}>
        <View style={{ backgroundColor:colors.card, padding:spacing.lg, borderBottomWidth:1, borderBottomColor:colors.border }}>
          <Text style={{ fontSize:20, fontWeight:'700', color:colors.text }}>Live Responder Locations</Text>
          <Text style={{ color:colors.textSecondary }}>Tracking {pings.length} active responder{pings.length===1?'':'s'}</Text>
        </View>
        
        <MapView style={{ flex:1 }} initialRegion={region} showsUserLocation>
          {pings.map((p,i)=>(
            <Marker 
              key={i} 
              coordinate={{ latitude:p.lat, longitude:p.lng }} 
              title={`Responder ${p.uid.slice(-4)}`}
              pinColor={colors.primary}
            />
          ))}
        </MapView>
      </View>
    </RoleGate>
  );
}