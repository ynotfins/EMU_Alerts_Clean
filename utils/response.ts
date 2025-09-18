import { addDoc, collection, serverTimestamp, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function logResponse(incidentId:string, userId:string, status:'responding'|'arrived'|'completed'){
  const ref = await addDoc(collection(db, 'responses'), {
    incidentId, 
    employeeId: userId, 
    timestamp: serverTimestamp(),
    status
  });
  return ref.id;
}

export async function updateIncidentStatus(incidentId:string, collectionName:'incidents'|'alerts', status:'active'|'resolved'|'en-route'){
  await updateDoc(doc(db, collectionName, incidentId), { status });
}