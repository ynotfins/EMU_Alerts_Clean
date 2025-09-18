import { Platform } from 'react-native';
import * as Linking from 'expo-linking';

export function openDirections(lat: number, lng: number, label = 'Incident') {
  // iOS prefers Apple Maps; Android prefers Google Maps; Web uses Google Maps web
  if (Platform.OS === 'ios') {
    // Apple Maps: maps://?q=label&daddr=lat,lng
    const url = `maps://?q=${encodeURIComponent(label)}&daddr=${lat},${lng}`;
    return Linking.openURL(url);
  } else if (Platform.OS === 'android') {
    // Google Maps intent: google.navigation:q=lat,lng
    const url = `google.navigation:q=${lat},${lng}`;
    return Linking.openURL(url);
  } else {
    // Web
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=&travelmode=driving`;
    return window.open(url, '_blank');
  }
}