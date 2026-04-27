import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Account extends Model {
  static table = 'accounts';

  @field('sf_id') sfId!: string;
  @field('name') name!: string;
  @field('account_type') accountType!: string;
  @field('channel') channel!: string;
  @field('territory_id') territoryId!: string;
  @field('contact_name') contactName!: string;
  @field('contact_title') contactTitle!: string;
  @field('contact_phone') contactPhone!: string;
  @field('address_street') addressStreet!: string;
  @field('address_city') addressCity!: string;
  @field('address_state') addressState!: string;
  @field('latitude') latitude?: number;
  @field('longitude') longitude?: number;
  @date('last_order_date') lastOrderDate?: Date;
  @date('last_visit_date') lastVisitDate?: Date;
  @field('days_since_last_order') daysSinceLastOrder!: number;
  @field('ytd_revenue') ytdRevenue!: number;
  @field('needs_attention') needsAttention!: boolean;
  @date('synced_at') syncedAt!: Date;
  @field('is_archived') isArchived!: boolean;
}
