import type { ApprovalRequest } from "@/types/domain";
import { activeProject } from "./mock-projects";

export const mockApprovals: ApprovalRequest[] = [
  {
    id: "approval_security_001",
    projectId: activeProject.id,
    workflowRunId: "run_release_001",
    toolCallId: "toolcall_publish_check_001",
    assignedRole: "Security Reviewer",
    assignedUserId: "user_security",
    status: "pending",
    riskLevel: "high",
    reason: "A local demo publish check is marked as approval-gated to prove the human review model.",
    requestedAt: "2026-06-02T10:34:24Z",
    expiresAt: "2026-06-02T12:34:24Z"
  },
  {
    id: "approval_product_002",
    projectId: activeProject.id,
    workflowRunId: "run_release_000",
    assignedRole: "Product Manager",
    assignedUserId: "user_pm",
    status: "approved",
    riskLevel: "medium",
    reason: "Product review accepted the evaluation warning for the local demo candidate.",
    decision: "approved",
    decidedByUserId: "user_pm",
    decisionComment: "Accepted for local demo only. Backend and auth remain future scope.",
    requestedAt: "2026-06-02T08:12:00Z",
    decidedAt: "2026-06-02T08:14:30Z"
  }
];
