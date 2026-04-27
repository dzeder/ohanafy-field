import { Text, View } from 'react-native';

import { ErrorBoundary } from './ErrorBoundary';

interface RoleTabPlaceholderProps {
  screenName: string;
  title: string;
  description: string;
}

export function RoleTabPlaceholder({
  screenName,
  title,
  description,
}: RoleTabPlaceholderProps): React.ReactNode {
  return (
    <ErrorBoundary screenName={screenName}>
      <View
        accessibilityLabel={`${title} screen — under construction`}
        className="flex-1 bg-ohanafy-paper px-6 pt-16 dark:bg-ohanafy-dark-surface"
      >
        <Text className="text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          {title}
        </Text>
        <Text className="mt-2 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
          {description}
        </Text>
        <View className="mt-6 rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
          <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Status
          </Text>
          <Text className="mt-1 text-sm text-ohanafy-ink dark:text-ohanafy-dark-text">
            Functional layout in place. Live data and full interactions land in v1.1 once the
            Field Sales Rep flow is validated with the pilot customer.
          </Text>
        </View>
      </View>
    </ErrorBoundary>
  );
}
