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
      <SectionCard
        title="Evaluation dashboard"
        description="Deterministic scorecards keep AI output review connected to runs, safety, cost, and release readiness."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {mockEvaluations.map((evaluation) => (
            <article key={evaluation.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{evaluation.workflowRunId}</p>
                  <p className="mt-1 text-xs text-slate-500">{formatDateTime(evaluation.createdAt)}</p>
                </div>
                <StatusBadge label={evaluation.status} tone={evaluationStatusTone(evaluation.status)} />
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">{formatPercent(evaluation.overallScore, 1)}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{evaluation.notes}</p>
              <div className="mt-4 space-y-3">
                {scoreKeys.map((key) => (
                  <div key={key}>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>{scoreLabels[key]}</span>
                      <span>{formatPercent(evaluation[key], 0)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/10">
                      <div className="h-2 rounded-full bg-cyan-300" style={{ width: `${evaluation[key] * 100}%` }} />
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
