export type RiskLevel = "low" | "medium" | "high" | "critical";
export type Severity = "info" | "success" | "warning" | "error";

export type ProjectStatus = "active" | "paused" | "archived";
export type AgentStatus = "active" | "paused" | "needs_review" | "archived";
export type WorkflowStatus = "draft" | "published" | "paused" | "archived";
export type RunStatus =
  | "queued"
  | "running"
  | "waiting_for_approval"
  | "evaluating"
  | "passed"
  | "failed"
  | "rejected"
  | "cancelled";

export type StepType =
  | "trigger"
  | "agent_task"
  | "tool_call"
  | "approval"
  | "evaluation"
  | "browser_qa"
  | "release_gate"
  | "notification";

export type StepStatus = "pending" | "running" | "waiting_for_approval" | "passed" | "failed" | "skipped" | "cancelled";
export type ToolCallStatus = "pending" | "running" | "waiting_for_approval" | "succeeded" | "failed" | "blocked" | "redacted";
export type ApprovalStatus = "pending" | "approved" | "rejected" | "expired" | "cancelled";
export type EvaluationStatus = "passed" | "warning" | "failed";
export type RiskStatus = "open" | "triaged" | "mitigated" | "accepted" | "resolved";
export type BrowserSessionStatus = "queued" | "running" | "passed" | "failed" | "cancelled";
export type ReleaseGateStatus = "passed" | "warning" | "blocked" | "not_checked";

export interface RetryPolicy {
  maxAttempts: number;
  backoff: "fixed" | "exponential";
  delayMs: number;
  retryableFailures: string[];
  nonRetryableFailures: string[];
}

export interface WorkflowStepDefinition {
  id: string;
  workflowId: string;
  stepKey: string;
  name: string;
  type: StepType;
  dependsOnStepKeys: string[];
  agentId?: string;
  toolName?: string;
  approvalPolicyId?: string;
  retryPolicy?: RetryPolicy;
  timeoutSeconds?: number;
  position: {
    x: number;
    y: number;
  };
}
