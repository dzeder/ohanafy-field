export {
  generateShelfTalker,
  generateProductCard,
  generateDeliveryReceipt,
} from './templates';
export type {
  ShelfTalkerParams,
  ProductCardParams,
  DeliveryReceiptParams,
  DeliveryReceiptLine,
  LabelTemplateType,
} from './templates';

export { renderZplPreview } from './preview';
export {
  discoverPrinters,
  printZpl,
  recordLabelPrint,
} from './printer';
export type { DiscoveredPrinter, PrintResult, RecordLabelPrintInput } from './printer';
