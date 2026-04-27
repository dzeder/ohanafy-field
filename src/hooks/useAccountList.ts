import { useEffect, useState } from 'react';

import { database } from '@/db';
import type { Account } from '@/db/models/Account';
import { observeAccounts, type ListAccountsOptions } from '@/db/repositories/accounts';

export interface AccountListState {
  accounts: Account[];
  loading: boolean;
}

export function useAccountList(opts: ListAccountsOptions): AccountListState {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const subscription = observeAccounts(database, opts).subscribe((next) => {
      setAccounts(next);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.search, opts.needsAttentionOnly]);

  return { accounts, loading };
}
