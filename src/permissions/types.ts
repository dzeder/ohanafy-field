// AppRole — one per Salesforce Permission Set in the ohfy_field__ namespace.
// Roles are determined by which Permission Sets the user has assigned.
// AppAdmin is special: grants the Admin Console + the ability to act as any
// functional role (so it implies all six functional roles in the matrix).
export type AppRole =
  | 'AppAdmin'
  | 'FieldSalesRep'
  | 'SalesManager'
  | 'Driver'
  | 'DriverManager'
  | 'WarehouseWorker'
  | 'WarehouseManager';

export const ALL_ROLES: readonly AppRole[] = [
  'AppAdmin',
  'FieldSalesRep',
  'SalesManager',
  'Driver',
  'DriverManager',
  'WarehouseWorker',
  'WarehouseManager',
];

// Permission — fine-grained capability checked by PermissionGate.
// Add a new entry here, then map roles to it in matrix.ts, then gate components on it.
export type Permission =
  // Field Sales Rep core
  | 'view_accounts'
  | 'edit_accounts'
  | 'log_visits'
  | 'create_orders'
  | 'submit_orders'
  | 'print_labels'
  | 'voice_input'
  // Sales Manager
  | 'view_team_activity'
  | 'approve_large_orders'
  | 'view_reports'
  | 'coach_reps'
  // Driver
  | 'view_route'
  | 'confirm_deliveries'
  | 'capture_signatures'
  | 'log_delivery_exceptions'
  // Driver Manager
  | 'manage_routes'
  | 'assign_drivers'
  | 'resolve_dispatch_exceptions'
  // Warehouse Worker
  | 'view_pick_list'
  | 'pick_pack_orders'
  | 'flag_inventory_issues'
  | 'log_inbound_receiving'
  // Warehouse Manager
  | 'manage_inventory'
  | 'view_warehouse_reports'
  | 'oversee_warehouse_workers'
  // App Admin
  | 'manage_admin_console'
  | 'manage_org_config'
  | 'view_audit_log';

export interface PermissionRecord {
  userId: string;
  roles: AppRole[];
  primaryRole: AppRole;
  customPerms: Partial<Record<Permission, boolean>>;
  fetchedAt: number;
}
