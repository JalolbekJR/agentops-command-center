import { riskTone } from "@/lib/status";
import { StatusBadge } from "@/components/status-badge";
import type { RiskLevel } from "@/types/workflow";

export function RiskBadge({ riskLevel }: { riskLevel: RiskLevel }) {
  return <StatusBadge label={`${riskLevel} risk`} tone={riskTone(riskLevel)} />;
}
