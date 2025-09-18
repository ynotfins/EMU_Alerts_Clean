import { ReactNode } from 'react';
import { View, Text } from 'react-native';
import { useUserProfile } from '../hooks/useUserProfile';

export function RoleGate({ allow, children }: { allow: Array<'employee'|'supervisor'|'customer'>; children: ReactNode }) {
  const { profile, loading } = useUserProfile();
  
  if (loading) return <Text>Loading…</Text>;
  if (!profile || !allow.includes(profile.role)) {
    return <Text style={{ color:'#8E8E93' }}>Insufficient permissions.</Text>;
  }
  
  return <>{children}</>;
}