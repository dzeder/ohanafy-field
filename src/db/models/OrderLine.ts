import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class OrderLine extends Model {
  static table = 'order_lines';

  @field('order_id') orderId!: string;
  @field('product_id') productId!: string;
  @field('product_sf_id') productSfId!: string;
  @field('product_name') productName!: string;
  @field('quantity') quantity!: number;
  @field('unit') unit!: string;
  @field('unit_price') unitPrice!: number;
  @field('line_total') lineTotal!: number;
}
