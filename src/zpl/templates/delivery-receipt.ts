import { dollars, sanitizeForZpl, truncate } from '../util';

export interface DeliveryReceiptLine {
  productName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  lineTotal: number;
}

export interface DeliveryReceiptParams {
  accountName: string;
  orderNumber: string;
  deliveryDate: Date;
  lines: DeliveryReceiptLine[];
  totalAmount: number;
  rep: string;
}

// 4" × 6" @ 8dpmm — PW=640, LL=960
const PW = 640;
const LL = 960;
const MAX_ACCOUNT_CHARS = 28;
const MAX_LINE_CHARS = 28;
const MAX_LINES = 16;
const LINE_HEIGHT = 32;

export function generateDeliveryReceipt(params: DeliveryReceiptParams): string {
  const account = sanitizeForZpl(truncate(params.accountName, MAX_ACCOUNT_CHARS));
  const dateStr = params.deliveryDate.toLocaleDateString('en-US');
  const orderNum = sanitizeForZpl(truncate(params.orderNumber, 20));
  const rep = sanitizeForZpl(truncate(params.rep, 24));
  const lines = params.lines.slice(0, MAX_LINES);

  const out = [
    '^XA',
    '^CI28',
    `^PW${PW}`,
    `^LL${LL}`,
    // Header
    `^FO30,25^A0N,40,40^FDOhanafy Field^FS`,
    `^FO30,75^A0N,24,24^FDDelivery Receipt^FS`,
    // Account block
    `^FO30,130^A0N,28,28^FD${account}^FS`,
    `^FO30,170^A0N,22,22^FDOrder: ${orderNum}^FS`,
    `^FO30,200^A0N,22,22^FDDate: ${dateStr}^FS`,
    `^FO30,230^A0N,22,22^FDRep: ${rep}^FS`,
    // Divider above lines
    `^FO30,275^GB580,2,2^FS`,
    `^FO30,285^A0N,22,22^FDQty  Item                     Total^FS`,
    `^FO30,315^GB580,2,2^FS`,
  ];

  // Line items
  lines.forEach((line, idx) => {
    const y = 330 + idx * LINE_HEIGHT;
    const item = sanitizeForZpl(truncate(line.productName, MAX_LINE_CHARS));
    const total = dollars(line.lineTotal);
    out.push(`^FO30,${y}^A0N,22,22^FD${line.quantity} ${line.unit}  ${item}^FS`);
    out.push(`^FO450,${y}^A0N,22,22^FD${total}^FS`);
  });

  // Total
  const totalY = 330 + lines.length * LINE_HEIGHT + 30;
  out.push(`^FO30,${totalY}^GB580,2,2^FS`);
  out.push(`^FO30,${totalY + 15}^A0N,32,32^FDTotal: ${dollars(params.totalAmount)}^FS`);

  // Signature line
  const sigY = totalY + 80;
  out.push(`^FO30,${sigY}^GB580,2,2^FS`);
  out.push(`^FO30,${sigY + 12}^A0N,18,18^FDSignature^FS`);

  out.push('^XZ');
  return out.join('\n');
}
