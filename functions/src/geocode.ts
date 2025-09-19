import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

initializeApp();
const db = getFirestore();
const KEY = process.env.GOOGLE_MAPS_GEOCODE_KEY;

async function geocode(address:string){
  if (!KEY) {
    console.warn('GOOGLE_MAPS_GEOCODE_KEY not set');
    return null;
  }
  
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${KEY}`;
  const res = await fetch(url);
  const json = await res.json() as any;
  
  if (json.status !== 'OK' || !json.results?.length) {
    console.log('Geocoding failed:', json.status, address);
    return null;
  }
  
  const loc = json.results[0].geometry.location;
  return { latitude: loc.lat, longitude: loc.lng };
}

export const onIncidentWrite = functions.firestore
  .document('{colId}/{docId}')
  .onWrite(async (change, ctx) => {
    const col = ctx.params.colId;
    if (col !== 'incidents' && col !== 'alerts') return;
    
    const after = change.after.exists ? change.after.data() : null;
    if (!after) return;
    
    const addr = after.address || '';
    const hasCoords = after.coordinates?.latitude != null && after.coordinates?.longitude != null;
    
    if (!addr || hasCoords) return;
    
    console.log(`Geocoding address: ${addr}`);
    const coords = await geocode(addr);
    
    if (!coords) {
      console.log(`Failed to geocode: ${addr}`);
      return;
    }
    
    console.log(`Geocoded ${addr} to:`, coords);
    await db.doc(`${col}/${ctx.params.docId}`).update({ coordinates: coords });
  });