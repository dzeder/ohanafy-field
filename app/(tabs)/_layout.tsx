import { Tabs } from 'expo-router';

import { usePermissionStore } from '@/permissions/store';

export default function TabsLayout(): React.ReactNode {
  // Day 1 only ships the Field Sales Rep tab set. Other roles get no-permission
  // screen until Day 2 fills in their respective tab sets (Roles Appendix C).
  const canSell = usePermissionStore((s) => s.hasPermission('view_accounts'));

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A5F80',
        tabBarInactiveTintColor: '#545454',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#F4F2F0' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accounts',
          tabBarAccessibilityLabel: 'Accounts',
          href: canSell ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: 'Route',
          tabBarAccessibilityLabel: 'Route',
          href: canSell ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarAccessibilityLabel: 'Orders',
          href: canSell ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarAccessibilityLabel: 'Settings',
        }}
      />
    </Tabs>
  );
}
