import { FlashList } from '@shopify/flash-list';
import { Pressable, Text, View } from 'react-native';

import type { Product } from '@/db/models/Product';

interface ProductPickerProps {
  products: Product[];
  onSelect: (product: Product) => void;
}

const PRODUCT_ROW_HEIGHT = 56;

export function ProductPicker({ products, onSelect }: ProductPickerProps): React.ReactNode {
  return (
    <View
      accessibilityLabel={`Product catalog, ${products.length} items`}
      className="flex-1"
    >
      <FlashList
        data={products}
        estimatedItemSize={PRODUCT_ROW_HEIGHT}
        keyExtractor={(p) => p.id}
        getItemType={() => 'product'}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Add ${item.name} to order`}
            accessibilityHint={`${item.unitLabel}, $${item.pricePerUnit.toFixed(2)} per ${item.unit}`}
            onPress={() => onSelect(item)}
            testID={`product-${item.sfId}`}
            className="mx-4 mb-2 rounded-xl bg-ohanafy-cork p-3 active:opacity-80 dark:bg-ohanafy-dark-elevated"
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
                {item.name}
              </Text>
              <Text className="text-sm font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                ${item.pricePerUnit.toFixed(2)}
              </Text>
            </View>
            <Text className="mt-0.5 text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
              {item.unitLabel} · {item.skuCode}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
