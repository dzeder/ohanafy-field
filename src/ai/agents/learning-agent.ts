import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import { writeMemory, type MemoryCategory } from '@/db/repositories/memories';
import type { FeedbackEvent } from '@/db/models/FeedbackEvent';

// Synthesizes Memory records from accumulated FeedbackEvents.
// Confidence model (per ai-tool-builder agent guidance):
//   ≥ 4 consistent examples → 0.9
//   2-3 examples → 0.7
//   1 example → 0.5 (stored as a hint only)
//
// Idempotent — every processed event is marked `synthesized = true`.
// Designed to run in the background; never blocks UI.

const NOISE_FLOOR = 3;

function confidenceForCount(n: number): number {
  if (n >= 4) return 0.9;
  if (n >= 2) return 0.7;
  return 0.5;
}

interface LearningRunOptions {
  repId: string;
}

export interface LearningRunResult {
  processed: number;
  memoriesCreated: number;
  patternsBelowFloor: number;
}

interface ParsedFeedback {
  event: FeedbackEvent;
  productKey: string | null;
  noteSubject: string | null;
}

function summarizeEditedAction(event: FeedbackEvent): ParsedFeedback {
  let productKey: string | null = null;
  let noteSubject: string | null = null;
  try {
    const ai = JSON.parse(event.aiOutput) as { action?: { type?: string; items?: Array<{ productName?: string }>; note?: string } };
    if (ai?.action?.type === 'ADD_TO_ORDER' && ai.action.items?.[0]?.productName) {
      productKey = ai.action.items[0].productName.toLowerCase();
    } else if (ai?.action?.type === 'LOG_NOTE' && ai.action.note) {
      noteSubject = ai.action.note.toLowerCase().split(/\s+/).slice(0, 3).join(' ');
    }
  } catch {
    // ignore malformed events
  }
  return { event, productKey, noteSubject };
}

export async function runLearningAgent(
  db: Database,
  opts: LearningRunOptions
): Promise<LearningRunResult> {
  const events = await db
    .get<FeedbackEvent>('feedback_events')
    .query(
      Q.where('rep_id', opts.repId),
      Q.where('synthesized', false),
      Q.where('event_type', Q.oneOf(['command_edited', 'command_rejected', 'insight_edited']))
    )
    .fetch();

  if (events.length === 0) {
    return { processed: 0, memoriesCreated: 0, patternsBelowFloor: 0 };
  }

  // Bucket by inferred subject
  const productBuckets = new Map<string, ParsedFeedback[]>();
  const noteBuckets = new Map<string, ParsedFeedback[]>();
  for (const e of events) {
    const parsed = summarizeEditedAction(e);
    if (parsed.productKey) {
      const bucket = productBuckets.get(parsed.productKey) ?? [];
      bucket.push(parsed);
      productBuckets.set(parsed.productKey, bucket);
    } else if (parsed.noteSubject) {
      const bucket = noteBuckets.get(parsed.noteSubject) ?? [];
      bucket.push(parsed);
      noteBuckets.set(parsed.noteSubject, bucket);
    }
  }

  let memoriesCreated = 0;
  let patternsBelowFloor = 0;

  for (const [key, bucket] of productBuckets.entries()) {
    if (bucket.length < NOISE_FLOOR) {
      patternsBelowFloor += 1;
      continue;
    }
    await writeMemory(db, {
      repId: opts.repId,
      category: 'PRODUCT_NICKNAME' satisfies MemoryCategory,
      key,
      value: JSON.stringify({ examples: bucket.length }),
      confidence: confidenceForCount(bucket.length),
      source: 'learning_agent',
    });
    memoriesCreated += 1;
  }

  for (const [key, bucket] of noteBuckets.entries()) {
    if (bucket.length < NOISE_FLOOR) {
      patternsBelowFloor += 1;
      continue;
    }
    await writeMemory(db, {
      repId: opts.repId,
      category: 'NOTE_PHRASING' satisfies MemoryCategory,
      key,
      value: JSON.stringify({ examples: bucket.length }),
      confidence: confidenceForCount(bucket.length),
      source: 'learning_agent',
    });
    memoriesCreated += 1;
  }

  // Mark all processed events as synthesized — idempotent on re-runs
  await db.write(async () => {
    for (const e of events) {
      await e.update((rec) => {
        rec.synthesized = true;
      });
    }
  });

  return { processed: events.length, memoriesCreated, patternsBelowFloor };
}
