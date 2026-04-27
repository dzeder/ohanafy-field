import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { SyncQueueItem } from '../models/SyncQueueItem';

export type SyncOperationType =
  | 'CREATE_ORDER'
  | 'UPDATE_ORDER'
  | 'CREATE_VISIT'
  | 'UPDATE_VISIT'
  | 'CREATE_LABEL_LOG';

export interface EnqueueInput {
  operationType: SyncOperationType;
  entityType: string;
  entityId: string;
  payload: Record<string, unknown>;
}

export async function enqueue(db: Database, input: EnqueueInput): Promise<SyncQueueItem> {
  let created!: SyncQueueItem;
  await db.write(async () => {
    created = await db.get<SyncQueueItem>('sync_queue').create((rec) => {
      rec.operationType = input.operationType;
      rec.entityType = input.entityType;
      rec.entityId = input.entityId;
      rec.payloadJson = JSON.stringify(input.payload);
      rec.status = 'pending';
      rec.attempts = 0;
      rec.createdAt = new Date();
    });
  });
  return created;
}

export async function listPending(
  db: Database,
  limit = 10
): Promise<SyncQueueItem[]> {
  return db
    .get<SyncQueueItem>('sync_queue')
    .query(
      Q.where('status', 'pending'),
      Q.sortBy('created_at', Q.asc),
      Q.take(limit)
    )
    .fetch();
}

export async function countPending(db: Database): Promise<number> {
  return db
    .get<SyncQueueItem>('sync_queue')
    .query(Q.where('status', Q.oneOf(['pending', 'processing'])))
    .fetchCount();
}

export async function markProcessing(
  db: Database,
  itemId: string
): Promise<void> {
  await db.write(async () => {
    const item = await db.get<SyncQueueItem>('sync_queue').find(itemId);
    await item.update((rec) => {
      rec.status = 'processing';
    });
  });
}

export async function markDone(db: Database, itemId: string): Promise<void> {
  await db.write(async () => {
    const item = await db.get<SyncQueueItem>('sync_queue').find(itemId);
    await item.update((rec) => {
      rec.status = 'done';
      rec.processedAt = new Date();
    });
  });
}

export async function markFailed(
  db: Database,
  itemId: string,
  error: string
): Promise<void> {
  await db.write(async () => {
    const item = await db.get<SyncQueueItem>('sync_queue').find(itemId);
    const nextAttempts = item.attempts + 1;
    await item.update((rec) => {
      rec.attempts = nextAttempts;
      rec.lastError = error;
      // Three strikes and fail permanently — surfaces in UI for manual retry/discard
      rec.status = nextAttempts >= 3 ? 'failed' : 'pending';
    });
  });
}
