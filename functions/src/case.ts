import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();

async function ensureCase(col:string, id:string, data:any){
  const caseId = id; // 1:1 mapping
  const docRef = db.collection('cases').doc(caseId);
  const snap = await docRef.get();
  if (snap.exists) return;

  const priority = (data?.priority || 'medium').toLowerCase();
  const prio = ['low','medium','high','critical'].includes(priority) ? priority : 'medium';
  const now = new Date().toISOString();

  await docRef.set({
    alertRef: { source: col as 'alerts'|'incidents', id },
    status: 'new',
    priority: prio,
    createdAt: now,
    updatedAt: now
  });

  console.log(`Auto-created case ${caseId} for ${col}/${id}`);
}

export const onAlertUpsertCreateCase = functions.firestore
  .document('alerts/{id}')
  .onWrite(async (change, ctx) => {
    if (!change.after.exists) return;
    await ensureCase('alerts', ctx.params.id, change.after.data());
  });

export const onIncidentUpsertCreateCase = functions.firestore
  .document('incidents/{id}')
  .onWrite(async (change, ctx) => {
    if (!change.after.exists) return;
    await ensureCase('incidents', ctx.params.id, change.after.data());
  });