import { Text, View } from 'react-native';

import { useVoiceStore } from '@/store/voice-store';

export function TranscriptDisplay(): React.ReactNode {
  const transcript = useVoiceStore((s) => s.transcript);
  const interim = useVoiceStore((s) => s.interimTranscript);
  const state = useVoiceStore((s) => s.state);

  if (state === 'idle' && !transcript && !interim) return null;

  const display = transcript || interim;
  if (!display) return null;

  return (
    <View
      accessibilityRole="text"
      accessibilityLabel={`Voice transcript: ${display}`}
      accessibilityLiveRegion="polite"
      className="mx-4 mb-2 rounded-2xl bg-ohanafy-cork px-4 py-3 dark:bg-ohanafy-dark-elevated"
    >
      <Text
        className={
          interim
            ? 'text-base italic text-ohanafy-muted dark:text-ohanafy-dark-muted'
            : 'text-base text-ohanafy-ink dark:text-ohanafy-dark-text'
        }
      >
        {display}
      </Text>
    </View>
  );
}
