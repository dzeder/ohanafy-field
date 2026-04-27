import { router } from 'expo-router';

import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { discoverPrinters } from '@/zpl/printer';

export default function OnboardingPrinter(): React.ReactNode {
  const handleFind = async (): Promise<void> => {
    // Stub for Day 5; the real Bluetooth pair flow ships when the native
    // Zebra Link-OS module lands (Day 6 device build). For now this just
    // opens the native module's discovery (no-op in dev) and continues.
    await discoverPrinters();
    router.push('/onboarding/first-visit');
  };

  return (
    <ErrorBoundary screenName="OnboardingPrinter">
      <OnboardingStep
        step={3}
        totalSteps={5}
        heading="Pair your label printer"
        body="Connect your Zebra ZQ520 or ZQ630 to print shelf talkers and delivery receipts on the spot. You can do this later from Settings → Printers."
        primaryCta="Find My Printer"
        secondaryCta="Skip for now"
        onPrimary={handleFind}
        onSecondary={() => router.push('/onboarding/first-visit')}
      />
    </ErrorBoundary>
  );
}
