import type { Database } from '@nozbe/watermelondb';

import { recordFeedback, type FeedbackEventInput } from '@/db/repositories/memories';

// Single source of truth for capturing user feedback on AI outputs. Tool
// handlers must NEVER write to the memories table directly. They write a
// FeedbackEvent here, and the learning agent (Day 4) synthesizes those into
// stable memories with confidence scores.
export async function captureFeedback(
  db: Database,
  input: FeedbackEventInput
): Promise<void> {
  await recordFeedback(db, input);
}
