import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { getPlanUsageStatuses } from "@/lib/usage-limits";

export function PlanLimitOverview() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Plans and usage"
        title="Monetization model without payment implementation."
        description="Plan limits explain how Free Demo, Starter, Pro, and Enterprise/Self-hosted would unlock agents, connectors, workers, retention, and support."
      />

      <SectionCard title="Workspace plans" description="No Stripe, checkout, billing portal, or live payment state exists in this phase.">
        <div className="grid gap-4 xl:grid-cols-4">
          {mockWorkspacePlans.map((plan) => (
            <article key={plan.id} className={["data-card", plan.recommended ? "border-white/[0.15]" : ""].join(" ")}>
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

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge label={plan.privateWorkers ? "workers" : "no workers"} tone={plan.privateWorkers ? "success" : "neutral"} />
                <StatusBadge label={plan.auditExport ? "audit export" : "basic audit"} tone={plan.auditExport ? "success" : "info"} />
              </div>
              <p className="muted-copy mt-4 text-sm">{plan.upgradeReason}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
