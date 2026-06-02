import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAgents } from "@/data/mock-agents";
import { mockUsers } from "@/data/mock-users";
import { formatCents, formatDateTime, formatPercent } from "@/lib/format";
import { riskTone } from "@/lib/status";

export function AgentRegistry() {
  const usersById = new Map(mockUsers.map((user) => [user.id, user]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agent registry"
        title="Agent inventory with ownership and tool boundaries."
        description="Owners, capabilities, approval gates, health, and cost are visible before an agent joins a workflow."
      />
      <SectionCard
        title="Agents"
        description="Operational inventory for the local workspace."
      >
        <div className="data-table-shell hidden lg:block">
          <div className="premium-scroll overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Capability</th>
                  <th className="px-4 py-3">Health</th>
                  <th className="px-4 py-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {mockAgents.map((agent) => {
                  const owner = usersById.get(agent.ownerUserId);

                  return (
                    <tr key={agent.id}>
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="muted-copy mt-1 max-w-sm text-sm">{agent.description}</p>
                        <p className="subtle-copy mt-2 text-xs">Last run {formatDateTime(agent.lastRunAt)}</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{owner?.name ?? "Unassigned"}</td>
                      <td className="px-4 py-4">
                        <RiskBadge riskLevel={agent.riskLevel} />
                      </td>
                      <td className="px-4 py-4">
                        <div className="space-y-2">
                          {agent.capabilities.map((capability) => (
                            <div key={capability.id}>
                              <p className="font-medium text-slate-200">{capability.name}</p>
                              <p className="subtle-copy text-xs">
                                {capability.toolName}
                                {capability.requiresApproval ? " - approval-gated" : " - local demo tool"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge label={agent.status} tone={riskTone(agent.riskLevel) === "danger" ? "warning" : "success"} />
                        <p className="subtle-copy mt-2 text-xs">{formatPercent(agent.successRate)} success rate</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{formatCents(agent.averageCostCents)} avg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-3 lg:hidden">
          {mockAgents.map((agent) => {
            const owner = usersById.get(agent.ownerUserId);

            return (
              <article key={agent.id} className="data-card">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge label={agent.status} tone={riskTone(agent.riskLevel) === "danger" ? "warning" : "success"} />
                  <RiskBadge riskLevel={agent.riskLevel} />
                </div>
                <h3 className="mt-3 text-base font-semibold text-white">{agent.name}</h3>
                <p className="muted-copy mt-2 text-sm">{agent.description}</p>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="meta-label">Owner</dt>
                    <dd className="mt-1 text-slate-200">{owner?.name ?? "Unassigned"}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Health</dt>
                    <dd className="mt-1 text-slate-200">{formatPercent(agent.successRate)}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Avg cost</dt>
                    <dd className="mt-1 text-slate-200">{formatCents(agent.averageCostCents)}</dd>
                  </div>
                  <div>
                    <dt className="meta-label">Last run</dt>
                    <dd className="mt-1 text-slate-200">{formatDateTime(agent.lastRunAt)}</dd>
                  </div>
                </dl>
                <div className="mt-4 space-y-2">
                  {agent.capabilities.map((capability) => (
                    <div key={capability.id} className="data-card-muted px-3 py-2">
                      <p className="text-sm font-medium text-slate-100">{capability.name}</p>
                      <p className="subtle-copy text-xs">{capability.requiresApproval ? "Approval-gated" : "Scoped demo tool"}</p>
                    </div>
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
