import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import { callClaude } from '@/ai/client';
import {
  formatMemoryContextForPrompt,
  getMemoryContext,
} from '@/ai/memory/retriever';
import { COMMAND_SYSTEM_PROMPT } from '@/ai/prompts/command';
import { interpretNote, interpretOrder } from '@/ai/tools';
import type { Product } from '@/db/models/Product';
import type { CommandAction } from '@/store/voice-store';

interface CommandAgentInput {
  transcript: string;
  repId: string;
  db: Database;
}

interface ClaudeCommandResponse {
  type: 'ADD_TO_ORDER' | 'LOG_NOTE' | 'UNKNOWN';
  candidates?: Array<{
    productNameSpoken: string;
    quantity: number;
    unit?: 'keg' | 'case' | null;
  }>;
  note?: string;
  summary?: string;
}

function parseClaudeResponse(raw: string): ClaudeCommandResponse {
  // Strip code fences if Claude included them despite instructions
  const stripped = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    return JSON.parse(stripped) as ClaudeCommandResponse;
  } catch {
    return { type: 'UNKNOWN', summary: 'Could not interpret response' };
  }
}

export async function interpretCommand(
  input: CommandAgentInput
): Promise<CommandAction> {
  const { transcript, repId, db } = input;

  const memoryContext = await getMemoryContext(db, repId, 5);
  const systemWithMemory =
    COMMAND_SYSTEM_PROMPT + formatMemoryContextForPrompt(memoryContext);

  const raw = await callClaude({
    systemPrompt: systemWithMemory,
    userMessage: `Transcript: "${transcript}"`,
    maxTokens: 512,
    temperature: 0.1,
  });
  const parsed = parseClaudeResponse(raw);

  if (parsed.type === 'ADD_TO_ORDER' && parsed.candidates && parsed.candidates.length > 0) {
    const products = await db
      .get<Product>('products')
      .query(Q.where('is_active', true))
      .fetch();
    const catalog = products.map((p) => ({
      sfId: p.sfId,
      name: p.name,
      unit: p.unit as 'keg' | 'case',
      pricePerUnit: p.pricePerUnit,
    }));

    const result = interpretOrder({
      candidates: parsed.candidates.map((c) => ({
        productNameSpoken: c.productNameSpoken,
        quantity: c.quantity,
        unit: c.unit ?? undefined,
      })),
      productCatalog: catalog,
    });

    if (result.itemsToAdd.length === 0) {
      return {
        type: 'UNKNOWN',
        transcript,
        summary: result.unmatched.length
          ? `Couldn't match: ${result.unmatched.join(', ')}`
          : 'No products matched',
      };
    }

    return {
      type: 'ADD_TO_ORDER',
      items: result.itemsToAdd,
      summary:
        parsed.summary ??
        `Add ${result.itemsToAdd
          .map((i) => `${i.quantity} ${i.unit}${i.quantity === 1 ? '' : 's'} ${i.productName}`)
          .join(', ')}`,
    };
  }

  if (parsed.type === 'LOG_NOTE' && parsed.note) {
    const cleaned = interpretNote({ rawTranscript: parsed.note });
    return {
      type: 'LOG_NOTE',
      note: cleaned.cleanedNote,
      rawTranscript: transcript,
      summary: parsed.summary ?? `Log note: ${cleaned.cleanedNote.slice(0, 60)}`,
    };
  }

  return {
    type: 'UNKNOWN',
    transcript,
    summary: parsed.summary ?? 'Sorry, I did not catch that',
  };
}
