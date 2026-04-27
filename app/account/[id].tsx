import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { InsightBanner } from '@/components/ai/InsightBanner';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { database } from '@/db';
import type { Account } from '@/db/models/Account';
import type { Order } from '@/db/models/Order';
import type { Visit } from '@/db/models/Visit';
import { getAccountById } from '@/db/repositories/accounts';
import { createDraftOrder, listOrdersForAccount } from '@/db/repositories/orders';
import { listVisitsForAccount } from '@/db/repositories/visits';

export default function AccountDetail(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>();
  const repId = useAuthStore((s) => s.userId) ?? 'demo-rep';
  const [account, setAccount] = useState<Account | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async (): Promise<void> => {
      const [a, vs, os] = await Promise.all([
        getAccountById(database, id),
        listVisitsForAccount(database, id, 5),
        listOrdersForAccount(database, id),
      ]);
      if (cancelled) return;
      setAccount(a);
      setVisits(vs);
      setOrders(os);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleNewOrder = async (): Promise<void> => {
    if (!account) return;
    const order = await createDraftOrder(database, {
      accountId: account.id,
      accountSfId: account.sfId,
      repId,
    });
    router.push(`/order/${order.id}`);
  };

  const handleLogVisit = (): void => {
    if (!account) return;
    router.push(`/visit/new?accountId=${account.id}&accountSfId=${account.sfId}`);
  };

  if (loading || !account) {
    return (
      <ErrorBoundary screenName="AccountDetail">
        <View className="flex-1 items-center justify-center bg-ohanafy-paper dark:bg-ohanafy-dark-surface">
          <ActivityIndicator color="#4A5F80" />
        </View>
      </ErrorBoundary>
    );
  }

  const lastOrder = orders[0];

  return (
    <ErrorBoundary screenName="AccountDetail">
      <ScrollView
        accessibilityLabel={`Account: ${account.name}`}
        className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
        contentContainerClassName="px-4 pt-12 pb-32"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to accounts"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>

        <Text className="text-3xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          {account.name}
        </Text>
        <Text className="mt-1 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
          {account.contactName} · {account.contactTitle}
        </Text>
        <Text className="mt-1 text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
          {account.addressStreet}, {account.addressCity}, {account.addressState}
        </Text>

        <View className="mt-6">
          <InsightBanner account={account} />
        </View>

        <View className="flex-row gap-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="New order"
            accessibilityHint="Starts a new order for this account"
            onPress={handleNewOrder}
            className="flex-1 rounded-xl bg-ohanafy-denim px-4 py-3 active:opacity-80"
          >
            <Text className="text-center text-base font-bold text-ohanafy-paper">New Order</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Log visit"
            accessibilityHint="Logs a visit note for this account"
            onPress={handleLogVisit}
            className="flex-1 rounded-xl border border-ohanafy-denim px-4 py-3 active:opacity-80"
          >
            <Text className="text-center text-base font-bold text-ohanafy-denim dark:text-ohanafy-denim-light">
              Log Visit
            </Text>
          </Pressable>
        </View>

        {lastOrder ? (
          <View className="mt-6 rounded-2xl bg-ohanafy-cork p-4 dark:bg-ohanafy-dark-elevated">
            <Text className="mb-1 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
              Last Order
            </Text>
            <Text className="text-base text-ohanafy-ink dark:text-ohanafy-dark-text">
              ${lastOrder.totalAmount.toFixed(2)} · {lastOrder.status}
            </Text>
          </View>
        ) : null}

        <Text className="mb-2 mt-8 text-xs font-bold uppercase tracking-wider text-ohanafy-muted dark:text-ohanafy-dark-muted">
          Recent Visits
        </Text>
        {visits.length === 0 ? (
          <Text className="text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
            No visits logged yet.
          </Text>
        ) : (
          visits.map((v) => (
            <View
              key={v.id}
              className="mb-2 rounded-xl bg-ohanafy-cork p-3 dark:bg-ohanafy-dark-elevated"
            >
              <Text className="text-xs text-ohanafy-muted dark:text-ohanafy-dark-muted">
                {v.visitDate.toLocaleDateString()}
              </Text>
              <Text className="mt-1 text-sm text-ohanafy-ink dark:text-ohanafy-dark-text">
                {v.note ?? '(no note)'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </ErrorBoundary>
  );
}
