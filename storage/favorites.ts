import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'emu:favorites:v1';

export async function getFavorites(): Promise<Record<string, true>> {
  try { const raw = await AsyncStorage.getItem(KEY); return raw ? JSON.parse(raw) : {}; }
  catch { return {}; }
}

export async function setFavorites(map: Record<string, true>) {
  await AsyncStorage.setItem(KEY, JSON.stringify(map));
}

export async function toggleFavorite(id: string): Promise<Record<string, true>> {
  const map = await getFavorites();
  if (map[id]) delete map[id]; else map[id] = true;
  await setFavorites(map);
  return map;
}