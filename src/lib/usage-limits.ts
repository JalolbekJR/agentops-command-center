import type { AgentConnector } from "@/types/connectors";
import type { BuiltInAgentDefinition } from "@/types/agent-builder";
import type { UsageLimit, UsageStatus, WorkspacePlan } from "@/types/plans";
import { isConnectorAllowedForPlan } from "@/lib/connector-policy";

export function getUsageStatus(limit: UsageLimit): UsageStatus {
  if (limit.included === "unlimited") {
    return {
      meter: limit.meter,
      label: limit.meter.replaceAll("_", " "),
      used: limit.used,
      included: limit.included,
      percentUsed: 0,
      status: "available"
    };
  }

  if (limit.included === 0) {
    return {
      meter: limit.meter,
      label: limit.meter.replaceAll("_", " "),
      used: limit.used,
      included: limit.included,
      percentUsed: 100,
      status: "locked"
    };
  }

  const percentUsed = Math.round((limit.used / limit.included) * 100);
  const status = percentUsed >= 100 ? "exceeded" : percentUsed >= 80 ? "near_limit" : "available";

  return {
    meter: limit.meter,
    label: limit.meter.replaceAll("_", " "),
    used: limit.used,
    included: limit.included,
    percentUsed,
    status
  };
}

export function getPlanUsageStatuses(plan: WorkspacePlan) {
  return plan.limits.map(getUsageStatus);
}

export function isBuiltInAgentPlanLimited(agent: BuiltInAgentDefinition, plan: WorkspacePlan) {
  return !plan.builtInAgentIds.includes(agent.id);
}

export function isBuiltInAgentUsageAllowed(agent: BuiltInAgentDefinition, plan: WorkspacePlan) {
  return !isBuiltInAgentPlanLimited(agent, plan);
}

export function getConnectorAccessSummary(connector: AgentConnector, plan: WorkspacePlan) {
  return isConnectorAllowedForPlan(connector, plan) ? "Available on this plan" : `Requires ${connector.minimumPlan.replaceAll("_", " ")} or connector access upgrade`;
}
