# WatermelonDB Patterns for Ohanafy Field

## Always write inside transactions
```typescript
await database.write(async () => {
  await collection.create(record => {
    record.name = value;
  });
});
```
Writing outside transactions is silent corruption risk.

## Reactive queries (UI layer)
```typescript
// In components: use withObservables HOC or useLiveQuery hook
const accounts = useLiveQuery(
  () => database.get<Account>('accounts').query(Q.where('needs_attention', true)),
  []
);
```
The UI re-renders automatically when the query result changes.

## Non-reactive queries (in sync engine, agents)
```typescript
const items = await database.get<SyncQueueItem>('sync_queue')
  .query(Q.where('status', 'pending'), Q.take(10))
  .fetch();
```

## Migration pattern
```typescript
// src/db/migrations/index.ts
import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations';
export default schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [addColumns({ table: 'accounts', columns: [{ name: 'new_field', type: 'string' }] })],
    },
  ],
});
```
Always increment `schema.version` AND add a migration. Mismatched versions crash on launch.

## Index strategy
Index: `sf_id`, `account_id`, `rep_id`, `status`, `sync_status`, `needs_attention`, `created_at`
Do NOT index: `notes`, `raw_transcript`, `payload_json` (large text fields)

## Batch operations
```typescript
await database.write(async () => {
  await database.batch(
    ...items.map(item => collection.prepareCreate(r => { r.field = item.value; }))
  );
});
```
Use `batch` for seeding or bulk updates — orders of magnitude faster than individual creates.
