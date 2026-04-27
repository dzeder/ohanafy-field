import type { Database } from '@nozbe/watermelondb';

import { topMemoriesForRep } from '@/db/repositories/memories';

export interface MemoryContextItem {
  category: string;
  key: string;
  value: string;
  confidence: number;
}

export async function getMemoryContext(
  db: Database,
  repId: string,
  limit = 5
): Promise<MemoryContextItem[]> {
  const memories = await topMemoriesForRep(db, repId, limit);
  return memories.map((m) => ({
    category: m.category,
    key: m.key,
    value: m.value,
    confidence: m.confidence,
  }));
}

export function formatMemoryContextForPrompt(items: MemoryContextItem[]): string {
  if (items.length === 0) return '';
  const lines = items.map(
    (m) =>
      `- [${m.category}] ${m.key}: ${m.value} (${Math.round(m.confidence * 100)}% confidence)`
  );
  return `\n\nKnown patterns for this rep:\n${lines.join('\n')}`;
}
