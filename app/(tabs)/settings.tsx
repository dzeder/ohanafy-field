import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';

export default function Settings(): React.ReactNode {
  const email = useAuthStore((s) => s.email);
  const instanceUrl = useAuthStore((s) => s.instanceUrl);

  return (
    <ErrorBoundary screenName="Settings">
      <ScrollView
        accessibilityLabel="Settings"
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-6 pt-16 pb-12"
      >
        <Text className="mb-6 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Settings
        </Text>

        <View className="mb-6 rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
          <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Signed in as
          </Text>
          <Text className="mt-1 text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
            {email ?? 'Not signed in'}
          </Text>
          {instanceUrl ? (
            <Text className="mt-1 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
              {instanceUrl}
            </Text>
          ) : null}
        </View>

        <RoleSwitcher />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="AI memories"
          accessibilityHint="View and delete the patterns the AI has learned from your corrections"
          onPress={() => router.push('/settings/memories')}
          className="mt-4 rounded-2xl bg-ohanafy-cork p-4 active:opacity-80 dark:bg-ohanafy-dark-elevated"
        >
          <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
            AI Memories
          </Text>
          <Text className="mt-1 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
            View and manage what the AI has learned from your corrections.
          </Text>
        </Pressable>
      </ScrollView>
    </ErrorBoundary>
  );
}
