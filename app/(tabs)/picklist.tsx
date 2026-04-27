import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function PickList(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="PickList"
      title="Pick List"
      description="Warehouse Worker view: orders ready to pick + pack, scan-to-pick flow, OOS / damaged flagging."
    />
  );
}
