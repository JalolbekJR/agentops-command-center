import { and, eq } from "drizzle-orm";
import type { DatabaseConnection } from "@/server/db/client";
import { projects } from "@/server/db/schema";
import { resourceNotFoundError } from "@/server/api/errors";
import type { AuthenticatedServerAuthContext } from "@/server/auth/context";
import { requirePermission } from "./authorize";

type Db = DatabaseConnection["db"];

export function requireWorkspaceAccess(context: AuthenticatedServerAuthContext, workspaceId: string) {
  if (context.workspace.internalWorkspaceId !== workspaceId) {
    throw resourceNotFoundError();
  }

  return context.workspace;
}

export function requireWorkspaceRead(context: AuthenticatedServerAuthContext, workspaceId: string) {
  requirePermission(context, "workspace.read");

  return requireWorkspaceAccess(context, workspaceId);
}

export async function requireProjectAccess(db: Db, context: AuthenticatedServerAuthContext, projectId: string) {
  const [project] = await db
    .select({
      id: projects.id,
      workspaceId: projects.workspaceId,
      name: projects.name,
      slug: projects.slug,
      environment: projects.environment,
      status: projects.status,
      description: projects.description,
      createdAt: projects.createdAt,
      updatedAt: projects.updatedAt
    })
    .from(projects)
    .where(and(eq(projects.id, projectId), eq(projects.workspaceId, context.workspace.internalWorkspaceId)))
    .limit(1);

  if (!project) {
    throw resourceNotFoundError();
  }

  return project;
}

export async function requireProjectRead(db: Db, context: AuthenticatedServerAuthContext, projectId: string) {
  requirePermission(context, "project.read");

  return requireProjectAccess(db, context, projectId);
}
