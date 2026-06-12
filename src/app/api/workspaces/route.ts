import { API_MODE, handleApiRequest, listResponse } from "@/server/api/responses";
import { parseQuery, workspaceListQuerySchema } from "@/server/api/validation";
import { withReadModels } from "@/server/services/read-models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleApiRequest(request, async ({ requestId }) => {
    const query = parseQuery(request, workspaceListQuerySchema);
    const result = await withReadModels(requestId, "workspace.read", (readModels) => readModels.listWorkspaces(query));

    return listResponse(result.data, {
      requestId,
      mode: API_MODE,
      limit: query.limit,
      nextCursor: result.nextCursor
    });
  });
}
