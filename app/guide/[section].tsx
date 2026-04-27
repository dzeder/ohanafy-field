import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, Text } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { GUIDE_SECTIONS } from '@/data/user-guide';

export default function GuideSectionScreen(): React.ReactNode {
  const { section: id } = useLocalSearchParams<{ section: string }>();
  const section = GUIDE_SECTIONS.find((s) => s.id === id);

  if (!section) {
    return (
      <ErrorBoundary screenName="GuideSection">
        <ScrollView className="flex-1 bg-ohanafy-paper px-4 pt-12 dark:bg-ohanafy-dark-surface">
          <Text className="text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Section not found.
          </Text>
        </ScrollView>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="GuideSection">
      <ScrollView
        accessibilityLabel={section.title}
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-4 pt-12 pb-12"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to guide"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
        <Text className="mb-4 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          {section.title}
        </Text>
        <Text className="text-base leading-6 text-ohanafy-ink dark:text-ohanafy-dark-text">
          {section.body}
        </Text>
      </ScrollView>
    </ErrorBoundary>
  );
}
