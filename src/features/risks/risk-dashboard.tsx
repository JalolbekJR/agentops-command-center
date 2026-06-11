import { PageHeader } from "@/components/page-header";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockRisks } from "@/data/mock-risks";
import { formatDateTime, titleCase } from "@/lib/format";

export function RiskDashboard() {
  const highRiskCount = mockRisks.filter((risk) => risk.severity === "high" || risk.severity === "critical").length;
  const openRiskCount = mockRisks.filter((risk) => risk.status === "open" || risk.status === "triaged").length;
  const primaryRisk = mockRisks.find((risk) => risk.severity === "high" || risk.severity === "critical") ?? mockRisks[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Risk review"
        title="Prioritize unsafe automation and policy findings."
        description="Severity, evidence, owner, and mitigation context stay close enough to act without making every item feel urgent."
      />
      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={`${openRiskCount} open or triaged`} tone={openRiskCount > 0 ? "warning" : "success"} />
              <StatusBadge label={`${highRiskCount} high risk`} tone={highRiskCount > 0 ? "danger" : "success"} />
              <StatusBadge label="Release gate input" tone="info" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">Risks explain what can block or slow an agent workflow.</h2>
            <p className="muted-copy mt-3 text-sm">
              Each finding carries evidence, owner, mitigation, and escalation context so reviewers can act without hunting through raw logs.
            </p>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Primary escalation</p>
            <div className="mt-2 flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white">{primaryRisk.title}</p>
              <RiskBadge riskLevel={primaryRisk.severity} />
            </div>
            <p className="muted-copy mt-2 text-sm">{primaryRisk.recommendedMitigation}</p>
          </div>
        </div>
      </section>
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
