import type { PermissionKey } from "@/server/policy/permissions";

export type AuthMode = "temporary_demo" | "authenticated" | "anonymous";

export interface ServerAuthUser {
  internalUserId: string;
  displayName: string;
  initials: string;
}

export interface ServerWorkspaceMembership {
  internalMembershipId: string;
  status: "active";
}

export interface ServerAuthWorkspace {
  internalWorkspaceId: string;
  displayName: string;
}

export interface ServerAuthRole {
  internalRoleId: string;
  displayName: string;
  permissions: PermissionKey[];
}

export interface DeploymentGate {
  isDemoOnly: boolean;
  publicDeploymentAllowed: boolean;
  reason: string;
}

export interface ServerAuthContext {
  mode: AuthMode;
  requestId: string;
  user: ServerAuthUser | null;
  membership: ServerWorkspaceMembership | null;
  workspace: ServerAuthWorkspace | null;
  role: ServerAuthRole | null;
  deploymentGate: DeploymentGate;
}

export type AuthenticatedServerAuthContext = ServerAuthContext & {
  mode: "temporary_demo" | "authenticated";
  user: ServerAuthUser;
  membership: ServerWorkspaceMembership;
  workspace: ServerAuthWorkspace;
  role: ServerAuthRole;
};

export function anonymousAuthContext(requestId: string): ServerAuthContext {
  return {
    mode: "anonymous",
    requestId,
    user: null,
    membership: null,
    workspace: null,
    role: null,
    deploymentGate: {
      isDemoOnly: false,
      publicDeploymentAllowed: false,
      reason: "No trusted server-side identity is available."
    }
  };
}
