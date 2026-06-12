import { API_MODE, handleApiRequest, listResponse } from "@/server/api/responses";
import { approvalListQuerySchema, parseProjectParams, parseQuery } from "@/server/api/validation";
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
    const query = parseQuery(request, approvalListQuerySchema);
    const result = await withReadModels((readModels) => readModels.listApprovals(projectId, query));

    return listResponse(result.data, {
      requestId,
      mode: API_MODE,
      limit: query.limit,
      nextCursor: result.nextCursor
    });
  });
}
