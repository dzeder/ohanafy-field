import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { LineItem } from '@/components/order/LineItem';
import { ProductPicker } from '@/components/order/ProductPicker';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import {
  addLineToOrder,
  removeLine,
  updateLineQuantity,
} from '@/db/repositories/orders';
import type { Product } from '@/db/models/Product';
import { useOrder } from '@/hooks/useOrder';

export default function OrderEntry(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, lines, products, loading } = useOrder(id);
  const [showPicker, setShowPicker] = useState(false);

  const handleAdd = async (product: Product): Promise<void> => {
    if (!id) return;
    const existing = lines.find((l) => l.productId === product.id);
    if (existing) {
      await updateLineQuantity(database, existing.id, existing.quantity + 1);
    } else {
      await addLineToOrder(database, id, { product, quantity: 1 });
    }
  };

  const handleIncrement = async (lineId: string): Promise<void> => {
    const line = lines.find((l) => l.id === lineId);
    if (line) await updateLineQuantity(database, lineId, line.quantity + 1);
  };

  const handleDecrement = async (lineId: string): Promise<void> => {
    const line = lines.find((l) => l.id === lineId);
    if (line) await updateLineQuantity(database, lineId, line.quantity - 1);
  };

  const handleRemove = async (lineId: string): Promise<void> => {
    await removeLine(database, lineId);
  };

  const handleConfirm = (): void => {
    if (id) router.push(`/order/${id}/confirm`);
  };

  if (loading || !order) {
    return (
      <ErrorBoundary screenName="OrderEntry">
        <View className="flex-1 items-center justify-center bg-ohanafy-paper dark:bg-ohanafy-dark-surface">
          <ActivityIndicator color="#4A5F80" />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="OrderEntry">
      <View
        accessibilityLabel="Order entry"
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
      >
        <View className="border-b border-ohanafy-cork px-4 pb-4 pt-12 dark:border-ohanafy-dark-elevated">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            className="mb-3 self-start"
          >
            <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
          </Pressable>
          <Text className="text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
            Order
          </Text>
          <Text className="mt-1 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
            {lines.length} {lines.length === 1 ? 'line' : 'lines'} · ${order.totalAmount.toFixed(2)}
          </Text>
        </View>

        {showPicker ? (
          <View className="flex-1">
            <View className="flex-row items-center justify-between px-4 pt-3">
              <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
                Add a product
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Close product picker"
                onPress={() => setShowPicker(false)}
              >
                <Text className="text-sm font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
                  Done
                </Text>
              </Pressable>
            </View>
            <ProductPicker
              products={products}
              onSelect={(p) => {
                handleAdd(p);
              }}
            />
          </View>
        ) : (
          <View className="flex-1 px-4 pt-3">
            {lines.length === 0 ? (
              <Text className="text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
                No items yet. Tap Add Item below.
              </Text>
            ) : (
              lines.map((line) => (
                <LineItem
                  key={line.id}
                  line={line}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onRemove={handleRemove}
                />
              ))
            )}
          </View>
        )}

        <View className="border-t border-ohanafy-cork bg-ohanafy-paper px-4 pb-8 pt-3 dark:border-ohanafy-dark-elevated dark:bg-ohanafy-dark-surface">
          <View className="flex-row gap-3">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={showPicker ? 'Hide product picker' : 'Add item'}
              onPress={() => setShowPicker((v) => !v)}
              className="flex-1 rounded-xl border border-ohanafy-denim px-4 py-3"
            >
              <Text className="text-center text-base font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
                {showPicker ? 'Hide Picker' : '+ Add Item'}
              </Text>
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Review and confirm order"
              accessibilityState={{ disabled: lines.length === 0 }}
              disabled={lines.length === 0}
              onPress={handleConfirm}
              className={
                lines.length === 0
                  ? 'flex-1 rounded-xl bg-ohanafy-cork px-4 py-3 dark:bg-ohanafy-dark-elevated'
                  : 'flex-1 rounded-xl bg-ohanafy-denim px-4 py-3 active:opacity-80'
              }
            >
              <Text
                className={
                  lines.length === 0
                    ? 'text-center text-base font-bold text-ohanafy-muted'
                    : 'text-center text-base font-bold text-ohanafy-paper'
                }
              >
                Review
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ErrorBoundary>
  );
}
