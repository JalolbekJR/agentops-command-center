import { z } from "zod";
import { DEFAULT_PAGE_LIMIT, MAX_CURSOR_OFFSET, MAX_PAGE_LIMIT } from "./pagination";
import { validationError } from "./errors";

const idSchema = z
  .string()
  .min(3)
  .max(128)
  .regex(/^[a-zA-Z0-9_-]+$/, "Identifiers may contain only letters, numbers, underscores, and hyphens.");

const limitSchema = z.coerce.number().int().min(1).max(MAX_PAGE_LIMIT).default(DEFAULT_PAGE_LIMIT);
const cursorSchema = z.coerce.number().int().min(0).max(MAX_CURSOR_OFFSET).default(0);

const riskLevelSchema = z.enum(["low", "medium", "high", "critical"]);
const projectStatusSchema = z.enum(["active", "paused", "archived"]);
const agentStatusSchema = z.enum(["active", "paused", "needs_review", "archived"]);
const runStatusSchema = z.enum(["queued", "running", "waiting_for_approval", "evaluating", "passed", "failed", "rejected", "cancelled"]);
const approvalStatusSchema = z.enum(["pending", "approved", "rejected", "expired", "cancelled"]);
const riskStatusSchema = z.enum(["open", "triaged", "mitigated", "accepted", "resolved"]);
const evaluationStatusSchema = z.enum(["passed", "warning", "failed"]);

const paginationFields = {
  limit: limitSchema,
  cursor: cursorSchema
};

export const workspaceParamsSchema = z
  .object({
    workspaceId: idSchema
  })
  .strict();

export const projectParamsSchema = z
  .object({
    projectId: idSchema
  })
  .strict();

export const workspaceListQuerySchema = z
  .object({
    ...paginationFields,
    status: projectStatusSchema.optional()
  })
  .strict();

export const projectListQuerySchema = z
  .object({
    ...paginationFields,
    status: projectStatusSchema.optional()
  })
  .strict();

export const agentListQuerySchema = z
  .object({
    ...paginationFields,
    status: agentStatusSchema.optional(),
    riskLevel: riskLevelSchema.optional()
  })
  .strict();

export const runListQuerySchema = z
  .object({
    ...paginationFields,
    status: runStatusSchema.optional()
  })
  .strict();

export const approvalListQuerySchema = z
  .object({
    ...paginationFields,
    status: approvalStatusSchema.optional(),
    riskLevel: riskLevelSchema.optional()
  })
  .strict();

export const riskListQuerySchema = z
  .object({
    ...paginationFields,
    status: riskStatusSchema.optional(),
    severity: riskLevelSchema.optional()
  })
  .strict();

export const evaluationListQuerySchema = z
  .object({
    ...paginationFields,
    status: evaluationStatusSchema.optional()
  })
  .strict();

export const auditListQuerySchema = z
  .object({
    ...paginationFields,
    actorUserId: idSchema.optional(),
    targetType: z.string().min(1).max(80).regex(/^[a-zA-Z0-9_.-]+$/).optional()
  })
  .strict();

export const usageListQuerySchema = z
  .object({
    ...paginationFields,
    meterKey: z.string().min(1).max(80).regex(/^[a-zA-Z0-9_.-]+$/).optional()
  })
  .strict();

export const paginationQuerySchema = z
  .object({
    ...paginationFields
  })
  .strict();

type AnyZodObject = z.ZodObject<z.ZodRawShape>;

function searchParamsToObject(searchParams: URLSearchParams, allowedKeys: Set<string>) {
  const parsed: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    if (!allowedKeys.has(key)) {
      throw validationError(`Unsupported query parameter: ${key}`);
    }

    if (Object.prototype.hasOwnProperty.call(parsed, key)) {
      throw validationError(`Duplicate query parameter: ${key}`);
    }

    parsed[key] = value;
  }

  return parsed;
}

function parseWithSchema<TSchema extends z.ZodType>(schema: TSchema, input: unknown): z.output<TSchema> {
  const result = schema.safeParse(input);

  if (!result.success) {
    throw validationError("The request input is invalid.");
  }

  return result.data;
}

export function parseQuery<TSchema extends AnyZodObject>(request: Request, schema: TSchema): z.output<TSchema> {
  const url = new URL(request.url);
  const allowedKeys = new Set(Object.keys(schema.shape));
  const input = searchParamsToObject(url.searchParams, allowedKeys);

  return parseWithSchema(schema, input);
}

export function parseProjectParams(params: unknown) {
  return parseWithSchema(projectParamsSchema, params);
}

export function parseWorkspaceParams(params: unknown) {
  return parseWithSchema(workspaceParamsSchema, params);
}
