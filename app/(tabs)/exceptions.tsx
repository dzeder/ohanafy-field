import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Exceptions(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Exceptions"
      title="Exceptions"
      description="Delivery and dispatch exceptions awaiting resolution. Filter by severity and route."
    />
  );
}
