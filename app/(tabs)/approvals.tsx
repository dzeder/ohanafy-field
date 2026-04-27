import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Approvals(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Approvals"
      title="Approvals"
      description="Pending large-order approvals from your reps. Tap to review and approve or reject."
    />
  );
}
