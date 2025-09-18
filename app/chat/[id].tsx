import { useLocalSearchParams } from 'expo-router';
import { useChat } from '../../hooks/useChat';
import { useState } from 'react';
import { View, Text, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';

export default function IncidentChat(){
  const { id } = useLocalSearchParams<{id:string}>();
  const { msgs, loading, send } = useChat(id!);
  const [draft, setDraft] = useState('');
  
  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:colors.bg }} behavior={Platform.OS==='ios'?'padding':undefined}>
      <FlatList
        style={{ flex:1, padding: spacing.lg }}
        data={msgs}
        keyExtractor={m=>m.id}
        renderItem={({item})=>(
          <View style={{
            backgroundColor: colors.card, borderRadius: radii.card, padding: spacing.md,
            marginBottom: spacing.sm, ...shadowCard
          }}>
            <Text style={{ fontWeight:'700', color:colors.text }}>{item.senderRole.toUpperCase()}</Text>
            <Text style={{ color:colors.text }}>{item.text}</Text>
          </View>
        )}
        ListEmptyComponent={!loading ? <Text style={{ textAlign:'center', color:colors.textTertiary, marginTop: spacing.xl }}>No messages yet.</Text> : null}
      />
      <View style={{ flexDirection:'row', gap: spacing.sm, padding: spacing.md, backgroundColor: colors.card, borderTopWidth:1, borderTopColor: colors.border }}>
        <TextInput
          style={{ flex:1, height:44, borderWidth:1, borderColor:colors.border, borderRadius:radii.button, paddingHorizontal: spacing.md }}
          placeholder="Message…"
          value={draft}
          onChangeText={setDraft}
        />
        <Pressable
          onPress={()=>{ const t=draft.trim(); if (t) { send(t); setDraft(''); } }}
          style={({pressed})=>({
            backgroundColor: pressed ? '#1976D2' : colors.primary,
            paddingHorizontal: spacing.lg, borderRadius: radii.button, alignItems:'center', justifyContent:'center'
          })}
        >
          <Text style={{ color:'#fff', fontWeight:'700' }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}