import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { captureFeedback } from '@/ai/memory';
import { database } from '@/db';
import type { FeedbackEventInput } from '@/db/repositories/memories';

interface FeedbackCaptureProps {
  repId: string;
  accountId?: string;
  eventTypeWhenAccepted: FeedbackEventInput['eventType'];
  eventTypeWhenRejected: FeedbackEventInput['eventType'];
  aiOutput: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export function FeedbackCapture({
  repId,
  accountId,
  eventTypeWhenAccepted,
  eventTypeWhenRejected,
  aiOutput,
  context,
}: FeedbackCaptureProps): React.ReactNode {
  const [submitted, setSubmitted] = useState<'up' | 'down' | null>(null);

  const handle = async (rating: 'up' | 'down'): Promise<void> => {
    if (submitted) return;
    setSubmitted(rating);
    await captureFeedback(database, {
      repId,
      accountId,
      eventType: rating === 'up' ? eventTypeWhenAccepted : eventTypeWhenRejected,
      aiOutput,
      context,
    });
  };

  return (
    <View className="mt-3 flex-row items-center gap-3">
      <Text className="text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
        Was this helpful?
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Helpful"
        accessibilityState={{ selected: submitted === 'up' }}
        disabled={submitted !== null}
        onPress={() => handle('up')}
        className={
          submitted === 'up'
            ? 'rounded-full bg-ohanafy-denim px-3 py-1'
            : 'rounded-full border border-ohanafy-denim px-3 py-1'
        }
      >
        <Text
          className={
            submitted === 'up'
              ? 'text-xs font-bold text-ohanafy-paper'
              : 'text-xs font-bold text-ohanafy-denim dark:text-ohanafy-denim-light'
          }
        >
          👍
        </Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Not helpful"
        accessibilityState={{ selected: submitted === 'down' }}
        disabled={submitted !== null}
        onPress={() => handle('down')}
        className={
          submitted === 'down'
            ? 'rounded-full bg-ohanafy-denim px-3 py-1'
            : 'rounded-full border border-ohanafy-denim px-3 py-1'
        }
      >
        <Text
          className={
            submitted === 'down'
              ? 'text-xs font-bold text-ohanafy-paper'
              : 'text-xs font-bold text-ohanafy-denim dark:text-ohanafy-denim-light'
          }
        >
          👎
        </Text>
      </Pressable>
    </View>
  );
}
