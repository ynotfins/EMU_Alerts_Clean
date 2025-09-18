import { Link } from 'expo-router';
import { FlatList, RefreshControl, Text, TextInput, View, TouchableOpacity, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import { useIncidents } from '../../hooks/useIncidents';
import { useFavorites } from '../../hooks/useFavorites';
import { haversine, humanDistance } from '../../utils/distance';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';

export default function Incidents(){
  const { incidents, loading, online } = useIncidents();
  const { favorites, isFav, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const [pulling, setPulling] = useState(false);
  const [userLoc, setUserLoc] = useState<{lat:number; lng:number}|null>(null);
  const [prio, setPrio] = useState<'all'|'critical'|'high'|'medium'|'low'>('all');
  const [nearby, setNearby] = useState(false);

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
    const base = !query.trim() ? incidents : incidents.filter(x=>{
      const hay = [
        x.address, x.city, x.county, x.state,
        x.alertType, x.message, x.priority, x.status
      ].filter(Boolean).map((s: any) => normalized(s)).join(' ');
      const q = normalized(query);
      return hay.includes(q);
    });
    const byPrio = prio==='all' ? base : base.filter(x=>x.priority===prio);
    if (nearby && userLoc) {
      return [...byPrio].sort((a,b)=>{
        const da = a.coordinates ? haversine(userLoc.lat,userLoc.lng,a.coordinates.latitude,a.coordinates.longitude) : Number.POSITIVE_INFINITY;
        const db = b.coordinates ? haversine(userLoc.lat,userLoc.lng,b.coordinates.latitude,b.coordinates.longitude) : Number.POSITIVE_INFINITY;
        return da - db;
      });
    }
    return byPrio;
  }, [incidents, query, prio, nearby, userLoc]);

  const lastUpdated = filtered[0]?.timestamp ? new Date(filtered[0].timestamp.seconds ? filtered[0].timestamp.seconds * 1000 : filtered[0].timestamp) : null;
  function fmtTime(d: Date){ return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }); }

  return (
    <View style={{ flex:1, backgroundColor:colors.bg, paddingTop:spacing.md }}>
      {/* Status + search bar */}
      <View style={{ marginHorizontal:spacing.md, marginBottom:spacing.sm }}>
        <Text style={{ fontSize:20, fontWeight:'700', marginBottom:spacing.sm, color:colors.text }}>Incidents</Text>

        <View style={{
          backgroundColor: online ? '#E3F2FD' : '#FFF4E5',
          borderColor: online ? '#90CAF9' : colors.warn,
          borderWidth: 1,
          borderRadius: radii.badge,
          paddingHorizontal: spacing.sm,
          paddingVertical: spacing.sm,
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'space-between',
          marginBottom: spacing.sm
        }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <View style={{
              width:8, height:8, borderRadius:4,
              backgroundColor: online ? colors.success : colors.warn, marginRight:spacing.xs
            }}/>
            <Text style={{ fontWeight:'600', color: online ? colors.primary : colors.warn }}>
              {online ? 'Online' : 'From cache'}
            </Text>
          </View>
          <Text style={{ color:colors.textSecondary }}>
            {lastUpdated ? `Last updated: ${fmtTime(lastUpdated)}` : 'No data yet'}
          </Text>
        </View>

        <View style={{
          backgroundColor:colors.card, borderColor:colors.border, borderWidth:1,
          borderRadius:radii.button, paddingHorizontal:spacing.md, paddingVertical:spacing.sm, flexDirection:'row', alignItems:'center'
        }}>
          <Ionicons name="search" size={18} color={colors.textTertiary} style={{ marginRight:spacing.sm }}/>
          <TextInput
            placeholder="Search address, city, alert type…"
            placeholderTextColor={colors.textTertiary}
            value={query}
            onChangeText={setQuery}
            style={{ flex:1, paddingVertical:spacing.xs }}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <Ionicons name="close-circle" size={18} color={colors.border} onPress={()=>setQuery('')} />
          )}
        </View>

        <Text style={{ color:colors.textTertiary, marginTop:spacing.xs }}>
          {filtered.length} result{filtered.length===1?'':'s'}
        </Text>

        <View style={{ flexDirection:'row', gap:spacing.sm, marginTop:spacing.sm, flexWrap:'wrap' }}>
          {(['all','critical','high','medium','low'] as const).map(p=>(
            <Pressable key={p} onPress={()=>setPrio(p)} style={{
              backgroundColor: prio===p ? colors.primary : colors.card,
              borderWidth:1, borderColor:colors.border, paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:radii.chip
            }}>
              <Text style={{ color: prio===p ? '#fff' : colors.textSecondary, fontWeight:'600' }}>{p.toUpperCase()}</Text>
            </Pressable>
          ))}
          <Pressable onPress={()=>setNearby(n=>!n)} style={{
            backgroundColor: nearby ? colors.primary : colors.card,
            borderWidth:1, borderColor:colors.border, paddingHorizontal:spacing.sm, paddingVertical:spacing.xs, borderRadius:radii.chip
          }}>
            <Text style={{ color: nearby ? '#fff' : colors.textSecondary, fontWeight:'600' }}>NEARBY</Text>
          </Pressable>
        </View>
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
              backgroundColor: isFav(`${item.source}:${item.id}`) ? colors.favorite : colors.card, 
              marginHorizontal:spacing.md, marginBottom:spacing.sm, padding:spacing.lg, borderRadius:radii.card,
              borderLeftWidth:4,
              borderLeftColor: item.priority==='critical'?colors.danger: item.priority==='high'?colors.warn: item.priority==='medium'?'#FFCC00':colors.info,
              ...shadowCard
            }}>
              <Text style={{ fontWeight:'700', color:colors.text }}>{item.alertType} • {item.priority.toUpperCase()}</Text>
              <Text style={{ color:colors.textSecondary }}>{item.state} | {item.county} | {item.city}</Text>
              <Text numberOfLines={2} style={{ fontWeight:'600', marginTop:spacing.xs, color:colors.text }}>
                {item.address}
                {userLoc && item.coordinates
                  ? ` · ${humanDistance(haversine(userLoc.lat, userLoc.lng, item.coordinates.latitude, item.coordinates.longitude),'mi')} away`
                  : ''}
              </Text>
              <Text numberOfLines={2} style={{ color:colors.textSecondary, marginTop:spacing.xs }}>{item.message}</Text>
              
              <View style={{ position:'absolute', right:spacing.md, top:spacing.md }}>
                <TouchableOpacity onPress={(e)=>{ e.stopPropagation?.(); toggle(`${item.source}:${item.id}`); }}>
                  <Ionicons
                    name={isFav(`${item.source}:${item.id}`) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFav(`${item.source}:${item.id}`) ? colors.danger : colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:spacing.xxl, color:colors.textTertiary }}>No incidents yet.</Text>}
      />
    </View>
  );
}