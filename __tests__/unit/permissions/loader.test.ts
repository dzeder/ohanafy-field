import { loadUserPermissions } from '@/permissions/loader';

describe('loadUserPermissions (fixture mode)', () => {
  describe('daniel.zeder@ohanafy.com', () => {
    it('returns AppAdmin as primary plus all 6 functional roles', async () => {
      const result = await loadUserPermissions({
        email: 'daniel.zeder@ohanafy.com',
        useSeedData: true,
      });
      expect(result.primaryRole).toBe('AppAdmin');
      expect(result.roles).toEqual(
        expect.arrayContaining([
          'AppAdmin',
          'FieldSalesRep',
          'SalesManager',
          'Driver',
          'DriverManager',
          'WarehouseWorker',
          'WarehouseManager',
        ])
      );
      expect(result.roles).toHaveLength(7);
    });
  });

  describe('daniel.zeder+salesrep@ohanafy.com', () => {
    it('returns FieldSalesRep only (no role switcher)', async () => {
      const result = await loadUserPermissions({
        email: 'daniel.zeder+salesrep@ohanafy.com',
        useSeedData: true,
      });
      expect(result.primaryRole).toBe('FieldSalesRep');
      expect(result.roles).toEqual(['FieldSalesRep']);
    });
  });

  describe('unknown email in fixture mode', () => {
    it('returns no roles (no-permission screen will render)', async () => {
      const result = await loadUserPermissions({
        email: 'unknown@example.com',
        useSeedData: true,
      });
      expect(result.roles).toEqual([]);
    });
  });

  describe('fetchedAt', () => {
    it('stamps the fetch time so we can detect staleness later', async () => {
      const before = Date.now();
      const result = await loadUserPermissions({
        email: 'daniel.zeder@ohanafy.com',
        useSeedData: true,
      });
      const after = Date.now();
      expect(result.fetchedAt).toBeGreaterThanOrEqual(before);
      expect(result.fetchedAt).toBeLessThanOrEqual(after);
    });
  });

  describe('non-fixture mode', () => {
    it('throws a descriptive error if useSeedData is false (live SF loader is Day 4)', async () => {
      await expect(
        loadUserPermissions({ email: 'whoever@example.com', useSeedData: false })
      ).rejects.toThrow(/live Salesforce permission loader/i);
    });
  });
});
