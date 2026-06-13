import type { Workflow } from "@/types/domain";
import { activeProject } from "./mock-projects";

export const mockWorkflows: Workflow[] = [
  {
    id: "workflow_release_review",
    projectId: activeProject.id,
    name: "Release Readiness Review",
    description: "Runs browser QA, security risk review, evaluation scoring, and release gate checks.",
    status: "published",
    version: 1,
    ownerUserId: "user_engineer",
    triggerType: "manual",
    updatedAt: "2026-06-02T10:02:00Z",
    steps: [
      {
        id: "step_release_trigger",
        workflowId: "workflow_release_review",
        stepKey: "release_trigger",
        name: "Manual release trigger",
        type: "trigger",
        dependsOnStepKeys: [],
        position: { x: 0, y: 0 }
      },
      {
        id: "step_browser_qa",
        workflowId: "workflow_release_review",
        stepKey: "browser_qa",
        name: "Run browser QA checks",
        type: "browser_qa",
        dependsOnStepKeys: ["release_trigger"],
        agentId: "agent_browser_qa",
        toolName: "browser_session_runner",
        timeoutSeconds: 90,
        position: { x: 220, y: -80 }
      },
      {
        id: "step_risk_scan",
        workflowId: "workflow_release_review",
        stepKey: "risk_scan",
        name: "Scan run for AI safety risks",
        type: "agent_task",
        dependsOnStepKeys: ["release_trigger"],
        agentId: "agent_security_sentinel",
        toolName: "prompt_injection_scanner",
        approvalPolicyId: "policy_high_risk_security",
        position: { x: 220, y: 80 }
      },
      {
        id: "step_security_approval",
        workflowId: "workflow_release_review",
        stepKey: "security_approval",
        name: "Security approval checkpoint",
        type: "approval",
        dependsOnStepKeys: ["risk_scan"],
        approvalPolicyId: "policy_high_risk_security",
        position: { x: 460, y: 80 }
      },
      {
        id: "step_evaluation",
        workflowId: "workflow_release_review",
        stepKey: "evaluation",
        name: "Score release quality",
        type: "evaluation",
        dependsOnStepKeys: ["browser_qa", "security_approval"],
        agentId: "agent_eval_analyst",
        position: { x: 700, y: 0 }
      },
      {
        id: "step_release_gate",
        workflowId: "workflow_release_review",
        stepKey: "release_gate",
        name: "Check release gate",
        type: "release_gate",
        dependsOnStepKeys: ["evaluation"],
        position: { x: 920, y: 0 }
      }
    ]
  },
  {
    id: "workflow_agent_debug",
    projectId: activeProject.id,
    name: "Failed Agent Run Debug",
    description: "Collects run evidence, tool calls, trace IDs, and suggested remediation for failed agent workflows.",
    status: "published",
    version: 2,
    ownerUserId: "user_engineer",
    triggerType: "manual",
    updatedAt: "2026-06-01T16:10:00Z",
    steps: [
      {
        id: "step_debug_trace",
        workflowId: "workflow_agent_debug",
        stepKey: "trace_review",
        name: "Review trace events",
        type: "agent_task",
        dependsOnStepKeys: [],
        agentId: "agent_release_orchestrator",
        position: { x: 0, y: 0 }
      },
      {
        id: "step_debug_tool_calls",
        workflowId: "workflow_agent_debug",
        stepKey: "tool_call_review",
        name: "Inspect tool calls",
        type: "tool_call",
        dependsOnStepKeys: ["trace_review"],
        agentId: "agent_security_sentinel",
        toolName: "tool_call_summarizer",
        position: { x: 240, y: 0 }
      }
    ]
  },
  {
    id: "workflow_cost_watch",
    projectId: activeProject.id,
    name: "Token Budget Watch",
    description: "Reviews token usage and flags budget anomalies before they become operational surprises.",
    status: "draft",
    version: 1,
    ownerUserId: "user_admin",
    triggerType: "scheduled",
    updatedAt: "2026-06-01T12:45:00Z",
    steps: [
      {
        id: "step_cost_collect",
        workflowId: "workflow_cost_watch",
        stepKey: "collect_costs",
        name: "Collect cost metrics",
        type: "agent_task",
        dependsOnStepKeys: [],
        agentId: "agent_cost_guardian",
        toolName: "cost_metric_aggregator",
        position: { x: 0, y: 0 }
      }
    ]
  }
];
