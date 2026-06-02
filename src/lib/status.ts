import type { ApprovalStatus, EvaluationStatus, RiskLevel, RunStatus, WorkflowStatus } from "@/types/workflow";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";

export function runStatusTone(status: RunStatus): Tone {
  switch (status) {
    case "passed":
      return "success";
    case "running":
    case "queued":
    case "evaluating":
      return "info";
    case "waiting_for_approval":
      return "warning";
    case "failed":
    case "rejected":
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

export function workflowStatusTone(status: WorkflowStatus): Tone {
  switch (status) {
    case "published":
      return "success";
    case "draft":
      return "info";
    case "paused":
      return "warning";
    case "archived":
      return "neutral";
    default:
      return "neutral";
  }
}

export function approvalStatusTone(status: ApprovalStatus): Tone {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
    case "expired":
    case "cancelled":
      return "danger";
    default:
      return "neutral";
  }
}

export function evaluationStatusTone(status: EvaluationStatus): Tone {
  switch (status) {
    case "passed":
      return "success";
    case "warning":
      return "warning";
    case "failed":
      return "danger";
    default:
      return "neutral";
  }
}

export function riskTone(riskLevel: RiskLevel): Tone {
  switch (riskLevel) {
    case "low":
      return "success";
    case "medium":
      return "warning";
    case "high":
    case "critical":
      return "danger";
    default:
      return "neutral";
  }
}
