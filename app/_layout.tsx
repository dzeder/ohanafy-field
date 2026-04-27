import 'react-native-gesture-handler';
import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import { seedDatabase } from '@/db/seeder';
import {
  configureAndroidChannel,
  requestNotificationPermission,
} from '@/notifications';
import { initPostHog, initSentry } from '@/observability';
import { startSyncEngine } from '@/sync/engine';

initSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const useSeed = process.env.EXPO_PUBLIC_USE_SEED_DATA === 'true';

export default function RootLayout(): React.ReactNode {
  useEffect(() => {
    // Defer non-critical init off the launch path
    const id = setTimeout(() => initPostHog(), 0);

    // Seed demo data on first run if enabled (no-op when DB already has rows)
    if (useSeed) {
      seedDatabase(database, { repId: 'demo-rep' }).catch(() => undefined);
    }

    // Auto-flush sync queue on reconnect
    const stopSync = startSyncEngine();

    // Notifications: request permission once, configure the Android channel
    requestNotificationPermission().then(() => configureAndroidChannel());

    return () => {
      clearTimeout(id);
      stopSync();
    };
  }, []);

  return (
    <ErrorBoundary screenName="Root">
      <QueryClientProvider client={queryClient}>
        <StatusBar style="auto" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="(no-permission)" options={{ presentation: 'modal' }} />
        </Stack>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
