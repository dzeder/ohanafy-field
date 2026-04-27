import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { GUIDE_SECTIONS, searchGuide } from '@/data/user-guide';

export default function GuideIndex(): React.ReactNode {
  const [query, setQuery] = useState('');
  const hits = useMemo(() => searchGuide(query), [query]);

  return (
    <ErrorBoundary screenName="GuideIndex">
      <ScrollView
        accessibilityLabel="User guide"
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
        <Text className="mb-1 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          User Guide
        </Text>
        <Text className="mb-4 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Available offline. Search or browse below.
        </Text>

        <TextInput
          accessibilityLabel="Search the guide"
          accessibilityHint="Filters guide sections as you type"
          placeholder="Search…"
          placeholderTextColor="#9a9a9a"
          value={query}
          onChangeText={setQuery}
          className="mb-4 rounded-xl bg-ohanafy-cork px-4 py-3 text-base text-ohanafy-ink dark:bg-ohanafy-dark-elevated dark:text-ohanafy-dark-text"
        />

        {query.trim().length > 0 ? (
          hits.length === 0 ? (
            <Text className="text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
              No matches for &quot;{query}&quot;
            </Text>
          ) : (
            hits.map((hit) => (
              <Pressable
                key={hit.section.id}
                accessibilityRole="button"
                accessibilityLabel={`Open guide section: ${hit.section.title}`}
                onPress={() => router.push(`/guide/${hit.section.id}`)}
                className="mb-3 rounded-2xl bg-ohanafy-cork p-4 active:opacity-80 dark:bg-ohanafy-dark-elevated"
              >
                <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                  {hit.section.title}
                </Text>
                {hit.matches.map((m, i) => (
                  <Text
                    key={i}
                    numberOfLines={2}
                    className="mt-1 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted"
                  >
                    {m}
                  </Text>
                ))}
              </Pressable>
            ))
          )
        ) : (
          GUIDE_SECTIONS.map((section) => (
            <Pressable
              key={section.id}
              accessibilityRole="button"
              accessibilityLabel={`Open guide section: ${section.title}`}
              onPress={() => router.push(`/guide/${section.id}`)}
              className="mb-3 rounded-2xl bg-ohanafy-cork p-4 active:opacity-80 dark:bg-ohanafy-dark-elevated"
            >
              <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                {section.title}
              </Text>
            </Pressable>
          ))
        )}
      </ScrollView>
    </ErrorBoundary>
  );
}
