import type { AgentOpsNativeEvent, AgentOpsNativeEventCategory, AgentOpsNativeProtocolMapping } from "@/types/agent-protocol";

const categories: AgentOpsNativeEventCategory[] = [
  "run.started",
  "run.status_changed",
  "run.event",
  "run.log",
  "step.event",
  "tool.started",
  "tool.completed",
  "tool.failed",
  "artifact.created",
  "approval.requested",
  "risk.created",
  "evaluation.completed",
  "cost.recorded",
  "run.completed",
  "run.failed",
  "run.cancelled"
];

export const nativeProtocolMappings: AgentOpsNativeProtocolMapping[] = [
  { eventCategory: "run.started", mapsTo: ["WorkflowRun", "RunEvent", "AuditLog"], securityRule: "Input summary only; no raw secrets." },
  { eventCategory: "run.event", mapsTo: ["RunEvent"], securityRule: "Metadata is schema-validated and redacted." },
  { eventCategory: "run.log", mapsTo: ["RunEvent"], securityRule: "Logs are summary/reference based." },
  { eventCategory: "tool.completed", mapsTo: ["ToolCall", "RunEvent", "AuditLog"], securityRule: "Tool output is data, not instruction." },
  { eventCategory: "artifact.created", mapsTo: ["AgentArtifact", "RunEvent"], securityRule: "Artifact references only; no embedded private files." },
  { eventCategory: "approval.requested", mapsTo: ["ApprovalRequest", "RunEvent", "AuditLog"], securityRule: "High-risk writes are attributable and auditable." },
  { eventCategory: "risk.created", mapsTo: ["RiskFinding", "RunEvent"], securityRule: "Evidence summary must avoid secret values." },
  { eventCategory: "evaluation.completed", mapsTo: ["EvaluationResult", "RunEvent"], securityRule: "Scores must map to deterministic thresholds." },
  { eventCategory: "cost.recorded", mapsTo: ["CostMetric", "RunEvent"], securityRule: "Usage is metered without exposing provider keys." },
  { eventCategory: "run.completed", mapsTo: ["WorkflowRun", "RunEvent", "AuditLog"], securityRule: "Completion includes summary and cost, not raw payloads." },
  { eventCategory: "run.failed", mapsTo: ["WorkflowRun", "RunEvent", "RiskFinding"], securityRule: "Failure reasons are reviewer-safe summaries." }
];

function hasString(value: unknown) {
  return typeof value === "string" && value.length > 0;
}

function hasNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateNativeEventShape(value: unknown): value is AgentOpsNativeEvent {
  if (!value || typeof value !== "object") {
    return false;
  }

  const event = value as Partial<AgentOpsNativeEvent>;

  return (
    hasString(event.id) &&
    typeof event.category === "string" &&
    categories.includes(event.category as AgentOpsNativeEventCategory) &&
    hasString(event.projectId) &&
    hasString(event.connectorId) &&
    hasString(event.workflowRunId) &&
    hasString(event.traceId) &&
    hasNumber(event.sequence) &&
    hasString(event.occurredAt) &&
    hasString(event.actorRef) &&
    typeof event.auditRequired === "boolean"
  );
}

export function getNativeProtocolMapping(category: AgentOpsNativeEventCategory) {
  return nativeProtocolMappings.find((mapping) => mapping.eventCategory === category);
}
