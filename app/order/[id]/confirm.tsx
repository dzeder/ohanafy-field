import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import { submitOrder } from '@/db/repositories/orders';
import { enqueue } from '@/db/repositories/sync-queue';
import { useOrder } from '@/hooks/useOrder';

export default function OrderConfirm(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { order, lines, loading } = useOrder(id);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    if (!id || !order) return;
    setBusy(true);
    try {
      await submitOrder(database, id);
      await enqueue(database, {
        operationType: 'CREATE_ORDER',
        entityType: 'order',
        entityId: id,
        payload: {
          localId: id,
          accountSfId: order.accountSfId,
          repId: order.repId,
          totalAmount: order.totalAmount,
          lines: lines.map((l) => ({
            productSfId: l.productSfId,
            productName: l.productName,
            quantity: l.quantity,
            unit: l.unit,
            unitPrice: l.unitPrice,
            lineTotal: l.lineTotal,
          })),
        },
      });
      router.dismissAll();
      router.replace('/(tabs)');
    } finally {
      setBusy(false);
    }
  };

  if (loading || !order) {
    return (
      <ErrorBoundary screenName="OrderConfirm">
        <View className="flex-1 items-center justify-center bg-ohanafy-paper dark:bg-ohanafy-dark-surface">
          <ActivityIndicator color="#4A5F80" />
        </View>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary screenName="OrderConfirm">
      <ScrollView
        accessibilityLabel="Confirm order"
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-4 pt-12 pb-32"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to order entry"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
        <Text className="mb-4 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Confirm Order
        </Text>
        {lines.map((line) => (
          <View
            key={line.id}
            className="mb-2 rounded-xl bg-ohanafy-cork p-3 dark:bg-ohanafy-dark-elevated"
          >
            <View className="flex-row items-center justify-between">
              <Text className="flex-1 text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
                {line.quantity} × {line.productName}
              </Text>
              <Text className="text-base font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
                ${line.lineTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
        <View className="mt-4 rounded-2xl bg-ohanafy-denim p-4">
          <Text className="text-xs font-bold uppercase tracking-wider text-ohanafy-paper opacity-80">
            Total
          </Text>
          <Text className="mt-1 text-3xl font-bold text-ohanafy-paper">
            ${order.totalAmount.toFixed(2)}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Place order"
          accessibilityHint="Saves the order locally and queues it for sync to Salesforce"
          accessibilityState={{ disabled: busy }}
          disabled={busy}
          onPress={handleSubmit}
          className={
            busy
              ? 'mt-6 rounded-xl bg-ohanafy-cork px-4 py-4 dark:bg-ohanafy-dark-elevated'
              : 'mt-6 rounded-xl bg-ohanafy-denim px-4 py-4 active:opacity-80'
          }
        >
          <Text
            className={
              busy
                ? 'text-center text-base font-bold text-ohanafy-muted'
                : 'text-center text-base font-bold text-ohanafy-paper'
            }
          >
            {busy ? 'Placing…' : 'Place Order'}
          </Text>
        </Pressable>
      </ScrollView>
    </ErrorBoundary>
  );
}
