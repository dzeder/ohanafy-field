import type { AppRole, Permission } from './types';

// matrix[role] = set of permissions that role grants.
// Rules: never check role names directly in components — always go through
// hasPermission(). To add a permission, add it to types.ts, add it to one or
// more rows here, then gate the component on it.
export const PERMISSION_MATRIX: Record<AppRole, ReadonlySet<Permission>> = {
  AppAdmin: new Set<Permission>([
    'manage_admin_console',
    'manage_org_config',
    'view_audit_log',
    // App Admin can also act as any functional role
    'view_accounts',
    'edit_accounts',
    'log_visits',
    'create_orders',
    'submit_orders',
    'print_labels',
    'voice_input',
    'view_team_activity',
    'approve_large_orders',
    'view_reports',
    'coach_reps',
    'view_route',
    'confirm_deliveries',
    'capture_signatures',
    'log_delivery_exceptions',
    'manage_routes',
    'assign_drivers',
    'resolve_dispatch_exceptions',
    'view_pick_list',
    'pick_pack_orders',
    'flag_inventory_issues',
    'log_inbound_receiving',
    'manage_inventory',
    'view_warehouse_reports',
    'oversee_warehouse_workers',
  ]),
  FieldSalesRep: new Set<Permission>([
    'view_accounts',
    'edit_accounts',
    'log_visits',
    'create_orders',
    'submit_orders',
    'print_labels',
    'voice_input',
  ]),
  SalesManager: new Set<Permission>([
    'view_accounts',
    'log_visits',
    'view_team_activity',
    'approve_large_orders',
    'view_reports',
    'coach_reps',
  ]),
  Driver: new Set<Permission>([
    'view_route',
    'confirm_deliveries',
    'capture_signatures',
    'log_delivery_exceptions',
    'print_labels',
  ]),
  DriverManager: new Set<Permission>([
    'view_route',
    'manage_routes',
    'assign_drivers',
    'resolve_dispatch_exceptions',
    'view_reports',
  ]),
  WarehouseWorker: new Set<Permission>([
    'view_pick_list',
    'pick_pack_orders',
    'flag_inventory_issues',
    'log_inbound_receiving',
    'print_labels',
  ]),
  WarehouseManager: new Set<Permission>([
    'view_pick_list',
    'manage_inventory',
    'view_warehouse_reports',
    'oversee_warehouse_workers',
    'view_reports',
  ]),
};

export function permissionsForRoles(roles: AppRole[]): ReadonlySet<Permission> {
  const merged = new Set<Permission>();
  for (const role of roles) {
    for (const p of PERMISSION_MATRIX[role]) {
      merged.add(p);
    }
  }
  return merged;
}
