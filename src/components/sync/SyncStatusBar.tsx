import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { database } from '@/db';
import { countPending } from '@/db/repositories/sync-queue';

export function SyncStatusBar(): React.ReactNode {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    let active = true;
    const tick = async (): Promise<void> => {
      const n = await countPending(database);
      if (active) setPending(n);
    };
    tick();
    const id = setInterval(tick, 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (pending === 0) return null;

  return (
    <View
      accessibilityLabel={`${pending} ${pending === 1 ? 'item' : 'items'} pending sync`}
      accessibilityLiveRegion="polite"
      className="bg-ohanafy-cork px-4 py-1.5 dark:bg-ohanafy-dark-elevated"
    >
      <Text className="text-center text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
        {pending} {pending === 1 ? 'change' : 'changes'} pending sync
      </Text>
    </View>
  );
}
