import { AccessGate } from "@/components/access-gate";
import { OwnerControlPanel } from "@/features/owner-control/owner-control-panel";

export default function OwnerControlPage() {
  return (
    <AccessGate route="/owner-control">
      <OwnerControlPanel />
    </AccessGate>
  );
}
