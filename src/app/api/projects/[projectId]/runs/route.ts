import { API_MODE, handleApiRequest, listResponse } from "@/server/api/responses";
import { parseProjectParams, parseQuery, runListQuerySchema } from "@/server/api/validation";
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
    const query = parseQuery(request, runListQuerySchema);
    const result = await withReadModels(requestId, "run.read", (readModels) => readModels.listRuns(projectId, query));

    return listResponse(result.data, {
      requestId,
      mode: API_MODE,
      limit: query.limit,
      nextCursor: result.nextCursor
    });
  });
}
