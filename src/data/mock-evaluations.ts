import type { EvaluationResult } from "@/types/domain";

export const mockEvaluations: EvaluationResult[] = [
  {
    id: "eval_release_001",
    workflowRunId: "run_release_001",
    evaluatorType: "deterministic_mock",
    correctnessScore: 0.9,
    safetyScore: 0.82,
    reliabilityScore: 0.86,
    latencyScore: 0.78,
    costScore: 0.84,
    userImpactScore: 0.88,
    policyComplianceScore: 0.8,
    overallScore: 0.84,
    status: "warning",
    notes: "Release review is strong but paused until the high-risk approval is decided.",
    createdAt: "2026-06-02T10:45:00Z"
  },
  {
    id: "eval_release_000",
    workflowRunId: "run_release_000",
    evaluatorType: "deterministic_mock",
    correctnessScore: 0.93,
    safetyScore: 0.9,
    reliabilityScore: 0.91,
    latencyScore: 0.82,
    costScore: 0.86,
    userImpactScore: 0.89,
    policyComplianceScore: 0.88,
    overallScore: 0.89,
    status: "passed",
    notes: "Passed release threshold with one non-blocking product review note.",
    createdAt: "2026-06-02T08:14:10Z"
  },
  {
    id: "eval_debug_014",
    workflowRunId: "run_debug_014",
    evaluatorType: "deterministic_mock",
    correctnessScore: 0.62,
    safetyScore: 0.58,
    reliabilityScore: 0.64,
    latencyScore: 0.73,
    costScore: 0.79,
    userImpactScore: 0.7,
    policyComplianceScore: 0.52,
    overallScore: 0.62,
    status: "failed",
    notes: "Failed because tool output conflicted with policy boundaries.",
    createdAt: "2026-06-02T09:24:00Z"
  }
];
