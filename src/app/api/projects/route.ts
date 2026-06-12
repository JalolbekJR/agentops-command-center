import { API_MODE, handleApiRequest, listResponse } from "@/server/api/responses";
import { parseQuery, projectListQuerySchema } from "@/server/api/validation";
import { withReadModels } from "@/server/services/read-models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleApiRequest(request, async ({ requestId }) => {
    const query = parseQuery(request, projectListQuerySchema);
    const result = await withReadModels((readModels) => readModels.listProjects(query));

    return listResponse(result.data, {
      requestId,
      mode: API_MODE,
      limit: query.limit,
      nextCursor: result.nextCursor
    });
  });
}
