import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function updatePresence(uid:string, lat:number, lng:number){
  await setDoc(doc(db, 'users', uid, 'presence', 'now'), {
    lat, lng, updatedAt: serverTimestamp()
  }, { merge: true });
}