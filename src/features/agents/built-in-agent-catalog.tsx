import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockBuiltInAgents } from "@/data/mock-built-in-agents";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { getBuiltInAgentAvailabilityLabel } from "@/lib/agent-builder";
import { isBuiltInAgentUsageAllowed } from "@/lib/usage-limits";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "pro") ?? mockWorkspacePlans[0];

export function BuiltInAgentCatalog() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Built-in agents"
        title="AgentOps-built agents as monetizable product modules."
        description="Website QA is first because it can later prove value with visible evidence, safe local targets, and release-readiness output."
      />

      <SectionCard title="Catalog" description="AgentOps owner controls publishing; workspaces enable available agents within plan limits.">
        <div className="grid gap-4 xl:grid-cols-3">
          {mockBuiltInAgents.map((agent) => {
            const included = isBuiltInAgentUsageAllowed(agent, currentPlan);

            return (
              <article key={agent.id} className="data-card">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{agent.name}</p>
                      {agent.recommended ? <StatusBadge label="first" tone="success" /> : null}
                    </div>
                    <p className="muted-copy mt-2 text-sm">{agent.shortDescription}</p>
                  </div>
                  <RiskBadge riskLevel={agent.riskLevel} />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="detail-tile">
                    <p className="meta-label">Tier</p>
                    <p className="mt-1 text-sm font-semibold text-white">{agent.monetizationTier.replaceAll("_", " ")}</p>
                  </div>
                  <div className="detail-tile">
                    <p className="meta-label">Meter</p>
                    <p className="mt-1 text-sm font-semibold text-white">{agent.usageMeter.replaceAll("_", " ")}</p>
                  </div>
                </div>

                <p className="muted-copy mt-4 text-sm">{agent.purpose}</p>
                <p className="subtle-copy mt-3 text-xs">{agent.securityNotes[0]}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label={agent.implementationStatus} tone={agent.implementationStatus === "recommended_demo_foundation" ? "success" : agent.implementationStatus === "planned" ? "warning" : "neutral"} />
                  <StatusBadge label={getBuiltInAgentAvailabilityLabel(agent, currentPlan)} tone={included ? "success" : "warning"} />
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
