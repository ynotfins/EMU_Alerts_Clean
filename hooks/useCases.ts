import { useEffect, useState, useMemo } from 'react';
import { db } from '../firebase.config';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import type { CaseDoc } from '../types/crm';

export function useCases(){
  const [rows, setRows] = useState<CaseDoc[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(()=>{
    const q = query(collection(db, 'cases'), orderBy('updatedAt','desc'));
    const u = onSnapshot(q, snap=>{
      setRows(snap.docs.map(d=>({ id:d.id, ...(d.data() as any) })));
      setLoading(false);
    });
    return ()=>u();
  },[]);
  
  return { cases: rows, loading };
}