import { router } from 'expo-router';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

export default function OnboardingWelcome(): React.ReactNode {
  return (
    <ErrorBoundary screenName="OnboardingWelcome">
      <OnboardingStep
        step={1}
        totalSteps={5}
        heading="Welcome to Ohanafy Field"
        body="Your territory. Your accounts. Your AI assistant. Works offline, listens to your voice, prints labels on the spot."
        primaryCta="Get Started"
        onPrimary={() => router.push('/onboarding/territory')}
      />
    </ErrorBoundary>
  );
}
