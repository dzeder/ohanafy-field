import { Text, View } from 'react-native';

interface EmptyStateProps {
  title: string;
  description?: string;
}

export function EmptyState({ title, description }: EmptyStateProps): React.ReactNode {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={description ? `${title}. ${description}` : title}
      className="flex-1 items-center justify-center px-8 py-16"
    >
      <Text className="mb-2 text-center text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
        {title}
      </Text>
      {description ? (
        <Text className="text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
          {description}
        </Text>
      ) : null}
    </View>
  );
}
