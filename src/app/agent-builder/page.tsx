import { AccessGate } from "@/components/access-gate";
import { AgentBuilderWorkbench } from "@/features/agent-builder/agent-builder-workbench";

export default function AgentBuilderPage() {
  return (
    <AccessGate route="/agent-builder">
      <AgentBuilderWorkbench />
    </AccessGate>
  );
}
