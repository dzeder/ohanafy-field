import type { ReactNode } from 'react';

import { usePermissionStore } from '@/permissions/store';
import type { Permission } from '@/permissions/types';

interface PermissionGateProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGate({
  permission,
  children,
  fallback = null,
}: PermissionGateProps): ReactNode {
  const allowed = usePermissionStore((s) => s.hasPermission(permission));
  return allowed ? children : fallback;
}
