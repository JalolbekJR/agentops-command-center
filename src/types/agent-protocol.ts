import type { ApprovalStatus, EvaluationStatus, RiskLevel, RunStatus, Severity, ToolCallStatus } from "./workflow";

export type AgentOpsNativeEventCategory =
  | "run.started"
  | "run.status_changed"
  | "run.event"
  | "run.log"
  | "step.event"
  | "tool.started"
  | "tool.completed"
  | "tool.failed"
  | "artifact.created"
  | "approval.requested"
  | "risk.created"
  | "evaluation.completed"
  | "cost.recorded"
  | "run.completed"
  | "run.failed"
  | "run.cancelled";

export interface AgentOpsNativeEventBase {
  id: string;
  category: AgentOpsNativeEventCategory;
  projectId: string;
  connectorId: string;
  workflowRunId: string;
  traceId: string;
  sequence: number;
  occurredAt: string;
  actorRef: string;
  redactionLevel: "summary_only" | "workspace_private" | "restricted";
  auditRequired: boolean;
}

export interface AgentOpsNativeRunStartedEvent extends AgentOpsNativeEventBase {
  category: "run.started";
  workflowId: string;
  agentId?: string;
  status: RunStatus;
  inputSummary: string;
}

export interface AgentOpsNativeRunEvent extends AgentOpsNativeEventBase {
  category: "run.status_changed" | "run.event" | "step.event";
  stepId?: string;
  status?: RunStatus;
  severity: Severity;
  message: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface AgentOpsNativeLogEvent extends AgentOpsNativeEventBase {
  category: "run.log";
  severity: Severity;
  messageSummary: string;
  logReference?: string;
}

export interface AgentOpsNativeToolCallEvent extends AgentOpsNativeEventBase {
  category: "tool.started" | "tool.completed" | "tool.failed";
  toolCallId: string;
  stepId: string;
  toolName: string;
  status: ToolCallStatus;
  riskLevel: RiskLevel;
  inputSummary: string;
  outputSummary?: string;
}

export interface AgentOpsNativeRiskEvent extends AgentOpsNativeEventBase {
  category: "risk.created";
  riskFindingId: string;
  severity: RiskLevel;
  title: string;
  evidenceSummary: string;
}

export interface AgentOpsNativeEvaluationEvent extends AgentOpsNativeEventBase {
  category: "evaluation.completed";
  evaluationResultId: string;
  status: EvaluationStatus;
  overallScore: number;
  notes: string;
}

export interface AgentOpsNativeArtifactEvent extends AgentOpsNativeEventBase {
  category: "artifact.created";
  artifactId: string;
  artifactType: "screenshot_ref" | "report_ref" | "log_summary_ref" | "trace_bundle_ref";
  label: string;
  reference: string;
}

export interface AgentOpsNativeCostEvent extends AgentOpsNativeEventBase {
  category: "cost.recorded";
  costMetricId: string;
  meter: "native_events" | "browser_qa_minutes" | "model_tokens" | "worker_minutes";
  quantity: number;
  estimatedCostCents: number;
}

export interface AgentOpsNativeApprovalEvent extends AgentOpsNativeEventBase {
  category: "approval.requested";
  approvalRequestId: string;
  assignedRole: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  reason: string;
}

export interface AgentOpsNativeRunCompletedEvent extends AgentOpsNativeEventBase {
  category: "run.completed" | "run.failed" | "run.cancelled";
  status: RunStatus;
  summary: string;
  totalCostCents: number;
  failureReason?: string;
}

export type AgentOpsNativeEvent =
  | AgentOpsNativeRunStartedEvent
  | AgentOpsNativeRunEvent
  | AgentOpsNativeLogEvent
  | AgentOpsNativeToolCallEvent
  | AgentOpsNativeRiskEvent
  | AgentOpsNativeEvaluationEvent
  | AgentOpsNativeArtifactEvent
  | AgentOpsNativeCostEvent
  | AgentOpsNativeApprovalEvent
  | AgentOpsNativeRunCompletedEvent;

export interface AgentOpsNativeProtocolMapping {
  eventCategory: AgentOpsNativeEventCategory;
  mapsTo: Array<"WorkflowRun" | "RunEvent" | "ToolCall" | "ApprovalRequest" | "EvaluationResult" | "RiskFinding" | "BrowserSession" | "AuditLog" | "CostMetric" | "AgentArtifact">;
  securityRule: string;
}
