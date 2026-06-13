import type { Agent } from "@/types/domain";
import { activeProject } from "./mock-projects";

export const mockAgents: Agent[] = [
  {
    id: "agent_release_orchestrator",
    projectId: activeProject.id,
    name: "Release Orchestrator",
    description: "Coordinates release-readiness checks across QA, risk, approval, and evaluation steps.",
    ownerUserId: "user_engineer",
    status: "active",
    riskLevel: "medium",
    defaultModel: "mock-reasoning-router",
    lastRunAt: "2026-06-02T10:30:00Z",
    successRate: 0.91,
    averageCostCents: 38,
    capabilities: [
      {
        id: "cap_release_plan",
        agentId: "agent_release_orchestrator",
        name: "Release plan synthesis",
        category: "ops",
        requiresApproval: false,
        riskLevel: "medium",
        toolName: "release_plan_builder"
      }
    ]
  },
  {
    id: "agent_browser_qa",
    projectId: activeProject.id,
    name: "Browser QA Agent",
    description: "Runs local deterministic browser QA scenarios and records session evidence.",
    ownerUserId: "user_qa",
    status: "active",
    riskLevel: "medium",
    defaultModel: "mock-qa-evaluator",
    lastRunAt: "2026-06-02T10:32:00Z",
    successRate: 0.88,
    averageCostCents: 22,
    capabilities: [
      {
        id: "cap_browser_session",
        agentId: "agent_browser_qa",
        name: "Browser session review",
        category: "qa",
        requiresApproval: false,
        riskLevel: "medium",
        toolName: "browser_session_runner"
      }
    ]
  },
  {
    id: "agent_security_sentinel",
    projectId: activeProject.id,
    name: "Security Sentinel",
    description: "Flags prompt injection, tool misuse, sensitive output, and policy boundary risks.",
    ownerUserId: "user_security",
    status: "needs_review",
    riskLevel: "high",
    defaultModel: "mock-risk-classifier",
    lastRunAt: "2026-06-02T10:34:00Z",
    successRate: 0.84,
    averageCostCents: 31,
    capabilities: [
      {
        id: "cap_prompt_injection",
        agentId: "agent_security_sentinel",
        name: "Prompt injection triage",
        category: "security",
        requiresApproval: true,
        riskLevel: "high",
        toolName: "prompt_injection_scanner"
      }
    ]
  },
  {
    id: "agent_eval_analyst",
    projectId: activeProject.id,
    name: "Evaluation Analyst",
    description: "Scores run output across correctness, safety, reliability, cost, and policy compliance.",
    ownerUserId: "user_pm",
    status: "active",
    riskLevel: "low",
    defaultModel: "mock-eval-scorecard",
    lastRunAt: "2026-06-02T10:45:00Z",
    successRate: 0.94,
    averageCostCents: 16,
    capabilities: [
      {
        id: "cap_quality_score",
        agentId: "agent_eval_analyst",
        name: "Quality scorecard",
        category: "product",
        requiresApproval: false,
        riskLevel: "low",
        toolName: "evaluation_scorecard"
      }
    ]
  },
  {
    id: "agent_cost_guardian",
    projectId: activeProject.id,
    name: "Cost Guardian",
    description: "Tracks token budgets, cost trend warnings, and workflow cost anomalies.",
    ownerUserId: "user_admin",
    status: "active",
    riskLevel: "low",
    defaultModel: "mock-cost-aggregator",
    lastRunAt: "2026-06-02T10:48:00Z",
    successRate: 0.97,
    averageCostCents: 8,
    capabilities: [
      {
        id: "cap_cost_budget",
        agentId: "agent_cost_guardian",
        name: "Budget alerting",
        category: "ops",
        requiresApproval: false,
        riskLevel: "low",
        toolName: "cost_metric_aggregator"
      }
    ]
  }
];
