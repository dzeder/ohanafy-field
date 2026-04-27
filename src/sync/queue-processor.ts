import type { Database } from '@nozbe/watermelondb';

import type { Order } from '@/db/models/Order';
import type { SyncQueueItem } from '@/db/models/SyncQueueItem';
import type { Visit } from '@/db/models/Visit';
import { markDone, markFailed, markProcessing } from '@/db/repositories/sync-queue';

import type { SFClient } from './sf-client';

interface CreateOrderPayload {
  localId: string;
  accountSfId: string;
  repId: string;
  totalAmount: number;
  lines: Array<{
    productSfId: string;
    productName: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    lineTotal: number;
  }>;
}

interface CreateVisitPayload {
  localId: string;
  accountSfId: string;
  repId: string;
  note: string;
}

export async function processQueueItem(
  item: SyncQueueItem,
  db: Database,
  client: SFClient
): Promise<void> {
  await markProcessing(db, item.id);
  try {
    switch (item.operationType) {
      case 'CREATE_ORDER':
        await processCreateOrder(item, db, client);
        break;
      case 'CREATE_VISIT':
        await processCreateVisit(item, db, client);
        break;
      default:
        throw new Error(`Unknown operation type: ${item.operationType}`);
    }
    await markDone(db, item.id);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    await markFailed(db, item.id, msg);
    throw error;
  }
}

async function processCreateOrder(
  item: SyncQueueItem,
  db: Database,
  client: SFClient
): Promise<void> {
  const payload = JSON.parse(item.payloadJson) as CreateOrderPayload;
  const { id: sfOrderId } = await client.createRecord('ohfy_field__Order__c', {
    ohfy_field__Account__c: payload.accountSfId,
    ohfy_field__Rep__c: payload.repId,
    ohfy_field__Total_Amount__c: payload.totalAmount,
    ohfy_field__Status__c: 'Submitted',
    ohfy_field__Created_Offline__c: true,
  });

  // Create line items
  for (const line of payload.lines) {
    await client.createRecord('ohfy_field__OrderLine__c', {
      ohfy_field__Order__c: sfOrderId,
      ohfy_field__Product_Sf_Id__c: line.productSfId,
      ohfy_field__Product_Name__c: line.productName,
      ohfy_field__Quantity__c: line.quantity,
      ohfy_field__Unit__c: line.unit,
      ohfy_field__Unit_Price__c: line.unitPrice,
      ohfy_field__Line_Total__c: line.lineTotal,
    });
  }

  // Update local order with the SF id and synced status
  await db.write(async () => {
    const order = await db.get<Order>('orders').find(payload.localId);
    await order.update((rec) => {
      rec.sfId = sfOrderId;
      rec.status = 'synced';
      rec.sfSyncStatus = 'synced';
      rec.updatedAt = new Date();
    });
  });
}

async function processCreateVisit(
  item: SyncQueueItem,
  db: Database,
  client: SFClient
): Promise<void> {
  const payload = JSON.parse(item.payloadJson) as CreateVisitPayload;
  const { id: sfVisitId } = await client.createRecord('ohfy_field__Visit__c', {
    ohfy_field__Account__c: payload.accountSfId,
    ohfy_field__Rep__c: payload.repId,
    ohfy_field__Note__c: payload.note,
    ohfy_field__Visit_Date__c: new Date().toISOString(),
  });

  await db.write(async () => {
    const visit = await db.get<Visit>('visits').find(payload.localId);
    await visit.update((rec) => {
      rec.sfId = sfVisitId;
      rec.sfSyncStatus = 'synced';
    });
  });
}
