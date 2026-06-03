import type { AgentConnector, AgentConnectorType, AllowedTarget, ConnectorCapability, ConnectorPlanTier, ConnectorPrivacyLevel } from "@/types/connectors";
import type { WorkspacePlan } from "@/types/plans";

const tierOrder: ConnectorPlanTier[] = ["free_demo", "starter", "pro", "enterprise_self_hosted"];

const connectorCapabilities: Record<AgentConnectorType, ConnectorCapability[]> = {
  built_in_agentops_agent: ["run_events", "tool_calls", "artifacts", "approval_requests", "risk_findings", "evaluations", "cost_metrics"],
  agentops_native_protocol: ["run_events", "structured_logs", "tool_calls", "artifacts", "approval_requests", "risk_findings", "evaluations", "cost_metrics"],
  byo_webhook: ["run_events", "structured_logs", "tool_calls", "risk_findings"],
  sdk_client: ["run_events", "tool_calls", "artifacts", "cost_metrics"],
  mcp_tool_connector: ["tool_calls", "structured_logs", "approval_requests", "risk_findings"],
  private_worker: ["worker_execution", "run_events", "tool_calls", "artifacts", "approval_requests", "risk_findings", "cost_metrics"],
  trace_import: ["trace_imports", "run_events", "structured_logs", "cost_metrics"]
};

const privacyByConnector: Record<AgentConnectorType, ConnectorPrivacyLevel> = {
  built_in_agentops_agent: "public_demo_safe",
  agentops_native_protocol: "workspace_private",
  byo_webhook: "workspace_private",
  sdk_client: "workspace_private",
  mcp_tool_connector: "enterprise_private",
  private_worker: "enterprise_private",
  trace_import: "workspace_private"
};

export function getConnectorCapabilities(type: AgentConnectorType) {
  return connectorCapabilities[type];
}

export function getConnectorPrivacyLevel(type: AgentConnectorType) {
  return privacyByConnector[type];
}

export function isTierAtLeast(plan: ConnectorPlanTier, required: ConnectorPlanTier) {
  return tierOrder.indexOf(plan) >= tierOrder.indexOf(required);
}

export function isConnectorAllowedForPlan(connector: AgentConnector, plan: WorkspacePlan) {
  return plan.connectorAccess.includes(connector.type) && isTierAtLeast(plan.id, connector.minimumPlan);
}

export function validateAllowedTarget(targetPattern: string, allowedTargets: AllowedTarget[]) {
  const target = allowedTargets.find((allowedTarget) => allowedTarget.targetPattern === targetPattern || allowedTarget.label === targetPattern);

  if (!target) {
    return {
      allowed: false,
      reason: "Target is not in the workspace allowlist."
    };
  }

  if (target.requiresApproval) {
    return {
      allowed: true,
      reason: "Target is allowlisted but requires approval before sensitive execution."
    };
  }

  return {
    allowed: true,
    reason: "Target is allowlisted for local deterministic demo use."
  };
}

export function connectorSecuritySummary(connector: AgentConnector) {
  const privacy = getConnectorPrivacyLevel(connector.type);
  const planLabel = connector.minimumPlan.replaceAll("_", " ");

  return `${connector.name} uses ${privacy.replaceAll("_", " ")} handling and requires ${planLabel} or higher.`;
}
