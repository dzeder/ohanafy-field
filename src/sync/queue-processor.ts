import type { Database } from '@nozbe/watermelondb';

import type { Order } from '@/db/models/Order';
import type { SyncQueueItem } from '@/db/models/SyncQueueItem';
import type { Visit } from '@/db/models/Visit';
import { markDone, markFailed, markProcessing } from '@/db/repositories/sync-queue';

import type { SFClient } from './sf-client';

// Salesforce mapping notes
// ────────────────────────
// Ohanafy Field is a UI/UX layer over the existing OHFY-Data_Model managed
// package (namespace `ohfy`). We do NOT define new custom objects — instead
// we map our local DB to the existing schema:
//
//   our `orders` + `order_lines`  →  ohfy__Commitment__c with serialized
//                                     line items in Offline_Items__c
//                                     (a Salesforce trigger materializes
//                                     ohfy__Commitment_Item__c rows)
//   our `visits`                   →  standard SF Task (Subject="Visit",
//                                     WhatId=accountSfId, Type="Visit",
//                                     Description=note, Status="Completed")
//
// Reference: github.com/Ohanafy/OHFY-Data_Model →
//   force-app/main/default/objects/Commitment__c
//
// The Commitment__c.Offline_Items__c field is explicitly designed for this:
// "The system populates this long text field with serialized commitment
//  item data captured while the mobile application was offline. Processed
//  during the next synchronization cycle to create individual Commitment
//  Item records."

interface CreateOrderPayload {
  localId: string;
  accountSfId: string;
  repId: string;
  totalAmount: number;
  notes?: string;
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

  // Serialize line items for Offline_Items__c — the SF-side trigger materializes
  // these into ohfy__Commitment_Item__c records on creation.
  const offlineItems = payload.lines.map((line) => ({
    itemSfId: line.productSfId,
    itemName: line.productName,
    quantity: line.quantity,
    unit: line.unit,
    unitPrice: line.unitPrice,
    lineTotal: line.lineTotal,
  }));

  const { id: sfCommitmentId } = await client.createRecord('ohfy__Commitment__c', {
    ohfy__Customer__c: payload.accountSfId,
    ohfy__Involved_Sales_Rep__c: payload.repId,
    ohfy__Date__c: new Date().toISOString().slice(0, 10), // YYYY-MM-DD for Date__c
    ohfy__Notes__c: payload.notes ?? null,
    ohfy__Was_Created_Offline__c: true,
    ohfy__Offline_Items__c: JSON.stringify(offlineItems),
  });

  await db.write(async () => {
    const order = await db.get<Order>('orders').find(payload.localId);
    await order.update((rec) => {
      rec.sfId = sfCommitmentId;
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

  // Standard SF Task (the API name for non-event Activity rows). REX-UI
  // uses the same pattern via ohfy__Activity_Goal__c → standard Activity.
  const { id: sfTaskId } = await client.createRecord('Task', {
    Subject: 'Visit',
    Description: payload.note,
    WhatId: payload.accountSfId,
    OwnerId: payload.repId,
    Type: 'Visit',
    Status: 'Completed',
    ActivityDate: new Date().toISOString().slice(0, 10),
  });

  await db.write(async () => {
    const visit = await db.get<Visit>('visits').find(payload.localId);
    await visit.update((rec) => {
      rec.sfId = sfTaskId;
      rec.sfSyncStatus = 'synced';
    });
  });
}
