import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Memory extends Model {
  static table = 'memories';

  @field('rep_id') repId!: string;
  @field('account_id') accountId?: string;
  @field('category') category!: string;
  @field('key') key!: string;
  @field('value') value!: string;
  @field('confidence') confidence!: number;
  @field('source') source!: string;
  @field('use_count') useCount!: number;
  @date('last_used_at') lastUsedAt?: Date;
  @date('created_at') createdAt!: Date;
  @field('sf_id') sfId?: string;
  @field('sync_status') sfSyncStatus!: string;
}
