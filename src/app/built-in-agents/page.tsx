import { AccessGate } from "@/components/access-gate";
import { BuiltInAgentCatalog } from "@/features/agents/built-in-agent-catalog";

export default function BuiltInAgentsPage() {
  return (
    <AccessGate route="/built-in-agents">
      <BuiltInAgentCatalog />
    </AccessGate>
  );
}
