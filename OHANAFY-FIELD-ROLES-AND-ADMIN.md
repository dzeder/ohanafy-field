# Ohanafy Field — Roles, Permissions & Admin Console
## Specification v1.0

> **The core principle:** Ohanafy Field contains zero permission logic of its own. Every access decision derives from the user's Salesforce Permission Sets, read at login and cached in SecureStore. Org admins manage access through Salesforce Setup — the tool they already know. The app renders a completely different experience based on who is logged in.
>
> **What this doc covers:** The six user roles, how they map to Salesforce Permission Sets, the complete permission matrix, the role-driven navigation system, and the full Admin Console specification for the Salesforce org admin who configures the app for their team.

---

## Table of Contents

- [§1 — The Six Roles](#1--the-six-roles)
- [§2 — Salesforce Permission Set Architecture](#2--salesforce-permission-set-architecture)
- [§3 — Permission Matrix](#3--permission-matrix)
- [§4 — Role-Driven Navigation](#4--role-driven-navigation)
- [§5 — Role Experiences (UX Specs)](#5--role-experiences-ux-specs)
- [§6 — Permission Runtime Implementation](#6--permission-runtime-implementation)
- [§7 — Admin Console Specification](#7--admin-console-specification)
- [§8 — Admin Console Screens](#8--admin-console-screens)
- [§9 — Provisioning Flow (New Customer)](#9--provisioning-flow-new-customer)
- [§10 — Permission Change Propagation](#10--permission-change-propagation)
- [§11 — Data Scope per Role](#11--data-scope-per-role)
- [§12 — Implementation Guide for Claude Code](#12--implementation-guide-for-claude-code)
- [Appendix A — Permission Set Definitions](#appendix-a--permission-set-definitions)
- [Appendix B — Role Detection Logic](#appendix-b--role-detection-logic)
- [Appendix C — Navigation Config per Role](#appendix-c--navigation-config-per-role)

---

## §1 — The Six Roles

Six distinct personas use Ohanafy Field. Each has a fundamentally different job, different data needs, different physical context, and different actions they are authorized to take. They are not variations of the same screen — they are different products that happen to share infrastructure.

### Role 1: Field Sales Rep
**Job:** Drive a territory, visit retail accounts (bars, stores, restaurants), place orders, log visits, print shelf talkers, hit volume targets.

**Physical context:** In a car, walking a store floor, standing in a bar back-of-house. Frequently no signal. One hand free at most. Time pressure at every stop.

**Core actions:** View account list and detail, place orders (voice or tap), log visit notes (voice or tap), print ZPL labels, see AI pre-call briefing.

**What they never do:** Approve other reps' orders, see other reps' accounts, view warehouse inventory levels, manage routes, see P&L.

**Existing spec:** Fully covered in the Product Bible. This role is Jake Thornton.

---

### Role 2: Sales Manager
**Job:** Lead a team of 5–15 field sales reps. Responsible for territory performance, coaching, large-order approvals, and coverage of key accounts.

**Physical context:** Mix of office (Salesforce desktop) and field (riding with reps, visiting top accounts independently). Has reliable connectivity most of the time.

**Core actions:** View real-time team activity feed, see coverage gaps (accounts not visited in N days), approve or reject orders above threshold, leave coaching notes on rep visits, compare rep performance, view team's AI insights.

**What they never do:** Place orders themselves (unless they also carry a territory), operate warehouse systems, dispatch drivers.

---

### Role 3: Driver
**Job:** Execute deliveries from the warehouse to retail accounts. Not a salesperson — focused on accurate delivery, receipt confirmation, and physical execution.

**Physical context:** In a delivery truck, often in warehouse loading docks and retail receiving areas. Has a tablet or ruggedized phone mounted in the cab. Route is pre-built — they execute it, they don't plan it.

**Core actions:** View today's delivery route (pre-loaded), confirm delivery at each stop (items, quantities, photos), capture signature or PIN confirmation, print delivery receipts (ZPL), log delivery exceptions (refused, short-shipped, damaged), navigate to next stop.

**What they never do:** Place new orders, see account financial history, modify their own route, see other drivers' routes, access AI selling intelligence.

**Critical difference from Sales Rep:** Drivers never need selling intelligence. They need logistics execution. The AI layer for a driver is "what do I have on my truck for this stop" — not "what should I pitch."

---

### Role 4: Driver Manager (Dispatch)
**Job:** Build delivery routes, assign drivers, monitor delivery progress throughout the day, handle exceptions (late deliveries, missed stops, damaged goods), manage the fleet.

**Physical context:** Primarily desktop (Salesforce + dispatch tools), but needs mobile visibility during the day.

**Core actions:** View all drivers' real-time progress on a map, see exception alerts (missed delivery window, damaged item report), reassign stops between drivers, communicate with drivers via in-app message, approve delivery exception resolutions, view end-of-day delivery performance summary.

**What they never do:** Place orders, access sales intelligence, manage sales rep activity.

---

### Role 5: Warehouse Worker
**Job:** Pick and pack orders, stage items for delivery, manage physical inventory movement, receive incoming supplier loads.

**Physical context:** Warehouse floor. Often using a mounted tablet on a forklift or a ruggedized handheld scanner. Loud environment. Gloves on. Voice is important.

**Core actions:** View pick list for today's orders (sorted by warehouse location for efficient picking), confirm item picked (scan barcode or tap), flag out-of-stock or damaged items, view inbound load manifest, confirm receipt of supplier delivery, print warehouse labels (different ZPL format — bin labels, load labels, damage tags).

**What they never do:** See account financial details, access selling intelligence, view driver routes, approve orders.

---

### Role 6: Warehouse Manager
**Job:** Oversee all warehouse operations — inventory accuracy, pick/pack throughput, inbound receiving, supplier compliance, labor management.

**Physical context:** Warehouse office + floor walkarounds. Mix of desktop and mobile.

**Core actions:** View real-time inventory levels and DOH (days-on-hand) by SKU, see pick productivity by worker, view exception queue (OOS items blocking orders, damaged goods, supplier short-ships), approve inventory adjustments, view inbound load schedule, generate end-of-day inventory reconciliation, manage warehouse worker assignments.

**What they never do:** Access sales account details, approve sales orders, manage driver routes.

---

## §2 — Salesforce Permission Set Architecture

### The model

Ohanafy Field ships six Salesforce Permission Sets as part of its managed package. Org admins assign these to users exactly as they would any other Salesforce permission. The app reads the user's assigned permission sets at login and derives their role.

```
Salesforce User
    └── Assigned Permission Sets (many-to-many)
            ├── ohfy_field__Sales_Rep
            ├── ohfy_field__Sales_Manager
            ├── ohfy_field__Driver
            ├── ohfy_field__Driver_Manager
            ├── ohfy_field__Warehouse_Worker
            └── ohfy_field__Warehouse_Manager
```

### Why Permission Sets, not Profiles

Salesforce best practice for ISV packages is Permission Sets, not Profiles. Reasons:
- Orgs already have their own Profiles; a managed package can't own them
- Permission Sets are additive — users can have multiple
- Permission Sets can be assigned without changing the user's org-wide Profile
- The app can detect multiple sets (a sales manager who also carries a territory gets both `Sales_Rep` and `Sales_Manager`)

### Multi-role users

Some users legitimately hold two roles. The app handles this as follows:

| Combination | App behavior |
|---|---|
| `Sales_Rep` + `Sales_Manager` | Shows manager dashboard as default tab; rep features available via role switcher |
| `Driver` + `Driver_Manager` | Shows manager view; driver execution available via role switcher |
| `Sales_Manager` + `Warehouse_Manager` | Operations overview screen combining both feeds |
| Any + `Warehouse_Manager` | Warehouse Manager always gets a tab regardless of other roles |
| Three or more roles | Treated as Operations Admin — sees a combined dashboard with access to all permitted features |

A **role switcher** in the app header (a small persona icon) lets multi-role users switch contexts without logging out. The switch is instant — it changes the navigation config and re-scopes all WatermelonDB queries. It does not require a new API call.

### Permission Set Groups (for easy admin assignment)

Ship three Permission Set Groups for common configurations:

| Group | Includes | For |
|---|---|---|
| `ohfy_field__Field_Team` | `Sales_Rep` | Standard rep user |
| `ohfy_field__Sales_Leadership` | `Sales_Rep` + `Sales_Manager` | Territory-carrying sales manager |
| `ohfy_field__Warehouse_Team` | `Warehouse_Worker` | Standard warehouse employee |

---

## §3 — Permission Matrix

The full permission matrix across all six roles. `✓` = permitted, `–` = not permitted, `R` = read-only.

### Account & Customer Data

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| View own territory accounts | ✓ | ✓ | – | – | – | – |
| View all territory accounts (their team's) | – | ✓ | – | – | – | – |
| View account financial history | ✓ | ✓ | – | – | – | – |
| View account contact details | ✓ | ✓ | R | – | – | – |
| Edit account notes | ✓ | ✓ | – | – | – | – |
| Log account visit | ✓ | ✓ | – | – | – | – |
| View AI pre-call briefing | ✓ | ✓ | – | – | – | – |

### Orders

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| Create order | ✓ | ✓ | – | – | – | – |
| Edit own draft order | ✓ | ✓ | – | – | – | – |
| Submit order | ✓ | – | – | – | – | – |
| Approve order (under threshold) | – | ✓ | – | – | – | – |
| Approve order (over threshold) | – | ✓* | – | – | – | – |
| View own orders | ✓ | ✓ | – | – | – | – |
| View team orders | – | ✓ | – | – | – | – |
| View orders assigned to driver | – | – | R | R | – | – |
| Confirm delivery of order | – | – | ✓ | – | – | – |
| Log delivery exception | – | – | ✓ | ✓ | – | – |
| Approve delivery exception | – | – | – | ✓ | – | – |

*`Sales_Manager` approval of over-threshold orders requires a separate `ohfy_field__Approve_Large_Orders` permission (custom permission, not a full permission set — assigned as a checkbox within the Sales Manager set). Threshold is configurable in the Admin Console.

### Visits & Activity

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| Log visit (own) | ✓ | ✓ | – | – | – | – |
| View visit history (own accounts) | ✓ | ✓ | – | – | – | – |
| View visit history (all team) | – | ✓ | – | – | – | – |
| Add coaching note to rep visit | – | ✓ | – | – | – | – |
| View coaching notes on own visits | ✓ | ✓ | – | – | – | – |

### Routes & Delivery

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| View own delivery route | – | – | ✓ | ✓ | – | – |
| View all driver routes | – | – | – | ✓ | – | – |
| Navigate to delivery stop | – | – | ✓ | – | – | – |
| Mark stop complete | – | – | ✓ | – | – | – |
| Reassign delivery stop | – | – | – | ✓ | – | – |
| View driver real-time location | – | – | – | ✓ | – | – |

### Inventory & Warehouse

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| View product availability (simple Y/N) | ✓ | ✓ | R | – | ✓ | ✓ |
| View full inventory levels + DOH | – | – | – | – | R | ✓ |
| View pick list | – | – | – | – | ✓ | ✓ |
| Confirm item picked | – | – | – | – | ✓ | – |
| Flag OOS / damaged | – | – | ✓ | – | ✓ | ✓ |
| Approve inventory adjustment | – | – | – | – | – | ✓ |
| View inbound load manifest | – | – | – | – | ✓ | ✓ |
| Confirm inbound receipt | – | – | – | – | ✓ | ✓ |
| View warehouse worker productivity | – | – | – | – | – | ✓ |

### ZPL Labels

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| Print shelf talker | ✓ | ✓ | – | – | – | – |
| Print product feature card | ✓ | ✓ | – | – | – | – |
| Print delivery receipt | ✓ | – | ✓ | – | – | – |
| Print driver route sheet | – | – | ✓ | ✓ | – | – |
| Print bin label (warehouse) | – | – | – | – | ✓ | ✓ |
| Print damage tag | – | – | ✓ | – | ✓ | ✓ |
| Print inbound load label | – | – | – | – | ✓ | ✓ |

### AI Features

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| AI pre-call briefing | ✓ | ✓ | – | – | – | – |
| AI voice order entry | ✓ | ✓ | – | – | – | – |
| AI voice note dictation | ✓ | ✓ | – | – | – | – |
| AI selling suggestions | ✓ | ✓ | – | – | – | – |
| AI delivery confirmation (voice) | – | – | ✓ | – | – | – |
| AI pick assist (voice pick confirmation) | – | – | – | – | ✓ | – |
| AI team performance summary | – | ✓ | – | ✓ | – | ✓ |
| View own AI memories | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Edit own AI memories | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| View team AI memories | – | ✓ | – | ✓ | – | ✓ |

### App Settings & Admin

| Permission | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| Pair Zebra printer | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Configure notification preferences | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Access Admin Console | – | – | – | – | – | – |
| Manage product catalog | – | – | – | – | – | – |
| Manage user roles | – | – | – | – | – | – |

*The Admin Console requires a separate `ohfy_field__App_Admin` custom permission (typically given to Salesforce System Admins). It is not available to any of the six operational roles.

---

## §4 — Role-Driven Navigation

The tab bar and navigation structure change completely based on role. The app is a single codebase — `_layout.tsx` reads the user's role from the permission store and renders the appropriate navigation tree.

### Sales Rep navigation
```
Tabs: [Accounts] [Route] [Orders] [Settings]
Deep: Account Detail → Order Entry → Visit Log → Label Print
```

### Sales Manager navigation
```
Tabs: [Team] [Accounts] [Approvals] [Reports] [Settings]
  Team: Rep activity feed, coverage map, rep list
  Accounts: Same as rep (for accounts they own or oversee)
  Approvals: Orders pending approval
  Reports: Territory performance, visit cadence, order trends
```

### Driver navigation
```
Tabs: [Route] [Deliveries] [Settings]
  Route: Today's stops in order, map view, nav
  Deliveries: Delivery confirmation, exceptions, receipt print
```

### Driver Manager navigation
```
Tabs: [Dispatch] [Routes] [Exceptions] [Reports] [Settings]
  Dispatch: All drivers on a map, real-time progress
  Routes: Build/edit routes, assign drivers
  Exceptions: All delivery exceptions across team
  Reports: Delivery performance, driver productivity
```

### Warehouse Worker navigation
```
Tabs: [Pick List] [Inbound] [Inventory] [Settings]
  Pick List: Today's orders to pick, sorted by warehouse location
  Inbound: Today's supplier loads to receive
  Inventory: Spot inventory check, flag discrepancies
```

### Warehouse Manager navigation
```
Tabs: [Operations] [Inventory] [Workers] [Reports] [Settings]
  Operations: Live view of pick progress, exceptions queue
  Inventory: Full inventory, DOH, adjustments
  Workers: Worker assignments, productivity by picker
  Reports: Throughput, accuracy, supplier compliance
```

### Multi-role (role switcher)

When a user has two or more roles, the tab bar shows a **role switcher** as the leftmost icon — a persona silhouette with the current role's initials. Tapping it opens a sheet with all available roles. Switching is instant.

```typescript
// src/store/role-store.ts
interface RoleStore {
  availableRoles: AppRole[];          // all roles this user has
  activeRole: AppRole;                // currently selected role
  permissions: PermissionSet;         // derived from activeRole
  switchRole: (role: AppRole) => void;
}
```

---

## §5 — Role Experiences (UX Specs)

### 5.1 Driver — key differences from Sales Rep

The Driver experience is built around **logistics execution**, not selling. Key differences:

**Route screen (primary screen):** A vertically scrolling list of delivery stops in sequence order. Each stop shows: account name, address, order summary (cases/kegs to deliver), delivery window, and status (pending / in progress / complete / exception). A map tab shows all stops pinned with status colors.

**Stop detail:** Tapping a stop shows the delivery manifest — every item, every quantity. Below the manifest: a "Navigate" button (opens Apple Maps / Google Maps with the address), a "Start Delivery" button, and a "Report Issue" button.

**Delivery confirmation flow:**
1. Tap "Start Delivery" → Start timestamp logged
2. For each item: tap to confirm quantity (or edit if short-ship)
3. Tap "Complete" → Capture signature screen (finger-draw) OR "No signature required" toggle
4. Optional: take a photo of the delivery
5. Print delivery receipt (ZPL) — auto-prompted
6. Tap "Confirm Delivery" → Stop marked complete, sync queued

**Exception flow:** "Report Issue" → select issue type (refused delivery / damaged goods / wrong address / access denied / customer not present) → voice or text note → optional photo → submit. Exception goes to Driver Manager's queue immediately on sync.

**AI for drivers:** Limited. Voice confirm: "Confirmed 2 kegs Bud Light and 3 cases Modelo" → AI parses quantities and matches to manifest, shows confirmation. No selling intelligence — Jake's AI briefings never appear in the Driver experience.

**ZPL for drivers:** Delivery receipt and damage tag only. Shelf talkers are hidden.

### 5.2 Warehouse Worker — key differences

The Warehouse Worker experience is built around **physical task execution** in a noisy, hands-busy environment.

**Pick list screen (primary screen):** Orders for today, grouped by warehouse zone/aisle for efficient picking. Each order line shows: product name, quantity, bin location (e.g., "Zone A, Row 3, Bin 7"), and a large checkmark button to confirm. The list is sorted to minimize travel distance — not by account or order number.

**Voice pick:** Worker says "Picked" or taps the mic and says "confirm pale ale, 2 cases, zone A" → AI confirms match to pick list. Reduces mis-picks.

**OOS flag:** If an item isn't there, tap "Flag OOS" → triggers an alert to Warehouse Manager and blocks that order line until resolved.

**Inbound receiving:** Supplier load arrives → Worker scans or selects the load → steps through each item on the manifest → confirms quantities → flags any discrepancies → submits. System updates inventory automatically.

**ZPL for warehouse:** Bin labels, damage tags, inbound load labels. No delivery receipts or shelf talkers.

### 5.3 Sales Manager — team visibility

The Team screen is the Sales Manager's primary screen. It shows:

**Coverage map:** A map of the territory with every account pinned. Color coding:
- Green: visited in the last 7 days
- Yellow: visited 8–21 days ago
- Red: not visited in 21+ days (needs attention)
- Grey: no rep assigned

**Rep activity feed:** Chronological list of recent activities across all reps — visits logged, orders placed, labels printed, AI insights surfaced. Shows rep name and time. Tapping opens the full record.

**Approvals queue:** Orders over the threshold dollar amount appear here pending manager approval. Shows: rep name, account, order summary, total, time submitted. Approve / Reject / Request Changes with one tap. Rejection requires a reason (shown to rep as a push notification).

**Coaching:** On any visit record, manager can tap "Add Coaching Note" → writes a private note attached to that visit. The rep sees the note the next time they view that visit. Coaching notes are never visible to other reps.

---

## §6 — Permission Runtime Implementation

### 6.1 Auth flow with permission detection

```typescript
// src/auth/sf-oauth.ts — after token exchange

export async function loadUserPermissions(
  accessToken: string,
  instanceUrl: string
): Promise<UserPermissions> {
  // 1. Get the user's ID from /services/oauth2/userinfo
  const userInfo = await sfFetch(accessToken, instanceUrl,
    '/services/oauth2/userinfo');

  // 2. Query assigned Permission Sets via SOQL
  // PermissionSetAssignment is queryable without special perms
  const query = encodeURIComponent(`
    SELECT PermissionSet.Name, PermissionSet.Label
    FROM PermissionSetAssignment
    WHERE AssigneeId = '${userInfo.user_id}'
    AND PermissionSet.NamespacePrefix = 'ohfy_field'
  `);

  const psResult = await sfFetch(accessToken, instanceUrl,
    `/services/data/v59.0/query?q=${query}`);

  // 3. Also check Custom Permissions for fine-grained flags
  const cpQuery = encodeURIComponent(`
    SELECT SetupEntityId, SetupEntityType
    FROM SetupEntityAccess
    WHERE Parent.Id IN (
      SELECT PermissionSetId FROM PermissionSetAssignment
      WHERE AssigneeId = '${userInfo.user_id}'
    )
    AND SetupEntityType = 'CustomPermission'
  `);

  const cpResult = await sfFetch(accessToken, instanceUrl,
    `/services/data/v59.0/query?q=${cpQuery}`);

  // 4. Derive roles and permissions
  const assignedSets = psResult.records.map(r => r.PermissionSet.Name);
  const customPerms = cpResult.records.map(r => r.SetupEntityId);

  return derivePermissions(assignedSets, customPerms, userInfo);
}

function derivePermissions(
  permSetNames: string[],
  customPerms: string[],
  userInfo: SFUserInfo
): UserPermissions {
  const roles: AppRole[] = [];

  if (permSetNames.includes('ohfy_field__Sales_Rep'))        roles.push('sales_rep');
  if (permSetNames.includes('ohfy_field__Sales_Manager'))    roles.push('sales_manager');
  if (permSetNames.includes('ohfy_field__Driver'))           roles.push('driver');
  if (permSetNames.includes('ohfy_field__Driver_Manager'))   roles.push('driver_manager');
  if (permSetNames.includes('ohfy_field__Warehouse_Worker')) roles.push('warehouse_worker');
  if (permSetNames.includes('ohfy_field__Warehouse_Manager'))roles.push('warehouse_manager');
  if (permSetNames.includes('ohfy_field__App_Admin'))        roles.push('app_admin');

  if (roles.length === 0) {
    throw new PermissionError(
      'no_role_assigned',
      'Your Salesforce user has no Ohanafy Field role assigned. ' +
      'Contact your system administrator.'
    );
  }

  return {
    userId: userInfo.user_id,
    userName: userInfo.name,
    userEmail: userInfo.email,
    roles,
    primaryRole: determinePrimaryRole(roles),
    customPermissions: {
      canApproveLargeOrders: customPerms.includes('ohfy_field__Approve_Large_Orders'),
      canViewAllTerritories: customPerms.includes('ohfy_field__View_All_Territories'),
      canManageRoutes: customPerms.includes('ohfy_field__Manage_Routes'),
    },
    permSetNames,
  };
}

// Primary role determines the default tab set shown on login
function determinePrimaryRole(roles: AppRole[]): AppRole {
  const priority: AppRole[] = [
    'app_admin',
    'warehouse_manager',
    'driver_manager',
    'sales_manager',
    'warehouse_worker',
    'driver',
    'sales_rep',
  ];
  return priority.find(r => roles.includes(r)) ?? roles[0];
}
```

### 6.2 Permission store (Zustand)

```typescript
// src/store/permission-store.ts
import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface PermissionStore {
  permissions: UserPermissions | null;
  activeRole: AppRole | null;
  isLoading: boolean;

  loadPermissions: (accessToken: string, instanceUrl: string) => Promise<void>;
  switchRole: (role: AppRole) => void;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: AppRole) => boolean;
  clear: () => void;
}

export const usePermissionStore = create<PermissionStore>((set, get) => ({
  permissions: null,
  activeRole: null,
  isLoading: false,

  loadPermissions: async (accessToken, instanceUrl) => {
    set({ isLoading: true });
    try {
      const perms = await loadUserPermissions(accessToken, instanceUrl);
      await SecureStore.setItemAsync('user_permissions', JSON.stringify(perms));
      await SecureStore.setItemAsync('user_active_role', perms.primaryRole);
      set({ permissions: perms, activeRole: perms.primaryRole, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  switchRole: (role) => {
    const { permissions } = get();
    if (!permissions?.roles.includes(role)) return;
    SecureStore.setItemAsync('user_active_role', role);
    set({ activeRole: role });
  },

  hasPermission: (permission) => {
    const { activeRole, permissions } = get();
    if (!activeRole || !permissions) return false;
    return PERMISSION_MATRIX[activeRole][permission] === true;
  },

  hasRole: (role) => {
    return get().permissions?.roles.includes(role) ?? false;
  },

  clear: () => {
    SecureStore.deleteItemAsync('user_permissions');
    SecureStore.deleteItemAsync('user_active_role');
    set({ permissions: null, activeRole: null });
  },
}));
```

### 6.3 Permission-aware components

```typescript
// src/components/shared/PermissionGate.tsx
interface PermissionGateProps {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function PermissionGate({ permission, children, fallback }: PermissionGateProps) {
  const hasPermission = usePermissionStore(s => s.hasPermission);
  if (!hasPermission(permission)) {
    return <>{fallback ?? null}</>;
  }
  return <>{children}</>;
}

// Usage:
<PermissionGate permission="can_approve_orders">
  <ApproveButton onApprove={handleApprove} />
</PermissionGate>

<PermissionGate
  permission="can_view_team_activity"
  fallback={<Text>You don't have access to team activity.</Text>}
>
  <TeamActivityFeed />
</PermissionGate>
```

### 6.4 Stale permission refresh

Permissions are re-fetched from Salesforce every 4 hours (configurable) and on every app foreground. If Salesforce revokes a permission set while the user has the app open, the change takes effect on the next foreground or sync cycle — not instantly. This is the correct trade-off: constant re-checking would drain battery and add latency to every operation.

```typescript
// src/auth/permission-refresh.ts
const PERMISSION_REFRESH_INTERVAL_MS = 4 * 60 * 60 * 1000; // 4 hours

export async function refreshPermissionsIfStale(): Promise<void> {
  const lastRefresh = await SecureStore.getItemAsync('permissions_last_refresh');
  const lastRefreshMs = lastRefresh ? parseInt(lastRefresh) : 0;

  if (Date.now() - lastRefreshMs < PERMISSION_REFRESH_INTERVAL_MS) {
    return; // still fresh
  }

  const { loadPermissions } = usePermissionStore.getState();
  const accessToken = await SecureStore.getItemAsync('sf_access_token');
  const instanceUrl = await SecureStore.getItemAsync('sf_instance_url');

  if (accessToken && instanceUrl) {
    await loadPermissions(accessToken, instanceUrl);
    await SecureStore.setItemAsync('permissions_last_refresh', String(Date.now()));
  }
}
```

### 6.5 No-permission screen

When a user logs in with no ohfy_field__ Permission Sets assigned:

```
Screen: "Account not set up"

[Icon: lock]

Heading: You don't have access to Ohanafy Field yet.

Body: Your Salesforce administrator needs to assign you a role
in Ohanafy Field before you can use the app.

Tell your admin to go to:
Salesforce Setup → Permission Sets → search "Ohanafy Field" →
assign the right role to your user.

[Contact your admin →]   (opens mailto: to the org admin email)
[Try again]              (re-fetches permissions)
```

---

## §7 — Admin Console Specification

### 7.1 What the Admin Console is

The Admin Console is a **Salesforce-native Lightning app** installed as part of the Ohanafy Field managed package. It is not a separate web app. It lives in Salesforce Lightning under the "Ohanafy Field Admin" Lightning app, accessible only to users with the `ohfy_field__App_Admin` custom permission.

It is not accessible from the mobile app. This is intentional — configuration is a desktop task that an admin does once per setup, not something a rep or manager needs on their phone.

### 7.2 Why Salesforce-native (Lightning app), not a separate web app

- Org admins already live in Salesforce — meeting them there reduces adoption friction
- Salesforce handles authentication, permissions, and audit logging for free
- Lightning components can directly query and mutate Salesforce objects
- Org admins are comfortable with Salesforce UI conventions (page layouts, lists, related lists)
- Avoids a separate hosted web service, separate auth, and separate deployment

### 7.3 Admin Console Lightning app tabs

```
Ohanafy Field Admin app
├── Dashboard        — Health overview, active users, sync stats
├── Users & Roles    — Who has what role; bulk assignment
├── App Settings     — Global configuration (thresholds, sync intervals, features)
├── Product Catalog  — Which SF products sync to the app; field mappings
├── ZPL Templates    — Manage label templates; upload custom templates
├── Territories      — Rep ↔ account mapping configuration
├── Notifications    — Notification rules and delivery settings
├── AI Configuration — AI feature settings; memory review; system prompts
├── Sync Monitor     — Real-time sync queue health; failed item resolution
└── Audit Log        — Every admin action, immutable
```

---

## §8 — Admin Console Screens

### 8.1 Dashboard

The first screen admins see. Designed to answer "is everything working?" at a glance.

**Widgets:**
- Active users today (count, with sparkline of last 7 days)
- Sync queue health: total pending / processing / failed items across all users
- Last sync error (most recent failed item with short reason)
- App version distribution (what % of users are on the current build)
- Permission coverage: how many users have each role (sanity check for mis-assignments)
- AI usage today: voice commands, insights surfaced, feedback given

**Alert banners (at top, only shown if condition is true):**
- "12 sync items have failed 3+ times. Review →" (links to Sync Monitor)
- "3 users have no role assigned" (links to Users & Roles)
- "App v1.0.3 available — 8 users still on v1.0.1" (links to App Settings)

### 8.2 Users & Roles

A list of all Salesforce users in the org who have at least one ohfy_field__ permission set. Columns: Name, Email, Roles (badge list), Last Active (in app), Sync Status (green/yellow/red).

**Bulk assign:** Multi-select users → "Assign Role" → pick from the six roles → confirm. Creates Permission Set Assignments in Salesforce via Apex. Includes an undo within 60 seconds.

**Single user view:** Click a user → see their full profile: all roles, last login, last sync, sync queue depth, AI memory count, recent activity (last 5 actions from the app), and a "Send Test Notification" button (useful for verifying push notification setup).

**Unassigned users tab:** Shows Salesforce users who are active and have the Ohanafy Field Connected App in their profile but no ohfy_field__ Permission Sets. These users will see the "Account not set up" screen. Admins can bulk-assign directly from this view.

### 8.3 App Settings

Global settings that affect all users. Changes take effect on next app foreground (via permission refresh cycle).

**Order approvals:**
- Order approval threshold: `$____` (orders above this require Sales Manager approval)
- Auto-approve timeout: if a manager hasn't acted within `__ hours`, auto-approve or auto-escalate
- Approval required on weekends: toggle

**Sync settings:**
- Background sync interval: `15 / 30 / 60 / 120 minutes`
- Sync on WiFi only: toggle (useful for cellular data-conscious customers)
- Full resync schedule: `daily / weekly / manual` (wipes local DB and re-pulls from SF)
- Max offline queue depth before warning rep: `__ items`

**Feature flags (per-org on/off):**
| Feature | Toggle | Notes |
|---|---|---|
| AI pre-call briefing | ✓/– | Requires Anthropic API key configured |
| Voice commands | ✓/– | Can disable for noise compliance in some facilities |
| ZPL printing | ✓/– | Disable if no Zebra hardware deployed |
| AI memories | ✓/– | Some orgs prefer stateless AI |
| Push notifications | ✓/– | Requires APNs/FCM config complete |
| Manager approval flow | ✓/– | Disable for orgs with flat authority structures |
| Delivery confirmation photos | ✓/– | Some orgs have privacy policies against photos |

**AI configuration:**
- Anthropic API key: `[encrypted input — shows last 4 chars of key]`
- AI model: `claude-sonnet-4-20250514` (locked; updated by Ohanafy on package update)
- Insight refresh frequency: how often visit prep insights are recalculated

**Connected App settings:**
- Client ID: `[read-only — set during installation]`
- Redirect URI: `[read-only]`
- Test connectivity: button that fires a test OAuth flow and reports success/failure

### 8.4 Product Catalog

Controls which Salesforce Product records are synced to the app and how they're presented.

**Catalog source:** `ohfy__Product__c` (default) or any custom object with a SOQL-accessible list of products. Admins can write a custom SOQL filter to limit which products appear (e.g., only active products in the rep's assigned pricebook).

**Field mappings:** Map app concepts to Salesforce field API names:

| App concept | Default SF field | Override |
|---|---|---|
| Product name | `Name` | `[text field input]` |
| SKU code | `ProductCode` | `[text field input]` |
| Unit price | `UnitPrice` (from PricebookEntry) | `[text field input]` |
| Product category | `Family` | `[text field input]` |
| Unit of measure | `ohfy__Unit__c` | `[text field input]` |
| Active flag | `IsActive` | `[text field input]` |

**Category display names:** Map the raw Salesforce `Family` picklist values to display names shown in the app:

| Salesforce Family value | App display name |
|---|---|
| `BEER_DRAFT` | `Beer — Kegs` |
| `BEER_PACKAGED` | `Beer — Cases` |
| `ENERGY` | `Energy Drinks` |
| `NA_BEVERAGE` | `Non-Alcoholic` |

**Sync frequency:** Products sync on full resync only (not on every background sync). The catalog changes rarely. Admins can trigger a manual catalog sync from this screen.

### 8.5 ZPL Templates

Manage the label templates available to reps and drivers.

**Built-in templates (read-only, from managed package):**
- Shelf Talker (2.5" × 1.5")
- Product Feature Card (4" × 3")
- Delivery Receipt (4" × 6")
- Driver Route Sheet (4" × 6")
- Warehouse Bin Label (2" × 1")
- Damage Tag (4" × 2")

**Custom templates:** Admins can upload custom ZPL templates. The upload flow:
1. Paste ZPL string into text area
2. Fill in parameter names (placeholders that the app will fill at print time)
3. Select template type (shelf / receipt / warehouse / other)
4. Choose which roles can access this template
5. Enter label dimensions (for Labelary preview)
6. Preview renders via Labelary API — admin sees the label before saving
7. Save — template appears in the app on next sync for authorized roles

**Per-role template visibility:** A matrix lets admins control which template types appear for which roles. Default matches the permission matrix in §3, but can be customized per org.

### 8.6 Territories

Controls which accounts appear in which rep's account list.

**Territory source:** Reads from Salesforce Territory Management (`UserTerritory2Association` for Enterprise Territory Management) if enabled in the org. Falls back to a direct rep ↔ account assignment model if Territory Management is not enabled.

**Manual assignment (fallback mode):**
- Rep list on left
- Account list on right (filterable by existing territory, account type, city)
- Drag-and-drop or checkbox-select to assign accounts to a rep
- Bulk import via CSV: `AccountId, RepUserId`

**Territory sync:** When SF Territory Management is active, the app respects it automatically — no manual assignment needed. Admins can see the territory-to-rep mapping here but can't override Salesforce's native territory rules.

**Orphaned accounts:** Accounts not assigned to any rep appear in an "Unassigned" list. If a rep opens the app and their account list is empty, this is the first place admins should check.

### 8.7 Notifications

Configure when the app sends push notifications to each role.

**Notification rules (per role, all configurable on/off + threshold):**

**Sales Rep:**
- Account not visited in N days → reminder push with account name
- Order approved by manager → confirmation
- Order rejected by manager → push with manager's reason
- Coaching note added to a visit → push to the rep

**Sales Manager:**
- Order submitted above approval threshold → push with rep name + order total
- Team member hasn't logged any visits today by 2pm → nudge
- Account in territory with no visit in 30+ days → escalation alert

**Driver:**
- Route assigned for tomorrow → morning push with stop count
- Delivery window starting in 30 minutes → timing alert
- Exception on a prior stop resolved by manager → confirmation

**Driver Manager:**
- Driver has not confirmed a stop 30 minutes after the delivery window opened
- Delivery exception requires resolution
- All drivers have completed routes → end-of-day summary

**Warehouse Worker:**
- Pick list available for today → morning notification
- OOS flag resolved → confirmation they can continue

**Warehouse Manager:**
- OOS item flagged → immediate push
- Inbound load arriving in 1 hour → advance notice
- Picker productivity below threshold → daily summary

**Technical configuration:**
- APNs certificate or key (iOS) — upload `.p8` file + Key ID + Team ID
- FCM server key (Android) — paste key from Firebase Console
- Test send: select a user, send a test notification, confirm receipt
- Quiet hours: `_:__ PM to _:__ AM` — no notifications outside this window

### 8.8 AI Configuration

**API key management:**
The Anthropic API key is stored encrypted in a custom metadata type (`ohfy_field__AI_Config__mdt`). It is never returned to the client in plaintext. When the mobile app authenticates, it receives a short-lived signed token that is exchanged at the API gateway for the actual key — the key never travels to the device.

```
Mobile app → POST /api/ai/command
           → Salesforce Connected App OAuth validates session
           → Apex callout signs request with stored API key
           → Returns response to mobile app
```

Wait — this changes the architecture from the Product Bible (direct device-to-Anthropic). The tradeoff:

| | Direct (Product Bible) | Via Apex proxy |
|---|---|---|
| Latency | Lower | +100–300ms |
| Key security | Key on device (SecureStore) | Key never leaves SF |
| Offline | Works | Requires network |
| Complexity | Lower | Higher |

**Recommendation for v1.0:** Keep the direct architecture from the Product Bible (key in SecureStore, retrieved at auth time). Log this as a known risk in the security review. Move to Apex proxy architecture in v1.1 before enterprise rollout.

**Memory management (admin view):**
- Per-rep memory count and storage size
- "Clear all memories for user" button (for offboarding or privacy requests)
- Memory audit: filterable list of all memories for a selected user (admin-only read access)
- Global memory retention policy: delete memories older than N days (default: 365)

**System prompt customization:**
Admins can prepend a custom context block to the AI system prompts. Example: "This distributor specializes in craft and import beer. They do not carry domestic macro brands." This context is injected into every AI call for this org, allowing Ohanafy to serve different customer types without code changes.

### 8.9 Sync Monitor

Real-time view of sync queue health across all users.

**Live queue table:** Every pending / processing / failed sync item, across all users:

| Columns | Description |
|---|---|
| User | Which rep/driver/worker |
| Type | CREATE_ORDER / CREATE_VISIT / CONFIRM_DELIVERY / etc. |
| Entity | Brief description (e.g., "Order — The Rail — $320") |
| Status | pending / processing / failed |
| Attempts | 0–3 (failed at 3) |
| Last error | Truncated error message |
| Created | How long ago |
| Actions | Retry / Discard / View detail |

**Retry:** Admin can manually retry a failed item. Resets attempts to 0 and re-queues it.

**Discard:** Admin discards a failed item after reviewing it. The rep gets a push notification: "Your [order/visit] from [time] could not be synced and was discarded. Please re-enter it."

**Detail view:** Full payload JSON for a sync item (admin-only). Useful for diagnosing data mapping issues.

**Bulk actions:** "Retry all failed" / "Discard all failed older than N days" with confirmation.

**Alerts:** If any user's failed item count exceeds 5, an alert banner appears at the top of this screen and on the Dashboard.

### 8.10 Audit Log

Every admin action in the console is logged, immutable, and queryable.

Captured for every action:
- Timestamp
- Admin user name + Salesforce user ID
- Action type (ROLE_ASSIGN / ROLE_REVOKE / SETTING_CHANGE / TEMPLATE_UPLOAD / SYNC_RETRY / MEMORY_CLEAR / etc.)
- Target (which user, which record, which setting)
- Before value / After value (for setting changes)
- IP address

The Audit Log is a read-only Salesforce Custom Object (`ohfy_field__Admin_Audit_Log__c`) with no delete permission even for System Admins. It cannot be cleared — this is intentional for compliance.

Exportable as CSV. Filterable by date range, admin user, and action type.

---

## §9 — Provisioning Flow (New Customer)

When a new Ohanafy customer purchases Ohanafy Field, this is the sequence:

### Step 1: Package installation (Ohanafy ops or customer IT)
- Install Ohanafy Field managed package from AppExchange into the customer's Salesforce org
- Package installs: 6 Permission Sets, 3 Permission Set Groups, all custom objects, the Lightning app, the custom metadata types

### Step 2: Connected App configuration (customer IT or guided by Ohanafy)
- In Salesforce Setup → Connected Apps → Ohanafy Field → configure OAuth settings
- Add the customer org's callback URI: `com.ohanafy.field://oauth/callback`
- Note the Consumer Key (Client ID) — needed in Step 4

### Step 3: Admin Console first run (Ohanafy implementation specialist + customer admin)
- Open the Ohanafy Field Admin Lightning app
- Walk through the first-run setup wizard (15–30 minutes):
  1. Configure product catalog field mappings
  2. Assign roles to users (bulk import or manual)
  3. Configure territories (or confirm Territory Management integration)
  4. Set the order approval threshold
  5. Configure notification settings
  6. Enter Anthropic API key (can be Ohanafy's key with usage tracking, or customer's own)
  7. Send a test notification to confirm APNs/FCM is working

### Step 4: App distribution to users
- Send users the App Store / Play Store link
- Users download and open the app
- They tap "Sign in with Salesforce" → standard OAuth flow using their existing Salesforce credentials
- App reads their permission sets → renders correct experience
- First sync downloads their accounts, products, and history

### Step 5: Verification
- Admin opens Sync Monitor — confirms all first syncs completed successfully
- Admin opens Dashboard — confirms active users count matches deployed users
- Admin spot-checks one rep's account list against what's in Salesforce

---

## §10 — Permission Change Propagation

What happens when a Salesforce admin changes a user's permissions mid-day.

| Change | When it takes effect | How |
|---|---|---|
| New role assigned | Next app foreground + permission refresh (≤ 4 hours) | Permission refresh cycle |
| Role revoked | Next app foreground + permission refresh (≤ 4 hours) | Permission refresh cycle |
| Custom permission added | Next app foreground | Same |
| Immediate revocation needed | Admin taps "Force logout" in Admin Console → User screen | Invalidates SF session; user sees login screen on next API call |

**Force logout:** The Admin Console's user detail screen has a "Force Logout" button that calls a Salesforce API to revoke the user's Connected App access tokens. This is for security incidents (lost device, terminated employee). The user sees the standard "Session expired" screen on their next sync attempt.

**Device loss protocol:**
1. Admin → Users & Roles → find user → Force Logout (invalidates tokens)
2. User's unsynced data is lost — this is unavoidable with a truly offline-first app
3. Admin → Sync Monitor → check for pending items from that user → note any that need manual re-entry
4. If the lost data is critical (large unsynced orders), admin can reconstruct from the rep's last-known state

---

## §11 — Data Scope per Role

WatermelonDB only syncs the data each role actually needs. This reduces sync time, storage, and the surface area of data that could be exposed if a device is lost.

| Data type | Sales Rep | Sales Manager | Driver | Driver Mgr | WH Worker | WH Manager |
|---|---|---|---|---|---|---|
| Accounts | Own territory | Full team territory | Delivery stops only | All | – | – |
| Account financial history | Own accounts | Full team | – | – | – | – |
| Products | Full catalog | Full catalog | Route manifest only | – | Active SKUs | Full catalog + inventory |
| Orders | Own orders | All team orders | Today's delivery orders | All delivery orders | Today's pick orders | All orders |
| Visits | Own visits | All team visits | – | – | – | – |
| Inventory levels | Product available Y/N | Product available Y/N | – | – | Full detail | Full detail |
| Routes | – | – | Own route | All routes | – | – |
| Pick lists | – | – | – | – | Own list | All lists |
| AI memories | Own | Own + can read team | Own | Own + can read team | Own | Own + can read team |

**Implementation note:** The sync engine reads the user's active role from the permission store and applies a `syncScope` filter before every pull from Salesforce. A driver does not have `ohfy__Account__c` financial history in their WatermelonDB — it was never synced. This is not a UI-level permission gate; it is a data-level control.

---

## §12 — Implementation Guide for Claude Code

### Day 1 additions (from the Product Bible)

Add to the Day 1 targets in the Product Bible:

- [ ] `loadUserPermissions()` implemented and tested with fixture permission sets
- [ ] `usePermissionStore` Zustand store created
- [ ] `PermissionGate` component renders and hides correctly based on role
- [ ] No-permission screen implemented
- [ ] Role switcher renders for a user with two roles

### New WatermelonDB tables needed

Add to the schema in §5 of the Product Bible:

```typescript
tableSchema({
  name: 'permissions',
  columns: [
    { name: 'user_id', type: 'string' },
    { name: 'roles_json', type: 'string' },        // JSON array of AppRole
    { name: 'primary_role', type: 'string' },
    { name: 'custom_perms_json', type: 'string' }, // JSON object
    { name: 'fetched_at', type: 'number' },        // for stale check
  ],
}),
```

### New Salesforce objects needed

Add to the SFDX package in §E of the Product Bible:

- `ohfy_field__Admin_Config__mdt` — custom metadata for org-wide settings
- `ohfy_field__Admin_Audit_Log__c` — immutable audit trail
- `ohfy_field__ZPL_Template__c` — custom ZPL templates per org
- `ohfy_field__Territory_Assignment__c` — manual rep ↔ account mapping (fallback)
- `ohfy_field__Notification_Rule__c` — configurable notification rules
- `ohfy_field__AI_Config__mdt` — encrypted AI settings (API key, prompt customizations)

### New Maestro E2E flows needed

Add to the test suite in §12 of the Product Bible:

- `role-detection.yaml` — login with each of the 6 roles; verify correct tab set renders
- `permission-gate.yaml` — login as Sales Rep; verify manager-only features are absent
- `role-switch.yaml` — login as Sales Rep + Sales Manager; switch roles; verify nav changes
- `no-permission.yaml` — login with no ohfy_field__ Permission Sets; verify no-permission screen
- `admin-console.yaml` — login as App Admin; verify Admin Console Lightning app loads

### CLAUDE.md additions

Add to `CLAUDE.md` (§10 of the Harness):

```markdown
## Role system
Every screen checks `usePermissionStore().hasPermission(permission)` before rendering
restricted features. Never check role names directly in components — always use
the permission abstraction. Permission matrix lives in `src/permissions/matrix.ts`.

Roles are read from Salesforce Permission Sets at auth time. Never hardcode
role logic. If a new permission is needed, add it to:
1. The Permission Set in the SFDX package
2. `src/permissions/types.ts` (the Permission enum)
3. `src/permissions/matrix.ts` (which roles get it)
4. Any component that needs to gate on it

Available agents for permission work:
- `salesforce-integration` for Permission Set Apex and SOQL
- `rn-architect` for PermissionGate component and navigation routing
```

---

## Appendix A — Permission Set Definitions

These six Permission Sets ship with the managed package. Each grants the minimum object and field permissions needed for that role. They intentionally do NOT grant permissions on any non-`ohfy_field__` objects — existing Salesforce permissions handle those.

### `ohfy_field__Sales_Rep`

**Object permissions:**
- `ohfy_field__Visit__c`: Create, Read, Edit (own)
- `ohfy_field__Order__c`: Create, Read, Edit (own draft only)
- `ohfy_field__OrderLine__c`: Create, Read, Edit, Delete (own orders only)
- `ohfy_field__LabelPrint__c`: Create, Read (own)
- `ohfy_field__RepMemory__c`: Read, Edit (own)
- `ohfy_field__SyncLog__c`: Create (own)

**Custom permissions:** None by default

**Read access on Ohanafy core objects (no edit):**
- `ohfy__Account__c` — account details for assigned territory
- `ohfy__Product__c` — product catalog
- `ohfy__Order__c` — prior order history for assigned accounts

### `ohfy_field__Sales_Manager`

All permissions from `ohfy_field__Sales_Rep`, plus:

**Object permissions:**
- `ohfy_field__Visit__c`: Read all (team), Edit (coaching note field only on others' records)
- `ohfy_field__Order__c`: Read all (team), Edit (`Status__c` field for approval actions)

**Custom permissions:**
- `ohfy_field__Approve_Large_Orders` — granted within this set by default (configurable off in Admin Console)

**Additional read access:**
- All accounts in the assigned territory (not just own accounts)

### `ohfy_field__Driver`

**Object permissions:**
- `ohfy_field__DeliveryConfirmation__c`: Create, Read (own routes)
- `ohfy_field__DeliveryException__c`: Create, Read (own routes)
- `ohfy_field__LabelPrint__c`: Create, Read (own — delivery receipt and damage tag only)
- `ohfy_field__SyncLog__c`: Create (own)

**Read access:**
- `ohfy__Order__c`: Read (today's delivery orders only, filtered by assigned route)
- `ohfy_field__Route__c`: Read (own assigned routes)

### `ohfy_field__Driver_Manager`

All permissions from `ohfy_field__Driver`, plus:

**Object permissions:**
- `ohfy_field__Route__c`: Create, Read, Edit, Delete
- `ohfy_field__DeliveryException__c`: Read all, Edit (`Resolution__c`, `Status__c`)

**Read access:**
- All drivers' routes and delivery confirmations

### `ohfy_field__Warehouse_Worker`

**Object permissions:**
- `ohfy_field__PickConfirmation__c`: Create, Read (own)
- `ohfy_field__InventoryFlag__c`: Create, Read (own)
- `ohfy_field__LabelPrint__c`: Create, Read (warehouse label types only)
- `ohfy_field__SyncLog__c`: Create (own)

**Read access:**
- `ohfy__Order__c`: Read (today's orders assigned to pick)
- `ohfy__Product__c`: Read (product name, SKU, bin location)
- `ohfy__InventoryItem__c`: Read (basic availability)

### `ohfy_field__Warehouse_Manager`

All permissions from `ohfy_field__Warehouse_Worker`, plus:

**Object permissions:**
- `ohfy__InventoryItem__c`: Read, Edit (`Quantity__c`, `LastAdjustedDate__c`)
- `ohfy_field__InventoryFlag__c`: Read all, Edit (resolution fields)
- `ohfy_field__InventoryAdjustment__c`: Create, Read, Edit (own adjustments)

**Read access:**
- Full inventory levels across all SKUs
- All warehouse workers' pick confirmations and productivity data

---

## Appendix B — Role Detection Logic

```typescript
// src/permissions/types.ts

export type AppRole =
  | 'sales_rep'
  | 'sales_manager'
  | 'driver'
  | 'driver_manager'
  | 'warehouse_worker'
  | 'warehouse_manager'
  | 'app_admin';

export type Permission =
  // Account
  | 'view_own_accounts'
  | 'view_team_accounts'
  | 'view_account_financials'
  | 'log_visit'
  | 'view_team_visits'
  | 'add_coaching_note'
  // Orders
  | 'create_order'
  | 'submit_order'
  | 'approve_order'
  | 'view_team_orders'
  // Delivery
  | 'view_own_route'
  | 'view_all_routes'
  | 'confirm_delivery'
  | 'log_delivery_exception'
  | 'approve_delivery_exception'
  | 'manage_routes'
  // Warehouse
  | 'view_pick_list'
  | 'confirm_pick'
  | 'view_full_inventory'
  | 'adjust_inventory'
  | 'view_worker_productivity'
  // AI
  | 'ai_visit_prep'
  | 'ai_voice_order'
  | 'ai_voice_note'
  | 'ai_selling_suggestions'
  | 'ai_voice_delivery'
  | 'ai_voice_pick'
  | 'ai_team_summary'
  | 'view_own_memories'
  | 'view_team_memories'
  // ZPL
  | 'print_shelf_talker'
  | 'print_product_card'
  | 'print_delivery_receipt'
  | 'print_route_sheet'
  | 'print_bin_label'
  | 'print_damage_tag';

// src/permissions/matrix.ts
export const PERMISSION_MATRIX: Record<AppRole, Record<Permission, boolean>> = {
  sales_rep: {
    view_own_accounts: true,
    view_team_accounts: false,
    view_account_financials: true,
    log_visit: true,
    view_team_visits: false,
    add_coaching_note: false,
    create_order: true,
    submit_order: true,
    approve_order: false,
    view_team_orders: false,
    view_own_route: false,
    view_all_routes: false,
    confirm_delivery: false,
    log_delivery_exception: false,
    approve_delivery_exception: false,
    manage_routes: false,
    view_pick_list: false,
    confirm_pick: false,
    view_full_inventory: false,
    adjust_inventory: false,
    view_worker_productivity: false,
    ai_visit_prep: true,
    ai_voice_order: true,
    ai_voice_note: true,
    ai_selling_suggestions: true,
    ai_voice_delivery: false,
    ai_voice_pick: false,
    ai_team_summary: false,
    view_own_memories: true,
    view_team_memories: false,
    print_shelf_talker: true,
    print_product_card: true,
    print_delivery_receipt: true,
    print_route_sheet: false,
    print_bin_label: false,
    print_damage_tag: false,
  },
  // ... (all six roles follow the matrix in §3)
};
```

---

## Appendix C — Navigation Config per Role

```typescript
// src/navigation/role-nav-config.ts

export interface TabConfig {
  name: string;
  title: string;
  icon: string;          // lucide-react-native icon name
  href: string;          // Expo Router path
  badge?: 'sync_count' | 'approval_count' | 'exception_count';
}

export const ROLE_NAV_CONFIG: Record<AppRole, TabConfig[]> = {
  sales_rep: [
    { name: 'accounts', title: 'Accounts', icon: 'Building2', href: '/(tabs)/' },
    { name: 'route',    title: 'Route',    icon: 'MapPin',    href: '/(tabs)/route' },
    { name: 'orders',   title: 'Orders',   icon: 'ShoppingCart', href: '/(tabs)/orders' },
    { name: 'settings', title: 'Settings', icon: 'Settings2', href: '/(tabs)/settings' },
  ],
  sales_manager: [
    { name: 'team',      title: 'Team',      icon: 'Users',       href: '/(tabs)/team', badge: 'approval_count' },
    { name: 'accounts',  title: 'Accounts',  icon: 'Building2',   href: '/(tabs)/' },
    { name: 'approvals', title: 'Approvals', icon: 'CheckSquare', href: '/(tabs)/approvals', badge: 'approval_count' },
    { name: 'reports',   title: 'Reports',   icon: 'BarChart2',   href: '/(tabs)/reports' },
    { name: 'settings',  title: 'Settings',  icon: 'Settings2',   href: '/(tabs)/settings' },
  ],
  driver: [
    { name: 'route',      title: 'Route',      icon: 'Truck',   href: '/(tabs)/route' },
    { name: 'deliveries', title: 'Deliveries', icon: 'Package', href: '/(tabs)/deliveries', badge: 'exception_count' },
    { name: 'settings',   title: 'Settings',   icon: 'Settings2', href: '/(tabs)/settings' },
  ],
  driver_manager: [
    { name: 'dispatch',   title: 'Dispatch',   icon: 'Map',         href: '/(tabs)/dispatch' },
    { name: 'routes',     title: 'Routes',     icon: 'Route',       href: '/(tabs)/routes' },
    { name: 'exceptions', title: 'Exceptions', icon: 'AlertTriangle', href: '/(tabs)/exceptions', badge: 'exception_count' },
    { name: 'reports',    title: 'Reports',    icon: 'BarChart2',   href: '/(tabs)/reports' },
    { name: 'settings',   title: 'Settings',   icon: 'Settings2',   href: '/(tabs)/settings' },
  ],
  warehouse_worker: [
    { name: 'picklist', title: 'Pick List', icon: 'ClipboardList', href: '/(tabs)/picklist' },
    { name: 'inbound',  title: 'Inbound',   icon: 'ArrowDownToLine', href: '/(tabs)/inbound' },
    { name: 'settings', title: 'Settings',  icon: 'Settings2',    href: '/(tabs)/settings' },
  ],
  warehouse_manager: [
    { name: 'operations', title: 'Operations', icon: 'Activity',      href: '/(tabs)/operations', badge: 'exception_count' },
    { name: 'inventory',  title: 'Inventory',  icon: 'Boxes',         href: '/(tabs)/inventory' },
    { name: 'workers',    title: 'Workers',    icon: 'Users',         href: '/(tabs)/workers' },
    { name: 'reports',    title: 'Reports',    icon: 'BarChart2',     href: '/(tabs)/reports' },
    { name: 'settings',   title: 'Settings',   icon: 'Settings2',     href: '/(tabs)/settings' },
  ],
  app_admin: [
    // App admin uses Salesforce Lightning — no mobile tab set
    // If app_admin + another role, show that other role's tabs
  ],
};
```
