import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { authenticateWithBiometric } from '@/auth/biometric';
import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function BiometricLock(): React.ReactNode {
  const setUnlocked = useAuthStore((s) => s.setBiometricUnlocked);

  const tryUnlock = async (): Promise<void> => {
    const ok = await authenticateWithBiometric();
    if (ok) {
      setUnlocked(true);
      router.replace('/');
    }
  };

  useEffect(() => {
    tryUnlock();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ErrorBoundary screenName="BiometricLock">
      <View
        accessibilityLabel="Biometric unlock"
        className="flex-1 items-center justify-center bg-ohanafy-paper px-6 dark:bg-ohanafy-dark-surface"
      >
        <ActivityIndicator size="large" color="#4A5F80" />
        <Text className="mt-6 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Unlocking with Face ID / Touch ID…
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Try again"
          accessibilityHint="Re-prompt for biometric authentication"
          onPress={tryUnlock}
          className="mt-8 rounded-xl bg-ohanafy-denim px-6 py-3 active:opacity-80"
        >
          <Text className="text-base font-bold text-ohanafy-paper">Try Again</Text>
        </Pressable>
      </View>
    </ErrorBoundary>
  );
}
