import { Pressable, Text, View } from 'react-native';

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  heading: string;
  body: string;
  primaryCta: string;
  secondaryCta?: string;
  onPrimary: () => void;
  onSecondary?: () => void;
  children?: React.ReactNode;
}

export function OnboardingStep({
  step,
  totalSteps,
  heading,
  body,
  primaryCta,
  secondaryCta,
  onPrimary,
  onSecondary,
  children,
}: OnboardingStepProps): React.ReactNode {
  return (
    <View
      accessibilityLabel={`Onboarding step ${step} of ${totalSteps}: ${heading}`}
      className="flex-1 bg-ohanafy-paper px-6 pt-16 dark:bg-ohanafy-dark-surface"
    >
      <View className="mb-4 flex-row gap-2">
        {Array.from({ length: totalSteps }, (_, i) => (
          <View
            key={i}
            className={
              i < step
                ? 'h-1.5 flex-1 rounded-full bg-ohanafy-denim'
                : 'h-1.5 flex-1 rounded-full bg-ohanafy-cork dark:bg-ohanafy-dark-elevated'
            }
          />
        ))}
      </View>

      <Text className="mb-2 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
        Step {step} of {totalSteps}
      </Text>
      <Text className="mb-3 text-3xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
        {heading}
      </Text>
      <Text className="mb-6 text-base leading-6 text-ohanafy-ink dark:text-ohanafy-dark-text">
        {body}
      </Text>

      <View className="flex-1">{children}</View>

      <View className="pb-12">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={primaryCta}
          onPress={onPrimary}
          className="rounded-xl bg-ohanafy-denim px-4 py-4 active:opacity-80"
        >
          <Text className="text-center text-base font-bold text-ohanafy-paper">{primaryCta}</Text>
        </Pressable>
        {secondaryCta ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={secondaryCta}
            onPress={onSecondary}
            className="mt-3 px-4 py-3"
          >
            <Text className="text-center text-sm font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
              {secondaryCta}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
