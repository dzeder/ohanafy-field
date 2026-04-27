import { RoleTabPlaceholder } from '@/components/shared/RoleTabPlaceholder';

export default function Inventory(): React.ReactNode {
  return (
    <RoleTabPlaceholder
      screenName="Inventory"
      title="Inventory"
      description="Stock levels by SKU + bin. Cycle count workflow, low-stock alerts, supplier reorder suggestions."
    />
  );
}
