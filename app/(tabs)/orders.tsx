import { Text, View } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function Orders(): React.ReactNode {
  return (
    <ErrorBoundary screenName="Orders">
      <View
        accessibilityLabel="Order history"
        className="flex-1 bg-ohanafy-paper px-6 pt-16 dark:bg-ohanafy-dark-surface"
      >
        <Text className="text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Orders
        </Text>
        <Text className="mt-2 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Day 2 fills this in: order history with sync status badges.
        </Text>
      </View>
    </ErrorBoundary>
  );
}
