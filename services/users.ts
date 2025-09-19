import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function ensureUser(uid:string, email:string|null|undefined){
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid, 
      email: email ?? '', 
      role: 'employee', 
      createdAt: serverTimestamp(), 
      department: ''
    });
  }
}