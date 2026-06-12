import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { toApiError } from "./errors";

export const API_MODE = "database-readonly";

interface BaseMeta {
  requestId: string;
  mode: typeof API_MODE;
}

interface ListMeta extends BaseMeta {
  limit: number;
  nextCursor: string | null;
}

export interface ApiRequestContext {
  requestId: string;
}

function headerRequestId(request: Request) {
  const headerValue = request.headers.get("x-request-id");

  if (!headerValue) {
    return null;
  }

  return /^[a-zA-Z0-9_-]{8,80}$/.test(headerValue) ? headerValue : null;
}

export function requestIdFor(request: Request) {
  return headerRequestId(request) ?? `req_${randomUUID()}`;
}

export function successResponse<T>(data: T, requestId: string) {
  return NextResponse.json({
    data,
    meta: {
      requestId,
      mode: API_MODE
    } satisfies BaseMeta
  });
}

export function listResponse<T>(data: T[], meta: ListMeta) {
  return NextResponse.json({
    data,
    meta
  });
}

export function errorResponse(error: unknown, requestId: string) {
  const apiError = toApiError(error);

  return NextResponse.json(
    {
      error: {
        code: apiError.code,
        message: apiError.publicMessage
      },
      meta: {
        requestId
      }
    },
    {
      status: apiError.status
    }
  );
}

export async function handleApiRequest(
  request: Request,
  handler: (context: ApiRequestContext) => Promise<Response>
) {
  const requestId = requestIdFor(request);

  try {
    return await handler({ requestId });
  } catch (error: unknown) {
    return errorResponse(error, requestId);
  }
}
