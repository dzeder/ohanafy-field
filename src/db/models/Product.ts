import { Model } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

export class Product extends Model {
  static table = 'products';

  @field('sf_id') sfId!: string;
  @field('name') name!: string;
  @field('category') category!: string;
  @field('unit') unit!: string;
  @field('unit_label') unitLabel!: string;
  @field('price_per_unit') pricePerUnit!: number;
  @field('supplier_id') supplierId!: string;
  @field('sku_code') skuCode!: string;
  @field('is_active') isActive!: boolean;
  @field('image_url') imageUrl?: string;
}
