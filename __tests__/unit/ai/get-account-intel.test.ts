import { getAccountIntel } from '@/ai/tools/get-account-intel';

const BASE_ACCOUNT = {
  name: 'The Rail',
  daysSinceLastOrder: 7,
  ytdRevenue: 41250,
  needsAttention: false,
  channel: 'Bar',
};

describe('getAccountIntel', () => {
  it('returns urgency: high when last order > 28 days', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 32 },
      recentVisits: [],
      lastOrderLines: [
        { productName: 'Yellowhammer Pale Ale', quantity: 2, unit: 'keg' },
      ],
    });
    expect(result.urgency).toBe('high');
    expect(result.headline).toContain('32');
    expect(result.suggestedAction).toContain('Yellowhammer Pale Ale');
  });

  it('returns urgency: medium when last order between 14 and 28 days', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 21 },
      recentVisits: [],
      lastOrderLines: [],
    });
    expect(result.urgency).toBe('medium');
  });

  it('returns urgency: low when last order < 14 days and not flagged', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 6 },
      recentVisits: [],
      lastOrderLines: [],
    });
    expect(result.urgency).toBe('low');
    expect(result.suggestedAction).toMatch(/check-in|new SKU/i);
  });

  it('promotes to medium urgency when needsAttention is true even if days < 14', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 5, needsAttention: true },
      recentVisits: [],
      lastOrderLines: [],
    });
    expect(result.urgency).toBe('medium');
    expect(result.headline).toContain('Flagged');
  });

  it('surfaces last visit note in the reason when present', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 30 },
      recentVisits: [
        { daysAgo: 28, note: 'Tap issue on the lager line still unresolved' },
      ],
      lastOrderLines: [],
    });
    expect(result.reason).toContain('Tap issue');
  });

  it('falls back to safe copy when no recent visits or last order lines', () => {
    const result = getAccountIntel({
      account: { ...BASE_ACCOUNT, daysSinceLastOrder: 30 },
      recentVisits: [],
      lastOrderLines: [],
    });
    expect(result.headline).toContain('30');
    expect(result.suggestedAction).toBeTruthy();
  });
});
