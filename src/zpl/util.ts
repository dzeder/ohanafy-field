// ZPL II text safety helpers — shared across templates.

export function truncate(text: string, maxChars: number, suffix = '…'): string {
  if (text.length <= maxChars) return text;
  return text.slice(0, maxChars - suffix.length).trimEnd() + suffix;
}

// Strip / replace characters that break ZPL field data (caret, tilde).
export function sanitizeForZpl(text: string): string {
  return text.replace(/\^/g, '/').replace(/~/g, '-');
}

export function dollars(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

// dpmm × 25.4 × inches — see zpl2-reference skill
export function inchesToDots(inches: number, dpmm = 8): number {
  return Math.round(inches * dpmm * 25.4);
}
