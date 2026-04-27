import type { AppRole } from '@/permissions/types';

// Per Roles & Admin Appendix C — the tab set each role sees on the home tabs
// nav. AppAdmin acts through whichever functional role they currently hold
// (the role switcher) — they have no admin-specific tab set on mobile (admin
// console is a Salesforce Lightning app).

export interface RoleTabConfig {
  name: string;
  title: string;
}

export const ROLE_NAV_CONFIG: Record<AppRole, RoleTabConfig[]> = {
  AppAdmin: [], // multi-role users use the role switcher; admin has no own tabs
  FieldSalesRep: [
    { name: 'index', title: 'Accounts' },
    { name: 'route', title: 'Route' },
    { name: 'orders', title: 'Orders' },
    { name: 'settings', title: 'Settings' },
  ],
  SalesManager: [
    { name: 'team', title: 'Team' },
    { name: 'index', title: 'Accounts' },
    { name: 'approvals', title: 'Approvals' },
    { name: 'reports', title: 'Reports' },
    { name: 'settings', title: 'Settings' },
  ],
  Driver: [
    { name: 'route', title: 'Route' },
    { name: 'deliveries', title: 'Deliveries' },
    { name: 'settings', title: 'Settings' },
  ],
  DriverManager: [
    { name: 'dispatch', title: 'Dispatch' },
    { name: 'routes', title: 'Routes' },
    { name: 'exceptions', title: 'Exceptions' },
    { name: 'reports', title: 'Reports' },
    { name: 'settings', title: 'Settings' },
  ],
  WarehouseWorker: [
    { name: 'picklist', title: 'Pick List' },
    { name: 'inbound', title: 'Inbound' },
    { name: 'settings', title: 'Settings' },
  ],
  WarehouseManager: [
    { name: 'operations', title: 'Operations' },
    { name: 'inventory', title: 'Inventory' },
    { name: 'workers', title: 'Workers' },
    { name: 'reports', title: 'Reports' },
    { name: 'settings', title: 'Settings' },
  ],
};

// Every tab route file must be declared in (tabs)/_layout.tsx. This is the
// union of all tab names across roles — used to render every Tabs.Screen
// once and then toggle href:null per role to hide.
export const ALL_TAB_NAMES = [
  'index',
  'route',
  'orders',
  'team',
  'approvals',
  'reports',
  'deliveries',
  'dispatch',
  'routes',
  'exceptions',
  'picklist',
  'inbound',
  'operations',
  'inventory',
  'workers',
  'settings',
] as const;

export type TabName = (typeof ALL_TAB_NAMES)[number];

export function tabsForRole(role: AppRole | null): readonly TabName[] {
  if (!role) return [];
  return ROLE_NAV_CONFIG[role].map((t) => t.name as TabName);
}

export function tabTitle(role: AppRole | null, name: TabName): string | undefined {
  if (!role) return undefined;
  const config = ROLE_NAV_CONFIG[role].find((t) => t.name === name);
  return config?.title;
}
