import { dollars, sanitizeForZpl, truncate } from '../util';

export interface ProductCardParams {
  productName: string;
  skuCode: string;
  pricePerCase: number;
  facts: string[]; // 1–3 short bullets
}

// 4" × 3" @ 8dpmm — PW=640 (margin 620), LL=480
const PW = 640;
const LL = 480;
const MAX_NAME_CHARS = 28;
const MAX_FACT_CHARS = 40;
const MAX_FACTS = 3;

export function generateProductCard(params: ProductCardParams): string {
  const name = sanitizeForZpl(truncate(params.productName, MAX_NAME_CHARS));
  const sku = sanitizeForZpl(truncate(params.skuCode, 24));
  const price = dollars(params.pricePerCase);
  const facts = params.facts
    .slice(0, MAX_FACTS)
    .map((f) => sanitizeForZpl(truncate(f, MAX_FACT_CHARS)));

  const lines = [
    '^XA',
    '^CI28',
    `^PW${PW}`,
    `^LL${LL}`,
    // Header band
    `^FO30,25^A0N,48,48^FD${name}^FS`,
    `^FO30,80^A0N,28,28^FDSKU: ${sku}^FS`,
    // Divider
    `^FO30,120^GB580,2,2^FS`,
    // Price
    `^FO30,140^A0N,72,72^FD${price}^FS`,
  ];

  // Facts
  facts.forEach((fact, idx) => {
    const y = 230 + idx * 50;
    lines.push(`^FO30,${y}^A0N,28,28^FD• ${fact}^FS`);
  });

  lines.push('^XZ');
  return lines.join('\n');
}
