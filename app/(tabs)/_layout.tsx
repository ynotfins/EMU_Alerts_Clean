import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Incidents',
          tabBarIcon: ({ color }) => <span>📋</span>,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <span>💬</span>,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color }) => <span>⭐</span>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <span>👤</span>,
        }}
      />
      <Tabs.Screen
        name="supervise"
        options={{
          title: 'Supervise',
          tabBarIcon: ({ color }) => <span>🗺️</span>,
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: 'Documents',
          tabBarIcon: ({ color }) => <span>📄</span>,
        }}
      />
    </Tabs>
  );
}