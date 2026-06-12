import { handleApiRequest, successResponse } from "@/server/api/responses";
import { parseProjectParams } from "@/server/api/validation";
import { withReadModels } from "@/server/services/read-models";

export const dynamic = "force-dynamic";

interface ProjectRouteContext {
  params: Promise<{
    projectId: string;
  }>;
}

export async function GET(request: Request, context: ProjectRouteContext) {
  return handleApiRequest(request, async ({ requestId }) => {
    const { projectId } = parseProjectParams(await context.params);
    const project = await withReadModels((readModels) => readModels.getProject(projectId));

    return successResponse(project, requestId);
  });
}
