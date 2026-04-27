import type { Database } from '@nozbe/watermelondb';
import { Q } from '@nozbe/watermelondb';

import type { Account } from '../models/Account';

export interface ListAccountsOptions {
  search?: string;
  needsAttentionOnly?: boolean;
}

function buildQuery(opts: ListAccountsOptions): unknown[] {
  const clauses: unknown[] = [Q.where('is_archived', false)];
  if (opts.needsAttentionOnly) {
    clauses.push(Q.where('needs_attention', true));
  }
  if (opts.search && opts.search.trim().length > 0) {
    clauses.push(Q.where('name', Q.like(`%${Q.sanitizeLikeString(opts.search.trim())}%`)));
  }
  clauses.push(Q.sortBy('name', Q.asc));
  return clauses;
}

export async function listAccounts(
  db: Database,
  opts: ListAccountsOptions = {}
): Promise<Account[]> {
  const collection = db.get<Account>('accounts');
  return collection.query(...(buildQuery(opts) as Parameters<typeof collection.query>)).fetch();
}

export function observeAccounts(db: Database, opts: ListAccountsOptions = {}) {
  const collection = db.get<Account>('accounts');
  return collection.query(...(buildQuery(opts) as Parameters<typeof collection.query>)).observe();
}

export async function getAccountById(db: Database, id: string): Promise<Account | null> {
  try {
    return await db.get<Account>('accounts').find(id);
  } catch {
    return null;
  }
}
