import { API_MODE, handleApiRequest, listResponse } from "@/server/api/responses";
import { paginationQuerySchema, parseQuery, parseWorkspaceParams } from "@/server/api/validation";
import { withReadModels } from "@/server/services/read-models";

export const dynamic = "force-dynamic";

interface WorkspaceRouteContext {
  params: Promise<{
    workspaceId: string;
  }>;
}

export async function GET(request: Request, context: WorkspaceRouteContext) {
  return handleApiRequest(request, async ({ requestId }) => {
    const { workspaceId } = parseWorkspaceParams(await context.params);
    const query = parseQuery(request, paginationQuerySchema);
    const result = await withReadModels((readModels) => readModels.listWorkspacePlanLimits(workspaceId, query));

    return listResponse(result.data, {
      requestId,
      mode: API_MODE,
      limit: query.limit,
      nextCursor: result.nextCursor
    });
  });
}
