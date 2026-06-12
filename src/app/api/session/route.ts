import { handleApiRequest, successResponse } from "@/server/api/responses";
import { withReadModels } from "@/server/services/read-models";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  return handleApiRequest(request, async ({ requestId }) => {
    const session = await withReadModels((readModels) => Promise.resolve(readModels.getSession()));

    return successResponse(session, requestId);
  });
}
