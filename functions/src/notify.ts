import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

async function push(to:string[], title:string, body:string, data:any={}){
  if (!to.length) return;
  
  const payload = to.map(t=>({ to:t, sound:'default', title, body, data }));
  
  const res = await fetch('https://exp.host/--/api/v2/push/send', {
    method:'POST', 
    headers:{ 'Content-Type':'application/json' }, 
    body: JSON.stringify(payload)
  });
  
  const result = await res.text();
  console.log('Push result:', result);
  return result;
}

export const onResponseCreate = functions.firestore
  .document('responses/{rid}')
  .onCreate( async (snap) => {
    const d = snap.data() as any;
    if (d?.status !== 'responding') return;

    console.log('Notifying supervisors of response:', d);

    // Gather supervisor tokens
    const supSnap = await db.collection('users').where('role','==','supervisor').get();
    const tokens: string[] = [];
    
    for (const doc of supSnap.docs) {
      const toks = await db.collection('users').doc(doc.id).collection('pushTokens').get();
      toks.forEach(t=> {
        const tokenData = t.data() as any;
        if (tokenData.token) {
          tokens.push(tokenData.token);
        }
      });
    }

    if (tokens.length === 0) {
      console.log('No supervisor push tokens found');
      return;
    }

    const title = 'Responder En-Route';
    const body = `Employee ${d.employeeId} is responding to incident ${d.incidentId}`;
    
    await push(tokens, title, body, { incidentId: d.incidentId });
    console.log(`Notified ${tokens.length} supervisors`);
  });