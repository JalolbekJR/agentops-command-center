import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockEvaluations } from "@/data/mock-evaluations";
import { formatDateTime, formatPercent } from "@/lib/format";
import { evaluationStatusTone } from "@/lib/status";

const scoreKeys = [
  "correctnessScore",
  "safetyScore",
  "reliabilityScore",
  "latencyScore",
  "costScore",
  "userImpactScore",
  "policyComplianceScore"
] as const;

const scoreLabels: Record<(typeof scoreKeys)[number], string> = {
  correctnessScore: "Correctness",
  safetyScore: "Safety",
  reliabilityScore: "Reliability",
  latencyScore: "Latency",
  costScore: "Cost",
  userImpactScore: "User impact",
  policyComplianceScore: "Policy"
};

export function EvaluationSummary() {
  const averageScore = mockEvaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / mockEvaluations.length;
  const warningCount = mockEvaluations.filter((evaluation) => evaluation.status === "warning").length;
  const minimumScore = Math.min(...mockEvaluations.map((evaluation) => evaluation.overallScore));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evaluation"
        title="Release confidence scorecards."
        description="Compare correctness, safety, reliability, latency, cost, user impact, and policy before a workflow moves forward."
      />
      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={`${formatPercent(averageScore, 1)} avg`} tone="success" />
              <StatusBadge label={`${warningCount} warning`} tone={warningCount > 0 ? "warning" : "success"} />
              <StatusBadge label="Release confidence" tone="info" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">Evaluation turns agent output into release evidence.</h2>
            <p className="muted-copy mt-3 text-sm">
              Scorecards show quality, safety, reliability, cost, user impact, and policy compliance so product and QA reviewers can explain release confidence.
            </p>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Gate policy</p>
            <p className="mt-2 text-lg font-semibold text-white">Minimum observed score: {formatPercent(minimumScore, 1)}</p>
            <p className="muted-copy mt-2 text-sm">Warnings do not disappear; they remain visible beside the run and audit story.</p>
          </div>
        </div>
      </section>
      <SectionCard
        title="Scorecards"
        description="Weighted results for recent workflow runs."
      >
        <div className="scorecard-grid grid gap-4 xl:grid-cols-3">
          {mockEvaluations.map((evaluation) => (
            <article key={evaluation.id} className="evaluation-card data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{evaluation.workflowRunId}</p>
                  <p className="subtle-copy mt-1 text-xs">{formatDateTime(evaluation.createdAt)}</p>
                </div>
                <StatusBadge label={evaluation.status} tone={evaluationStatusTone(evaluation.status)} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{formatPercent(evaluation.overallScore, 1)}</p>
              <p className="muted-copy mt-2 text-sm">{evaluation.notes}</p>
              <div className="mt-4 space-y-3">
                {scoreKeys.map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between gap-3 text-xs text-slate-400">
                      <span>{scoreLabels[key]}</span>
                      <span>{formatPercent(evaluation[key], 0)}</span>
                    </div>
                    <div className="score-bar mt-1">
                      <div className="score-bar-fill" style={{ width: `${evaluation[key] * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
