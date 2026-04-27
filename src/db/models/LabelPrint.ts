import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class LabelPrint extends Model {
  static table = 'label_prints';

  @field('account_id') accountId!: string;
  @field('product_id') productId?: string;
  @field('template_type') templateType!: string;
  @field('product_name') productName!: string;
  @field('printer_serial') printerSerial?: string;
  @date('printed_at') printedAt!: Date;
  @field('zpl_snapshot') zplSnapshot!: string;
  @field('sync_status') sfSyncStatus!: string;
}
