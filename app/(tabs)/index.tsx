import { FlashList } from '@shopify/flash-list';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { AccountCard } from '@/components/account/AccountCard';
import {
  AccountDetailEmptyState,
  AccountDetailView,
} from '@/components/account/AccountDetailView';
import { CoachMark } from '@/components/onboarding/CoachMark';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { LoadingSkeleton } from '@/components/shared/LoadingSkeleton';
import { OfflineBanner } from '@/components/sync/OfflineBanner';
import { SyncStatusBar } from '@/components/sync/SyncStatusBar';
import type { Account } from '@/db/models/Account';
import { useAccountList } from '@/hooks/useAccountList';
import { useTabletLayout } from '@/hooks/useTabletLayout';

const ACCOUNT_CARD_HEIGHT = 100;

export default function Accounts(): React.ReactNode {
  const [search, setSearch] = useState('');
  const [needsAttentionOnly, setNeedsAttentionOnly] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const { accounts, loading } = useAccountList({ search, needsAttentionOnly });
  const { isTablet, splitPaneLeftWidth } = useTabletLayout();

  const handleOpen = useCallback(
    (id: string) => {
      if (isTablet) {
        setSelectedAccountId(id);
      } else {
        router.push(`/account/${id}`);
      }
    },
    [isTablet]
  );

  const renderItem = useCallback(
    ({ item }: { item: Account }) => (
      <AccountCard
        account={item}
        onPress={handleOpen}
        isSelected={isTablet && item.id === selectedAccountId}
      />
    ),
    [handleOpen, isTablet, selectedAccountId]
  );

  const listView = (
    <View className="flex-1 bg-ohanafy-paper dark:bg-ohanafy-dark-surface">
      <OfflineBanner />
      <SyncStatusBar />
      <View className="px-4 pb-3 pt-12">
        <Text className="mb-3 text-2xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          Accounts
        </Text>
        <CoachMark
          markId="accounts-list"
          title="Your accounts are here"
          body="Tap any account to see AI insights and start an order. Accounts that need attention are flagged."
        />

        <TextInput
          accessibilityLabel="Search accounts"
          accessibilityHint="Filters the account list as you type"
          placeholder="Search…"
          placeholderTextColor="#9a9a9a"
          value={search}
          onChangeText={setSearch}
          className="rounded-xl bg-ohanafy-cork px-4 py-3 text-base text-ohanafy-ink dark:bg-ohanafy-dark-elevated dark:text-ohanafy-dark-text"
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Needs Attention filter"
          accessibilityState={{ selected: needsAttentionOnly }}
          accessibilityHint="Toggles the filter to show only accounts that need attention"
          onPress={() => setNeedsAttentionOnly((v) => !v)}
          className={
            needsAttentionOnly
              ? 'mt-3 self-start rounded-full bg-ohanafy-denim px-3 py-1.5'
              : 'mt-3 self-start rounded-full border border-ohanafy-denim px-3 py-1.5'
          }
        >
          <Text
            className={
              needsAttentionOnly
                ? 'text-xs font-bold text-ohanafy-paper'
                : 'text-xs font-bold text-ohanafy-denim dark:text-ohanafy-denim-light'
            }
          >
            Needs Attention
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <LoadingSkeleton count={5} itemHeight={ACCOUNT_CARD_HEIGHT} />
      ) : accounts.length === 0 ? (
        <EmptyState
          title="No accounts found"
          description={
            search
              ? `Nothing matches "${search}". Try a different search.`
              : 'When your sync completes, accounts in your territory will appear here.'
          }
        />
      ) : (
        <FlashList
          data={accounts}
          renderItem={renderItem}
          estimatedItemSize={ACCOUNT_CARD_HEIGHT}
          keyExtractor={(item) => item.id}
          getItemType={() => 'account'}
          accessibilityLabel={`Accounts list, ${accounts.length} ${accounts.length === 1 ? 'account' : 'accounts'}`}
          extraData={selectedAccountId}
        />
      )}
    </View>
  );

  if (!isTablet) {
    return <ErrorBoundary screenName="Accounts">{listView}</ErrorBoundary>;
  }

  return (
    <ErrorBoundary screenName="Accounts">
      <View
        accessibilityLabel="Accounts split view"
        className="flex-1 flex-row bg-ohanafy-paper dark:bg-ohanafy-dark-surface"
      >
        <View
          style={{ width: splitPaneLeftWidth }}
          className="border-r border-ohanafy-cork dark:border-ohanafy-dark-elevated"
        >
          {listView}
        </View>
        <View className="flex-1">
          {selectedAccountId ? (
            <AccountDetailView
              key={selectedAccountId}
              accountId={selectedAccountId}
              showBackButton={false}
            />
          ) : (
            <AccountDetailEmptyState />
          )}
        </View>
      </View>
    </ErrorBoundary>
  );
}
