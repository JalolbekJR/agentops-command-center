import type { AgentBuilderTemplate, BuiltInAgentDefinition } from "@/types/agent-builder";
import type { WorkspacePlan } from "@/types/plans";
import { isTierAtLeast } from "@/lib/connector-policy";
import { isBuiltInAgentPlanLimited } from "@/lib/usage-limits";

export function isAgentTemplateAvailableForPlan(template: AgentBuilderTemplate, plan: WorkspacePlan) {
  return isTierAtLeast(plan.id, template.planRequired);
}

export function getTemplateAvailabilityLabel(template: AgentBuilderTemplate, plan: WorkspacePlan) {
  if (isAgentTemplateAvailableForPlan(template, plan)) {
    return "Available";
  }

  return template.planLockReason ?? `Requires ${template.planRequired.replaceAll("_", " ")}`;
}

export function getBuiltInAgentAvailabilityLabel(agent: BuiltInAgentDefinition, plan: WorkspacePlan) {
  return isBuiltInAgentPlanLimited(agent, plan) ? `Locked on ${plan.name}` : "Included";
}

export function getRecommendedBuilderTemplate(templates: AgentBuilderTemplate[]) {
  return templates.find((template) => template.recommended) ?? templates[0];
}
