import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { FeedbackEvent } from '../models/FeedbackEvent';
import type { Memory } from '../models/Memory';

export type MemoryCategory =
  | 'COMMAND_PATTERN'
  | 'ACCOUNT_PREFERENCE'
  | 'PRODUCT_NICKNAME'
  | 'NOTE_PHRASING';

export interface MemoryWriteInput {
  repId: string;
  accountId?: string;
  category: MemoryCategory;
  key: string;
  value: string;
  confidence: number;
  source: 'user_correction' | 'learning_agent' | 'onboarding';
}

export async function writeMemory(
  db: Database,
  input: MemoryWriteInput
): Promise<Memory> {
  let created!: Memory;
  await db.write(async () => {
    created = await db.get<Memory>('memories').create((rec) => {
      rec.repId = input.repId;
      rec.accountId = input.accountId;
      rec.category = input.category;
      rec.key = input.key;
      rec.value = input.value;
      rec.confidence = input.confidence;
      rec.source = input.source;
      rec.useCount = 0;
      rec.createdAt = new Date();
      rec.sfSyncStatus = input.confidence >= 0.3 ? 'pending' : 'local_only';
    });
  });
  return created;
}

export async function topMemoriesForRep(
  db: Database,
  repId: string,
  limit = 5
): Promise<Memory[]> {
  return db
    .get<Memory>('memories')
    .query(
      Q.where('rep_id', repId),
      Q.where('confidence', Q.gte(0.3)),
      Q.sortBy('confidence', Q.desc),
      Q.take(limit)
    )
    .fetch();
}

export interface FeedbackEventInput {
  repId: string;
  accountId?: string;
  eventType:
    | 'command_accepted'
    | 'command_edited'
    | 'command_rejected'
    | 'insight_accepted'
    | 'insight_edited'
    | 'insight_rejected';
  aiOutput: Record<string, unknown>;
  userCorrection?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export async function recordFeedback(
  db: Database,
  input: FeedbackEventInput
): Promise<FeedbackEvent> {
  let created!: FeedbackEvent;
  await db.write(async () => {
    created = await db.get<FeedbackEvent>('feedback_events').create((rec) => {
      rec.repId = input.repId;
      rec.accountId = input.accountId;
      rec.eventType = input.eventType;
      rec.aiOutput = JSON.stringify(input.aiOutput);
      rec.userCorrection = input.userCorrection
        ? JSON.stringify(input.userCorrection)
        : undefined;
      rec.contextJson = JSON.stringify(input.context ?? {});
      rec.createdAt = new Date();
      rec.synthesized = false;
    });
  });
  return created;
}
