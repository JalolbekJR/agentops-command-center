import {
  accessDeniedError,
  authenticationRequiredError,
  isApiError,
  type ApiError
} from "@/server/api/errors";
import type { AuthenticatedServerAuthContext, ServerAuthContext } from "@/server/auth/context";
import type { PermissionKey } from "./permissions";

export function requireAuthenticatedContext(context: ServerAuthContext): AuthenticatedServerAuthContext {
  if (!context.user || !context.workspace || !context.membership || !context.role || context.mode === "anonymous") {
    throw authenticationRequiredError();
  }

  return context as AuthenticatedServerAuthContext;
}

export function requirePermission(context: ServerAuthContext, permission: PermissionKey): AuthenticatedServerAuthContext {
  const authenticatedContext = requireAuthenticatedContext(context);

  if (!authenticatedContext.role.permissions.includes(permission)) {
    throw accessDeniedError();
  }

  return authenticatedContext;
}

export function assertReadOnlyRouteAllowed(context: ServerAuthContext, permission: PermissionKey): AuthenticatedServerAuthContext {
  const authenticatedContext = requirePermission(context, permission);

  if (!authenticatedContext.deploymentGate.isDemoOnly && !authenticatedContext.deploymentGate.publicDeploymentAllowed) {
    throw accessDeniedError();
  }

  return authenticatedContext;
}

export function toAuthorizationError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  return accessDeniedError();
}
