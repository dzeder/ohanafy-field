import { Text, View } from 'react-native';

import { useOfflineStatus } from '@/hooks/useOfflineStatus';

export function OfflineBanner(): React.ReactNode {
  const { isOffline } = useOfflineStatus();
  if (!isOffline) return null;
  return (
    <View
      accessibilityRole="alert"
      accessibilityLabel="You are offline. Changes will sync when you reconnect."
      accessibilityLiveRegion="polite"
      className="bg-ohanafy-denim px-4 py-2"
    >
      <Text className="text-center text-xs font-bold text-ohanafy-paper">
        Offline — changes will sync when you reconnect
      </Text>
    </View>
  );
}
