import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

const TIPS: Array<{ icon: string; title: string; body: string }> = [
  {
    icon: '📋',
    title: 'Open an account',
    body: 'Tap any card on the home screen. The AI surfaces a pre-call insight at the top.',
  },
  {
    icon: '🎤',
    title: 'Use your voice',
    body: 'Tap the mic and say things like "add 2 kegs Pale Ale". Accept, edit, or reject.',
  },
  {
    icon: '🖨️',
    title: 'Print on the spot',
    body: 'Generate shelf talkers in seconds. Hand them to the buyer before you leave.',
  },
  {
    icon: '🔄',
    title: 'It all works offline',
    body: "Place orders without signal. They sync to Salesforce when you reconnect.",
  },
];

export default function OnboardingFirstVisit(): React.ReactNode {
  return (
    <ErrorBoundary screenName="OnboardingFirstVisit">
      <OnboardingStep
        step={4}
        totalSteps={5}
        heading="Try your first visit"
        body="Here's the rep workflow you'll use 8–12 times a day."
        primaryCta="I'm ready"
        onPrimary={() => router.push('/onboarding/done')}
      >
        <View>
          {TIPS.map((tip) => (
            <View
              key={tip.title}
              className="mb-3 flex-row rounded-2xl bg-ohanafy-cork p-3 dark:bg-ohanafy-dark-elevated"
            >
              <Text className="mr-3 text-2xl">{tip.icon}</Text>
              <View className="flex-1">
                <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                  {tip.title}
                </Text>
                <Text className="mt-1 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
                  {tip.body}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </OnboardingStep>
    </ErrorBoundary>
  );
}
