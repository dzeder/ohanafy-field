import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Inbound(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Inbound"
      title="Inbound"
      description="Receive supplier loads. Verify pallet counts, capture damages, generate bin labels."
    />
  );
}
