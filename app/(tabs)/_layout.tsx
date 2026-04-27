import { Tabs } from 'expo-router';
import { useMemo } from 'react';

import {
  ALL_TAB_NAMES,
  tabsForRole,
  tabTitle,
  type TabName,
} from '@/navigation/role-nav-config';
import { usePermissionStore } from '@/permissions/store';

export default function TabsLayout(): React.ReactNode {
  // Active role drives which tabs are visible. AppAdmin has no functional tab
  // set of its own — they switch into a functional role via Settings to use
  // the app's mobile features (admin console is on Lightning).
  const activeRole = usePermissionStore((s) => s.activeRole);

  const visibleTabs = useMemo(() => {
    const allowed = tabsForRole(activeRole);
    return new Set<TabName>(allowed);
  }, [activeRole]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4A5F80',
        tabBarInactiveTintColor: '#545454',
        headerShown: false,
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#F4F2F0' },
      }}
    >
      {ALL_TAB_NAMES.map((name: TabName) => {
        const visible = visibleTabs.has(name);
        const customTitle = tabTitle(activeRole, name);
        return (
          <Tabs.Screen
            key={name}
            name={name}
            options={{
              // href:null hides the tab from the bar AND blocks deep-linking;
              // exactly the Bible §15 contract for role-scoped nav.
              href: visible ? undefined : null,
              title: customTitle ?? name,
              tabBarAccessibilityLabel: customTitle ?? name,
            }}
          />
        );
      })}
    </Tabs>
  );
}
