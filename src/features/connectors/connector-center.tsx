import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockConnectors } from "@/data/mock-connectors";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { connectorSecuritySummary, getConnectorCapabilities, isConnectorAllowedForPlan } from "@/lib/connector-policy";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "pro") ?? mockWorkspacePlans[0];

export function ConnectorCenter() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Connector center"
        title="Connect built-in, custom, worker, and trace-based agents safely."
        description="AgentOps Native Protocol is the recommended custom-agent path because it maps cleanly into timelines, tools, approvals, risks, evaluations, costs, and audit logs."
      />

      <SectionCard
        title="Connection methods"
        description={`Plan context: ${currentPlan.name}. Availability is local deterministic UI only.`}
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {mockConnectors.map((connector) => {
            const available = isConnectorAllowedForPlan(connector, currentPlan);
            const capabilities = getConnectorCapabilities(connector.type);

            return (
              <article key={connector.id} className="data-card">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{connector.name}</p>
                      {connector.isRecommended ? <StatusBadge label="recommended" tone="success" /> : null}
                    </div>
                    <p className="muted-copy mt-2 text-sm">{connector.summary}</p>
                  </div>
                  <StatusBadge label={connector.status} tone={connector.status === "demo_ready" ? "success" : connector.status === "planned" ? "warning" : "neutral"} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="detail-tile">
                    <p className="meta-label">Difficulty</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.setupDifficulty}</p>
                  </div>
                  <div className="detail-tile">
                    <p className="meta-label">Privacy</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.privacyLevel.replaceAll("_", " ")}</p>
                  </div>
                  <div className="detail-tile">
                    <p className="meta-label">Plan</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.minimumPlan.replaceAll("_", " ")}</p>
                  </div>
                </div>

                <p className="muted-copy mt-4 text-sm">{connector.bestFor}</p>
                <p className="data-card-muted mt-3 p-3 text-xs leading-5 text-slate-400">{connectorSecuritySummary(connector)}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label={available ? "plan available" : "plan locked"} tone={available ? "success" : "warning"} />
                  {capabilities.slice(0, 5).map((capability) => (
                    <span key={capability} className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">
                      {capability}
                    </span>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
