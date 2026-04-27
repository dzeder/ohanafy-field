import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Reports(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Reports"
      title="Reports"
      description="Role-scoped dashboards: territory performance for managers, route efficiency for dispatch, throughput for warehouse managers."
    />
  );
}
