// Labelary preview API — renders ZPL to a PNG.
// Free tier, no auth: http://api.labelary.com/v1/printers/{dpmm}dpmm/labels/{W}x{H}/{idx}/

interface PreviewOptions {
  zpl: string;
  widthInches: number;
  heightInches: number;
  dpmm?: 8 | 12;
}

export async function renderZplPreview(opts: PreviewOptions): Promise<{
  pngBase64: string;
}> {
  const dpmm = opts.dpmm ?? 8;
  const url = `http://api.labelary.com/v1/printers/${dpmm}dpmm/labels/${opts.widthInches}x${opts.heightInches}/0/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'image/png',
    },
    body: opts.zpl,
  });
  if (!response.ok) {
    throw new Error(`Labelary preview failed: ${response.status} ${response.statusText}`);
  }
  // RN's fetch supports response.arrayBuffer(); we base64-encode it for inline display
  const buffer = await response.arrayBuffer();
  return { pngBase64: arrayBufferToBase64(buffer) };
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  // btoa is available in RN's Hermes JS runtime as a global
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const g = globalThis as any;
  if (typeof g.btoa === 'function') return g.btoa(binary);
  // Node fallback for tests
  return Buffer.from(binary, 'binary').toString('base64');
}
