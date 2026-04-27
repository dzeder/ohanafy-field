import { usePermissionStore } from '@/permissions/store';

describe('usePermissionStore', () => {
  beforeEach(() => {
    usePermissionStore.getState().clear();
  });

  describe('setPermissions', () => {
    it('stores roles and computes derived permission set', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'rep@ohanafy.com',
        roles: ['FieldSalesRep'],
        primaryRole: 'FieldSalesRep',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      const state = usePermissionStore.getState();
      expect(state.userId).toBe('rep@ohanafy.com');
      expect(state.activeRole).toBe('FieldSalesRep');
      expect(state.hasPermission('create_orders')).toBe(true);
    });
  });

  describe('hasPermission', () => {
    it('returns true when active role grants the permission', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'admin@ohanafy.com',
        roles: ['AppAdmin', 'FieldSalesRep'],
        primaryRole: 'AppAdmin',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      expect(usePermissionStore.getState().hasPermission('manage_admin_console')).toBe(true);
    });

    it('returns false when no permissions loaded', () => {
      expect(usePermissionStore.getState().hasPermission('create_orders')).toBe(false);
    });

    it('honors customPerms overrides (true)', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'rep@ohanafy.com',
        roles: ['FieldSalesRep'],
        primaryRole: 'FieldSalesRep',
        customPerms: { manage_admin_console: true },
        fetchedAt: Date.now(),
      });
      expect(usePermissionStore.getState().hasPermission('manage_admin_console')).toBe(true);
    });

    it('honors customPerms overrides (false denies a granted permission)', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'rep@ohanafy.com',
        roles: ['FieldSalesRep'],
        primaryRole: 'FieldSalesRep',
        customPerms: { create_orders: false },
        fetchedAt: Date.now(),
      });
      expect(usePermissionStore.getState().hasPermission('create_orders')).toBe(false);
    });
  });

  describe('switchRole (multi-role users)', () => {
    it('changes the active role and recomputes permissions', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'admin@ohanafy.com',
        roles: ['AppAdmin', 'FieldSalesRep', 'Driver'],
        primaryRole: 'AppAdmin',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      usePermissionStore.getState().switchRole('Driver');
      const state = usePermissionStore.getState();
      expect(state.activeRole).toBe('Driver');
      expect(state.hasPermission('confirm_deliveries')).toBe(true);
      expect(state.hasPermission('manage_admin_console')).toBe(false);
    });

    it('rejects switching to a role the user does not hold', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'rep@ohanafy.com',
        roles: ['FieldSalesRep'],
        primaryRole: 'FieldSalesRep',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      expect(() => usePermissionStore.getState().switchRole('AppAdmin')).toThrow(
        /not assigned/i
      );
    });
  });

  describe('hasMultipleRoles', () => {
    it('is true for users with >1 role (role switcher renders)', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'admin@ohanafy.com',
        roles: ['AppAdmin', 'FieldSalesRep'],
        primaryRole: 'AppAdmin',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      expect(usePermissionStore.getState().hasMultipleRoles()).toBe(true);
    });

    it('is false for single-role users', () => {
      usePermissionStore.getState().setPermissions({
        userId: 'rep@ohanafy.com',
        roles: ['FieldSalesRep'],
        primaryRole: 'FieldSalesRep',
        customPerms: {},
        fetchedAt: Date.now(),
      });
      expect(usePermissionStore.getState().hasMultipleRoles()).toBe(false);
    });
  });
});
