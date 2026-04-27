import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useCoachMark } from '@/hooks/useCoachMark';

interface CoachMarkProps {
  markId: string;
  title: string;
  body: string;
}

// Inline tooltip-style coach mark. Day 5 ships the simple inline version per
// the Bible §19 onboarding spec; Day 6 polish can layer a true overlay if the
// designer review calls for one.
export function CoachMark({ markId, title, body }: CoachMarkProps): React.ReactNode {
  const { visible, dismiss } = useCoachMark(markId);
  if (!visible) return null;

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      exiting={FadeOut.duration(120)}
      className="mb-3 rounded-2xl bg-ohanafy-mellow p-4"
    >
      <View
        accessibilityRole="alert"
        accessibilityLabel={`${title}. ${body}`}
        accessibilityLiveRegion="polite"
      >
        <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-ink opacity-70">
          Tip
        </Text>
        <Text className="mt-1 text-base font-bold text-ohanafy-ink">{title}</Text>
        <Text className="mt-1 text-sm text-ohanafy-ink">{body}</Text>
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Got it"
        accessibilityHint="Dismisses this tip. It won't be shown again."
        onPress={dismiss}
        className="mt-3 self-start rounded-full bg-ohanafy-ink px-3 py-1.5 active:opacity-80"
      >
        <Text className="text-xs font-bold text-ohanafy-paper">Got it</Text>
      </Pressable>
    </Animated.View>
  );
}
