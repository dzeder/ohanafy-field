import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { loginWithSalesforce } from '@/auth/sf-oauth';
import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { loadUserPermissions } from '@/permissions/loader';
import { usePermissionStore } from '@/permissions/store';

export default function Login(): React.ReactNode {
  const setSession = useAuthStore((s) => s.setSession);
  const setPermissions = usePermissionStore((s) => s.setPermissions);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useSeed = process.env.EXPO_PUBLIC_USE_SEED_DATA === 'true';

  const handleLogin = async (): Promise<void> => {
    setBusy(true);
    setError(null);
    try {
      const result = await loginWithSalesforce();
      setSession({
        userId: result.userId,
        email: result.email,
        instanceUrl: result.instanceUrl,
      });
      const perms = await loadUserPermissions({ email: result.email, useSeedData: useSeed });
      setPermissions(perms);
      router.replace('/(auth)/biometric');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <ErrorBoundary screenName="Login">
      <View
        accessibilityLabel="Sign in to Ohanafy Field"
        className="flex-1 items-center justify-center bg-ohanafy-paper px-6 dark:bg-ohanafy-dark-surface"
      >
        <View className="mb-12 items-center">
          <Text className="text-4xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
            Ohanafy Field
          </Text>
          <Text className="mt-2 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
            The AI-powered operating system for beverage
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Sign in with Salesforce"
          accessibilityHint="Opens Salesforce in your browser to authorize the app"
          accessibilityState={{ disabled: busy }}
          disabled={busy}
          onPress={handleLogin}
          className="w-full rounded-2xl bg-ohanafy-denim px-6 py-4 active:opacity-80"
        >
          {busy ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text className="text-center text-lg font-bold text-ohanafy-paper">
              Sign in with Salesforce
            </Text>
          )}
        </Pressable>
        {error ? (
          <Text
            accessibilityLiveRegion="polite"
            className="mt-4 text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted"
          >
            {error}
          </Text>
        ) : null}
      </View>
    </ErrorBoundary>
  );
}
