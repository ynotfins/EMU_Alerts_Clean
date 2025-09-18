import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, TextInput, Pressable, FlatList, Alert, ScrollView } from 'react-native';
import { colors, radii, shadowCard, spacing } from '../../ui/theme';
import { db } from '../../firebase.config';
import { doc, getDoc, updateDoc, addDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { logCaseEvent } from '../../services/timeline';

export default function CaseDetail(){
  const { id } = useLocalSearchParams<{id:string}>();
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [casedoc, setCasedoc] = useState<any>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [note, setNote] = useState('');

  useEffect(()=>{
    if (!id) return;
    
    const ref = doc(db, 'cases', id);
    getDoc(ref).then(s=> {
      if (s.exists()) {
        setCasedoc({ id:s.id, ...s.data() });
      }
    });
    
    const unsubN = onSnapshot(collection(db, 'cases', id, 'notes'), s=> {
      setNotes(s.docs.map(d=>({ id:d.id, ...d.data() })));
    });
    
    const unsubT = onSnapshot(collection(db, 'cases', id, 'tasks'), s=> {
      setTasks(s.docs.map(d=>({ id:d.id, ...d.data() })));
    });
    
    return ()=>{ unsubN(); unsubT(); };
  }, [id]);

  async function addNote(){
    if (!user || !profile || !note.trim()) return;
    try {
      await addDoc(collection(db, 'cases', id!, 'notes'), {
        authorUid: user.uid, 
        authorRole: profile.role || 'employee', 
        text: note.trim(), 
        createdAt: serverTimestamp()
      });
      setNote('');
      Alert.alert('Success', 'Note added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add note: ' + (error as Error).message);
    }
  }

  async function addTask(){
    if (!title.trim()) return;
    try {
      await addDoc(collection(db, 'cases', id!, 'tasks'), {
        title: title.trim(), 
        done: false, 
        assigneeUid: user?.uid ?? null, 
        createdAt: serverTimestamp()
      });
      setTitle('');
      Alert.alert('Success', 'Task added');
    } catch (error) {
      Alert.alert('Error', 'Failed to add task: ' + (error as Error).message);
    }
  }

  async function setStatus(next:string){
    try {
      await updateDoc(doc(db, 'cases', id!), { 
        status: next, 
        updatedAt: new Date().toISOString() 
      });
      
      // Log to case timeline
      await logCaseEvent(id!, 'case-status', { 
        previousStatus: casedoc?.status,
        newStatus: next,
        changedBy: user?.uid 
      });
      
      Alert.alert('Success', `Status changed to ${next}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status: ' + (error as Error).message);
    }
  }

  async function toggleTask(taskId: string, currentDone: boolean) {
    try {
      await updateDoc(doc(db, 'cases', id!, 'tasks', taskId), {
        done: !currentDone,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task: ' + (error as Error).message);
    }
  }

  if (!casedoc) {
    return (
      <View style={{flex:1, alignItems:'center', justifyContent:'center', backgroundColor: colors.bg}}>
        <Text style={{ color: colors.textTertiary }}>Loading case...</Text>
      </View>
    );
  }

  const isSuper = profile?.role === 'supervisor';

  return (
    <ScrollView style={{ flex:1, backgroundColor: colors.bg }}>
      {/* Case Header */}
      <View style={{ 
        backgroundColor: colors.card, 
        margin: spacing.lg, 
        padding: spacing.md, 
        borderRadius: radii.card, 
        ...shadowCard 
      }}>
        <Text style={{ fontWeight:'700', fontSize:18, marginBottom: spacing.sm, color:colors.text }}>
          Case {id}
        </Text>
        <Text style={{ color: colors.textSecondary, marginBottom: spacing.md }}>
          {casedoc.status?.toUpperCase()} • {casedoc.priority?.toUpperCase()} • {casedoc.alertRef?.source}/{casedoc.alertRef?.id}
        </Text>
        
        {/* Status Chips (Supervisor Only) */}
        {isSuper && (
          <View style={{ flexDirection:'row', gap: spacing.xs, marginTop: spacing.md, flexWrap: 'wrap' }}>
            {['new','assigned','responding','on-scene','in-progress','resolved','closed'].map(s=>(
              <Pressable 
                key={s} 
                onPress={()=>setStatus(s)} 
                style={{ 
                  backgroundColor: s===casedoc?.status ? colors.primary : colors.card, 
                  borderWidth:1, 
                  borderColor: colors.border, 
                  borderRadius: radii.chip, 
                  paddingHorizontal: spacing.sm, 
                  paddingVertical: spacing.xs 
                }}
              >
                <Text style={{ 
                  fontWeight:'600', 
                  color: s===casedoc?.status ? '#fff' : colors.textSecondary 
                }}>
                  {s}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Notes Section */}
      <View style={{ 
        backgroundColor: colors.card, 
        marginHorizontal: spacing.lg, 
        marginBottom: spacing.md, 
        padding: spacing.md, 
        borderRadius: radii.card, 
        ...shadowCard 
      }}>
        <Text style={{ fontWeight:'700', marginBottom: spacing.sm, color:colors.text }}>
          Notes ({notes.length})
        </Text>
        
        <FlatList 
          data={notes} 
          keyExtractor={(x)=>x.id}
          scrollEnabled={false}
          renderItem={({item})=>(
            <View style={{ 
              borderWidth:1, 
              borderColor: colors.border, 
              borderRadius: radii.button, 
              padding: spacing.sm, 
              marginBottom: spacing.sm 
            }}>
              <Text style={{ fontWeight:'600', color:colors.text }}>
                {item.authorRole?.toUpperCase()} • {item.authorUid?.slice(-4)}
              </Text>
              <Text style={{ color:colors.text, marginTop: spacing.xs }}>{item.text}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: colors.textTertiary }}>No notes yet.</Text>}
        />
        
        <View style={{ flexDirection:'row', gap: spacing.sm, marginTop: spacing.md }}>
          <TextInput 
            value={note} 
            onChangeText={setNote} 
            placeholder="Add note…" 
            multiline
            style={{ 
              flex:1, 
              minHeight:44, 
              borderWidth:1, 
              borderColor: colors.border, 
              borderRadius: radii.button, 
              paddingHorizontal: spacing.md,
              paddingVertical: spacing.sm,
              backgroundColor: colors.bg
            }}
          />
          <Pressable 
            onPress={addNote} 
            style={{ 
              backgroundColor: colors.info, 
              paddingHorizontal: spacing.lg, 
              borderRadius: radii.button, 
              justifyContent:'center' 
            }}
          >
            <Text style={{ color:'#fff', fontWeight:'700' }}>Add</Text>
          </Pressable>
        </View>
      </View>

      {/* Tasks Section */}
      <View style={{ 
        backgroundColor: colors.card, 
        marginHorizontal: spacing.lg, 
        marginBottom: spacing.lg, 
        padding: spacing.md, 
        borderRadius: radii.card, 
        ...shadowCard 
      }}>
        <Text style={{ fontWeight:'700', marginBottom: spacing.sm, color:colors.text }}>
          Tasks ({tasks.filter(t => !t.done).length} open, {tasks.filter(t => t.done).length} done)
        </Text>
        
        <FlatList 
          data={tasks} 
          keyExtractor={(x)=>x.id}
          scrollEnabled={false}
          renderItem={({item})=>(
            <Pressable 
              onPress={() => toggleTask(item.id, item.done)}
              style={{ 
                borderWidth:1, 
                borderColor: colors.border, 
                borderRadius: radii.button, 
                padding: spacing.sm, 
                marginBottom: spacing.sm,
                backgroundColor: item.done ? colors.favorite : colors.card
              }}
            >
              <Text style={{ 
                fontWeight:'600', 
                color:colors.text,
                textDecorationLine: item.done ? 'line-through' : 'none'
              }}>
                {item.done ? '✅' : '⏳'} {item.title}
              </Text>
              {item.assigneeUid && (
                <Text style={{ color: colors.textTertiary, marginTop: spacing.xs }}>
                  Assigned: {item.assigneeUid.slice(-4)}
                </Text>
              )}
            </Pressable>
          )}
          ListEmptyComponent={<Text style={{ color: colors.textTertiary }}>No tasks yet.</Text>}
        />
        
        <View style={{ flexDirection:'row', gap: spacing.sm, marginTop: spacing.md }}>
          <TextInput 
            value={title} 
            onChangeText={setTitle} 
            placeholder="New task…" 
            style={{ 
              flex:1, 
              height:44, 
              borderWidth:1, 
              borderColor: colors.border, 
              borderRadius: radii.button, 
              paddingHorizontal: spacing.md,
              backgroundColor: colors.bg
            }}
          />
          <Pressable 
            onPress={addTask} 
            style={{ 
              backgroundColor: colors.primary, 
              paddingHorizontal: spacing.lg, 
              borderRadius: radii.button, 
              justifyContent:'center' 
            }}
          >
            <Text style={{ color:'#fff', fontWeight:'700' }}>Add</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}