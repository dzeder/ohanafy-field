import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { InsightBanner } from '@/components/ai/InsightBanner';
import { CoachMark } from '@/components/onboarding/CoachMark';
import { database } from '@/db';
import type { Account } from '@/db/models/Account';
import type { Order } from '@/db/models/Order';
import type { Visit } from '@/db/models/Visit';
import { getAccountById } from '@/db/repositories/accounts';
import { createDraftOrder, listOrdersForAccount } from '@/db/repositories/orders';
import { listVisitsForAccount } from '@/db/repositories/visits';

interface AccountDetailViewProps {
  accountId: string;
  showBackButton?: boolean;
}

// Reusable account-detail body. Used by:
//   - app/account/[id].tsx — phone full-screen detail (showBackButton=true)
//   - app/(tabs)/index.tsx (tablet right pane) — embedded (showBackButton=false)
export function AccountDetailView({
  accountId,
  showBackButton = true,
}: AccountDetailViewProps): React.ReactNode {
  const repId = useAuthStore((s) => s.userId) ?? 'demo-rep';
  const [account, setAccount] = useState<Account | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accountId) return;
    let cancelled = false;
    (async (): Promise<void> => {
      const [a, vs, os] = await Promise.all([
        getAccountById(database, accountId),
        listVisitsForAccount(database, accountId, 5),
        listOrdersForAccount(database, accountId),
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
  }, [accountId]);

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
      <View
        accessibilityLabel="Loading account details"
        accessibilityLiveRegion="polite"
        className="flex-1 items-center justify-center bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
      >
        <ActivityIndicator color="#4A5F80" />
      </View>
    );
  }

  const lastOrder = orders[0];

  return (
    <ScrollView
      accessibilityLabel={`Account: ${account.name}`}
      className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
      contentContainerClassName="px-4 pt-12 pb-32"
    >
      {showBackButton ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back to accounts"
          onPress={() => router.back()}
          className="mb-4 self-start"
        >
          <Text className="text-base text-ohanafy-denim dark:text-ohanafy-denim-light">← Back</Text>
        </Pressable>
      ) : null}

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
        <CoachMark
          markId="account-detail-insight"
          title="Pre-call briefing"
          body="The AI scanned this account's history and surfaced the most important thing to know. Tap thumbs-up or thumbs-down to teach it your preferences."
        />
        <InsightBanner account={account} />
      </View>

      <View className="flex-row gap-3">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`New order for ${account.name}`}
          accessibilityHint="Starts a new order for this account"
          onPress={handleNewOrder}
          className="flex-1 rounded-xl bg-ohanafy-denim px-4 py-3 active:opacity-80"
        >
          <Text className="text-center text-base font-bold text-ohanafy-paper">New Order</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Log visit at ${account.name}`}
          accessibilityHint="Opens the visit log to dictate or type a note"
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
            accessibilityLabel={`Visit on ${v.visitDate.toLocaleDateString()}: ${v.note ?? 'no note'}`}
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
  );
}

export function AccountDetailEmptyState(): React.ReactNode {
  return (
    <View
      accessibilityRole="text"
      accessibilityLabel="Select an account to see its details"
      className="flex-1 items-center justify-center bg-ohanafy-paper px-12 dark:bg-ohanafy-dark-surface"
    >
      <Text className="text-center text-lg font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
        Select an account
      </Text>
      <Text className="mt-2 text-center text-sm text-ohanafy-muted dark:text-ohanafy-dark-muted">
        Tap an account on the left to see its AI insight, recent visits, and last order.
      </Text>
    </View>
  );
}
