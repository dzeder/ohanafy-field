import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class SyncQueueItem extends Model {
  static table = 'sync_queue';

  @field('operation_type') operationType!: string;
  @field('entity_type') entityType!: string;
  @field('entity_id') entityId!: string;
  @field('payload_json') payloadJson!: string;
  @field('status') status!: string;
  @field('attempts') attempts!: number;
  @field('last_error') lastError?: string;
  @date('created_at') createdAt!: Date;
  @date('processed_at') processedAt?: Date;
}
