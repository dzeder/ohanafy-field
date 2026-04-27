import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { runLearningAgent } from '@/ai/agents';
import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import { deleteMemory, useMemories } from '@/hooks/useMemories';
import type { Memory } from '@/db/models/Memory';

export default function Memories(): React.ReactNode {
  const repId = useAuthStore((s) => s.userId) ?? 'demo-rep';
  const { memories, loading } = useMemories(repId);

  const handleSynthesize = async (): Promise<void> => {
    await runLearningAgent(database, { repId });
  };

  const handleDelete = async (memory: Memory): Promise<void> => {
    await deleteMemory(memory);
  };

  return (
    <ErrorBoundary screenName="Memories">
      <ScrollView
        accessibilityLabel="AI memories for your account"
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-4 pt-12 pb-12"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
        <Text className="mb-2 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          AI Memories
        </Text>
        <Text className="mb-4 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Patterns the AI has learned from your corrections. Higher confidence
          = more consistent examples. Delete anything that no longer fits.
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Run learning agent now"
          onPress={handleSynthesize}
          className="mb-4 rounded-xl border border-ohanafy-denim px-4 py-3"
        >
          <Text className="text-center text-sm font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
            Run learning now
          </Text>
        </Pressable>

        {loading ? null : memories.length === 0 ? (
          <Text className="text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
            No memories yet. The AI starts learning after a few accept/edit/reject taps on voice commands.
          </Text>
        ) : (
          memories.map((m) => (
            <View
              key={m.id}
              className="mb-3 rounded-2xl bg-ohanafy-cork p-3 dark:bg-ohanafy-dark-elevated"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
                  {m.category}
                </Text>
                <Text className="text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
                  {Math.round(m.confidence * 100)}% confidence
                </Text>
              </View>
              <Text className="mt-1 text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
                {m.key}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete memory: ${m.key}`}
                accessibilityHint="Removes this learned pattern. The AI may re-learn it from future corrections."
                onPress={() => handleDelete(m)}
                className="mt-2 self-end rounded-full px-3 py-1"
              >
                <Text className="text-xs font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
                  Delete
                </Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </ErrorBoundary>
  );
}
