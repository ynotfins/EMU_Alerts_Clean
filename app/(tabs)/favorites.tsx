import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { useIncidents } from '../../hooks/useIncidents';

export default function FavoritesScreen(){
  const { favorites } = useFavorites();
  const { incidents } = useIncidents();
  const favList = incidents.filter(x => favorites[`${x.source}:${x.id}`]);
  return (
    <View style={{ flex:1, backgroundColor:'#F8F9FA', paddingTop:12 }}>
      <Text style={{ fontSize:20, fontWeight:'700', marginHorizontal:12, marginBottom:8 }}>
        Favorites ({favList.length})
      </Text>
      <FlatList
        data={favList}
        keyExtractor={(x)=>`${x.source}:${x.id}`}
        renderItem={({item})=>(
          <Link href={{ pathname:'/incident/[id]' as any, params:{ id:item.id, source:item.source }}} asChild>
            <View style={{
              backgroundColor:'#FFF9E6', marginHorizontal:12, marginBottom:10, padding:16, borderRadius:16,
              borderLeftWidth:4, borderLeftColor:'#FFCC00'
            }}>
              <Text style={{ fontWeight:'700' }}>{item.alertType} • FAVORITE</Text>
              <Text>{item.state} | {item.county} | {item.city}</Text>
              <Text numberOfLines={2} style={{ fontWeight:'600' }}>{item.address}</Text>
              <Text numberOfLines={2} style={{ color:'#555' }}>{item.message}</Text>
            </View>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:40, color:'#8E8E93' }}>
          No Favorites Yet. Tap the heart on an incident to save it here.
        </Text>}
      />
    </View>
  );
}