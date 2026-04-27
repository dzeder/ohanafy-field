import NetInfo from '@react-native-community/netinfo';

import { database } from '@/db';
import { listPending } from '@/db/repositories/sync-queue';

import { processQueueItem } from './queue-processor';
import { sfClient, type SFClient } from './sf-client';

interface SyncOptions {
  client?: SFClient;
  batchSize?: number;
}

let inFlight = false;

export async function flushQueue(options: SyncOptions = {}): Promise<void> {
  if (inFlight) return;
  inFlight = true;
  try {
    const client = options.client ?? sfClient;
    const items = await listPending(database, options.batchSize ?? 10);
    for (const item of items) {
      try {
        await processQueueItem(item, database, client);
      } catch {
        // queue-processor already records the failure; continue with the next item
      }
    }
  } finally {
    inFlight = false;
  }
}

export function startSyncEngine(options: SyncOptions = {}): () => void {
  const unsubscribe = NetInfo.addEventListener((state) => {
    if (state.isConnected && state.isInternetReachable !== false) {
      // Fire and forget — failures are logged on each item, not at engine level
      flushQueue(options).catch(() => undefined);
    }
  });
  return unsubscribe;
}
