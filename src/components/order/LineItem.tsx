import { memo } from 'react';
import { Pressable, Text, View } from 'react-native';

import type { OrderLine } from '@/db/models/OrderLine';

interface LineItemProps {
  line: OrderLine;
  onIncrement: (lineId: string) => void;
  onDecrement: (lineId: string) => void;
  onRemove: (lineId: string) => void;
}

function LineItemBase({
  line,
  onIncrement,
  onDecrement,
  onRemove,
}: LineItemProps): React.ReactNode {
  return (
    <View
      accessibilityLabel={`${line.quantity} ${line.unit} of ${line.productName}, line total ${line.lineTotal} dollars`}
      className="mb-3 rounded-2xl bg-ohanafy-paper p-4 dark:bg-ohanafy-dark-elevated"
    >
      <View className="flex-row items-center justify-between">
        <Text className="flex-1 text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          {line.productName}
        </Text>
        <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          ${line.lineTotal.toFixed(2)}
        </Text>
      </View>
      <Text className="mt-1 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
        {line.unit} · ${line.unitPrice.toFixed(2)}/each
      </Text>
      <View className="mt-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Decrease quantity of ${line.productName}`}
            onPress={() => onDecrement(line.id)}
            className="h-9 w-9 items-center justify-center rounded-full bg-ohanafy-cork dark:bg-ohanafy-dark-surface"
          >
            <Text className="text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">−</Text>
          </Pressable>
          <Text
            accessibilityLiveRegion="polite"
            className="min-w-[32px] text-center text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text"
          >
            {line.quantity}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Increase quantity of ${line.productName}`}
            onPress={() => onIncrement(line.id)}
            className="h-9 w-9 items-center justify-center rounded-full bg-ohanafy-cork dark:bg-ohanafy-dark-surface"
          >
            <Text className="text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">+</Text>
          </Pressable>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${line.productName} from order`}
          onPress={() => onRemove(line.id)}
          className="px-3 py-2"
        >
          <Text className="text-sm font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
            Remove
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export const LineItem = memo(
  LineItemBase,
  (prev, next) =>
    prev.line.id === next.line.id &&
    prev.line.quantity === next.line.quantity &&
    prev.line.lineTotal === next.line.lineTotal
);
