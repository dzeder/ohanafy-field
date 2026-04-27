import { runLearningAgent } from '@/ai/agents/learning-agent';

interface FakeFeedback {
  id: string;
  repId: string;
  eventType: string;
  aiOutput: string;
  synthesized: boolean;
  [key: string]: unknown;
}

interface FakeMemory {
  id: string;
  repId: string;
  category: string;
  key: string;
  value: string;
  confidence: number;
  source: string;
  [key: string]: unknown;
}

function makeDb(events: FakeFeedback[]) {
  const memories: FakeMemory[] = [];
  function makeRecordProxy<T extends Record<string, unknown>>(target: T) {
    return {
      ...target,
      update: async (mutator: (rec: T) => void) => mutator(target),
    };
  }
  const db = {
    write: async (fn: () => Promise<void>) => fn(),
    get: (table: string) => ({
      query: () => ({
        fetch: async () =>
          table === 'feedback_events'
            ? events
                .filter((e) => !e.synthesized)
                .map((e) => makeRecordProxy(e))
            : [],
      }),
      create: async (mutator: (rec: FakeMemory) => void) => {
        const rec: FakeMemory = {
          id: `m_${memories.length + 1}`,
          repId: '',
          category: '',
          key: '',
          value: '',
          confidence: 0,
          source: '',
        };
        // The repository setter (writeMemory) sets all fields; the date fields
        // use Date objects which we ignore in the fake.
        mutator(rec);
        memories.push(rec);
        return rec;
      },
    }),
  };
  return { db, memories, events };
}

describe('runLearningAgent', () => {
  it('returns zero counts and no memories when there are no unprocessed events', async () => {
    const { db } = makeDb([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await runLearningAgent(db as any, { repId: 'rep1' });
    expect(result).toEqual({ processed: 0, memoriesCreated: 0, patternsBelowFloor: 0 });
  });

  it('does NOT create memories when below the noise floor (< 3 examples)', async () => {
    const events: FakeFeedback[] = [
      {
        id: 'e1',
        repId: 'rep1',
        eventType: 'command_edited',
        synthesized: false,
        aiOutput: JSON.stringify({
          action: { type: 'ADD_TO_ORDER', items: [{ productName: 'Pale Ale' }] },
        }),
      },
      {
        id: 'e2',
        repId: 'rep1',
        eventType: 'command_edited',
        synthesized: false,
        aiOutput: JSON.stringify({
          action: { type: 'ADD_TO_ORDER', items: [{ productName: 'Pale Ale' }] },
        }),
      },
    ];
    const { db, memories } = makeDb(events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await runLearningAgent(db as any, { repId: 'rep1' });
    expect(memories).toHaveLength(0);
    expect(result.memoriesCreated).toBe(0);
    expect(result.patternsBelowFloor).toBe(1);
  });

  it('creates a memory at confidence 0.7 for 3 examples', async () => {
    const events: FakeFeedback[] = Array.from({ length: 3 }, (_, i) => ({
      id: `e${i}`,
      repId: 'rep1',
      eventType: 'command_edited',
      synthesized: false,
      aiOutput: JSON.stringify({
        action: { type: 'ADD_TO_ORDER', items: [{ productName: 'Pale Ale' }] },
      }),
    }));
    const { db, memories } = makeDb(events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = await runLearningAgent(db as any, { repId: 'rep1' });
    expect(memories).toHaveLength(1);
    expect(memories[0].confidence).toBe(0.7);
    expect(memories[0].category).toBe('PRODUCT_NICKNAME');
    expect(result.memoriesCreated).toBe(1);
  });

  it('creates a memory at confidence 0.9 for 4+ examples', async () => {
    const events: FakeFeedback[] = Array.from({ length: 5 }, (_, i) => ({
      id: `e${i}`,
      repId: 'rep1',
      eventType: 'command_edited',
      synthesized: false,
      aiOutput: JSON.stringify({
        action: { type: 'ADD_TO_ORDER', items: [{ productName: 'Pale Ale' }] },
      }),
    }));
    const { db, memories } = makeDb(events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await runLearningAgent(db as any, { repId: 'rep1' });
    expect(memories[0].confidence).toBe(0.9);
  });

  it('marks every processed event as synthesized (idempotent re-runs)', async () => {
    const events: FakeFeedback[] = Array.from({ length: 3 }, (_, i) => ({
      id: `e${i}`,
      repId: 'rep1',
      eventType: 'command_edited',
      synthesized: false,
      aiOutput: JSON.stringify({
        action: { type: 'ADD_TO_ORDER', items: [{ productName: 'Pale Ale' }] },
      }),
    }));
    const { db } = makeDb(events);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await runLearningAgent(db as any, { repId: 'rep1' });
    expect(events.every((e) => e.synthesized)).toBe(true);
  });
});
