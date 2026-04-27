import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import { logVisit } from '@/db/repositories/visits';
import { enqueue } from '@/db/repositories/sync-queue';

export default function NewVisit(): React.ReactNode {
  const { accountId, accountSfId } = useLocalSearchParams<{
    accountId: string;
    accountSfId: string;
  }>();
  const repId = useAuthStore((s) => s.userId) ?? 'demo-rep';
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const handleSave = async (): Promise<void> => {
    if (!accountId || !accountSfId || !note.trim()) return;
    setBusy(true);
    try {
      const visit = await logVisit(database, {
        accountId,
        accountSfId,
        repId,
        note: note.trim(),
      });
      await enqueue(database, {
        operationType: 'CREATE_VISIT',
        entityType: 'visit',
        entityId: visit.id,
        payload: { localId: visit.id, accountSfId, note: note.trim(), repId },
      });
      router.back();
    } finally {
      setBusy(false);
    }
  };

  return (
    <ErrorBoundary screenName="NewVisit">
      <View
        accessibilityLabel="New visit note"
        className="flex-1 bg-ohanafy-paper px-4 pt-12 dark:bg-ohanafy-dark-surface"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancel"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">Cancel</Text>
        </Pressable>
        <Text className="mb-4 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Log Visit
        </Text>
        <TextInput
          accessibilityLabel="Visit note"
          accessibilityHint="Type the visit note here. Day 3 adds voice dictation."
          placeholder="What did you talk about? Any tap issues, new menu items, sell-through concerns…"
          placeholderTextColor="#9a9a9a"
          value={note}
          onChangeText={setNote}
          multiline
          textAlignVertical="top"
          className="min-h-[160px] rounded-2xl bg-ohanafy-cork p-4 text-base text-ohanafy-ink dark:bg-ohanafy-dark-elevated dark:text-ohanafy-dark-text"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Save visit"
          accessibilityState={{ disabled: busy || note.trim().length === 0 }}
          disabled={busy || note.trim().length === 0}
          onPress={handleSave}
          className={
            busy || note.trim().length === 0
              ? 'mt-6 rounded-xl bg-ohanafy-cork px-4 py-3 dark:bg-ohanafy-dark-elevated'
              : 'mt-6 rounded-xl bg-ohanafy-denim px-4 py-3 active:opacity-80'
          }
        >
          <Text
            className={
              busy || note.trim().length === 0
                ? 'text-center text-base font-bold text-ohanafy-muted'
                : 'text-center text-base font-bold text-ohanafy-paper'
            }
          >
            {busy ? 'Saving…' : 'Save Visit'}
          </Text>
        </Pressable>
      </View>
    </ErrorBoundary>
  );
}
