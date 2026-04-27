import { generateShelfTalker } from '@/zpl/templates/shelf-talker';

describe('generateShelfTalker', () => {
  it('starts with ^XA and ends with ^XZ', () => {
    const zpl = generateShelfTalker({
      productName: 'Yellowhammer Pale Ale',
      skuCode: 'YH-PA-HB',
      pricePerCase: 142,
    });
    expect(zpl).toMatch(/^\^XA/);
    expect(zpl.trim()).toMatch(/\^XZ$/);
  });

  it('contains UTF-8 charset and PW400', () => {
    const zpl = generateShelfTalker({
      productName: 'Test',
      skuCode: 'T-1',
      pricePerCase: 10,
    });
    expect(zpl).toContain('^CI28');
    expect(zpl).toContain('^PW400');
  });

  it('all ^FO x coordinates are within label width minus margin (< 380)', () => {
    const zpl = generateShelfTalker({
      productName: 'A Very Long Product Name That Might Overflow',
      skuCode: 'VL-PROD-HB-EXTENDED',
      pricePerCase: 999.99,
      promoLine: 'Promo with a much too long banner that goes way over',
    });
    const xCoords = [...zpl.matchAll(/\^FO(\d+),/g)].map((m) => Number.parseInt(m[1], 10));
    for (const x of xCoords) {
      expect(x).toBeLessThan(380);
    }
  });

  it('truncates product name longer than 22 chars', () => {
    const zpl = generateShelfTalker({
      productName: 'This Name Is Way Too Long For The 2.5 Inch Label',
      skuCode: 'TN-LONG',
      pricePerCase: 50,
    });
    expect(zpl).not.toContain('This Name Is Way Too Long For The 2.5 Inch Label');
    expect(zpl).toMatch(/This Name Is Way Too…/);
  });

  it('formats price as $X.XX', () => {
    const zpl = generateShelfTalker({
      productName: 'Test',
      skuCode: 'T-1',
      pricePerCase: 142,
    });
    expect(zpl).toContain('$142.00');
  });

  it('includes promo line when provided', () => {
    const zpl = generateShelfTalker({
      productName: 'Test',
      skuCode: 'T-1',
      pricePerCase: 50,
      promoLine: 'Buy 2 get 1 free',
    });
    expect(zpl).toContain('Buy 2 get 1 free');
  });

  it('omits promo region entirely when no promo line is given', () => {
    const zpl = generateShelfTalker({
      productName: 'Test',
      skuCode: 'T-1',
      pricePerCase: 50,
    });
    // Only 3 ^FO blocks — name, sku, price
    expect(zpl.match(/\^FO/g)).toHaveLength(3);
  });

  it('matches snapshot for regression detection', () => {
    const zpl = generateShelfTalker({
      productName: 'Yellowhammer Pale Ale',
      skuCode: 'YH-PA-HB',
      pricePerCase: 142,
      promoLine: 'New seasonal release',
    });
    expect(zpl).toMatchSnapshot();
  });
});
