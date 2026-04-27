import { Q } from '@nozbe/watermelondb';
import { useEffect, useState } from 'react';

import { database } from '@/db';
import type { Memory } from '@/db/models/Memory';

export function useMemories(repId: string): { memories: Memory[]; loading: boolean } {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repId) return;
    const subscription = database
      .get<Memory>('memories')
      .query(Q.where('rep_id', repId), Q.sortBy('confidence', Q.desc))
      .observe()
      .subscribe((next) => {
        setMemories(next);
        setLoading(false);
      });
    return () => subscription.unsubscribe();
  }, [repId]);

  return { memories, loading };
}

export async function deleteMemory(memory: Memory): Promise<void> {
  await database.write(async () => {
    await memory.markAsDeleted();
  });
}
