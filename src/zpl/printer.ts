// Zebra printer wrapper. Day 4 ships a TypeScript stub that logs the ZPL string
// in dev — the actual native bridge to Zebra Link-OS SDK is added in a Day 5/6
// iOS+Android dev build. This wrapper keeps every screen + repository call site
// stable across both phases.

import { Platform } from 'react-native';

import { database } from '@/db';
import type { LabelPrint } from '@/db/models/LabelPrint';

export interface DiscoveredPrinter {
  serial: string;
  name: string;
  connectionType: 'bluetooth' | 'network';
}

export async function discoverPrinters(): Promise<DiscoveredPrinter[]> {
  // Stub. Real impl uses Zebra Link-OS SDK BluetoothDeviceManager.
  // eslint-disable-next-line no-console
  console.warn('[zebra] discoverPrinters: stub — returning empty list. Native module pending.');
  return [];
}

export interface PrintResult {
  success: boolean;
  printerSerial: string;
  message: string;
  simulated: boolean;
}

export async function printZpl(
  zpl: string,
  options: { printerSerial?: string } = {}
): Promise<PrintResult> {
  const printerSerial = options.printerSerial ?? 'simulator';
  // Stub. Real impl resolves the ZQ520/ZQ630 instance and calls .write(zpl).
  // eslint-disable-next-line no-console
  console.warn(`[zebra] printZpl on ${Platform.OS}: stub — ZPL string captured.`);
  // eslint-disable-next-line no-console
  console.warn(zpl);
  return {
    success: true,
    printerSerial,
    message: 'Simulated print (Day 5 device build wires the native bridge)',
    simulated: true,
  };
}

export interface RecordLabelPrintInput {
  accountId: string;
  productId?: string;
  templateType: 'shelf_talker' | 'product_card' | 'delivery_receipt';
  productName: string;
  printerSerial?: string;
  zplSnapshot: string;
}

export async function recordLabelPrint(input: RecordLabelPrintInput): Promise<LabelPrint> {
  let created!: LabelPrint;
  await database.write(async () => {
    created = await database.get<LabelPrint>('label_prints').create((rec) => {
      rec.accountId = input.accountId;
      rec.productId = input.productId;
      rec.templateType = input.templateType;
      rec.productName = input.productName;
      rec.printerSerial = input.printerSerial;
      rec.printedAt = new Date();
      rec.zplSnapshot = input.zplSnapshot;
      rec.sfSyncStatus = 'pending';
    });
  });
  return created;
}
