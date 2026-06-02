import type { RoleName } from "./rbac";
import type {
  AgentStatus,
  ApprovalStatus,
  BrowserSessionStatus,
  EvaluationStatus,
  ProjectStatus,
  ReleaseGateStatus,
  RiskLevel,
  RiskStatus,
  RunStatus,
  Severity,
  ToolCallStatus,
  WorkflowStatus,
  WorkflowStepDefinition
} from "./workflow";

export interface User {
  id: string;
  teamId: string;
  name: string;
  email: string;
  role: RoleName;
  avatarInitials: string;
  status: "active" | "invited" | "disabled";
  lastActiveAt: string;
}

export interface Team {
  id: string;
  name: string;
  plan: "portfolio_demo" | "future_enterprise";
}

export interface Project {
  id: string;
  teamId: string;
  name: string;
  slug: string;
  environment: "Local Demo" | "Development" | "Staging" | "Production";
  status: ProjectStatus;
  description: string;
  updatedAt: string;
}

export interface AgentCapability {
  id: string;
  agentId: string;
  name: string;
  category: "engineering" | "qa" | "security" | "product" | "ops";
  requiresApproval: boolean;
  riskLevel: RiskLevel;
  toolName: string;
}

export interface Agent {
  id: string;
  projectId: string;
  name: string;
  description: string;
  ownerUserId: string;
  status: AgentStatus;
  riskLevel: RiskLevel;
  defaultModel: string;
  lastRunAt: string;
  successRate: number;
  averageCostCents: number;
  capabilities: AgentCapability[];
}

export interface Workflow {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  version: number;
  ownerUserId: string;
  triggerType: "manual" | "scheduled" | "webhook" | "release_gate";
  steps: WorkflowStepDefinition[];
  updatedAt: string;
}

export interface WorkflowRun {
  id: string;
  projectId: string;
  workflowId: string;
  workflowVersion: number;
  triggeredByUserId: string;
  status: RunStatus;
  environment: Project["environment"];
  traceId: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  totalCostCents: number;
  failureReason?: string;
  summary: string;
}

export interface RunEvent {
  id: string;
  workflowRunId: string;
  stepId?: string;
  eventType: string;
  severity: Severity;
  message: string;
  metadata?: Record<string, string | number | boolean>;
  createdAt: string;
  sequence: number;
}

export interface ToolCall {
  id: string;
  workflowRunId: string;
  stepId: string;
  agentId: string;
  toolName: string;
  inputSummary: string;
  outputSummary: string;
  status: ToolCallStatus;
  riskLevel: RiskLevel;
  approvalRequestId?: string;
  startedAt: string;
  completedAt?: string;
  durationMs?: number;
  errorCode?: string;
}

export interface ApprovalRequest {
  id: string;
  projectId: string;
  workflowRunId: string;
  toolCallId?: string;
  assignedRole: RoleName;
  assignedUserId?: string;
  status: ApprovalStatus;
  riskLevel: RiskLevel;
  reason: string;
  decision?: "approved" | "rejected";
  decidedByUserId?: string;
  decisionComment?: string;
  requestedAt: string;
  decidedAt?: string;
  expiresAt?: string;
}

export interface EvaluationResult {
  id: string;
  workflowRunId: string;
  evaluatorType: "deterministic_mock" | "future_ai_evaluator" | "human_reviewer";
  correctnessScore: number;
  safetyScore: number;
  reliabilityScore: number;
  latencyScore: number;
  costScore: number;
  userImpactScore: number;
  policyComplianceScore: number;
  overallScore: number;
  status: EvaluationStatus;
  notes: string;
  createdAt: string;
}

export interface RiskFinding {
  id: string;
  projectId: string;
  workflowRunId: string;
  toolCallId?: string;
  category: "prompt_injection" | "tool_injection" | "sensitive_data_exposure" | "unauthorized_access" | "unsafe_automation" | "qa_failure" | "policy_violation" | "cost_overrun" | "reliability_regression" | "release_gate_blocker";
  severity: RiskLevel;
  status: RiskStatus;
  title: string;
  description: string;
  evidenceSummary: string;
  ownerRole: RoleName;
  ownerUserId?: string;
  recommendedMitigation: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface BrowserStep {
  id: string;
  browserSessionId: string;
  sequence: number;
  action: string;
  selectorSummary: string;
  expectedResult: string;
  observedResult: string;
  status: "passed" | "failed" | "warning";
  screenshotRef: string;
  consoleIssueCount: number;
  networkIssueCount: number;
  accessibilityNote: string;
}

export interface BrowserSession {
  id: string;
  projectId: string;
  workflowRunId: string;
  status: BrowserSessionStatus;
  targetUrl: string;
  browserName: "chromium" | "firefox" | "webkit";
  viewport: string;
  startedAt: string;
  completedAt?: string;
  summary: string;
  steps: BrowserStep[];
}

export interface CostMetric {
  id: string;
  projectId: string;
  workflowRunId: string;
  agentId: string;
  modelName: string;
  inputTokens: number;
  outputTokens: number;
  estimatedCostCents: number;
  recordedAt: string;
}

export interface AuditLog {
  id: string;
  projectId: string;
  actorUserId: string;
  action: string;
  targetType: string;
  targetId: string;
  beforeSummary?: string;
  afterSummary?: string;
  reason: string;
  correlationId: string;
  createdAt: string;
}

export interface ReleaseGate {
  id: string;
  projectId: string;
  name: string;
  status: ReleaseGateStatus;
  environment: Project["environment"];
  requiredEvaluationScore: number;
  blockOnHighRisk: boolean;
  blockOnFailedBrowserQa: boolean;
  lastCheckedAt: string;
}
