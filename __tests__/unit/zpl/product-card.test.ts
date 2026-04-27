import { generateProductCard } from '@/zpl/templates/product-card';

describe('generateProductCard', () => {
  const baseParams = {
    productName: 'Yellowhammer Belgian White',
    skuCode: 'YH-BW-HB',
    pricePerCase: 184,
    facts: ['Brewed in Birmingham AL', '1/2 bbl keg', 'Year-round'],
  };

  it('starts with ^XA and ends with ^XZ', () => {
    const zpl = generateProductCard(baseParams);
    expect(zpl).toMatch(/^\^XA/);
    expect(zpl.trim()).toMatch(/\^XZ$/);
  });

  it('uses PW640 for 4 inch width', () => {
    const zpl = generateProductCard(baseParams);
    expect(zpl).toContain('^PW640');
  });

  it('all ^FO x coordinates are within label width minus margin (< 620)', () => {
    const zpl = generateProductCard({
      ...baseParams,
      productName: 'An Even Longer Product Name That Tests Boundaries',
    });
    const xCoords = [...zpl.matchAll(/\^FO(\d+),/g)].map((m) => Number.parseInt(m[1], 10));
    for (const x of xCoords) {
      expect(x).toBeLessThan(620);
    }
  });

  it('limits to 3 facts even when more provided', () => {
    const zpl = generateProductCard({
      ...baseParams,
      facts: ['Fact one', 'Fact two', 'Fact three', 'Fact four', 'Fact five'],
    });
    expect(zpl).toContain('Fact one');
    expect(zpl).toContain('Fact two');
    expect(zpl).toContain('Fact three');
    expect(zpl).not.toContain('Fact four');
    expect(zpl).not.toContain('Fact five');
  });

  it('formats price as $X.XX', () => {
    const zpl = generateProductCard(baseParams);
    expect(zpl).toContain('$184.00');
  });

  it('matches snapshot', () => {
    expect(generateProductCard(baseParams)).toMatchSnapshot();
  });
});
