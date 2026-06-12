export type ApiErrorCode =
  | "access_denied"
  | "database_unavailable"
  | "internal_error"
  | "resource_not_found"
  | "session_unavailable"
  | "validation_invalid";

export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status: number;
  readonly publicMessage: string;

  constructor(code: ApiErrorCode, status: number, publicMessage: string) {
    super(publicMessage);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
    this.publicMessage = publicMessage;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function validationError(message = "The request input is invalid.") {
  return new ApiError("validation_invalid", 400, message);
}

export function databaseUnavailableError() {
  return new ApiError("database_unavailable", 503, "Database is not configured for this environment.");
}

export function resourceNotFoundError() {
  return new ApiError("resource_not_found", 404, "The requested resource was not found.");
}

export function accessDeniedError() {
  return new ApiError("access_denied", 403, "The current server session cannot read this resource.");
}

export function sessionUnavailableError() {
  return new ApiError("session_unavailable", 503, "The temporary demo session is not available.");
}

export function toApiError(error: unknown) {
  if (isApiError(error)) {
    return error;
  }

  return new ApiError("internal_error", 500, "The request could not be completed.");
}
