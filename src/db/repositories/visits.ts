import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Visit } from '../models/Visit';

export interface NewVisitInput {
  accountId: string;
  accountSfId: string;
  repId: string;
  note: string;
  rawTranscript?: string;
  durationMinutes?: number;
}

export async function listVisitsForAccount(
  db: Database,
  accountId: string,
  limit = 10
): Promise<Visit[]> {
  return db
    .get<Visit>('visits')
    .query(
      Q.where('account_id', accountId),
      Q.sortBy('visit_date', Q.desc),
      Q.take(limit)
    )
    .fetch();
}

export async function logVisit(db: Database, input: NewVisitInput): Promise<Visit> {
  let created!: Visit;
  await db.write(async () => {
    created = await db.get<Visit>('visits').create((rec) => {
      rec.accountId = input.accountId;
      rec.accountSfId = input.accountSfId;
      rec.repId = input.repId;
      rec.visitDate = new Date();
      rec.durationMinutes = input.durationMinutes;
      rec.note = input.note;
      rec.rawTranscript = input.rawTranscript;
      rec.sfSyncStatus = 'pending';
      rec.syncAttempts = 0;
      rec.createdOffline = true;
    });
  });
  return created;
}
