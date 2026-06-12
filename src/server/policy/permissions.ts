export const READ_PERMISSION_KEYS = [
  "session.read",
  "workspace.read",
  "project.read",
  "agent.read",
  "run.read",
  "approval.read",
  "risk.read",
  "evaluation.read",
  "audit.read",
  "usage.read",
  "entitlement.read",
  "plan_limit.read"
] as const;

export type PermissionKey = (typeof READ_PERMISSION_KEYS)[number];

export type ServerRoleName =
  | "Founder/Admin"
  | "AI Engineer"
  | "QA Reviewer"
  | "Security Reviewer"
  | "Product Manager"
  | "Viewer";

export const DEMO_ROLE_PERMISSION_PRESETS: Record<ServerRoleName, readonly PermissionKey[]> = {
  "Founder/Admin": READ_PERMISSION_KEYS,
  "AI Engineer": [
    "session.read",
    "workspace.read",
    "project.read",
    "agent.read",
    "run.read",
    "approval.read",
    "risk.read",
    "evaluation.read",
    "usage.read",
    "entitlement.read",
    "plan_limit.read"
  ],
  "QA Reviewer": ["session.read", "workspace.read", "project.read", "run.read", "approval.read", "risk.read", "evaluation.read"],
  "Security Reviewer": ["session.read", "workspace.read", "project.read", "agent.read", "run.read", "approval.read", "risk.read", "audit.read"],
  "Product Manager": ["session.read", "workspace.read", "project.read", "agent.read", "run.read", "approval.read", "risk.read", "evaluation.read", "usage.read"],
  Viewer: ["session.read", "workspace.read", "project.read", "agent.read", "run.read", "approval.read", "risk.read", "evaluation.read"]
};

export function permissionsForDemoRole(roleName: string): PermissionKey[] {
  if (isServerRoleName(roleName)) {
    return [...DEMO_ROLE_PERMISSION_PRESETS[roleName]];
  }

  return [];
}

export function isPermissionKey(value: string): value is PermissionKey {
  return (READ_PERMISSION_KEYS as readonly string[]).includes(value);
}

function isServerRoleName(value: string): value is ServerRoleName {
  return Object.prototype.hasOwnProperty.call(DEMO_ROLE_PERMISSION_PRESETS, value);
}
