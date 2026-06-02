import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockRisks } from "@/data/mock-risks";
import { formatDateTime, titleCase } from "@/lib/format";

export function RiskDashboard() {
  const highRiskCount = mockRisks.filter((risk) => risk.severity === "high" || risk.severity === "critical").length;

  return (
    <div className="space-y-6">
      <SectionCard
        title="Risk and security dashboard"
        description="Risk findings connect AI behavior to evidence, owners, mitigation, and release gates."
        action={<StatusBadge label={`${highRiskCount} high risk`} tone={highRiskCount > 0 ? "danger" : "success"} />}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {mockRisks.map((risk) => (
            <article key={risk.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{risk.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{titleCase(risk.category)}</p>
                </div>
                <RiskBadge riskLevel={risk.severity} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{risk.description}</p>
              <div className="mt-4 rounded-md border border-white/10 bg-slate-950/50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{risk.evidenceSummary}</p>
              </div>
              <p className="mt-4 text-xs text-slate-500">
                Owner: {risk.ownerRole}. Created {formatDateTime(risk.createdAt)}.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-400">{risk.recommendedMitigation}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
