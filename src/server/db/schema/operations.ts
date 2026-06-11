import { doublePrecision, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users, workspaces } from "./identity";
import { agents, projects, riskLevelEnum } from "./projects";
import { roles } from "./rbac";

export const workflowStatusEnum = pgEnum("workflow_status", ["draft", "published", "paused", "archived"]);
export const workflowTriggerTypeEnum = pgEnum("workflow_trigger_type", ["manual", "scheduled", "webhook", "release_gate"]);
export const workflowStepTypeEnum = pgEnum("workflow_step_type", ["trigger", "agent_task", "tool_call", "approval", "evaluation", "browser_qa", "release_gate", "notification"]);
export const runStatusEnum = pgEnum("run_status", ["queued", "running", "waiting_for_approval", "evaluating", "passed", "failed", "rejected", "cancelled"]);
export const eventSeverityEnum = pgEnum("event_severity", ["info", "success", "warning", "error"]);
export const toolCallStatusEnum = pgEnum("tool_call_status", ["pending", "running", "waiting_for_approval", "succeeded", "failed", "blocked", "redacted"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected", "expired", "cancelled"]);
export const evaluationStatusEnum = pgEnum("evaluation_status", ["passed", "warning", "failed"]);
export const evaluatorTypeEnum = pgEnum("evaluator_type", ["deterministic_mock", "future_ai_evaluator", "human_reviewer"]);
export const riskCategoryEnum = pgEnum("risk_category", [
  "prompt_injection",
  "tool_injection",
  "sensitive_data_exposure",
  "unauthorized_access",
  "unsafe_automation",
  "qa_failure",
  "policy_violation",
  "cost_overrun",
  "reliability_regression",
  "release_gate_blocker"
]);
export const riskStatusEnum = pgEnum("risk_status", ["open", "triaged", "mitigated", "accepted", "resolved"]);

export const workflows = pgTable(
  "workflows",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description").notNull(),
    status: workflowStatusEnum("status").default("draft").notNull(),
    version: integer("version").default(1).notNull(),
    ownerUserId: text("owner_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    triggerType: workflowTriggerTypeEnum("trigger_type").default("manual").notNull(),
    publishedAt: timestamp("published_at", { mode: "string", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("workflows_project_id_idx").on(table.projectId),
    index("workflows_project_status_idx").on(table.projectId, table.status),
    index("workflows_project_version_idx").on(table.projectId, table.version)
  ]
);

export const workflowSteps = pgTable(
  "workflow_steps",
  {
    id: text("id").primaryKey(),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "cascade" }),
    stepKey: text("step_key").notNull(),
    name: text("name").notNull(),
    type: workflowStepTypeEnum("type").notNull(),
    dependsOnStepKeys: jsonb("depends_on_step_keys").$type<string[]>().default([]).notNull(),
    agentId: text("agent_id").references(() => agents.id, { onDelete: "set null" }),
    toolName: text("tool_name"),
    approvalPolicyId: text("approval_policy_id"),
    retryPolicy: jsonb("retry_policy").$type<{
      maxAttempts: number;
      backoff: "fixed" | "exponential";
      delayMs: number;
      retryableFailures: string[];
      nonRetryableFailures: string[];
    } | null>(),
    timeoutSeconds: integer("timeout_seconds"),
    positionX: integer("position_x").default(0).notNull(),
    positionY: integer("position_y").default(0).notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    uniqueIndex("workflow_steps_workflow_step_key_unique").on(table.workflowId, table.stepKey),
    index("workflow_steps_workflow_id_idx").on(table.workflowId),
    index("workflow_steps_agent_id_idx").on(table.agentId),
    index("workflow_steps_type_idx").on(table.type)
  ]
);

export const runs = pgTable(
  "runs",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    workflowId: text("workflow_id")
      .notNull()
      .references(() => workflows.id, { onDelete: "restrict" }),
    workflowVersion: integer("workflow_version").notNull(),
    triggeredByUserId: text("triggered_by_user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: runStatusEnum("status").default("queued").notNull(),
    environment: text("environment").notNull(),
    traceId: text("trace_id").notNull(),
    startedAt: timestamp("started_at", { mode: "string", withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { mode: "string", withTimezone: true }),
    durationMs: integer("duration_ms"),
    totalCostCents: integer("total_cost_cents").default(0).notNull(),
    failureReason: text("failure_reason"),
    summary: text("summary").notNull(),
    eventCount: integer("event_count").default(0).notNull(),
    approvalCount: integer("approval_count").default(0).notNull(),
    riskCount: integer("risk_count").default(0).notNull(),
    latestEventAt: timestamp("latest_event_at", { mode: "string", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    uniqueIndex("runs_trace_id_unique").on(table.traceId),
    index("runs_project_id_idx").on(table.projectId),
    index("runs_project_status_started_idx").on(table.projectId, table.status, table.startedAt),
    index("runs_workflow_started_idx").on(table.workflowId, table.startedAt)
  ]
);

export const runEvents = pgTable(
  "run_events",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    stepId: text("step_id").references(() => workflowSteps.id, { onDelete: "set null" }),
    eventType: text("event_type").notNull(),
    severity: eventSeverityEnum("severity").default("info").notNull(),
    message: text("message").notNull(),
    metadataSummary: jsonb("metadata_summary").$type<Record<string, string | number | boolean>>().default({}).notNull(),
    sequence: integer("sequence").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    uniqueIndex("run_events_run_sequence_unique").on(table.runId, table.sequence),
    index("run_events_run_id_idx").on(table.runId),
    index("run_events_run_created_idx").on(table.runId, table.createdAt),
    index("run_events_type_severity_idx").on(table.eventType, table.severity)
  ]
);

export const toolCalls = pgTable(
  "tool_calls",
  {
    id: text("id").primaryKey(),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    stepId: text("step_id")
      .notNull()
      .references(() => workflowSteps.id, { onDelete: "restrict" }),
    agentId: text("agent_id")
      .notNull()
      .references(() => agents.id, { onDelete: "restrict" }),
    toolName: text("tool_name").notNull(),
    inputSummary: text("input_summary").notNull(),
    outputSummary: text("output_summary").notNull(),
    status: toolCallStatusEnum("status").default("pending").notNull(),
    riskLevel: riskLevelEnum("risk_level").default("low").notNull(),
    approvalRequestId: text("approval_request_id"),
    startedAt: timestamp("started_at", { mode: "string", withTimezone: true }).notNull(),
    completedAt: timestamp("completed_at", { mode: "string", withTimezone: true }),
    durationMs: integer("duration_ms"),
    errorCode: text("error_code"),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    index("tool_calls_run_id_idx").on(table.runId),
    index("tool_calls_agent_id_idx").on(table.agentId),
    index("tool_calls_status_idx").on(table.status),
    index("tool_calls_risk_level_idx").on(table.riskLevel)
  ]
);

export const approvals = pgTable(
  "approvals",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").references(() => toolCalls.id, { onDelete: "set null" }),
    assignedRoleId: text("assigned_role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    assignedUserId: text("assigned_user_id").references(() => users.id, { onDelete: "set null" }),
    status: approvalStatusEnum("status").default("pending").notNull(),
    riskLevel: riskLevelEnum("risk_level").default("low").notNull(),
    reason: text("reason").notNull(),
    decision: text("decision"),
    decidedByUserId: text("decided_by_user_id").references(() => users.id, { onDelete: "set null" }),
    decisionComment: text("decision_comment"),
    requestedAt: timestamp("requested_at", { mode: "string", withTimezone: true }).notNull(),
    decidedAt: timestamp("decided_at", { mode: "string", withTimezone: true }),
    expiresAt: timestamp("expires_at", { mode: "string", withTimezone: true }),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    index("approvals_project_status_requested_idx").on(table.projectId, table.status, table.requestedAt),
    index("approvals_run_id_idx").on(table.runId),
    index("approvals_assigned_role_id_idx").on(table.assignedRoleId),
    index("approvals_assigned_user_id_idx").on(table.assignedUserId)
  ]
);

export const riskFindings = pgTable(
  "risk_findings",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    toolCallId: text("tool_call_id").references(() => toolCalls.id, { onDelete: "set null" }),
    category: riskCategoryEnum("category").notNull(),
    severity: riskLevelEnum("severity").notNull(),
    status: riskStatusEnum("status").default("open").notNull(),
    title: text("title").notNull(),
    description: text("description").notNull(),
    evidenceSummary: text("evidence_summary").notNull(),
    ownerRoleId: text("owner_role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    ownerUserId: text("owner_user_id").references(() => users.id, { onDelete: "set null" }),
    recommendedMitigation: text("recommended_mitigation").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    resolvedAt: timestamp("resolved_at", { mode: "string", withTimezone: true }),
    updatedAt: timestamp("updated_at", { mode: "string", withTimezone: true }).defaultNow().notNull(),
    version: integer("version").default(1).notNull()
  },
  (table) => [
    index("risk_findings_project_severity_status_idx").on(table.projectId, table.severity, table.status),
    index("risk_findings_category_status_idx").on(table.category, table.status),
    index("risk_findings_run_id_idx").on(table.runId),
    index("risk_findings_owner_role_id_idx").on(table.ownerRoleId)
  ]
);

export const evaluationResults = pgTable(
  "evaluation_results",
  {
    id: text("id").primaryKey(),
    projectId: text("project_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    runId: text("run_id")
      .notNull()
      .references(() => runs.id, { onDelete: "cascade" }),
    evaluatorType: evaluatorTypeEnum("evaluator_type").notNull(),
    correctnessScore: doublePrecision("correctness_score").notNull(),
    safetyScore: doublePrecision("safety_score").notNull(),
    reliabilityScore: doublePrecision("reliability_score").notNull(),
    latencyScore: doublePrecision("latency_score").notNull(),
    costScore: doublePrecision("cost_score").notNull(),
    userImpactScore: doublePrecision("user_impact_score").notNull(),
    policyComplianceScore: doublePrecision("policy_compliance_score").notNull(),
    overallScore: doublePrecision("overall_score").notNull(),
    status: evaluationStatusEnum("status").notNull(),
    notes: text("notes").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("evaluation_results_project_status_created_idx").on(table.projectId, table.status, table.createdAt),
    index("evaluation_results_run_id_idx").on(table.runId)
  ]
);

export const auditEvents = pgTable(
  "audit_events",
  {
    id: text("id").primaryKey(),
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspaces.id, { onDelete: "cascade" }),
    projectId: text("project_id").references(() => projects.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => users.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    beforeSummary: text("before_summary"),
    afterSummary: text("after_summary"),
    reason: text("reason").notNull(),
    requestId: text("request_id"),
    correlationId: text("correlation_id").notNull(),
    createdAt: timestamp("created_at", { mode: "string", withTimezone: true }).defaultNow().notNull()
  },
  (table) => [
    index("audit_events_workspace_created_idx").on(table.workspaceId, table.createdAt),
    index("audit_events_project_created_idx").on(table.projectId, table.createdAt),
    index("audit_events_actor_created_idx").on(table.actorUserId, table.createdAt),
    index("audit_events_target_idx").on(table.targetType, table.targetId)
  ]
);
