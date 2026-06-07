import type { AgentBuilderTemplate, BuiltInAgentDefinition } from "@/types/agent-builder";
import type { AgentConnector } from "@/types/connectors";
import type { WorkspacePlan } from "@/types/plans";
import type { RoleName } from "@/types/rbac";
import { isConnectorAllowedForPlan } from "@/lib/connector-policy";
import { isAgentTemplateAvailableForPlan } from "@/lib/agent-builder";
import { isBuiltInAgentUsageAllowed } from "@/lib/usage-limits";

export type PlatformRoute = "/setup" | "/connectors" | "/built-in-agents" | "/agent-builder" | "/plans" | "/owner-control";
export type AccessLevel = "full" | "configure" | "read" | "redacted" | "locked";
export type FeatureKey = "workspaceSetup" | "connectors" | "builtInAgents" | "agentBuilder" | "plans" | "ownerControl";
export type ActionKey =
  | "workspaceSetup.configure"
  | "connector.configure"
  | "builtInAgents.useModule"
  | "agentBuilder.createDraft"
  | "agentBuilder.configureTemplate"
  | "plans.manage"
  | "ownerControl.manage";

export interface RouteAccess {
  route: PlatformRoute;
  label: string;
  level: AccessLevel;
  requiredRole: string;
  reason: string;
  recommendedAction: string;
}

const routeLabels: Record<PlatformRoute, string> = {
  "/setup": "Setup",
  "/connectors": "Connectors",
  "/built-in-agents": "Built-in Agents",
  "/agent-builder": "Agent Builder",
  "/plans": "Plans",
  "/owner-control": "Owner Control"
};

const featureRoutes: Record<FeatureKey, PlatformRoute> = {
  workspaceSetup: "/setup",
  connectors: "/connectors",
  builtInAgents: "/built-in-agents",
  agentBuilder: "/agent-builder",
  plans: "/plans",
  ownerControl: "/owner-control"
};

const routeAccessByRole: Record<PlatformRoute, Record<RoleName, AccessLevel>> = {
  "/setup": {
    "Founder/Admin": "full",
    "AI Engineer": "configure",
    "QA Reviewer": "locked",
    "Security Reviewer": "locked",
    "Product Manager": "read",
    Viewer: "locked"
  },
  "/connectors": {
    "Founder/Admin": "full",
    "AI Engineer": "configure",
    "QA Reviewer": "locked",
    "Security Reviewer": "read",
    "Product Manager": "read",
    Viewer: "redacted"
  },
  "/built-in-agents": {
    "Founder/Admin": "full",
    "AI Engineer": "configure",
    "QA Reviewer": "read",
    "Security Reviewer": "read",
    "Product Manager": "read",
    Viewer: "redacted"
  },
  "/agent-builder": {
    "Founder/Admin": "full",
    "AI Engineer": "configure",
    "QA Reviewer": "read",
    "Security Reviewer": "read",
    "Product Manager": "read",
    Viewer: "locked"
  },
  "/plans": {
    "Founder/Admin": "full",
    "AI Engineer": "read",
    "QA Reviewer": "read",
    "Security Reviewer": "read",
    "Product Manager": "read",
    Viewer: "redacted"
  },
  "/owner-control": {
    "Founder/Admin": "full",
    "AI Engineer": "locked",
    "QA Reviewer": "locked",
    "Security Reviewer": "locked",
    "Product Manager": "locked",
    Viewer: "locked"
  }
};

const lockedReasons: Record<PlatformRoute, Partial<Record<RoleName, string>>> = {
  "/setup": {
    "QA Reviewer": "QA Reviewers inspect evidence and release readiness; workspace setup is outside this local role boundary.",
    "Security Reviewer": "Security Reviewers inspect security summaries, but setup configuration belongs to owner/admin or AI Engineer roles.",
    Viewer: "Viewer is read-only and cannot access workspace setup."
  },
  "/connectors": {
    "QA Reviewer": "QA Reviewers use run and browser QA evidence; connector configuration is outside this role."
  },
  "/agent-builder": {
    Viewer: "Viewer cannot create or configure agents."
  },
  "/owner-control": {
    "AI Engineer": "Owner Control is reserved for the platform owner, not workspace builders.",
    "QA Reviewer": "Owner Control contains platform-global policies outside QA review authority.",
    "Security Reviewer": "Security Reviewers can inspect risks and connector summaries, not platform-global ownership controls.",
    "Product Manager": "Product Managers can review packaging and plans, not owner-only platform policy.",
    Viewer: "Viewer cannot access platform-global controls."
  },
  "/built-in-agents": {},
  "/plans": {}
};

const recommendedActions: Record<PlatformRoute, Partial<Record<RoleName, string>>> = {
  "/setup": {
    "QA Reviewer": "Review Browser QA or Evaluations instead.",
    "Security Reviewer": "Open Connectors for security summaries instead.",
    Viewer: "Open Dashboard or Built-in Agents for redacted product context."
  },
  "/connectors": {
    "QA Reviewer": "Open Browser QA for reviewable evidence."
  },
  "/agent-builder": {
    Viewer: "Open Built-in Agents to view available modules."
  },
  "/owner-control": {
    "AI Engineer": "Use Setup, Connectors, or Agent Builder for workspace-level configuration.",
    "QA Reviewer": "Use Runs, Browser QA, and Evaluations.",
    "Security Reviewer": "Use Risks, Audit, and Connectors.",
    "Product Manager": "Use Plans and Built-in Agents for product packaging.",
    Viewer: "Use Dashboard for safe read-only summaries."
  },
  "/built-in-agents": {},
  "/plans": {}
};

export function isFounderAdmin(role: RoleName) {
  return role === "Founder/Admin";
}

export function routeLabel(route: PlatformRoute) {
  return routeLabels[route];
}

export function getRouteAccess(role: RoleName, route: PlatformRoute): RouteAccess {
  const level = routeAccessByRole[route][role];
  const label = routeLabels[route];

  return {
    route,
    label,
    level,
    requiredRole: route === "/owner-control" ? "Founder/Admin" : "Role with workspace or reviewer access",
    reason: level === "locked" ? lockedReasons[route][role] ?? `${role} does not have access to ${label}.` : `${role} has ${level} access to ${label}.`,
    recommendedAction: level === "locked" ? recommendedActions[route][role] ?? "Switch to Founder/Admin in the local role switcher to inspect the full demo." : "Continue in the current role view."
  };
}

export function canViewRoute(role: RoleName, route: PlatformRoute) {
  return getRouteAccess(role, route).level !== "locked";
}

export function canAccessFeature(role: RoleName, feature: FeatureKey) {
  return canViewRoute(role, featureRoutes[feature]);
}

export function canPerformAction(role: RoleName, action: ActionKey) {
  switch (action) {
    case "workspaceSetup.configure":
      return ["full", "configure"].includes(getRouteAccess(role, "/setup").level);
    case "connector.configure":
      return ["full", "configure"].includes(getRouteAccess(role, "/connectors").level);
    case "builtInAgents.useModule":
      return ["full", "configure"].includes(getRouteAccess(role, "/built-in-agents").level);
    case "agentBuilder.createDraft":
    case "agentBuilder.configureTemplate":
      return ["full", "configure"].includes(getRouteAccess(role, "/agent-builder").level);
    case "plans.manage":
      return isFounderAdmin(role);
    case "ownerControl.manage":
      return isFounderAdmin(role);
    default:
      return false;
  }
}

export function canConfigureOwnerControl(role: RoleName) {
  return canPerformAction(role, "ownerControl.manage");
}

export function canEditWorkspaceSetup(role: RoleName) {
  return canPerformAction(role, "workspaceSetup.configure");
}

export function canUseAgentBuilder(role: RoleName) {
  return canPerformAction(role, "agentBuilder.createDraft");
}

export function canViewPlans(role: RoleName) {
  return canViewRoute(role, "/plans");
}

export function canApproveRisk(role: RoleName) {
  return role === "Founder/Admin" || role === "Security Reviewer";
}

export function canUseConnector(role: RoleName, connector: AgentConnector, plan: WorkspacePlan) {
  return canPerformAction(role, "connector.configure") && isConnectorAllowedForPlan(connector, plan);
}

export function canUseBuiltInAgent(role: RoleName, agent: BuiltInAgentDefinition, plan: WorkspacePlan) {
  return canPerformAction(role, "builtInAgents.useModule") && isBuiltInAgentUsageAllowed(agent, plan);
}

export function canUseAgentTemplate(role: RoleName, template: AgentBuilderTemplate, plan: WorkspacePlan) {
  return canUseAgentBuilder(role) && isAgentTemplateAvailableForPlan(template, plan);
}

export function getLockedReason(role: RoleName, resource: PlatformRoute | string) {
  if (resource.startsWith("/")) {
    return getRouteAccess(role, resource as PlatformRoute).reason;
  }

  return `${role} does not have the required permission for ${resource}.`;
}

export function getRecommendedNextAction(role: RoleName, currentPage: PlatformRoute) {
  return getRouteAccess(role, currentPage).recommendedAction;
}
