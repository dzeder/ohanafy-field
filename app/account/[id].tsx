import { useLocalSearchParams } from 'expo-router';

import { AccountDetailView } from '@/components/account/AccountDetailView';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// Phone full-screen route. Tablet renders <AccountDetailView> directly inside
// the split-pane on /(tabs)/index.tsx, no full navigation.
export default function AccountDetail(): React.ReactNode {
  const { id } = useLocalSearchParams<{ id: string }>();
  if (!id) return null;
  return (
    <ErrorBoundary screenName="AccountDetail">
      <AccountDetailView accountId={id} showBackButton />
    </ErrorBoundary>
  );
}
