import { Redirect } from 'expo-router';

import { useAuthStore } from '@/auth/store';
import { usePermissionStore } from '@/permissions/store';

export default function Index(): React.ReactNode {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isBiometricUnlocked = useAuthStore((s) => s.isBiometricUnlocked);
  const activeRole = usePermissionStore((s) => s.activeRole);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }
  if (!isBiometricUnlocked) {
    return <Redirect href="/(auth)/biometric" />;
  }
  // Day 1: only FieldSalesRep has functional tabs.
  // App Admin is multi-role; we default them through the role switcher in Settings.
  if (activeRole === 'FieldSalesRep' || activeRole === 'AppAdmin') {
    return <Redirect href="/(tabs)" />;
  }
  return <Redirect href="/(no-permission)" />;
}
