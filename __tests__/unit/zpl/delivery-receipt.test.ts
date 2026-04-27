import { generateDeliveryReceipt } from '@/zpl/templates/delivery-receipt';

describe('generateDeliveryReceipt', () => {
  const baseParams = {
    accountName: 'The Rail',
    orderNumber: 'OF-1042',
    // Local-time Date constructor — always renders as 4/30/2026 via
    // toLocaleDateString regardless of the test runner's timezone (CI is UTC,
    // local dev may be EDT/PDT — both interpret this the same way).
    deliveryDate: new Date(2026, 3, 30),
    rep: 'Jake Thornton',
    lines: [
      {
        productName: 'Yellowhammer Pale Ale',
        quantity: 2,
        unit: 'keg',
        unitPrice: 178,
        lineTotal: 356,
      },
      {
        productName: 'Modelo Especial',
        quantity: 1,
        unit: 'keg',
        unitPrice: 192,
        lineTotal: 192,
      },
    ],
    totalAmount: 548,
  };

  it('starts with ^XA and ends with ^XZ', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    expect(zpl).toMatch(/^\^XA/);
    expect(zpl.trim()).toMatch(/\^XZ$/);
  });

  it('uses PW640 LL960 for 4×6 inch receipt', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    expect(zpl).toContain('^PW640');
    expect(zpl).toContain('^LL960');
  });

  it('all ^FO x coordinates within margin (<= 620)', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    const xCoords = [...zpl.matchAll(/\^FO(\d+),/g)].map((m) => Number.parseInt(m[1], 10));
    for (const x of xCoords) {
      expect(x).toBeLessThanOrEqual(620);
    }
  });

  it('renders each line item exactly once', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    expect((zpl.match(/Yellowhammer Pale Ale/g) ?? []).length).toBe(1);
    expect((zpl.match(/Modelo Especial/g) ?? []).length).toBe(1);
  });

  it('shows line totals correctly (qty × unitPrice = lineTotal)', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    expect(zpl).toContain('$356.00');
    expect(zpl).toContain('$192.00');
  });

  it('renders the order total', () => {
    const zpl = generateDeliveryReceipt(baseParams);
    expect(zpl).toContain('Total: $548.00');
  });

  it('caps to 16 lines when more are provided', () => {
    const manyLines = Array.from({ length: 25 }, (_, i) => ({
      productName: `Product ${i}`,
      quantity: 1,
      unit: 'case',
      unitPrice: 10,
      lineTotal: 10,
    }));
    const zpl = generateDeliveryReceipt({ ...baseParams, lines: manyLines });
    expect(zpl).toContain('Product 0');
    expect(zpl).toContain('Product 15');
    expect(zpl).not.toContain('Product 16');
  });

  it('matches snapshot', () => {
    expect(generateDeliveryReceipt(baseParams)).toMatchSnapshot();
  });
});
