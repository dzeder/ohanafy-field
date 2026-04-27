import { Pressable, Text, View } from 'react-native';

import { usePermissionStore } from '@/permissions/store';
import type { AppRole } from '@/permissions/types';

const ROLE_LABELS: Record<AppRole, string> = {
  AppAdmin: 'App Admin',
  FieldSalesRep: 'Field Sales Rep',
  SalesManager: 'Sales Manager',
  Driver: 'Driver',
  DriverManager: 'Driver Manager',
  WarehouseWorker: 'Warehouse Worker',
  WarehouseManager: 'Warehouse Manager',
};

export function RoleSwitcher(): React.ReactNode {
  const roles = usePermissionStore((s) => s.roles);
  const activeRole = usePermissionStore((s) => s.activeRole);
  const switchRole = usePermissionStore((s) => s.switchRole);
  const hasMultipleRoles = usePermissionStore((s) => s.hasMultipleRoles());

  if (!hasMultipleRoles) return null;

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel="Switch role"
      className="rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated"
    >
      <Text className="mb-3 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
        Role
      </Text>
      {roles.map((role) => (
        <Pressable
          key={role}
          accessibilityRole="radio"
          accessibilityLabel={ROLE_LABELS[role]}
          accessibilityState={{ selected: role === activeRole }}
          onPress={() => switchRole(role)}
          className={
            role === activeRole
              ? 'mb-2 rounded-xl bg-ohanafy-denim px-4 py-3'
              : 'mb-2 rounded-xl border border-ohanafy-denim px-4 py-3'
          }
        >
          <Text
            className={
              role === activeRole
                ? 'text-base font-bold text-ohanafy-paper'
                : 'text-base font-bold text-ohanafy-denim dark:text-ohanafy-denim-light'
            }
          >
            {ROLE_LABELS[role]}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
