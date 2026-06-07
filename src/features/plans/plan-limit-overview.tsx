"use client";

import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge } from "@/components/permission-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { useDemoState } from "@/lib/demo-state";
import { getRouteAccess, isFounderAdmin } from "@/lib/role-access";
import { getPlanUsageStatuses } from "@/lib/usage-limits";
import type { WorkspacePlan } from "@/types/plans";

const featureRows: Array<{ label: string; getValue: (plan: WorkspacePlan) => string | boolean }> = [
  { label: "Built-in agents", getValue: (plan) => `${plan.builtInAgentIds.length} modules` },
  { label: "Native Protocol", getValue: (plan) => plan.connectorAccess.includes("agentops_native_protocol") },
  { label: "Webhook", getValue: (plan) => plan.connectorAccess.includes("byo_webhook") },
  { label: "SDK", getValue: (plan) => plan.sdkAccess },
  { label: "MCP", getValue: (plan) => plan.mcpConnectors },
  { label: "Private Worker", getValue: (plan) => plan.privateWorkers },
  { label: "Audit export", getValue: (plan) => plan.auditExport }
];

function FeatureValue({ value }: { value: string | boolean }) {
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-slate-100">{value}</span>;
  }

  return <StatusBadge label={value ? "included" : "locked"} tone={value ? "success" : "neutral"} />;
}

export function PlanLimitOverview() {
  const { selectedRole } = useDemoState();
  const access = getRouteAccess(selectedRole, "/plans");
  const canManagePlans = isFounderAdmin(selectedRole);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Plans and usage"
        title="Plan packaging for a monetizable agent operations platform."
        description="Free Demo proves value safely, Starter supports small teams, Pro unlocks custom agent operations, and Enterprise adds private workers and license control."
        action={<PermissionBadge level={access.level} />}
      />

      <div className="notice-card notice-card-neutral flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">Payment boundary</p>
          <p className="muted-copy mt-1 text-sm">Pricing and limits are product packaging only. No checkout, billing portal, webhooks, or Stripe code exists.</p>
        </div>
        <StatusBadge label={canManagePlans ? "owner can manage" : "read-only"} tone={canManagePlans ? "success" : "info"} />
      </div>

      <SectionCard title="Plan comparison" description="Pro is the recommended product package because it unlocks custom-agent value without enterprise deployment complexity.">
        <div className="grid gap-4 xl:grid-cols-4">
          {mockWorkspacePlans.map((plan) => (
            <article key={plan.id} className={["data-card", plan.recommended ? "border-white/[0.2] bg-white/[0.05]" : ""].join(" ")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{plan.name}</p>
                  <p className="subtle-copy mt-1 text-xs">{plan.priceLabel}</p>
                </div>
                {plan.recommended ? <StatusBadge label="recommended" tone="success" /> : null}
              </div>
              <p className="muted-copy mt-3 text-sm">{plan.summary}</p>
              <p className="subtle-copy mt-3 text-xs">{plan.audience}</p>

              <div className="mt-4 space-y-2">
                {getPlanUsageStatuses(plan).slice(0, 5).map((usage) => (
                  <div key={usage.meter} className="data-card-muted p-3">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="capitalize text-slate-400">{usage.label}</span>
                      <span className="text-slate-200">{usage.included === "unlimited" ? "Unlimited" : `${usage.used}/${usage.included}`}</span>
                    </div>
                    {usage.included !== "unlimited" ? (
                      <div className="score-bar mt-2">
                        <div className="score-bar-fill" style={{ width: `${Math.min(100, usage.percentUsed)}%` }} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-4">
                <ActionButton disabled={!canManagePlans} variant={plan.recommended && canManagePlans ? "primary" : "secondary"}>
                  {canManagePlans ? "Adjust package" : "View summary"}
                </ActionButton>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="What unlocks what" description="A compact product matrix makes the upgrade story visible without adding payments.">
        <div className="data-table-shell overflow-x-auto">
          <table className="data-table min-w-[760px]">
            <thead>
              <tr>
                <th>Feature</th>
                {mockWorkspacePlans.map((plan) => (
                  <th key={plan.id}>{plan.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {featureRows.map((row) => (
                <tr key={row.label}>
                  <td className="font-semibold text-slate-100">{row.label}</td>
                  {mockWorkspacePlans.map((plan) => (
                    <td key={`${plan.id}-${row.label}`}>
                      <FeatureValue value={row.getValue(plan)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
