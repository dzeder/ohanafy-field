import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Order extends Model {
  static table = 'orders';

  @field('sf_id') sfId?: string;
  @field('account_id') accountId!: string;
  @field('account_sf_id') accountSfId!: string;
  @field('rep_id') repId!: string;
  @field('status') status!: string;
  @date('order_date') orderDate!: Date;
  @date('delivery_date') deliveryDate?: Date;
  @field('total_amount') totalAmount!: number;
  @field('notes') notes?: string;
  @field('sync_status') sfSyncStatus!: string;
  @field('sync_attempts') syncAttempts!: number;
  @field('created_offline') createdOffline!: boolean;
  @date('created_at') createdAt!: Date;
  @date('updated_at') updatedAt!: Date;
}
