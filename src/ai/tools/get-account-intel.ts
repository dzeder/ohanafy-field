import { z } from 'zod';

export const AccountIntelInputSchema = z.object({
  account: z.object({
    name: z.string(),
    daysSinceLastOrder: z.number().int().nonnegative(),
    ytdRevenue: z.number().nonnegative(),
    needsAttention: z.boolean(),
    channel: z.string(),
  }),
  recentVisits: z
    .array(
      z.object({
        daysAgo: z.number().int().nonnegative(),
        note: z.string().optional(),
      })
    )
    .max(5),
  lastOrderLines: z
    .array(
      z.object({
        productName: z.string(),
        quantity: z.number().int(),
        unit: z.string(),
      })
    )
    .max(20),
});

export type AccountIntelInput = z.infer<typeof AccountIntelInputSchema>;

export type Urgency = 'high' | 'medium' | 'low';

export interface AccountIntelOutput {
  urgency: Urgency;
  headline: string;
  reason: string;
  suggestedAction: string;
}

// Pure handler that derives urgency from the structured account context.
// The AI agent (visit-prep-agent.ts) layers a natural-language headline on
// top by calling Claude — but the urgency + suggestedAction are deterministic.
export function getAccountIntel(input: AccountIntelInput): AccountIntelOutput {
  const { account, recentVisits, lastOrderLines } = input;

  let urgency: Urgency;
  if (account.daysSinceLastOrder > 28) {
    urgency = 'high';
  } else if (account.daysSinceLastOrder >= 14 || account.needsAttention) {
    urgency = 'medium';
  } else {
    urgency = 'low';
  }

  const reorderHint = lastOrderLines
    .slice(0, 2)
    .map((l) => `${l.quantity} ${l.unit}${l.quantity === 1 ? '' : 's'} ${l.productName}`)
    .join(' + ');

  let headline: string;
  let suggestedAction: string;
  let reason: string;

  if (urgency === 'high') {
    headline = `${account.daysSinceLastOrder} days since last order`;
    reason = recentVisits[0]?.note
      ? `Last visit note: "${recentVisits[0].note.slice(0, 100)}"`
      : `${account.name} hasn't ordered in over 4 weeks. Reorder window is closing.`;
    suggestedAction = reorderHint
      ? `Suggest a reorder of ${reorderHint}.`
      : 'Pitch a fresh assortment based on the last order.';
  } else if (urgency === 'medium') {
    headline = account.needsAttention
      ? `Flagged for attention`
      : `${account.daysSinceLastOrder} days since last order`;
    reason = recentVisits[0]?.note
      ? `Last visit note: "${recentVisits[0].note.slice(0, 100)}"`
      : 'Watch for a potential reorder this visit.';
    suggestedAction = reorderHint
      ? `Confirm if they want to reorder ${reorderHint}.`
      : 'Walk the back-of-house and check tap status.';
  } else {
    headline = 'Recent order on the books';
    reason = `${account.name} ordered ${account.daysSinceLastOrder} days ago. YTD revenue $${account.ytdRevenue.toLocaleString()}.`;
    suggestedAction = 'Friendly check-in. Discuss new SKUs or promotional opportunities.';
  }

  return { urgency, headline, reason, suggestedAction };
}
