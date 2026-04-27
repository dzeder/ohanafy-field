import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { Account } from '@/db/models/Account';

interface AccountCardProps {
  account: Account;
  onPress: (id: string) => void;
  isSelected?: boolean;
}

function AccountCardBase({
  account,
  onPress,
  isSelected = false,
}: AccountCardProps): React.ReactNode {
  const lastOrderDays = account.daysSinceLastOrder;
  const subtitle = `${account.addressCity}, ${account.addressState} · ${account.channel}`;
  const lastOrderLabel =
    lastOrderDays === 0 ? 'Today' : `${lastOrderDays}d since last order`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${account.name}, ${subtitle}, ${lastOrderLabel}`}
      accessibilityHint="Opens account detail"
      accessibilityState={{ selected: isSelected }}
      onPress={() => onPress(account.id)}
      testID={`account-card-${account.sfId}`}
      className={
        isSelected
          ? 'mx-4 mb-3 rounded-2xl border-2 border-ohanafy-denim bg-ohanafy-paper p-4 dark:bg-ohanafy-dark-elevated'
          : 'mx-4 mb-3 rounded-2xl bg-ohanafy-paper p-4 active:opacity-80 dark:bg-ohanafy-dark-elevated'
      }
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          {account.name}
        </Text>
        {account.needsAttention ? (
          <View
            accessibilityLabel="Needs attention"
            className="ml-2 rounded-full bg-ohanafy-mellow px-2 py-0.5"
          >
            <Text className="text-xs font-bold text-ohanafy-ink">!</Text>
          </View>
        ) : null}
      </View>
      <Text className="mt-1 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
        {subtitle}
      </Text>
      <Text className="mt-1 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
        {lastOrderLabel}
      </Text>
    </Pressable>
  );
}

export const AccountCard = memo(
  AccountCardBase,
  (prev, next) =>
    prev.account.id === next.account.id &&
    prev.account.needsAttention === next.account.needsAttention &&
    prev.account.daysSinceLastOrder === next.account.daysSinceLastOrder &&
    prev.isSelected === next.isSelected &&
    prev.onPress === next.onPress
);
