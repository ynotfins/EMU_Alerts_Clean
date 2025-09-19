import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase.config';

export async function registerForPushAsync(uid:string|null) {
  if (!Device.isDevice) return null;
  const { status: exStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = exStatus;
  if (finalStatus !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    finalStatus = req.status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId
  })).data;

  if (uid && token) {
    // de-dupe (avoid storing the same token repeatedly)
    const q = query(collection(db, `users/${uid}/pushTokens`), where('token','==', token));
    const dup = await getDocs(q);
    if (dup.empty) {
      await addDoc(collection(db, `users/${uid}/pushTokens`), {
        token, createdAt: serverTimestamp(), device: Device.modelName ?? 'unknown'
      });
    }
  }
  return token;
}