import type { Database } from '@nozbe/watermelondb';

import { callClaude } from '@/ai/client';
import { VISIT_PREP_SYSTEM_PROMPT } from '@/ai/prompts/visit-prep';
import {
  AccountIntelInputSchema,
  getAccountIntel,
  type AccountIntelInput,
  type AccountIntelOutput,
  type Urgency,
} from '@/ai/tools/get-account-intel';
import type { Account } from '@/db/models/Account';
import { listOrdersForAccount, listLinesForOrder } from '@/db/repositories/orders';
import { listVisitsForAccount } from '@/db/repositories/visits';

const TIMEOUT_MS = 3000;

interface VisitPrepInput {
  account: Account;
  db: Database;
}

export interface VisitInsight {
  urgency: Urgency;
  headline: string;
  reason: string;
  suggestedAction: string;
}

async function gatherContext(input: VisitPrepInput): Promise<AccountIntelInput> {
  const { account, db } = input;
  const visits = await listVisitsForAccount(db, account.id, 3);
  const orders = await listOrdersForAccount(db, account.id);
  const lastOrder = orders[0];
  const lastOrderLines = lastOrder ? await listLinesForOrder(db, lastOrder.id) : [];

  const now = Date.now();
  return AccountIntelInputSchema.parse({
    account: {
      name: account.name,
      daysSinceLastOrder: account.daysSinceLastOrder,
      ytdRevenue: account.ytdRevenue,
      needsAttention: account.needsAttention,
      channel: account.channel,
    },
    recentVisits: visits.map((v) => ({
      daysAgo: Math.floor((now - v.visitDate.getTime()) / (24 * 60 * 60 * 1000)),
      note: v.note,
    })),
    lastOrderLines: lastOrderLines.map((l) => ({
      productName: l.productName,
      quantity: l.quantity,
      unit: l.unit,
    })),
  });
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch(() => {
        clearTimeout(timer);
        resolve(null);
      });
  });
}

export async function getVisitInsight(input: VisitPrepInput): Promise<VisitInsight> {
  const context = await gatherContext(input);
  const fallback: AccountIntelOutput = getAccountIntel(context);

  // Try the LLM for a more specific headline; fall back to the deterministic
  // result if it takes longer than 3s. This is the §6 "non-blocking insight"
  // contract: the banner appears or it doesn't — never spins.
  const aiResult = await withTimeout(
    callClaude({
      systemPrompt: VISIT_PREP_SYSTEM_PROMPT,
      userMessage: JSON.stringify(context),
      maxTokens: 256,
      temperature: 0.2,
    }),
    TIMEOUT_MS
  );

  if (!aiResult) return fallback;

  const stripped = aiResult
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();
  try {
    const parsed = JSON.parse(stripped) as Partial<VisitInsight>;
    return {
      urgency: fallback.urgency, // urgency is deterministic — don't let the LLM downgrade it
      headline: parsed.headline ?? fallback.headline,
      reason: parsed.reason ?? fallback.reason,
      suggestedAction: parsed.suggestedAction ?? fallback.suggestedAction,
    };
  } catch {
    return fallback;
  }
}
