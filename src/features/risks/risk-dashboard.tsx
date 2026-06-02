import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockRisks } from "@/data/mock-risks";
import { formatDateTime, titleCase } from "@/lib/format";

export function RiskDashboard() {
  const highRiskCount = mockRisks.filter((risk) => risk.severity === "high" || risk.severity === "critical").length;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Risk review"
        title="Prioritize unsafe automation and policy findings."
        description="Severity, evidence, owner, and mitigation context stay close enough to act without making every item feel urgent."
      />
      <SectionCard
        title="Risk findings"
        description="Open issues linked to runs and release readiness."
        action={<StatusBadge label={`${highRiskCount} high risk`} tone={highRiskCount > 0 ? "danger" : "success"} />}
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {mockRisks.map((risk) => (
            <article key={risk.id} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{risk.title}</p>
                  <p className="subtle-copy mt-1 text-xs">{titleCase(risk.category)}</p>
                </div>
                <RiskBadge riskLevel={risk.severity} />
              </div>
              <p className="muted-copy mt-4 text-sm">{risk.description}</p>
              <div className="data-card-muted mt-4 p-3">
                <p className="meta-label">Evidence</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{risk.evidenceSummary}</p>
              </div>
              <p className="subtle-copy mt-4 text-xs">
                Owner: {risk.ownerRole}. Created {formatDateTime(risk.createdAt)}.
              </p>
              <p className="muted-copy mt-3 text-sm">{risk.recommendedMitigation}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
