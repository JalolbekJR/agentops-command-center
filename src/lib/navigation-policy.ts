import type { RoleName } from "@/types/rbac";
import { can } from "@/lib/rbac";
import { canViewRoute, getRouteAccess, type PlatformRoute } from "@/lib/role-access";

export type AppRoute =
  | "/"
  | "/dashboard"
  | "/agents"
  | "/workflows"
  | "/runs"
  | "/approvals"
  | "/evaluations"
  | "/risks"
  | "/browser-qa"
  | "/audit"
  | "/settings"
  | PlatformRoute;

export interface NavigationItem {
  href: AppRoute;
  label: string;
  code: string;
}

export interface NavigationItemState extends NavigationItem {
  state: "link" | "locked";
  reason?: string;
}

export interface NavigationGroupState {
  label: string;
  items: NavigationItemState[];
}

export interface RoleRedirectTarget {
  route: AppRoute;
  attemptedRoute: AppRoute | null;
  attemptedLabel: string;
  requiredAccess: string;
  reason: string;
}

const operationItems: NavigationItem[] = [
  { href: "/dashboard", label: "Overview", code: "OV" },
  { href: "/agents", label: "Agents", code: "AG" },
  { href: "/workflows", label: "Workflows", code: "WF" },
  { href: "/runs", label: "Runs", code: "RN" },
  { href: "/approvals", label: "Approvals", code: "AP" },
  { href: "/evaluations", label: "Evaluations", code: "EV" },
  { href: "/risks", label: "Risks", code: "RK" },
  { href: "/browser-qa", label: "Browser QA", code: "QA" },
  { href: "/audit", label: "Audit", code: "AU" }
];

const platformItems: NavigationItem[] = [
  { href: "/setup", label: "Setup", code: "SU" },
  { href: "/connectors", label: "Connectors", code: "CN" },
  { href: "/built-in-agents", label: "Built-in Agents", code: "BA" },
  { href: "/agent-builder", label: "Agent Builder", code: "AB" },
  { href: "/plans", label: "Plans", code: "PL" },
  { href: "/owner-control", label: "Owner Control", code: "OC" },
  { href: "/settings", label: "Settings", code: "ST" }
];

const operationPermissions: Partial<Record<AppRoute, Parameters<typeof can>[1]>> = {
  "/dashboard": "dashboard.read",
  "/agents": "agent.read",
  "/workflows": "workflow.read",
  "/runs": "run.read",
  "/approvals": "approval.read",
  "/evaluations": "evaluation.read",
  "/risks": "risk.read",
  "/browser-qa": "browserQa.read",
  "/audit": "audit.read"
};

const routeLabels: Record<AppRoute, string> = {
  "/": "Dashboard",
  "/dashboard": "Dashboard",
  "/agents": "Agents",
  "/workflows": "Workflows",
  "/runs": "Runs",
  "/approvals": "Approvals",
  "/evaluations": "Evaluations",
  "/risks": "Risks",
  "/browser-qa": "Browser QA",
  "/audit": "Audit",
  "/settings": "Settings",
  "/setup": "Setup",
  "/connectors": "Connectors",
  "/built-in-agents": "Built-in Agents",
  "/agent-builder": "Agent Builder",
  "/plans": "Plans",
  "/owner-control": "Owner Control"
};

const operationVisibilityByRole: Record<RoleName, AppRoute[]> = {
  "Founder/Admin": ["/dashboard", "/agents", "/workflows", "/runs", "/approvals", "/evaluations", "/risks", "/browser-qa", "/audit"],
  "AI Engineer": ["/dashboard", "/agents", "/workflows", "/runs", "/browser-qa"],
  "QA Reviewer": ["/dashboard", "/runs", "/evaluations", "/risks", "/browser-qa", "/audit"],
  "Security Reviewer": ["/dashboard", "/runs", "/approvals", "/evaluations", "/risks", "/browser-qa", "/audit"],
  "Product Manager": ["/dashboard", "/runs", "/evaluations", "/risks"],
  Viewer: ["/dashboard", "/runs", "/browser-qa"]
};

const platformVisibilityByRole: Record<RoleName, AppRoute[]> = {
  "Founder/Admin": ["/setup", "/connectors", "/built-in-agents", "/agent-builder", "/plans", "/owner-control", "/settings"],
  "AI Engineer": ["/setup", "/connectors", "/built-in-agents", "/agent-builder", "/plans", "/settings"],
  "QA Reviewer": ["/built-in-agents", "/plans", "/settings"],
  "Security Reviewer": ["/connectors", "/built-in-agents", "/plans", "/settings"],
  "Product Manager": ["/setup", "/built-in-agents", "/plans", "/settings"],
  Viewer: ["/built-in-agents", "/plans", "/settings"]
};

const fallbackRoutesByRole: Record<RoleName, AppRoute[]> = {
  "Founder/Admin": ["/dashboard", "/agent-builder", "/connectors", "/built-in-agents", "/plans", "/settings"],
  "AI Engineer": ["/agent-builder", "/connectors", "/dashboard"],
  "QA Reviewer": ["/browser-qa", "/runs", "/dashboard"],
  "Security Reviewer": ["/risks", "/approvals", "/audit", "/dashboard"],
  "Product Manager": ["/plans", "/built-in-agents", "/dashboard"],
  Viewer: ["/dashboard", "/built-in-agents", "/plans", "/settings"]
};

const appRoutes = new Set<AppRoute>(Object.keys(routeLabels) as AppRoute[]);

function normalizeAppRoute(pathname: string): AppRoute | null {
  const cleanPath = pathname.split("?")[0]?.split("#")[0] ?? pathname;

  if (cleanPath === "/") {
    return "/";
  }

  return appRoutes.has(cleanPath as AppRoute) ? (cleanPath as AppRoute) : null;
}

function isPlatformRoute(route: AppRoute): route is PlatformRoute {
  return platformItems.some((item) => item.href === route && route !== "/settings");
}

export function getAppRouteLabel(pathname: string) {
  const route = normalizeAppRoute(pathname);
  return route ? routeLabels[route] : "This page";
}

export function canViewAppRoute(role: RoleName, pathname: string) {
  const route = normalizeAppRoute(pathname);

  if (!route) {
    return true;
  }

  if (route === "/" || route === "/settings") {
    return true;
  }

  if (isPlatformRoute(route)) {
    return platformVisibilityByRole[role].includes(route) && canViewRoute(role, route);
  }

  const permission = operationPermissions[route];
  return operationVisibilityByRole[role].includes(route) && (!permission || can(role, permission));
}

export function getAppRouteAccessReason(role: RoleName, pathname: string) {
  const route = normalizeAppRoute(pathname);

  if (!route) {
    return `${getAppRouteLabel(pathname)} is not part of the local demo route map.`;
  }

  if (isPlatformRoute(route)) {
    return getRouteAccess(role, route).reason;
  }

  return `${getAppRouteLabel(route)} is not available for ${role}.`;
}

export function getAppRouteRequiredAccess(role: RoleName, pathname: string) {
  const route = normalizeAppRoute(pathname);

  if (!route) {
    return "An available local demo route.";
  }

  if (isPlatformRoute(route)) {
    return getRouteAccess(role, route).requiredRole;
  }

  const permission = operationPermissions[route];
  return permission ? `Permission: ${permission}` : "An allowed role for this route.";
}

export function getBestRouteForRole(role: RoleName): AppRoute {
  return fallbackRoutesByRole[role].find((route) => canViewAppRoute(role, route)) ?? "/dashboard";
}

export function getFallbackRouteForRole(role: RoleName, attemptedPath: string): RoleRedirectTarget {
  const attemptedRoute = normalizeAppRoute(attemptedPath);
  const route = getBestRouteForRole(role);

  return {
    route,
    attemptedRoute,
    attemptedLabel: getAppRouteLabel(attemptedPath),
    requiredAccess: getAppRouteRequiredAccess(role, attemptedPath),
    reason: getAppRouteAccessReason(role, attemptedPath)
  };
}

function getOperationItemState(role: RoleName, item: NavigationItem): NavigationItemState | null {
  const permission = operationPermissions[item.href];

  if (!permission || can(role, permission)) {
    return { ...item, state: "link" };
  }

  return null;
}

function getPlatformItemState(role: RoleName, item: NavigationItem): NavigationItemState {
  if (item.href === "/settings") {
    return { ...item, state: "link" };
  }

  const access = getRouteAccess(role, item.href as PlatformRoute);

  if (access.level === "locked") {
    return { ...item, state: "locked", reason: access.reason };
  }

  return { ...item, state: "link" };
}

export function canSeeNavItem(role: RoleName, item: NavigationItem) {
  const visibleRoutes = new Set([...operationVisibilityByRole[role], ...platformVisibilityByRole[role]]);

  if (!visibleRoutes.has(item.href)) {
    return false;
  }

  return canViewAppRoute(role, item.href);
}

export function getNavigationGroups(role: RoleName): NavigationGroupState[] {
  const operations = operationItems
    .filter((item) => canSeeNavItem(role, item))
    .map((item) => getOperationItemState(role, item))
    .filter((item): item is NavigationItemState => Boolean(item));
  const platformLinks = platformItems
    .filter((item) => canSeeNavItem(role, item))
    .map((item) => getPlatformItemState(role, item))
    .filter((item) => item.state === "link");

  return [
    { label: "Operations", items: operations },
    { label: "Platform", items: platformLinks }
  ].filter((group) => group.items.length > 0);
}
