import { View } from 'react-native';

interface LoadingSkeletonProps {
  count?: number;
  itemHeight?: number;
}

export function LoadingSkeleton({
  count = 5,
  itemHeight = 88,
}: LoadingSkeletonProps): React.ReactNode {
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
      accessibilityLiveRegion="polite"
      className="px-4 py-2"
    >
      {Array.from({ length: count }, (_, i) => (
        <View
          key={i}
          style={{ height: itemHeight }}
          className="mb-3 rounded-2xl bg-ohanafy-cork dark:bg-ohanafy-dark-elevated"
        />
      ))}
    </View>
  );
}
