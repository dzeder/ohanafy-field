export { generateShelfTalker } from './shelf-talker';
export type { ShelfTalkerParams } from './shelf-talker';
export { generateProductCard } from './product-card';
export type { ProductCardParams } from './product-card';
export { generateDeliveryReceipt } from './delivery-receipt';
export type {
  DeliveryReceiptParams,
  DeliveryReceiptLine,
} from './delivery-receipt';

export type LabelTemplateType = 'shelf_talker' | 'product_card' | 'delivery_receipt';
