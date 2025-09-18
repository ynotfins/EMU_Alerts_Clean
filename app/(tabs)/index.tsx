import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text, TextInput, View, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { useIncidents } from '../../hooks/useIncidents';
import { useFavorites } from '../../hooks/useFavorites';
import { haversine, humanDistance } from '../../utils/distance';

export default function Incidents(){
  const { incidents, loading, online } = useIncidents();
  const { favorites, isFav, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const [pulling, setPulling] = useState(false);
  const [userLoc, setUserLoc] = useState<{lat:number; lng:number}|null>(null);

  useEffect(()=>{ if (!loading) setPulling(false); }, [loading]);

  useEffect(()=>{
    let mounted = true;
    (async ()=>{
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const pos = await Location.getCurrentPositionAsync({});
      if (!mounted) return;
      setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    })();
    return ()=>{ mounted = false; };
  },[]);

  const normalized = (s:string) => s.normalize('NFKD').toLowerCase();
  const filtered = useMemo(()=>{
    if (!query.trim()) return incidents;
    const q = normalized(query);
    return incidents.filter(x=>{
      const hay = [
        x.address, x.city, x.county, x.state,
        x.alertType, x.message, x.priority, x.status
      ].filter(Boolean).map((s: any) => normalized(s)).join(' ');
      return hay.includes(q);
    });
  }, [incidents, query]);

  const lastUpdated = filtered[0]?.timestamp ? new Date(filtered[0].timestamp.seconds ? filtered[0].timestamp.seconds * 1000 : filtered[0].timestamp) : null;
  function fmtTime(d: Date){ return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }

  return (
    <View style={{ flex:1, backgroundColor:'#F8F9FA', paddingTop:12 }}>
      {/* Status + search bar */}
      <View style={{ marginHorizontal:12, marginBottom:8 }}>
        <Text style={{ fontSize:20, fontWeight:'700', marginBottom:8 }}>Incidents</Text>

        <View style={{
          backgroundColor: online ? '#E3F2FD' : '#FFF4E5',
          borderColor: online ? '#90CAF9' : '#FFC107',
          borderWidth: 1,
          borderRadius: 10,
          paddingHorizontal: 10,
          paddingVertical: 8,
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'space-between',
          marginBottom: 8
        }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <View style={{
              width:8, height:8, borderRadius:4,
              backgroundColor: online ? '#34C759' : '#FF9500', marginRight:6
            }}/>
            <Text style={{ fontWeight:'600', color: online ? '#1976D2' : '#8E6B00' }}>
              {online ? 'Online' : 'From cache'}
            </Text>
          </View>
          <Text style={{ color:'#3A3A3C' }}>
            {lastUpdated ? `Last updated: ${fmtTime(lastUpdated)}` : 'No data yet'}
          </Text>
        </View>

        <View style={{
          backgroundColor:'#FFFFFF', borderColor:'#E5E5EA', borderWidth:1,
          borderRadius:12, paddingHorizontal:12, paddingVertical:8, flexDirection:'row', alignItems:'center'
        }}>
          <Ionicons name="search" size={18} color="#8E8E93" style={{ marginRight:8 }}/>
          <TextInput
            placeholder="Search address, city, alert type…"
            placeholderTextColor="#8E8E93"
            value={query}
            onChangeText={setQuery}
            style={{ flex:1, paddingVertical:4 }}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={18} color="#C7C7CC" onPress={()=>setQuery('')} />
          )}
        </View>

        <Text style={{ color:'#8E8E93', marginTop:6 }}>
          {filtered.length} result{filtered.length===1?'':'s'}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(x)=>`${x.source}:${x.id}`}
        refreshControl={
          <RefreshControl refreshing={pulling || loading} onRefresh={()=>{ setPulling(true); /* live listeners auto-refresh */ }} />
        }
        renderItem={({item})=>(
          <Link href={{ pathname:'/incident/[id]' as any, params:{ id: item.id, source:item.source }}} asChild>
            <View style={{
              backgroundColor: isFav(`${item.source}:${item.id}`) ? '#FFF9E6' : '#fff', 
              marginHorizontal:12, marginBottom:10, padding:16, borderRadius:16,
              borderLeftWidth:4,
              borderLeftColor: item.priority==='critical'?'#FF3B30': item.priority==='high'?'#FF9500': item.priority==='medium'?'#FFCC00':'#007AFF',
              shadowColor:'#000', shadowOffset:{ width:0, height:2 }, shadowOpacity:0.06, shadowRadius:8, elevation:2
            }}>
              <Text style={{ fontWeight:'700' }}>{item.alertType} • {item.priority.toUpperCase()}</Text>
              <Text style={{ color:'#3A3A3C' }}>{item.state} | {item.county} | {item.city}</Text>
              <Text numberOfLines={2} style={{ fontWeight:'600', marginTop:2 }}>
                {item.address}
                {userLoc && item.coordinates
                  ? ` · ${humanDistance(haversine(userLoc.lat, userLoc.lng, item.coordinates.latitude, item.coordinates.longitude),'mi')} away`
                  : ''}
              </Text>
              <Text numberOfLines={2} style={{ color:'#555', marginTop:4 }}>{item.message}</Text>
              
              <View style={{ position:'absolute', right:12, top:12 }}>
                <TouchableOpacity onPress={(e)=>{ e.stopPropagation?.(); toggle(`${item.source}:${item.id}`); }}>
                  <Ionicons
                    name={isFav(`${item.source}:${item.id}`) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFav(`${item.source}:${item.id}`) ? '#FF3B30' : '#8E8E93'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:40, color:'#8E8E93' }}>No incidents yet.</Text>}
      />
    </View>
  );
}