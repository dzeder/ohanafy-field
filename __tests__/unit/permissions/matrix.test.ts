import { PERMISSION_MATRIX, permissionsForRoles } from '@/permissions/matrix';
import type { AppRole } from '@/permissions/types';

describe('PERMISSION_MATRIX', () => {
  describe('AppAdmin', () => {
    it('grants all admin-only permissions', () => {
      const admin = PERMISSION_MATRIX.AppAdmin;
      expect(admin.has('manage_admin_console')).toBe(true);
      expect(admin.has('manage_org_config')).toBe(true);
      expect(admin.has('view_audit_log')).toBe(true);
    });

    it('also grants every functional role permission (admin can act as any role)', () => {
      const admin = PERMISSION_MATRIX.AppAdmin;
      expect(admin.has('create_orders')).toBe(true);
      expect(admin.has('confirm_deliveries')).toBe(true);
      expect(admin.has('manage_inventory')).toBe(true);
      expect(admin.has('view_team_activity')).toBe(true);
    });
  });

  describe('FieldSalesRep', () => {
    it('grants core selling permissions', () => {
      const rep = PERMISSION_MATRIX.FieldSalesRep;
      expect(rep.has('view_accounts')).toBe(true);
      expect(rep.has('create_orders')).toBe(true);
      expect(rep.has('voice_input')).toBe(true);
      expect(rep.has('print_labels')).toBe(true);
    });

    it('does NOT grant admin or manager permissions', () => {
      const rep = PERMISSION_MATRIX.FieldSalesRep;
      expect(rep.has('manage_admin_console')).toBe(false);
      expect(rep.has('view_team_activity')).toBe(false);
      expect(rep.has('manage_inventory')).toBe(false);
    });
  });

  describe('non-overlapping role boundaries', () => {
    it('Driver cannot create orders (selling, not delivery)', () => {
      expect(PERMISSION_MATRIX.Driver.has('create_orders')).toBe(false);
    });

    it('WarehouseWorker cannot view team activity', () => {
      expect(PERMISSION_MATRIX.WarehouseWorker.has('view_team_activity')).toBe(false);
    });

    it('SalesManager cannot edit accounts (read-only oversight)', () => {
      expect(PERMISSION_MATRIX.SalesManager.has('edit_accounts')).toBe(false);
    });
  });
});

describe('permissionsForRoles', () => {
  it('returns the union of permissions across roles', () => {
    const merged = permissionsForRoles(['FieldSalesRep', 'Driver']);
    expect(merged.has('create_orders')).toBe(true);     // from FieldSalesRep
    expect(merged.has('confirm_deliveries')).toBe(true); // from Driver
    expect(merged.has('print_labels')).toBe(true);       // shared by both
  });

  it('returns empty set for empty roles array', () => {
    expect(permissionsForRoles([] as AppRole[]).size).toBe(0);
  });

  it('deduplicates shared permissions across roles', () => {
    const sales = PERMISSION_MATRIX.FieldSalesRep.size;
    const merged = permissionsForRoles(['FieldSalesRep', 'FieldSalesRep']);
    expect(merged.size).toBe(sales);
  });
});
