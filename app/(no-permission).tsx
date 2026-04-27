import { Text, View } from 'react-native';

import { useAuthStore } from '@/auth/store';
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';
import { RoleSwitcher } from '@/components/shared/RoleSwitcher';
import { usePermissionStore } from '@/permissions/store';

export default function NoPermission(): React.ReactNode {
  const email = useAuthStore((s) => s.email);
  const roles = usePermissionStore((s) => s.roles);

  const hasNoRoles = roles.length === 0;

  return (
    <ErrorBoundary screenName="NoPermission">
      <View
        accessibilityLabel="No permission for this role"
        className="flex-1 bg-ohanafy-paper px-6 pt-24 dark:bg-ohanafy-dark-surface"
      >
        <Text className="mb-3 text-3xl font-bold text-ohanafy-ink dark:text-ohanafy-dark-text">
          No access yet
        </Text>
        {hasNoRoles ? (
          <Text className="mb-6 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Your account ({email}) has no Ohanafy Field permission sets assigned. Ask your
            Salesforce admin to assign one of the role permission sets in the
            <Text className="font-bold text-ohanafy-ink dark:text-ohanafy-dark-text"> ohfy_field__</Text> namespace.
          </Text>
        ) : (
          <Text className="mb-6 text-base text-ohanafy-muted dark:text-ohanafy-dark-muted">
            Day 1 only ships the Field Sales Rep experience. The rest of your roles get their
            own tab sets in Day 2. Switch to Field Sales Rep below to keep going.
          </Text>
        )}
        <RoleSwitcher />
      </View>
    </ErrorBoundary>
  );
}
