import { processQueueItem } from '@/sync/queue-processor';
import type { SFClient } from '@/sync/sf-client';

type FakeOrder = {
  sfId?: string;
  status: string;
  sfSyncStatus: string;
  updatedAt: Date;
  [key: string]: unknown;
};
type FakeVisit = {
  sfId?: string;
  sfSyncStatus: string;
  [key: string]: unknown;
};
type FakeQueueItem = {
  id: string;
  status: string;
  attempts: number;
  lastError?: string;
  processedAt?: Date;
  operationType: 'CREATE_ORDER' | 'CREATE_VISIT';
  payloadJson: string;
  [key: string]: unknown;
};

function makeFakeDb() {
  const orders: Record<string, FakeOrder> = {
    local_order_001: { status: 'pending_sync', sfSyncStatus: 'pending', updatedAt: new Date() },
  };
  const visits: Record<string, FakeVisit> = {
    local_visit_001: { sfSyncStatus: 'pending' },
  };
  const queueItems: Record<string, FakeQueueItem> = {};

  function makeRecordProxy<T extends Record<string, unknown>>(target: T) {
    return {
      ...target,
      update: async (mutator: (rec: T) => void) => {
        mutator(target);
      },
    };
  }

  const db = {
    write: async (fn: () => Promise<void>) => fn(),
    get: (table: string) => ({
      find: async (id: string) => {
        if (table === 'orders' && orders[id]) return makeRecordProxy(orders[id]);
        if (table === 'visits' && visits[id]) return makeRecordProxy(visits[id]);
        if (table === 'sync_queue' && queueItems[id]) return makeRecordProxy(queueItems[id]);
        throw new Error(`record not found: ${table}/${id}`);
      },
    }),
  };

  return { db, orders, visits, queueItems };
}

describe('processQueueItem — CREATE_ORDER', () => {
  it('creates order in Salesforce, creates lines, updates local sync status', async () => {
    const { db, orders, queueItems } = makeFakeDb();
    queueItems.qi_1 = {
      id: 'qi_1',
      status: 'pending',
      attempts: 0,
      operationType: 'CREATE_ORDER',
      payloadJson: JSON.stringify({
        localId: 'local_order_001',
        accountSfId: 'a01',
        repId: 'rep_1',
        totalAmount: 356,
        lines: [
          {
            productSfId: 'p01',
            productName: 'Pale Ale',
            quantity: 2,
            unit: 'keg',
            unitPrice: 178,
            lineTotal: 356,
          },
        ],
      }),
    };

    const calls: Array<{ object: string; payload: Record<string, unknown> }> = [];
    const client: SFClient = {
      createRecord: jest.fn(async (object, payload) => {
        calls.push({ object, payload });
        return { id: object === 'ohfy_field__Order__c' ? 'SF_ORDER_001' : 'SF_LINE_001' };
      }),
      updateRecord: jest.fn(),
      query: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await processQueueItem(queueItems.qi_1 as any, db as any, client);

    expect(calls).toHaveLength(2);
    expect(calls[0].object).toBe('ohfy_field__Order__c');
    expect(calls[1].object).toBe('ohfy_field__OrderLine__c');
    expect(orders.local_order_001.sfId).toBe('SF_ORDER_001');
    expect(orders.local_order_001.status).toBe('synced');
    expect(orders.local_order_001.sfSyncStatus).toBe('synced');
    expect(queueItems.qi_1.status).toBe('done');
  });

  it('marks item failed (still pending, attempts++) on Salesforce error', async () => {
    const { db, queueItems } = makeFakeDb();
    queueItems.qi_2 = {
      id: 'qi_2',
      status: 'pending',
      attempts: 0,
      operationType: 'CREATE_ORDER',
      payloadJson: JSON.stringify({
        localId: 'local_order_001',
        accountSfId: 'a01',
        repId: 'rep_1',
        totalAmount: 0,
        lines: [],
      }),
    };

    const client: SFClient = {
      createRecord: jest.fn(async () => {
        throw new Error('SF timeout');
      }),
      updateRecord: jest.fn(),
      query: jest.fn(),
    };

    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processQueueItem(queueItems.qi_2 as any, db as any, client)
    ).rejects.toThrow('SF timeout');
    expect(queueItems.qi_2.attempts).toBe(1);
    expect(queueItems.qi_2.status).toBe('pending');
    expect(queueItems.qi_2.lastError).toContain('SF timeout');
  });

  it('marks item permanently failed at attempts >= 3', async () => {
    const { db, queueItems } = makeFakeDb();
    queueItems.qi_3 = {
      id: 'qi_3',
      status: 'pending',
      attempts: 2,
      operationType: 'CREATE_ORDER',
      payloadJson: JSON.stringify({
        localId: 'local_order_001',
        accountSfId: 'a01',
        repId: 'rep_1',
        totalAmount: 0,
        lines: [],
      }),
    };

    const client: SFClient = {
      createRecord: jest.fn(async () => {
        throw new Error('SF timeout');
      }),
      updateRecord: jest.fn(),
      query: jest.fn(),
    };

    await expect(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      processQueueItem(queueItems.qi_3 as any, db as any, client)
    ).rejects.toThrow('SF timeout');
    expect(queueItems.qi_3.attempts).toBe(3);
    expect(queueItems.qi_3.status).toBe('failed');
  });
});

describe('processQueueItem — CREATE_VISIT', () => {
  it('creates visit in Salesforce and updates local sync status', async () => {
    const { db, visits, queueItems } = makeFakeDb();
    queueItems.qi_v1 = {
      id: 'qi_v1',
      status: 'pending',
      attempts: 0,
      operationType: 'CREATE_VISIT',
      payloadJson: JSON.stringify({
        localId: 'local_visit_001',
        accountSfId: 'a01',
        repId: 'rep_1',
        note: 'Tap issue resolved.',
      }),
    };

    const client: SFClient = {
      createRecord: jest.fn(async () => ({ id: 'SF_VISIT_001' })),
      updateRecord: jest.fn(),
      query: jest.fn(),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await processQueueItem(queueItems.qi_v1 as any, db as any, client);

    expect(client.createRecord).toHaveBeenCalledWith(
      'ohfy_field__Visit__c',
      expect.objectContaining({
        ohfy_field__Account__c: 'a01',
        ohfy_field__Note__c: 'Tap issue resolved.',
      })
    );
    expect(visits.local_visit_001.sfId).toBe('SF_VISIT_001');
    expect(visits.local_visit_001.sfSyncStatus).toBe('synced');
  });
});
