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
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Evaluation"
        title="Score agent outcomes before release."
        description="Quality, safety, reliability, cost, and policy scores feed release readiness without hiding weak signals."
      />
      <SectionCard
        title="Scorecards"
        description="Weighted results for recent workflow runs."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {mockEvaluations.map((evaluation) => (
            <article key={evaluation.id} className="data-card">
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
