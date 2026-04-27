import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Order } from '../models/Order';
import type { OrderLine } from '../models/OrderLine';
import type { Product } from '../models/Product';

export interface NewOrderInput {
  accountId: string;
  accountSfId: string;
  repId: string;
}

export interface OrderLineInput {
  product: Pick<Product, 'id' | 'sfId' | 'name' | 'unit' | 'pricePerUnit'>;
  quantity: number;
}

export async function listOrdersForAccount(
  db: Database,
  accountId: string
): Promise<Order[]> {
  return db
    .get<Order>('orders')
    .query(Q.where('account_id', accountId), Q.sortBy('order_date', Q.desc))
    .fetch();
}

export async function listLinesForOrder(
  db: Database,
  orderId: string
): Promise<OrderLine[]> {
  return db.get<OrderLine>('order_lines').query(Q.where('order_id', orderId)).fetch();
}

export async function createDraftOrder(
  db: Database,
  input: NewOrderInput
): Promise<Order> {
  const now = Date.now();
  let created!: Order;
  await db.write(async () => {
    created = await db.get<Order>('orders').create((rec) => {
      rec.accountId = input.accountId;
      rec.accountSfId = input.accountSfId;
      rec.repId = input.repId;
      rec.status = 'draft';
      rec.orderDate = new Date(now);
      rec.totalAmount = 0;
      rec.sfSyncStatus = 'pending';
      rec.syncAttempts = 0;
      rec.createdOffline = true;
      rec.createdAt = new Date(now);
      rec.updatedAt = new Date(now);
    });
  });
  return created;
}

export async function addLineToOrder(
  db: Database,
  orderId: string,
  input: OrderLineInput
): Promise<OrderLine> {
  let created!: OrderLine;
  await db.write(async () => {
    created = await db.get<OrderLine>('order_lines').create((rec) => {
      rec.orderId = orderId;
      rec.productId = input.product.id;
      rec.productSfId = input.product.sfId;
      rec.productName = input.product.name;
      rec.quantity = input.quantity;
      rec.unit = input.product.unit;
      rec.unitPrice = input.product.pricePerUnit;
      rec.lineTotal = input.product.pricePerUnit * input.quantity;
    });
    await recalcOrderTotal(db, orderId);
  });
  return created;
}

export async function removeLine(db: Database, lineId: string): Promise<void> {
  await db.write(async () => {
    const line = await db.get<OrderLine>('order_lines').find(lineId);
    const orderId = line.orderId;
    await line.markAsDeleted();
    await recalcOrderTotal(db, orderId);
  });
}

export async function updateLineQuantity(
  db: Database,
  lineId: string,
  quantity: number
): Promise<void> {
  if (quantity < 1) {
    await removeLine(db, lineId);
    return;
  }
  await db.write(async () => {
    const line = await db.get<OrderLine>('order_lines').find(lineId);
    await line.update((rec) => {
      rec.quantity = quantity;
      rec.lineTotal = rec.unitPrice * quantity;
    });
    await recalcOrderTotal(db, line.orderId);
  });
}

async function recalcOrderTotal(db: Database, orderId: string): Promise<void> {
  const lines = await db
    .get<OrderLine>('order_lines')
    .query(Q.where('order_id', orderId))
    .fetch();
  const total = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const order = await db.get<Order>('orders').find(orderId);
  await order.update((rec) => {
    rec.totalAmount = total;
    rec.updatedAt = new Date();
  });
}

export async function submitOrder(
  db: Database,
  orderId: string
): Promise<void> {
  await db.write(async () => {
    const order = await db.get<Order>('orders').find(orderId);
    await order.update((rec) => {
      rec.status = 'pending_sync';
      rec.sfSyncStatus = 'pending';
      rec.updatedAt = new Date();
    });
  });
}
