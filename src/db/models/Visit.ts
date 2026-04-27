import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Visit extends Model {
  static table = 'visits';

  @field('sf_id') sfId?: string;
  @field('account_id') accountId!: string;
  @field('account_sf_id') accountSfId!: string;
  @field('rep_id') repId!: string;
  @date('visit_date') visitDate!: Date;
  @field('duration_minutes') durationMinutes?: number;
  @field('note') note?: string;
  @field('raw_transcript') rawTranscript?: string;
  @field('ai_insight') aiInsight?: string;
  @field('insight_feedback') insightFeedback?: string;
  @field('order_id') orderId?: string;
  @field('sync_status') sfSyncStatus!: string;
  @field('sync_attempts') syncAttempts!: number;
  @field('created_offline') createdOffline!: boolean;
}
