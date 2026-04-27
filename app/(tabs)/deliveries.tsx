import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Deliveries(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Deliveries"
      title="Deliveries"
      description="Driver view: today's stops, sign-on-glass receipt confirmation, exception logging."
    />
  );
}
