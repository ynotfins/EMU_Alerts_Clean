import { View, Text, FlatList, Pressable } from 'react-native';
import { Link } from 'expo-router';
import { useCases } from '../../hooks/useCases';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';

export default function Cases(){
  const { cases, loading } = useCases();
  
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, paddingTop: spacing.lg }}>
      <Text style={{ fontSize:20, fontWeight:'700', marginHorizontal: spacing.lg, marginBottom: spacing.md, color:colors.text }}>
        Cases ({cases.length})
      </Text>
      
      <FlatList
        data={cases}
        keyExtractor={(x)=>x.id}
        renderItem={({item})=>(
          <Link href={{ pathname:'/case/[id]' as any, params:{ id:item.id }}} asChild>
            <Pressable style={({pressed})=>({
              backgroundColor: colors.card, 
              marginHorizontal: spacing.lg, 
              marginBottom: spacing.sm, 
              padding: spacing.md,
              borderRadius: radii.card, 
              borderWidth:1, 
              borderColor: colors.border, 
              opacity: pressed?0.95:1, 
              ...shadowCard,
              borderLeftWidth: 4,
              borderLeftColor: item.priority==='critical'?colors.danger: item.priority==='high'?colors.warn: item.priority==='medium'?'#FFCC00':colors.info,
            })}>
              <Text style={{ fontWeight:'700', color:colors.text }}>
                Case {item.id} • {item.status.toUpperCase()} • {item.priority.toUpperCase()}
              </Text>
              <Text style={{ color: colors.textSecondary, marginTop: spacing.xs }}>
                Source: {item.alertRef.source}/{item.alertRef.id}
              </Text>
              {item.assignedTo && (
                <Text style={{ color: colors.textTertiary, marginTop: spacing.xs }}>
                  Assigned: {item.assignedTo.slice(-4)}
                </Text>
              )}
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          !loading ? (
            <Text style={{ textAlign:'center', color: colors.textTertiary, marginTop: spacing.xl }}>
              No cases yet.
            </Text>
          ) : null
        }
      />
    </View>
  );
}