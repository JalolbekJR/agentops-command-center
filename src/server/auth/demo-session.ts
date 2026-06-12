import { and, eq } from "drizzle-orm";
import type { DatabaseConnection } from "@/server/db/client";
import { roles, users, workspaceMembers, workspaces } from "@/server/db/schema";
import { sessionUnavailableError } from "@/server/api/errors";
import type { AuthenticatedServerAuthContext } from "./context";
import { permissionsForDemoRole } from "@/server/policy/permissions";

export const TEMPORARY_DEMO_USER_ID = "user_admin";
export const TEMPORARY_DEMO_WORKSPACE_ID = "team_ai_factory";

export type TemporaryDemoAuthContext = AuthenticatedServerAuthContext & {
  mode: "temporary_demo";
};

type Db = DatabaseConnection["db"];

export async function resolveTemporaryDemoSession(db: Db, requestId: string): Promise<TemporaryDemoAuthContext> {
  const [session] = await db
    .select({
      membershipId: workspaceMembers.id,
      userId: users.id,
      userName: users.name,
      avatarInitials: users.avatarInitials,
      workspaceId: workspaces.id,
      workspaceName: workspaces.name,
      roleId: roles.id,
      roleName: roles.name
    })
    .from(workspaceMembers)
    .innerJoin(users, eq(workspaceMembers.userId, users.id))
    .innerJoin(workspaces, eq(workspaceMembers.workspaceId, workspaces.id))
    .innerJoin(roles, eq(workspaceMembers.roleId, roles.id))
    .where(
      and(
        eq(workspaceMembers.userId, TEMPORARY_DEMO_USER_ID),
        eq(workspaceMembers.workspaceId, TEMPORARY_DEMO_WORKSPACE_ID),
        eq(workspaceMembers.status, "active"),
        eq(users.status, "active"),
        eq(workspaces.status, "active")
      )
    )
    .limit(1);

  if (!session) {
    throw sessionUnavailableError();
  }

  return {
    mode: "temporary_demo",
    requestId,
    user: {
      internalUserId: session.userId,
      displayName: session.userName,
      initials: session.avatarInitials
    },
    membership: {
      internalMembershipId: session.membershipId,
      status: "active"
    },
    workspace: {
      internalWorkspaceId: session.workspaceId,
      displayName: session.workspaceName
    },
    role: {
      internalRoleId: session.roleId,
      displayName: session.roleName,
      permissions: permissionsForDemoRole(session.roleName)
    },
    deploymentGate: {
      isDemoOnly: true,
      publicDeploymentAllowed: false,
      reason: "Temporary seeded demo identity is allowed only for local read-only verification."
    }
  };
}
