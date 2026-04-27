import { Model } from '@nozbe/watermelondb';
import { field, date } from '@nozbe/watermelondb/decorators';

export class Permission extends Model {
  static table = 'permissions';

  @field('user_id') userId!: string;
  @field('roles_json') rolesJson!: string;
  @field('primary_role') primaryRole!: string;
  @field('custom_perms_json') customPermsJson!: string;
  @date('fetched_at') fetchedAt!: Date;
}
