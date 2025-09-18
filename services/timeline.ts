import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function logCaseEvent(caseId:string, type:string, payload:any={}){
  try {
    await addDoc(collection(db, 'cases', caseId, 'timeline'), {
      type, 
      payload, 
      createdAt: serverTimestamp()
    });
    console.log(`Timeline logged: ${type} for case ${caseId}`);
  } catch (error) {
    console.error('Failed to log timeline event:', error);
  }
}