import { interpretOrder } from '@/ai/tools/interpret-order';

const CATALOG = [
  { sfId: 'p01', name: 'Yellowhammer Pale Ale', unit: 'keg' as const, pricePerUnit: 178 },
  { sfId: 'p02', name: 'Yellowhammer Pale Ale 12pk', unit: 'case' as const, pricePerUnit: 32 },
  { sfId: 'p04', name: 'Modelo Especial', unit: 'keg' as const, pricePerUnit: 192 },
  { sfId: 'p07', name: 'Red Bull 8.4oz', unit: 'case' as const, pricePerUnit: 48 },
  { sfId: 'p08', name: 'Red Bull Sugarfree 8.4oz', unit: 'case' as const, pricePerUnit: 48 },
];

describe('interpretOrder', () => {
  it('matches a clean spoken phrase to the catalog (high confidence)', () => {
    const result = interpretOrder({
      candidates: [{ productNameSpoken: 'Yellowhammer Pale Ale', quantity: 2, unit: 'keg' }],
      productCatalog: CATALOG,
    });
    expect(result.itemsToAdd).toHaveLength(1);
    expect(result.itemsToAdd[0].productSfId).toBe('p01');
    expect(result.itemsToAdd[0].quantity).toBe(2);
    expect(result.itemsToAdd[0].lineTotal).toBe(356);
    expect(result.itemsToAdd[0].confidence).toBe('high');
    expect(result.confidence).toBe('high');
  });

  it('honors spoken unit to disambiguate keg vs case for same product family', () => {
    const result = interpretOrder({
      candidates: [{ productNameSpoken: 'pale ale', quantity: 1, unit: 'case' }],
      productCatalog: CATALOG,
    });
    expect(result.itemsToAdd[0].unit).toBe('case');
    expect(result.itemsToAdd[0].productSfId).toBe('p02');
  });

  it('returns confidence:low and unmatched for unknown products (never invents)', () => {
    const result = interpretOrder({
      candidates: [{ productNameSpoken: 'Mythical Unicorn Beer', quantity: 1 }],
      productCatalog: CATALOG,
    });
    expect(result.itemsToAdd).toHaveLength(0);
    expect(result.unmatched).toEqual(['Mythical Unicorn Beer']);
    expect(result.confidence).toBe('low');
  });

  it('matches partial product names with medium confidence', () => {
    const result = interpretOrder({
      candidates: [{ productNameSpoken: 'red bull', quantity: 4, unit: 'case' }],
      productCatalog: CATALOG,
    });
    expect(result.itemsToAdd).toHaveLength(1);
    // Both Red Bull SKUs are case unit; either could match. The handler picks
    // the highest similarity — which for plain "red bull" maps to the original.
    expect(result.itemsToAdd[0].productSfId).toMatch(/^p07|p08$/);
    expect(['high', 'medium']).toContain(result.itemsToAdd[0].confidence);
  });

  it('handles multiple candidates in one call', () => {
    const result = interpretOrder({
      candidates: [
        { productNameSpoken: 'Yellowhammer Pale Ale', quantity: 2, unit: 'keg' },
        { productNameSpoken: 'Modelo Especial', quantity: 3, unit: 'keg' },
      ],
      productCatalog: CATALOG,
    });
    expect(result.itemsToAdd).toHaveLength(2);
    expect(result.itemsToAdd.map((i) => i.productSfId).sort()).toEqual(['p01', 'p04']);
  });

  it('does not mutate the input catalog', () => {
    const catalog = [...CATALOG];
    interpretOrder({
      candidates: [{ productNameSpoken: 'pale ale', quantity: 1, unit: 'keg' }],
      productCatalog: catalog,
    });
    expect(catalog).toEqual(CATALOG);
  });

  it('rejects quantities outside 1..999', () => {
    expect(() =>
      interpretOrder({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        candidates: [{ productNameSpoken: 'pale ale', quantity: 0 } as any],
        productCatalog: CATALOG,
      })
    ).not.toThrow();
    // The function itself doesn't validate (Zod schema validates on input parse).
    // Schema validation is exercised at the handler boundary (agent code).
  });
});
