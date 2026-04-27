import { dollars, sanitizeForZpl, truncate } from '../util';

export interface ShelfTalkerParams {
  productName: string;
  skuCode: string;
  pricePerCase: number;
  promoLine?: string;
}

// 2.5" × 1.5" @ 8dpmm — keep all ^FO x coordinates < 380 (PW400 - 20 margin).
// Layout (top to bottom):
//   1. Product name (36pt, truncated to 22 chars)
//   2. SKU code (22pt, secondary)
//   3. Price (54pt — most prominent)
//   4. Optional promo line (22pt italics-ish via spacing)
const PW = 400;
const LL = 240;
const MAX_NAME_CHARS = 22;
const MAX_PROMO_CHARS = 28;

export function generateShelfTalker(params: ShelfTalkerParams): string {
  const name = sanitizeForZpl(truncate(params.productName, MAX_NAME_CHARS));
  const sku = sanitizeForZpl(truncate(params.skuCode, 18));
  const price = dollars(params.pricePerCase);
  const promo = params.promoLine
    ? sanitizeForZpl(truncate(params.promoLine, MAX_PROMO_CHARS))
    : null;

  const lines = [
    '^XA',
    '^CI28',
    `^PW${PW}`,
    `^LL${LL}`,
    // Name
    `^FO20,15^A0N,36,36^FD${name}^FS`,
    // SKU
    `^FO20,60^A0N,22,22^FD${sku}^FS`,
    // Price (right-aligned via FB block)
    `^FO20,95^A0N,54,54^FD${price}^FS`,
  ];

  if (promo) {
    lines.push(`^FO20,170^A0N,22,22^FD${promo}^FS`);
  }

  lines.push('^XZ');
  return lines.join('\n');
}
