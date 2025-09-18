import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { db } from '../../firebase.config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import * as WebBrowser from 'expo-web-browser';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';

type Doc = { id:string; name:string; url:string; esignUrl?:string };

export default function Documents(){
  const [docs, setDocs] = useState<Doc[]>([]);
  
  useEffect(()=>{
    const q = query(collection(db, 'libraryDocs'), orderBy('updatedAt','desc'));
    const unsub = onSnapshot(q, snap=>{
      setDocs(snap.docs.map(d=>({ id:d.id, ...(d.data() as any) })));
    });
    return ()=>unsub();
  },[]);
  
  return (
    <View style={{ flex:1, backgroundColor: colors.bg, paddingTop: spacing.lg }}>
      <Text style={{ fontSize:20, fontWeight:'700', marginHorizontal:spacing.lg, marginBottom:spacing.sm, color:colors.text }}>
        Documents Library
      </Text>
      
      <FlatList
        data={docs}
        keyExtractor={d=>d.id}
        renderItem={({item})=>(
          <View style={{ 
            backgroundColor: colors.card, 
            marginHorizontal: spacing.lg, 
            marginBottom: spacing.md, 
            padding: spacing.md, 
            borderRadius: radii.card, 
            ...shadowCard 
          }}>
            <Text style={{ fontWeight:'700', color:colors.text }}>{item.name}</Text>
            <View style={{ flexDirection:'row', gap: spacing.sm, marginTop: spacing.sm }}>
              <Pressable 
                onPress={()=>WebBrowser.openBrowserAsync(item.url)} 
                style={{ 
                  backgroundColor: colors.info, 
                  borderRadius: radii.button, 
                  paddingHorizontal: spacing.lg, 
                  paddingVertical: spacing.sm 
                }}
              >
                <Text style={{ color:'#fff', fontWeight:'700' }}>Open PDF</Text>
              </Pressable>
              {item.esignUrl ? (
                <Pressable 
                  onPress={()=>WebBrowser.openBrowserAsync(item.esignUrl!)} 
                  style={{ 
                    backgroundColor: colors.primary, 
                    borderRadius: radii.button, 
                    paddingHorizontal: spacing.lg, 
                    paddingVertical: spacing.sm 
                  }}
                >
                  <Text style={{ color:'#fff', fontWeight:'700' }}>Send to e-sign</Text>
                </Pressable>
              ) : null}
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ 
            textAlign:'center', 
            color: colors.textTertiary, 
            marginTop: spacing.xl 
          }}>
            No documents available.
          </Text>
        }
      />
    </View>
  );
}