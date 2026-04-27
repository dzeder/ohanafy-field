import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Operations(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Operations"
      title="Operations"
      description="Warehouse Manager dashboard: throughput, exceptions, worker productivity at a glance."
    />
  );
}
