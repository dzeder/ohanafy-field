import { Pressable, Text, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown } from 'react-native-reanimated';

import type { CommandAction } from '@/store/voice-store';

interface CommandFeedbackProps {
  action: CommandAction;
  onAccept: () => void;
  onEdit: () => void;
  onReject: () => void;
}

export function CommandFeedback({
  action,
  onAccept,
  onEdit,
  onReject,
}: CommandFeedbackProps): React.ReactNode {
  const canAccept = action.type !== 'UNKNOWN';

  return (
    <Animated.View
      entering={SlideInDown.duration(200)}
      exiting={SlideOutDown.duration(150)}
      className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-ohanafy-paper p-4 shadow-2xl dark:bg-ohanafy-dark-elevated"
    >
      <View
        accessibilityRole="alert"
        accessibilityLabel={`AI understood: ${action.summary}`}
        accessibilityLiveRegion="polite"
        className="mb-4"
      >
        <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
          AI heard
        </Text>
        <Text className="mt-1 text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
          {action.summary}
        </Text>
      </View>
      <View className="flex-row gap-2">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Reject"
          accessibilityHint="Discards the AI suggestion. Nothing is saved."
          onPress={onReject}
          className="flex-1 rounded-xl border border-ohanafy-muted px-4 py-3"
        >
          <Text className="text-center text-sm font-bold text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Reject
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Edit"
          accessibilityHint="Modify the AI suggestion before accepting."
          onPress={onEdit}
          className="flex-1 rounded-xl border border-ohanafy-denim px-4 py-3"
        >
          <Text className="text-center text-sm font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
            Edit
          </Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Accept"
          accessibilityHint="Applies the AI suggestion."
          accessibilityState={{ disabled: !canAccept }}
          disabled={!canAccept}
          onPress={onAccept}
          className={
            canAccept
              ? 'flex-1 rounded-xl bg-ohanafy-denim px-4 py-3 active:opacity-80'
              : 'flex-1 rounded-xl bg-ohanafy-cork px-4 py-3 dark:bg-ohanafy-dark-surface'
          }
        >
          <Text
            className={
              canAccept
                ? 'text-center text-sm font-bold text-ohanafy-paper'
                : 'text-center text-sm font-bold text-ohanafy-muted'
            }
          >
            Accept
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
