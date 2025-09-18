import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase.config';
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';

const storage = getStorage();

export async function uploadIncidentMedia(incidentId:string, source:'incidents'|'alerts', uri:string){
  const resp = await fetch(uri);
  const blob = await resp.blob();
  const path = `incidents/${source}/${incidentId}/${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const r = ref(storage, path);
  await uploadBytes(r, blob);
  const url = await getDownloadURL(r);
  await updateDoc(doc(db, source, incidentId), {
    hasMedia: true,
    media: arrayUnion({ url, createdAt: serverTimestamp() })
  });
  return url;
}