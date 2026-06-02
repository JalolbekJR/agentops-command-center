import type { CostMetric } from "@/types/domain";
import { activeProject } from "@/data/mock-projects";

export const mockCostMetrics: CostMetric[] = [
  {
    id: "cost_release_001_orchestrator",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    agentId: "agent_release_orchestrator",
    modelName: "mock-reasoning-router",
    inputTokens: 18200,
    outputTokens: 4200,
    estimatedCostCents: 18,
    recordedAt: "2026-06-02T10:30:30Z"
  },
  {
    id: "cost_release_001_security",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    agentId: "agent_security_sentinel",
    modelName: "mock-risk-classifier",
    inputTokens: 24500,
    outputTokens: 5100,
    estimatedCostCents: 24,
    recordedAt: "2026-06-02T10:34:20Z"
  },
  {
    id: "cost_release_000_eval",
    projectId: activeProject.id,
    workflowRunId: "run_release_000",
    agentId: "agent_eval_analyst",
    modelName: "mock-eval-scorecard",
    inputTokens: 16800,
    outputTokens: 3900,
    estimatedCostCents: 16,
    recordedAt: "2026-06-02T08:14:10Z"
  },
  {
    id: "cost_debug_014_security",
    projectId: activeProject.id,
    workflowRunId: "run_debug_014",
    agentId: "agent_security_sentinel",
    modelName: "mock-risk-classifier",
    inputTokens: 22800,
    outputTokens: 4700,
    estimatedCostCents: 27,
    recordedAt: "2026-06-02T09:22:41Z"
  },
  {
    id: "cost_cost_009_guardian",
    projectId: activeProject.id,
    workflowRunId: "run_cost_009",
    agentId: "agent_cost_guardian",
    modelName: "mock-cost-aggregator",
    inputTokens: 9200,
    outputTokens: 1800,
    estimatedCostCents: 12,
    recordedAt: "2026-06-02T10:48:30Z"
  }
];
