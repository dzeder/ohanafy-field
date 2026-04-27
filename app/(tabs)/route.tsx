import { Text, View } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function Route(): React.ReactNode {
  return (
    <ErrorBoundary screenName="Route">
      <View
        accessibilityLabel="Today's route"
        className="flex-1 bg-ohanafy-paper px-6 pt-16 dark:bg-ohanafy-dark-surface"
      >
        <Text className="text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Route
        </Text>
        <Text className="mt-2 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Day 2 fills this in: today's planned stops with a map view.
        </Text>
      </View>
    </ErrorBoundary>
  );
}
