import 'react-native-gesture-handler';
import '../global.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { initPostHog, initSentry } from '@/observability';

initSentry();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function RootLayout(): React.ReactNode {
  useEffect(() => {
    // Defer non-critical init off the launch path
    const id = setTimeout(() => initPostHog(), 0);
    return () => clearTimeout(id);
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
