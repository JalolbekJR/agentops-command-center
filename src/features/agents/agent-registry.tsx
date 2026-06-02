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
      <SectionCard
        title="Agent registry"
        description="Agents are modeled with owners, capabilities, approval needs, risk level, status, success rate, and cost. All records are deterministic demo data."
      >
        <div className="overflow-hidden rounded-lg border border-white/10">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Risk</th>
                  <th className="px-4 py-3">Capability</th>
                  <th className="px-4 py-3">Health</th>
                  <th className="px-4 py-3">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockAgents.map((agent) => {
                  const owner = usersById.get(agent.ownerUserId);

                  return (
                    <tr key={agent.id} className="bg-slate-950/35 align-top">
                      <td className="px-4 py-4">
                        <p className="font-semibold text-white">{agent.name}</p>
                        <p className="mt-1 max-w-sm text-sm leading-6 text-slate-400">{agent.description}</p>
                        <p className="mt-2 text-xs text-slate-500">Last run {formatDateTime(agent.lastRunAt)}</p>
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
                              <p className="text-xs text-slate-500">
                                {capability.toolName}
                                {capability.requiresApproval ? " - approval-gated" : " - local demo tool"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <StatusBadge label={agent.status} tone={riskTone(agent.riskLevel) === "danger" ? "warning" : "success"} />
                        <p className="mt-2 text-xs text-slate-500">{formatPercent(agent.successRate)} success rate</p>
                      </td>
                      <td className="px-4 py-4 text-slate-300">{formatCents(agent.averageCostCents)} avg</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
