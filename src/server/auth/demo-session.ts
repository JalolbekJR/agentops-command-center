import { and, eq } from "drizzle-orm";
import type { DatabaseConnection } from "@/server/db/client";
import { roles, users, workspaceMembers, workspaces } from "@/server/db/schema";
import { sessionUnavailableError } from "@/server/api/errors";

export const TEMPORARY_DEMO_USER_ID = "user_admin";
export const TEMPORARY_DEMO_WORKSPACE_ID = "team_ai_factory";

export interface DemoSession {
  mode: "temporary-demo-session";
  user: {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
  };
  workspace: {
    id: string;
    name: string;
    slug: string;
  };
  role: {
    id: string;
    name: string;
  };
}

type Db = DatabaseConnection["db"];

export async function resolveTemporaryDemoSession(db: Db): Promise<DemoSession> {
  const [session] = await db
    .select({
      userId: users.id,
      userName: users.name,
      userEmail: users.email,
      avatarInitials: users.avatarInitials,
      workspaceId: workspaces.id,
      workspaceName: workspaces.name,
      workspaceSlug: workspaces.slug,
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
    mode: "temporary-demo-session",
    user: {
      id: session.userId,
      name: session.userName,
      email: session.userEmail,
      avatarInitials: session.avatarInitials
    },
    workspace: {
      id: session.workspaceId,
      name: session.workspaceName,
      slug: session.workspaceSlug
    },
    role: {
      id: session.roleId,
      name: session.roleName
    }
  };
}
