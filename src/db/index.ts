import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import schema from './schema';
import {
  Account,
  Product,
  Order,
  OrderLine,
  Visit,
  LabelPrint,
  SyncQueueItem,
  Memory,
  FeedbackEvent,
  Permission,
} from './models';

const adapter = new SQLiteAdapter({
  schema,
  jsi: true,
  onSetUpError: (error) => {
    // eslint-disable-next-line no-console
    console.error('[db] setup error', error);
  },
});

export const database = new Database({
  adapter,
  modelClasses: [
    Account,
    Product,
    Order,
    OrderLine,
    Visit,
    LabelPrint,
    SyncQueueItem,
    Memory,
    FeedbackEvent,
    Permission,
  ],
});

export type AppDatabase = typeof database;
