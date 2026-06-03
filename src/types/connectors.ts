import type { Project } from "./domain";
import type { RiskLevel } from "./workflow";

export type AgentConnectorType =
  | "built_in_agentops_agent"
  | "agentops_native_protocol"
  | "byo_webhook"
  | "sdk_client"
  | "mcp_tool_connector"
  | "private_worker"
  | "trace_import";

export type ConnectorStatus = "demo_ready" | "planned" | "future";
export type ConnectorSetupDifficulty = "low" | "medium" | "high";
export type ConnectorPrivacyLevel = "public_demo_safe" | "workspace_private" | "enterprise_private";
export type ConnectorPlanTier = "free_demo" | "starter" | "pro" | "enterprise_self_hosted";
export type ConnectorCapability =
  | "run_events"
  | "tool_calls"
  | "structured_logs"
  | "artifacts"
  | "approval_requests"
  | "risk_findings"
  | "evaluations"
  | "cost_metrics"
  | "worker_execution"
  | "trace_imports";

export interface ConnectorSecretReference {
  id: string;
  projectId: string;
  label: string;
  scope: "workspace" | "connector" | "worker" | "owner_only";
  provider: "future_secret_manager" | "local_demo_reference";
  lastRotatedAt?: string;
  notes: string;
}

export interface AgentEndpoint {
  id: string;
  connectorId: string;
  label: string;
  environment: Project["environment"];
  endpointKind: "future_ingest_url" | "local_demo_sink" | "worker_channel" | "trace_import";
  displayUrl: string;
  allowedTargetIds: string[];
  secretReferenceId?: string;
  status: "not_connected" | "configured" | "healthy" | "needs_review";
}

export interface AllowedTarget {
  id: string;
  projectId: string;
  label: string;
  targetPattern: string;
  environment: Project["environment"];
  targetType: "local_app" | "demo_domain" | "staging_domain" | "repository" | "worker_queue";
  riskLevel: RiskLevel;
  requiresApproval: boolean;
  notes: string;
}

export interface WorkerInstance {
  id: string;
  projectId: string;
  label: string;
  deploymentMode: "hosted_saas" | "self_hosted_enterprise" | "local_developer";
  status: "not_configured" | "healthy" | "degraded" | "offline";
  connectorIds: string[];
  healthCheckIds: string[];
  lastHeartbeatAt?: string;
  privacyLevel: ConnectorPrivacyLevel;
}

export interface AgentArtifact {
  id: string;
  projectId: string;
  workflowRunId: string;
  connectorId: string;
  artifactType: "screenshot_ref" | "report_ref" | "log_summary_ref" | "trace_bundle_ref";
  label: string;
  reference: string;
  createdAt: string;
  sensitivity: "demo_safe" | "workspace_private" | "restricted";
  notes: string;
}

export interface AgentConnector {
  id: string;
  projectId: string;
  type: AgentConnectorType;
  name: string;
  summary: string;
  bestFor: string;
  setupDifficulty: ConnectorSetupDifficulty;
  privacyLevel: ConnectorPrivacyLevel;
  minimumPlan: ConnectorPlanTier;
  status: ConnectorStatus;
  isRecommended: boolean;
  capabilities: ConnectorCapability[];
  requiredSecretReferenceIds: string[];
  requiredPermissionKeys: string[];
  securityNotes: string[];
  endpointIds: string[];
}
