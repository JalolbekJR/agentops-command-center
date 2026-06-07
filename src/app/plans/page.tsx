import { AccessGate } from "@/components/access-gate";
import { PlanLimitOverview } from "@/features/plans/plan-limit-overview";

export default function PlansPage() {
  return (
    <AccessGate route="/plans">
      <PlanLimitOverview />
    </AccessGate>
  );
}
