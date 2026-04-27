import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import type { LabelTemplateType } from '@/zpl';

const TEMPLATES: Array<{
  type: LabelTemplateType;
  title: string;
  size: string;
  description: string;
}> = [
  {
    type: 'shelf_talker',
    title: 'Shelf Talker',
    size: '2.5" × 1.5"',
    description: 'Compact tag for cooler / shelf placement.',
  },
  {
    type: 'product_card',
    title: 'Product Card',
    size: '4" × 3"',
    description: '3 key facts about the product.',
  },
  {
    type: 'delivery_receipt',
    title: 'Delivery Receipt',
    size: '4" × 6"',
    description: 'Order summary with line totals + signature line.',
  },
];

export default function LabelSelect(): React.ReactNode {
  const params = useLocalSearchParams<{ accountId?: string; productId?: string; orderId?: string }>();

  return (
    <ErrorBoundary screenName="LabelSelect">
      <View
        accessibilityLabel="Select label type"
        className="flex-1 bg-ohanafy-paper px-4 pt-12 dark:bg-ohanafy-dark-surface"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
        <Text className="mb-4 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Pick a label
        </Text>
        {TEMPLATES.map((tpl) => (
          <Pressable
            key={tpl.type}
            accessibilityRole="button"
            accessibilityLabel={`${tpl.title}, ${tpl.size}`}
            accessibilityHint={tpl.description}
            onPress={() =>
              router.push({
                pathname: '/label/preview',
                params: { template: tpl.type, ...params },
              })
            }
            className="mb-3 rounded-2xl bg-ohanafy-cork p-4 active:opacity-80 dark:bg-ohanafy-dark-elevated"
          >
            <Text className="text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
              {tpl.title}
            </Text>
            <Text className="mt-1 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
              {tpl.size}
            </Text>
            <Text className="mt-2 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
              {tpl.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </ErrorBoundary>
  );
}
