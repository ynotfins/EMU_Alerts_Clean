import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { View } from 'react-native';
import ToastHost from './_toast-host';
import { useAuth } from '../hooks/useAuth';

export default function Root() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <View style={{ flex:1 }}>
      <Stack screenOptions={{ headerStyle:{backgroundColor:'#2196F3'}, headerTintColor:'#fff' }} >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="incident/[id]" options={{ title: 'Incident Details' }} />
        <Stack.Screen name="chat/[id]" options={{ title: 'Incident Chat' }} />
        <Stack.Screen name="case/[id]" options={{ title: 'Case Details' }} />
      </Stack>
      <ToastHost />
    </View>
  );
}