import { useEffect } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useVoiceStore } from '@/store/voice-store';

interface VoiceButtonProps {
  onPress: () => void;
  disabled?: boolean;
}

export function VoiceButton({ onPress, disabled = false }: VoiceButtonProps): React.ReactNode {
  const state = useVoiceStore((s) => s.state);
  const isListening = state === 'listening';
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isListening) {
      scale.value = withRepeat(withTiming(1.15, { duration: 600 }), -1, true);
    } else {
      scale.value = withTiming(1, { duration: 200 });
    }
  }, [isListening, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const label = isListening ? 'Stop listening' : 'Start voice input';
  const hint = isListening
    ? 'Currently recording your voice. Tap to stop.'
    : 'Tap and speak. Say "add 2 kegs pale ale" or "note the lager tap is intermittent."';

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityHint={hint}
        accessibilityState={{ busy: isListening, disabled }}
        disabled={disabled}
        onPress={onPress}
        testID="voice-button"
        className={
          isListening
            ? 'h-16 w-16 items-center justify-center rounded-full bg-ohanafy-mellow shadow-lg'
            : 'h-16 w-16 items-center justify-center rounded-full bg-ohanafy-denim shadow-lg active:opacity-80'
        }
      >
        <Text className={isListening ? 'text-2xl' : 'text-2xl'}>{isListening ? '◉' : '🎤'}</Text>
      </Pressable>
    </Animated.View>
  );
}
