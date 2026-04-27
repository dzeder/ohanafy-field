import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class FeedbackEvent extends Model {
  static table = 'feedback_events';

  @field('rep_id') repId!: string;
  @field('account_id') accountId?: string;
  @field('event_type') eventType!: string;
  @field('ai_output') aiOutput!: string;
  @field('user_correction') userCorrection?: string;
  @field('context_json') contextJson!: string;
  @date('created_at') createdAt!: Date;
  @field('synthesized') synthesized!: boolean;
}
