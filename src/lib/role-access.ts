import type { RoleName } from "@/types/rbac";
import {
  canApproveRisk,
  canAccessFeature,
  canConfigureOwnerControl,
  canEditWorkspaceSetup,
  canPerformAction,
  canUseAgentBuilder,
  canUseAgentTemplate,
  canUseBuiltInAgent,
  canUseConnector,
  canViewPlans,
  canViewRoute,
  getLockedReason,
  getRecommendedNextAction,
  getRouteAccess,
  isFounderAdmin,
  routeLabel,
  type ActionKey,
  type FeatureKey,
  type PlatformRoute,
  type RouteAccess
} from "@/lib/platform-permissions";

export {
  canApproveRisk,
  canAccessFeature,
  canConfigureOwnerControl,
  canEditWorkspaceSetup,
  canPerformAction,
  canUseAgentBuilder,
  canUseAgentTemplate,
  canUseBuiltInAgent,
  canUseConnector,
  canViewPlans,
  canViewRoute,
  getLockedReason,
  getRecommendedNextAction,
  getRouteAccess,
  isFounderAdmin,
  routeLabel,
  type ActionKey,
  type FeatureKey,
  type PlatformRoute,
  type RouteAccess
};

export function getRoleAccessSummary(role: RoleName) {
  if (role === "Founder/Admin") {
    return "Platform owner view with complete local access for this portfolio workspace.";
  }

  if (role === "AI Engineer") {
    return "Workspace builder view with agent, connector, setup, and builder access.";
  }

  if (role === "Product Manager") {
    return "Product packaging view with read-only setup, catalog, builder preview, and plan summaries.";
  }

  if (role === "Security Reviewer") {
    return "Security review view for risks, approvals, audit, and connector security summaries.";
  }

  if (role === "QA Reviewer") {
    return "QA review view for runs, evaluations, Browser QA, and template previews.";
  }

  return "Read-only redacted view for safe demo exploration.";
}
