import type { Database } from '@nozbe/watermelondb';

import {
  SEED_ACCOUNTS,
  SEED_ORDERS,
  SEED_PRODUCTS,
  SEED_VISITS,
} from '@/data/seed-data';

import type { Account } from './models/Account';
import type { Order } from './models/Order';
import type { OrderLine } from './models/OrderLine';
import type { Product } from './models/Product';
import type { Visit } from './models/Visit';

const DAY_MS = 24 * 60 * 60 * 1000;

interface SeedOptions {
  repId: string;
}

export async function isDatabaseEmpty(db: Database): Promise<boolean> {
  const accountCount = await db.get<Account>('accounts').query().fetchCount();
  return accountCount === 0;
}

export async function seedDatabase(db: Database, opts: SeedOptions): Promise<void> {
  const empty = await isDatabaseEmpty(db);
  if (!empty) return;

  const now = Date.now();
  const repId = opts.repId;

  await db.write(async () => {
    const productsCollection = db.get<Product>('products');
    const accountsCollection = db.get<Account>('accounts');
    const visitsCollection = db.get<Visit>('visits');
    const ordersCollection = db.get<Order>('orders');
    const orderLinesCollection = db.get<OrderLine>('order_lines');

    // Products
    const productBySfId = new Map<string, Product>();
    for (const p of SEED_PRODUCTS) {
      const created = await productsCollection.create((rec) => {
        rec.sfId = p.sfId;
        rec.name = p.name;
        rec.category = p.category;
        rec.unit = p.unit;
        rec.unitLabel = p.unitLabel;
        rec.pricePerUnit = p.pricePerUnit;
        rec.supplierId = p.supplierId;
        rec.skuCode = p.skuCode;
        rec.isActive = true;
      });
      productBySfId.set(p.sfId, created);
    }

    // Accounts
    const accountBySfId = new Map<string, Account>();
    for (const a of SEED_ACCOUNTS) {
      const lastOrderTs = now - a.daysSinceLastOrder * DAY_MS;
      const created = await accountsCollection.create((rec) => {
        rec.sfId = a.sfId;
        rec.name = a.name;
        rec.accountType = a.accountType;
        rec.channel = a.channel;
        rec.territoryId = a.territoryId;
        rec.contactName = a.contactName;
        rec.contactTitle = a.contactTitle;
        rec.contactPhone = a.contactPhone;
        rec.addressStreet = a.addressStreet;
        rec.addressCity = a.addressCity;
        rec.addressState = a.addressState;
        rec.latitude = a.latitude;
        rec.longitude = a.longitude;
        rec.lastOrderDate = new Date(lastOrderTs);
        rec.daysSinceLastOrder = a.daysSinceLastOrder;
        rec.ytdRevenue = a.ytdRevenue;
        rec.needsAttention = a.needsAttention;
        rec.syncedAt = new Date(now);
        rec.isArchived = false;
      });
      accountBySfId.set(a.sfId, created);
    }

    // Visits — set last_visit_date on the account too
    for (const v of SEED_VISITS) {
      const account = accountBySfId.get(v.accountSfId);
      if (!account) continue;
      const visitTs = now - v.daysAgo * DAY_MS;
      await visitsCollection.create((rec) => {
        rec.accountId = account.id;
        rec.accountSfId = v.accountSfId;
        rec.repId = repId;
        rec.visitDate = new Date(visitTs);
        rec.durationMinutes = v.durationMinutes;
        rec.note = v.note;
        rec.sfSyncStatus = 'synced';
        rec.syncAttempts = 0;
        rec.createdOffline = false;
      });
      await account.update((rec) => {
        rec.lastVisitDate = new Date(visitTs);
      });
    }

    // Orders + lines
    for (const o of SEED_ORDERS) {
      const account = accountBySfId.get(o.accountSfId);
      if (!account) continue;
      const orderTs = now - o.daysAgo * DAY_MS;
      let total = 0;
      const linePayloads: { product: Product; qty: number }[] = [];
      for (const line of o.lines) {
        const product = productBySfId.get(line.productSfId);
        if (!product) continue;
        total += product.pricePerUnit * line.quantity;
        linePayloads.push({ product, qty: line.quantity });
      }
      const order = await ordersCollection.create((rec) => {
        rec.sfId = `${o.accountSfId}_order_${o.daysAgo}`;
        rec.accountId = account.id;
        rec.accountSfId = o.accountSfId;
        rec.repId = repId;
        rec.status = o.status;
        rec.orderDate = new Date(orderTs);
        rec.totalAmount = total;
        rec.notes = o.notes;
        rec.sfSyncStatus = 'synced';
        rec.syncAttempts = 0;
        rec.createdOffline = false;
        rec.createdAt = new Date(orderTs);
        rec.updatedAt = new Date(orderTs);
      });
      for (const { product, qty } of linePayloads) {
        await orderLinesCollection.create((rec) => {
          rec.orderId = order.id;
          rec.productId = product.id;
          rec.productSfId = product.sfId;
          rec.productName = product.name;
          rec.quantity = qty;
          rec.unit = product.unit;
          rec.unitPrice = product.pricePerUnit;
          rec.lineTotal = product.pricePerUnit * qty;
        });
      }
    }
  });
}

export async function clearDatabase(db: Database): Promise<void> {
  await db.write(async () => {
    const tables = [
      'order_lines',
      'orders',
      'visits',
      'label_prints',
      'sync_queue',
      'memories',
      'feedback_events',
      'accounts',
      'products',
      'permissions',
    ];
    for (const table of tables) {
      const all = await db.get(table).query().fetch();
      for (const rec of all) {
        await rec.markAsDeleted();
      }
    }
    // Purge soft-deleted rows so subsequent isDatabaseEmpty checks return true
    await db.adapter.unsafeExecute({ sqls: tables.map((t) => [`DELETE FROM ${t}`, []]) });
  });
}
