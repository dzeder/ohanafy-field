import { render } from '@testing-library/react-native';
import { Text } from 'react-native';

import { PermissionGate } from '@/components/shared/PermissionGate';
import { usePermissionStore } from '@/permissions/store';

describe('<PermissionGate>', () => {
  beforeEach(() => {
    usePermissionStore.getState().clear();
  });

  it('renders children when the user has the permission', () => {
    usePermissionStore.getState().setPermissions({
      userId: 'rep@ohanafy.com',
      roles: ['FieldSalesRep'],
      primaryRole: 'FieldSalesRep',
      customPerms: {},
      fetchedAt: Date.now(),
    });
    const { queryByText } = render(
      <PermissionGate permission="create_orders">
        <Text>Order entry</Text>
      </PermissionGate>
    );
    expect(queryByText('Order entry')).toBeTruthy();
  });

  it('renders fallback when the user lacks the permission', () => {
    usePermissionStore.getState().setPermissions({
      userId: 'rep@ohanafy.com',
      roles: ['FieldSalesRep'],
      primaryRole: 'FieldSalesRep',
      customPerms: {},
      fetchedAt: Date.now(),
    });
    const { queryByText } = render(
      <PermissionGate permission="manage_admin_console" fallback={<Text>Locked</Text>}>
        <Text>Admin Console</Text>
      </PermissionGate>
    );
    expect(queryByText('Admin Console')).toBeNull();
    expect(queryByText('Locked')).toBeTruthy();
  });

  it('renders nothing (null fallback) when permission is missing and no fallback prop given', () => {
    usePermissionStore.getState().setPermissions({
      userId: 'rep@ohanafy.com',
      roles: ['FieldSalesRep'],
      primaryRole: 'FieldSalesRep',
      customPerms: {},
      fetchedAt: Date.now(),
    });
    const { toJSON } = render(
      <PermissionGate permission="manage_admin_console">
        <Text>Admin Console</Text>
      </PermissionGate>
    );
    expect(toJSON()).toBeNull();
  });
});
