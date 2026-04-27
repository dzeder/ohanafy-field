import { Q } from '@nozbe/watermelondb';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import type { Account } from '@/db/models/Account';

interface TerritoryStats {
  total: number;
  byType: Record<string, number>;
}

export default function OnboardingTerritory(): React.ReactNode {
  const email = useAuthStore((s) => s.email);
  const [stats, setStats] = useState<TerritoryStats>({ total: 0, byType: {} });

  useEffect(() => {
    let active = true;
    (async (): Promise<void> => {
      const all = await database
        .get<Account>('accounts')
        .query(Q.where('is_archived', false))
        .fetch();
      if (!active) return;
      const byType: Record<string, number> = {};
      for (const a of all) {
        byType[a.accountType] = (byType[a.accountType] ?? 0) + 1;
      }
      setStats({ total: all.length, byType });
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <ErrorBoundary screenName="OnboardingTerritory">
      <OnboardingStep
        step={2}
        totalSteps={5}
        heading="Your territory"
        body={`${email ? `Welcome, ${email}.` : 'Welcome.'} ${stats.total} accounts loaded to your device. They're available offline.`}
        primaryCta="Continue"
        onPrimary={() => router.push('/onboarding/printer')}
      >
        <View className="rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
          {Object.entries(stats.byType).map(([type, count]) => (
            <View key={type} className="mb-2 flex-row items-center justify-between">
              <Text className="text-sm text-ohanafy-ink dark:text-ohanafy-dark-text">
                {labelFor(type)}
              </Text>
              <Text className="text-sm font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                {count}
              </Text>
            </View>
          ))}
        </View>
      </OnboardingStep>
    </ErrorBoundary>
  );
}

function labelFor(type: string): string {
  switch (type) {
    case 'on_premise':
      return 'On-premise';
    case 'off_premise_chain':
      return 'Off-premise chain';
    case 'off_premise_indie':
      return 'Off-premise indie';
    case 'convenience':
      return 'Convenience';
    default:
      return type;
  }
}
