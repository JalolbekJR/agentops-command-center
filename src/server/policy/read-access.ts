import { and, eq } from "drizzle-orm";
import type { DatabaseConnection } from "@/server/db/client";
import { projects } from "@/server/db/schema";
import { resourceNotFoundError } from "@/server/api/errors";
import type { DemoSession } from "@/server/auth/demo-session";

type Db = DatabaseConnection["db"];

export function assertWorkspaceReadable(session: DemoSession, workspaceId: string) {
  if (session.workspace.id !== workspaceId) {
    throw resourceNotFoundError();
  }
}

export async function requireReadableProject(db: Db, session: DemoSession, projectId: string) {
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
    .where(and(eq(projects.id, projectId), eq(projects.workspaceId, session.workspace.id)))
    .limit(1);

  if (!project) {
    throw resourceNotFoundError();
  }

  return project;
}
