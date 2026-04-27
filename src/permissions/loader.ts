import type { AppRole, PermissionRecord } from './types';

interface LoadOptions {
  email: string;
  useSeedData: boolean;
}

// Day-1 fixtures. Day 4 wires the real SF Permission Set loader and these go away.
const FIXTURE_USERS: Record<string, AppRole[]> = {
  'daniel.zeder@ohanafy.com': [
    'AppAdmin',
    'FieldSalesRep',
    'SalesManager',
    'Driver',
    'DriverManager',
    'WarehouseWorker',
    'WarehouseManager',
  ],
  'daniel.zeder+salesrep@ohanafy.com': ['FieldSalesRep'],
};

export async function loadUserPermissions(opts: LoadOptions): Promise<PermissionRecord> {
  if (!opts.useSeedData) {
    throw new Error(
      'live Salesforce permission loader not implemented yet — set EXPO_PUBLIC_USE_SEED_DATA=true (Day 4 deploys ohfy_field__ Permission Sets and switches to live)'
    );
  }

  const email = opts.email.toLowerCase().trim();
  const roles = FIXTURE_USERS[email] ?? [];
  const primaryRole = roles[0] ?? 'FieldSalesRep';

  return {
    userId: email,
    roles,
    primaryRole,
    customPerms: {},
    fetchedAt: Date.now(),
  };
}
