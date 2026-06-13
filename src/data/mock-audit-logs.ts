import type { AuditLog } from "@/types/domain";
import { activeProject } from "./mock-projects";

export const mockAuditLogs: AuditLog[] = [
  {
    id: "audit_approval_requested_001",
    projectId: activeProject.id,
    actorUserId: "user_engineer",
    action: "approval.requested",
    targetType: "approval_request",
    targetId: "approval_security_001",
    afterSummary: "Security approval requested for high-risk publish check.",
    reason: "Policy requires human review before production-like tool action.",
    correlationId: "trace_release_001",
    createdAt: "2026-06-02T10:34:24Z"
  },
  {
    id: "audit_risk_created_001",
    projectId: activeProject.id,
    actorUserId: "user_security",
    action: "risk.created",
    targetType: "risk_finding",
    targetId: "risk_prompt_injection_001",
    afterSummary: "High-risk prompt injection finding opened.",
    reason: "Tool output referenced a production-like publish path.",
    correlationId: "trace_release_001",
    createdAt: "2026-06-02T10:34:12Z"
  },
  {
    id: "audit_product_approved_002",
    projectId: activeProject.id,
    actorUserId: "user_pm",
    action: "approval.approved",
    targetType: "approval_request",
    targetId: "approval_product_002",
    beforeSummary: "Product review pending.",
    afterSummary: "Product review approved for local demo scope.",
    reason: "Evaluation warning was accepted with no customer impact in the demo.",
    correlationId: "trace_release_000",
    createdAt: "2026-06-02T08:14:30Z"
  },
  {
    id: "audit_workflow_published_001",
    projectId: activeProject.id,
    actorUserId: "user_engineer",
    action: "workflow.published",
    targetType: "workflow",
    targetId: "workflow_release_review",
    afterSummary: "Release readiness workflow published as version 1.",
    reason: "Phase 2 demo needs a stable workflow definition for run timelines.",
    correlationId: "trace_workflow_publish_001",
    createdAt: "2026-06-01T17:05:00Z"
  }
];
