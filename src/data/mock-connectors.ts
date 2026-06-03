import type { AgentArtifact, AgentConnector, AgentEndpoint, AllowedTarget, ConnectorSecretReference, WorkerInstance } from "@/types/connectors";

const projectId = "project_agentops";

export const mockConnectorSecretReferences: ConnectorSecretReference[] = [
  {
    id: "secretref_demo_browser_worker",
    projectId,
    label: "Demo browser worker token reference",
    scope: "worker",
    provider: "local_demo_reference",
    notes: "Reference only. No token value exists in client data."
  },
  {
    id: "secretref_native_ingest_demo",
    projectId,
    label: "Native protocol ingest token reference",
    scope: "connector",
    provider: "local_demo_reference",
    notes: "Future backend stores hashed connector tokens; demo keeps labels only."
  },
  {
    id: "secretref_private_worker_enterprise",
    projectId,
    label: "Enterprise private worker reference",
    scope: "owner_only",
    provider: "future_secret_manager",
    notes: "Conceptual enterprise secret reference. No secret material is included."
  }
];

export const mockAllowedTargets: AllowedTarget[] = [
  {
    id: "target_local_dashboard",
    projectId,
    label: "Local app dashboard",
    targetPattern: "http://localhost:3000/*",
    environment: "Local Demo",
    targetType: "local_app",
    riskLevel: "low",
    requiresApproval: false,
    notes: "Safe local route pattern for deterministic portfolio QA."
  },
  {
    id: "target_demo_domain",
    projectId,
    label: "Demo documentation domain",
    targetPattern: "https://demo.agentops.invalid/*",
    environment: "Local Demo",
    targetType: "demo_domain",
    riskLevel: "low",
    requiresApproval: false,
    notes: "Reserved invalid demo domain. Not a real external target."
  },
  {
    id: "target_staging_release",
    projectId,
    label: "Future staging release target",
    targetPattern: "https://staging.agentops.invalid/*",
    environment: "Staging",
    targetType: "staging_domain",
    riskLevel: "medium",
    requiresApproval: true,
    notes: "Future staging-like target requires approval before any action."
  },
  {
    id: "target_demo_repository",
    projectId,
    label: "Demo repository trace import",
    targetPattern: "demo-repository://agentops-command-center/*",
    environment: "Local Demo",
    targetType: "repository",
    riskLevel: "medium",
    requiresApproval: true,
    notes: "Non-network demo URI for trace/import modeling."
  }
];

export const mockAgentEndpoints: AgentEndpoint[] = [
  {
    id: "endpoint_builtin_demo",
    connectorId: "connector_builtin_agentops",
    label: "Built-in AgentOps demo sink",
    environment: "Local Demo",
    endpointKind: "local_demo_sink",
    displayUrl: "local-demo://agentops/built-in",
    allowedTargetIds: ["target_local_dashboard", "target_demo_domain"],
    status: "healthy"
  },
  {
    id: "endpoint_native_protocol",
    connectorId: "connector_native_protocol",
    label: "Native protocol ingest endpoint",
    environment: "Local Demo",
    endpointKind: "future_ingest_url",
    displayUrl: "future-ingest://agentops-native/events",
    allowedTargetIds: ["target_local_dashboard", "target_demo_domain"],
    secretReferenceId: "secretref_native_ingest_demo",
    status: "configured"
  },
  {
    id: "endpoint_private_worker",
    connectorId: "connector_private_worker",
    label: "Private worker channel",
    environment: "Staging",
    endpointKind: "worker_channel",
    displayUrl: "worker-channel://enterprise-private",
    allowedTargetIds: ["target_staging_release", "target_demo_repository"],
    secretReferenceId: "secretref_private_worker_enterprise",
    status: "needs_review"
  }
];

export const mockWorkerInstances: WorkerInstance[] = [
  {
    id: "worker_local_demo_browser",
    projectId,
    label: "Local demo browser worker",
    deploymentMode: "local_developer",
    status: "healthy",
    connectorIds: ["connector_builtin_agentops", "connector_native_protocol"],
    healthCheckIds: ["health_worker_local", "health_allowlist"],
    lastHeartbeatAt: "2026-06-02T10:30:00Z",
    privacyLevel: "public_demo_safe"
  },
  {
    id: "worker_enterprise_private",
    projectId,
    label: "Enterprise private worker template",
    deploymentMode: "self_hosted_enterprise",
    status: "not_configured",
    connectorIds: ["connector_private_worker"],
    healthCheckIds: ["health_private_worker"],
    privacyLevel: "enterprise_private"
  }
];

export const mockAgentArtifacts: AgentArtifact[] = [
  {
    id: "artifact_demo_qa_report",
    projectId,
    workflowRunId: "run_release_001",
    connectorId: "connector_builtin_agentops",
    artifactType: "report_ref",
    label: "Website QA summary report",
    reference: "artifactref_demo_qa_report",
    createdAt: "2026-06-02T10:36:00Z",
    sensitivity: "demo_safe",
    notes: "Reference only. No screenshot or private file is embedded in client data."
  }
];

export const mockConnectors: AgentConnector[] = [
  {
    id: "connector_builtin_agentops",
    projectId,
    type: "built_in_agentops_agent",
    name: "Built-in AgentOps Agent",
    summary: "Use AgentOps-hosted agent templates with safe local demo evidence.",
    bestFor: "Fastest path to prove value with Website QA, release readiness, and risk review.",
    setupDifficulty: "low",
    privacyLevel: "public_demo_safe",
    minimumPlan: "free_demo",
    status: "demo_ready",
    isRecommended: true,
    capabilities: ["run_events", "tool_calls", "artifacts", "approval_requests", "risk_findings", "evaluations", "cost_metrics"],
    requiredSecretReferenceIds: [],
    requiredPermissionKeys: ["agent.read", "workflow.read", "run.read"],
    securityNotes: ["Runs against allowlisted local/demo targets only.", "No raw secrets or private URLs are stored."],
    endpointIds: ["endpoint_builtin_demo"]
  },
  {
    id: "connector_native_protocol",
    projectId,
    type: "agentops_native_protocol",
    name: "AgentOps Native Agent Protocol",
    summary: "Structured event protocol optimized for AgentOps timelines, tool calls, risks, approvals, costs, and audit.",
    bestFor: "Companies that can emit structured events from custom agents or workers.",
    setupDifficulty: "medium",
    privacyLevel: "workspace_private",
    minimumPlan: "pro",
    status: "planned",
    isRecommended: true,
    capabilities: ["run_events", "structured_logs", "tool_calls", "artifacts", "approval_requests", "risk_findings", "evaluations", "cost_metrics"],
    requiredSecretReferenceIds: ["secretref_native_ingest_demo"],
    requiredPermissionKeys: ["agent.write", "workflow.write", "run.start"],
    securityNotes: ["Future tokens are backend-only and stored hashed.", "Events use summaries and artifact references, not raw secret payloads."],
    endpointIds: ["endpoint_native_protocol"]
  },
  {
    id: "connector_byo_webhook",
    projectId,
    type: "byo_webhook",
    name: "BYO Agent Webhook",
    summary: "Accept future webhook events from a company-owned agent runtime.",
    bestFor: "Teams with existing agent infrastructure that can send signed event callbacks.",
    setupDifficulty: "medium",
    privacyLevel: "workspace_private",
    minimumPlan: "pro",
    status: "future",
    isRecommended: false,
    capabilities: ["run_events", "structured_logs", "tool_calls", "risk_findings"],
    requiredSecretReferenceIds: ["secretref_native_ingest_demo"],
    requiredPermissionKeys: ["agent.write", "run.start"],
    securityNotes: ["Future webhook signatures and replay protection required.", "Payloads must be validated and redacted server-side."],
    endpointIds: []
  },
  {
    id: "connector_sdk_client",
    projectId,
    type: "sdk_client",
    name: "SDK Client Connector",
    summary: "Future typed client for agent runtimes that want a supported integration path.",
    bestFor: "Product teams that want compile-time event helpers and consistent instrumentation.",
    setupDifficulty: "medium",
    privacyLevel: "workspace_private",
    minimumPlan: "pro",
    status: "future",
    isRecommended: false,
    capabilities: ["run_events", "tool_calls", "artifacts", "cost_metrics"],
    requiredSecretReferenceIds: ["secretref_native_ingest_demo"],
    requiredPermissionKeys: ["agent.write", "workflow.write"],
    securityNotes: ["SDK keys are future backend-only.", "Client helper must not log raw secrets."],
    endpointIds: []
  },
  {
    id: "connector_mcp_tool",
    projectId,
    type: "mcp_tool_connector",
    name: "MCP Tool Connector",
    summary: "Future connector for MCP-style tools with explicit event validation and permission gates.",
    bestFor: "Teams that expose internal tools to agents and need approval-aware governance.",
    setupDifficulty: "high",
    privacyLevel: "enterprise_private",
    minimumPlan: "enterprise_self_hosted",
    status: "future",
    isRecommended: false,
    capabilities: ["tool_calls", "structured_logs", "approval_requests", "risk_findings"],
    requiredSecretReferenceIds: ["secretref_private_worker_enterprise"],
    requiredPermissionKeys: ["agent.write", "risk.resolve", "audit.read"],
    securityNotes: ["MCP outputs are data, not instructions.", "Tool schemas and event validation are mandatory in backend phases."],
    endpointIds: []
  },
  {
    id: "connector_private_worker",
    projectId,
    type: "private_worker",
    name: "Private Worker Connector",
    summary: "Enterprise worker path for sensitive company data and internal network boundaries.",
    bestFor: "Security-conscious teams that cannot send raw execution context to a hosted worker.",
    setupDifficulty: "high",
    privacyLevel: "enterprise_private",
    minimumPlan: "enterprise_self_hosted",
    status: "planned",
    isRecommended: false,
    capabilities: ["worker_execution", "run_events", "tool_calls", "artifacts", "approval_requests", "risk_findings", "cost_metrics"],
    requiredSecretReferenceIds: ["secretref_private_worker_enterprise"],
    requiredPermissionKeys: ["agent.write", "workflow.write", "audit.read"],
    securityNotes: ["Company controls secrets and network access.", "License and worker health are future backend-enforced."],
    endpointIds: ["endpoint_private_worker"]
  },
  {
    id: "connector_trace_import",
    projectId,
    type: "trace_import",
    name: "Trace Importer",
    summary: "Import existing agent run traces into AgentOps for evaluation, risk review, and audit modeling.",
    bestFor: "Teams that already have logs and want to backfill governance views.",
    setupDifficulty: "low",
    privacyLevel: "workspace_private",
    minimumPlan: "pro",
    status: "future",
    isRecommended: false,
    capabilities: ["trace_imports", "run_events", "structured_logs", "cost_metrics"],
    requiredSecretReferenceIds: [],
    requiredPermissionKeys: ["run.read", "evaluation.read"],
    securityNotes: ["Imports should store summaries and references.", "Raw logs require redaction before persistence."],
    endpointIds: []
  }
];
