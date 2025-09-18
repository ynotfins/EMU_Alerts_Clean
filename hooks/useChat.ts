import { useEffect, useState, useCallback } from 'react';
import { db } from '../firebase.config';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './useAuth';
import { useUserProfile } from './useUserProfile';

export interface ChatMessage { 
  id:string; 
  senderUid:string; 
  senderRole:string; 
  text:string; 
  createdAt: any; 
}

export function useChat(incidentId: string) {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [msgs, setMsgs] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    if (!incidentId) return;
    const q = query(collection(db, 'chats', incidentId, 'messages'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, snap=>{
      setMsgs(snap.docs.map(d=>({ id:d.id, ...(d.data() as any) })));
      setLoading(false);
    });
    return ()=>unsub();
  }, [incidentId]);

  const send = useCallback(async (text:string)=>{
    if (!user || !profile || !text.trim()) return;
    await addDoc(collection(db, 'chats', incidentId, 'messages'), {
      senderUid: user.uid, 
      senderRole: profile.role || 'employee', 
      text: text.trim(), 
      createdAt: serverTimestamp()
    });
  }, [incidentId, user, profile]);

  return { msgs, loading, send };
}