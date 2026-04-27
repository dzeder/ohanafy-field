import { z } from 'zod';

import type { AddToOrderItem } from '@/store/voice-store';

// Pure-data tool — no AI call inside. The agent (command-agent.ts) calls
// Anthropic, parses the JSON response, then invokes this handler with the
// parsed candidate items. This handler validates against the catalog and
// rejects fabricated products. AI never invents data.

export const InterpretOrderInputSchema = z.object({
  candidates: z.array(
    z.object({
      productNameSpoken: z.string().min(1).max(120),
      quantity: z.number().int().min(1).max(999),
      unit: z.enum(['keg', 'case']).optional(),
    })
  ),
  productCatalog: z.array(
    z.object({
      sfId: z.string(),
      name: z.string(),
      unit: z.enum(['keg', 'case']),
      pricePerUnit: z.number().nonnegative(),
    })
  ),
});

export type InterpretOrderInput = z.infer<typeof InterpretOrderInputSchema>;

export interface InterpretOrderOutput {
  itemsToAdd: AddToOrderItem[];
  unmatched: string[];
  confidence: 'high' | 'medium' | 'low';
}

function similarityScore(spoken: string, candidate: string): number {
  const a = spoken.toLowerCase().trim();
  const b = candidate.toLowerCase().trim();
  if (a === b) return 1;
  if (b.includes(a) || a.includes(b)) return 0.85;
  // Token overlap
  const aTokens = new Set(a.split(/\s+/));
  const bTokens = new Set(b.split(/\s+/));
  let overlap = 0;
  for (const t of aTokens) if (bTokens.has(t)) overlap += 1;
  return overlap / Math.max(aTokens.size, bTokens.size);
}

export function interpretOrder(input: InterpretOrderInput): InterpretOrderOutput {
  const itemsToAdd: AddToOrderItem[] = [];
  const unmatched: string[] = [];

  for (const candidate of input.candidates) {
    let bestProduct = null as null | InterpretOrderInput['productCatalog'][number];
    let bestScore = 0;
    for (const product of input.productCatalog) {
      // Honor the spoken unit if provided
      if (candidate.unit && candidate.unit !== product.unit) continue;
      const score = similarityScore(candidate.productNameSpoken, product.name);
      if (score > bestScore) {
        bestScore = score;
        bestProduct = product;
      }
    }

    if (!bestProduct || bestScore < 0.5) {
      unmatched.push(candidate.productNameSpoken);
      continue;
    }

    const itemConfidence: 'high' | 'medium' | 'low' =
      bestScore >= 0.85 ? 'high' : bestScore >= 0.65 ? 'medium' : 'low';

    itemsToAdd.push({
      productSfId: bestProduct.sfId,
      productName: bestProduct.name,
      quantity: candidate.quantity,
      unit: bestProduct.unit,
      unitPrice: bestProduct.pricePerUnit,
      lineTotal: bestProduct.pricePerUnit * candidate.quantity,
      confidence: itemConfidence,
    });
  }

  const confidence: 'high' | 'medium' | 'low' =
    itemsToAdd.length === 0
      ? 'low'
      : itemsToAdd.every((i) => i.confidence === 'high')
        ? 'high'
        : itemsToAdd.some((i) => i.confidence === 'low')
          ? 'low'
          : 'medium';

  return { itemsToAdd, unmatched, confidence };
}
