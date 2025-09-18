import { Link } from 'expo-router';
import { View, Text, FlatList } from 'react-native';
import { useFavorites } from '../../hooks/useFavorites';
import { useIncidents } from '../../hooks/useIncidents';
import { colors, radii, spacing } from '../../ui/theme';

export default function FavoritesScreen(){
  const { favorites } = useFavorites();
  const { incidents } = useIncidents();
  const favList = incidents.filter(x => favorites[`${x.source}:${x.id}`]);
  return (
    <View style={{ flex:1, backgroundColor:colors.bg, paddingTop:spacing.md }}>
      <Text style={{ fontSize:20, fontWeight:'700', marginHorizontal:spacing.md, marginBottom:spacing.sm, color:colors.text }}>
        Favorites ({favList.length})
      </Text>
      <FlatList
        data={favList}
        keyExtractor={(x)=>`${x.source}:${x.id}`}
        renderItem={({item})=>(
          <Link href={{ pathname:'/incident/[id]' as any, params:{ id:item.id, source:item.source }}} asChild>
            <View style={{
              backgroundColor:colors.favorite, marginHorizontal:spacing.md, marginBottom:spacing.sm, padding:spacing.lg, borderRadius:radii.card,
              borderLeftWidth:4, borderLeftColor:'#FFCC00'
            }}>
              <Text style={{ fontWeight:'700', color:colors.text }}>{item.alertType} • FAVORITE</Text>
              <Text style={{ color:colors.textSecondary }}>{item.state} | {item.county} | {item.city}</Text>
              <Text numberOfLines={2} style={{ fontWeight:'600', color:colors.text }}>{item.address}</Text>
              <Text numberOfLines={2} style={{ color:colors.textSecondary }}>{item.message}</Text>
            </View>
          </Link>
        )}
        ListEmptyComponent={<Text style={{ textAlign:'center', marginTop:spacing.xxl, color:colors.textTertiary }}>
          No Favorites Yet. Tap the heart on an incident to save it here.
        </Text>}
      />
    </View>
  );
}