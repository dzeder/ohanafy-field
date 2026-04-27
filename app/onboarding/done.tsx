import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function OnboardingDone(): React.ReactNode {
  const handleComplete = async (): Promise<void> => {
    await SecureStore.setItemAsync('onboarding_complete', '1');
    router.replace('/(tabs)');
  };

  return (
    <ErrorBoundary screenName="OnboardingDone">
      <OnboardingStep
        step={5}
        totalSteps={5}
        heading="You're all set"
        body="Ohanafy Field is ready. Your accounts are cached for offline use. The AI gets smarter as you use it. Tap any ? button on a screen, or open Settings → User Guide whenever you need help."
        primaryCta="Go to my accounts"
        onPrimary={handleComplete}
      />
    </ErrorBoundary>
  );
}
