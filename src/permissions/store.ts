import { create } from 'zustand';

import { permissionsForRoles } from './matrix';
import type { AppRole, Permission, PermissionRecord } from './types';

interface PermissionStoreState {
  userId: string | null;
  roles: AppRole[];
  activeRole: AppRole | null;
  customPerms: Partial<Record<Permission, boolean>>;
  fetchedAt: number | null;

  setPermissions: (record: PermissionRecord) => void;
  switchRole: (role: AppRole) => void;
  clear: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasMultipleRoles: () => boolean;
}

export const usePermissionStore = create<PermissionStoreState>((set, get) => ({
  userId: null,
  roles: [],
  activeRole: null,
  customPerms: {},
  fetchedAt: null,

  setPermissions: (record) => {
    set({
      userId: record.userId,
      roles: record.roles,
      activeRole: record.primaryRole,
      customPerms: record.customPerms,
      fetchedAt: record.fetchedAt,
    });
  },

  switchRole: (role) => {
    const { roles } = get();
    if (!roles.includes(role)) {
      throw new Error(`Role "${role}" not assigned to this user`);
    }
    set({ activeRole: role });
  },

  clear: () => {
    set({
      userId: null,
      roles: [],
      activeRole: null,
      customPerms: {},
      fetchedAt: null,
    });
  },

  hasPermission: (permission) => {
    const { activeRole, customPerms } = get();
    // customPerms override takes precedence (true grants, false denies)
    if (permission in customPerms) {
      return customPerms[permission] === true;
    }
    if (!activeRole) return false;
    const grants = permissionsForRoles([activeRole]);
    return grants.has(permission);
  },

  hasMultipleRoles: () => get().roles.length > 1,
}));
