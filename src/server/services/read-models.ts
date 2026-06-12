import { and, asc, desc, eq, type SQL } from "drizzle-orm";
import { databaseUnavailableError, isApiError } from "@/server/api/errors";
import { pageRows, type PaginationInput } from "@/server/api/pagination";
import { resolveTemporaryDemoSession, type DemoSession } from "@/server/auth/demo-session";
import { createDatabaseConnection, type DatabaseConnection } from "@/server/db/client";
import {
  agents,
  approvals,
  auditEvents,
  entitlements,
  evaluationResults,
  projects,
  riskFindings,
  runs,
  usageCounters,
  workspaceEntitlements,
  workspaces
} from "@/server/db/schema";
import { assertWorkspaceReadable, requireReadableProject } from "@/server/policy/read-access";

type Db = DatabaseConnection["db"];
type ProjectListQuery = PaginationInput & { status?: "active" | "paused" | "archived" };
type AgentListQuery = PaginationInput & { status?: "active" | "paused" | "needs_review" | "archived"; riskLevel?: "low" | "medium" | "high" | "critical" };
type RunListQuery = PaginationInput & { status?: "queued" | "running" | "waiting_for_approval" | "evaluating" | "passed" | "failed" | "rejected" | "cancelled" };
type ApprovalListQuery = PaginationInput & { status?: "pending" | "approved" | "rejected" | "expired" | "cancelled"; riskLevel?: "low" | "medium" | "high" | "critical" };
type RiskListQuery = PaginationInput & { status?: "open" | "triaged" | "mitigated" | "accepted" | "resolved"; severity?: "low" | "medium" | "high" | "critical" };
type EvaluationListQuery = PaginationInput & { status?: "passed" | "warning" | "failed" };
type AuditListQuery = PaginationInput & { actorUserId?: string; targetType?: string };
type UsageListQuery = PaginationInput & { meterKey?: string };

function scopedWhere(conditions: SQL[]) {
  return and(...conditions);
}

function addPageLimit(pagination: PaginationInput) {
  return pagination.limit + 1;
}

export class ReadModels {
  constructor(
    private readonly db: Db,
    private readonly session: DemoSession
  ) {}

  getSession() {
    return this.session;
  }

  async listWorkspaces(query: ProjectListQuery) {
    const conditions: SQL[] = [eq(workspaces.id, this.session.workspace.id)];

    if (query.status) {
      conditions.push(eq(workspaces.status, query.status));
    }

    const rows = await this.db
      .select({
        id: workspaces.id,
        name: workspaces.name,
        slug: workspaces.slug,
        planKey: workspaces.planKey,
        status: workspaces.status,
        createdAt: workspaces.createdAt,
        updatedAt: workspaces.updatedAt
      })
      .from(workspaces)
      .where(scopedWhere(conditions))
      .orderBy(asc(workspaces.name), asc(workspaces.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listProjects(query: ProjectListQuery) {
    const conditions: SQL[] = [eq(projects.workspaceId, this.session.workspace.id)];

    if (query.status) {
      conditions.push(eq(projects.status, query.status));
    }

    const rows = await this.db
      .select({
        id: projects.id,
        workspaceId: projects.workspaceId,
        name: projects.name,
        slug: projects.slug,
        environment: projects.environment,
        status: projects.status,
        description: projects.description,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt
      })
      .from(projects)
      .where(scopedWhere(conditions))
      .orderBy(desc(projects.updatedAt), asc(projects.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async getProject(projectId: string) {
    return requireReadableProject(this.db, this.session, projectId);
  }

  async listAgents(projectId: string, query: AgentListQuery) {
    await requireReadableProject(this.db, this.session, projectId);

    const conditions: SQL[] = [eq(agents.projectId, projectId)];

    if (query.status) {
      conditions.push(eq(agents.status, query.status));
    }

    if (query.riskLevel) {
      conditions.push(eq(agents.riskLevel, query.riskLevel));
    }

    const rows = await this.db
      .select({
        id: agents.id,
        projectId: agents.projectId,
        name: agents.name,
        description: agents.description,
        ownerUserId: agents.ownerUserId,
        status: agents.status,
        riskLevel: agents.riskLevel,
        defaultModel: agents.defaultModel,
        lastRunAt: agents.lastRunAt,
        successRate: agents.successRate,
        averageCostCents: agents.averageCostCents,
        builtInAgentId: agents.builtInAgentId,
        createdAt: agents.createdAt,
        updatedAt: agents.updatedAt
      })
      .from(agents)
      .where(scopedWhere(conditions))
      .orderBy(asc(agents.name), asc(agents.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listRuns(projectId: string, query: RunListQuery) {
    await requireReadableProject(this.db, this.session, projectId);

    const conditions: SQL[] = [eq(runs.projectId, projectId)];

    if (query.status) {
      conditions.push(eq(runs.status, query.status));
    }

    const rows = await this.db
      .select({
        id: runs.id,
        projectId: runs.projectId,
        workflowId: runs.workflowId,
        workflowVersion: runs.workflowVersion,
        triggeredByUserId: runs.triggeredByUserId,
        status: runs.status,
        environment: runs.environment,
        traceId: runs.traceId,
        startedAt: runs.startedAt,
        completedAt: runs.completedAt,
        durationMs: runs.durationMs,
        totalCostCents: runs.totalCostCents,
        failureReason: runs.failureReason,
        summary: runs.summary,
        eventCount: runs.eventCount,
        approvalCount: runs.approvalCount,
        riskCount: runs.riskCount,
        latestEventAt: runs.latestEventAt
      })
      .from(runs)
      .where(scopedWhere(conditions))
      .orderBy(desc(runs.startedAt), asc(runs.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listApprovals(projectId: string, query: ApprovalListQuery) {
    await requireReadableProject(this.db, this.session, projectId);

    const conditions: SQL[] = [eq(approvals.projectId, projectId)];

    if (query.status) {
      conditions.push(eq(approvals.status, query.status));
    }

    if (query.riskLevel) {
      conditions.push(eq(approvals.riskLevel, query.riskLevel));
    }

    const rows = await this.db
      .select({
        id: approvals.id,
        projectId: approvals.projectId,
        runId: approvals.runId,
        toolCallId: approvals.toolCallId,
        assignedRoleId: approvals.assignedRoleId,
        assignedUserId: approvals.assignedUserId,
        status: approvals.status,
        riskLevel: approvals.riskLevel,
        reason: approvals.reason,
        decision: approvals.decision,
        decidedByUserId: approvals.decidedByUserId,
        decisionComment: approvals.decisionComment,
        requestedAt: approvals.requestedAt,
        decidedAt: approvals.decidedAt,
        expiresAt: approvals.expiresAt
      })
      .from(approvals)
      .where(scopedWhere(conditions))
      .orderBy(desc(approvals.requestedAt), asc(approvals.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listRisks(projectId: string, query: RiskListQuery) {
    await requireReadableProject(this.db, this.session, projectId);

    const conditions: SQL[] = [eq(riskFindings.projectId, projectId)];

    if (query.status) {
      conditions.push(eq(riskFindings.status, query.status));
    }

    if (query.severity) {
      conditions.push(eq(riskFindings.severity, query.severity));
    }

    const rows = await this.db
      .select({
        id: riskFindings.id,
        projectId: riskFindings.projectId,
        runId: riskFindings.runId,
        toolCallId: riskFindings.toolCallId,
        category: riskFindings.category,
        severity: riskFindings.severity,
        status: riskFindings.status,
        title: riskFindings.title,
        description: riskFindings.description,
        evidenceSummary: riskFindings.evidenceSummary,
        ownerRoleId: riskFindings.ownerRoleId,
        ownerUserId: riskFindings.ownerUserId,
        recommendedMitigation: riskFindings.recommendedMitigation,
        createdAt: riskFindings.createdAt,
        resolvedAt: riskFindings.resolvedAt,
        updatedAt: riskFindings.updatedAt
      })
      .from(riskFindings)
      .where(scopedWhere(conditions))
      .orderBy(desc(riskFindings.createdAt), asc(riskFindings.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listEvaluations(projectId: string, query: EvaluationListQuery) {
    await requireReadableProject(this.db, this.session, projectId);

    const conditions: SQL[] = [eq(evaluationResults.projectId, projectId)];

    if (query.status) {
      conditions.push(eq(evaluationResults.status, query.status));
    }

    const rows = await this.db
      .select({
        id: evaluationResults.id,
        projectId: evaluationResults.projectId,
        runId: evaluationResults.runId,
        evaluatorType: evaluationResults.evaluatorType,
        correctnessScore: evaluationResults.correctnessScore,
        safetyScore: evaluationResults.safetyScore,
        reliabilityScore: evaluationResults.reliabilityScore,
        latencyScore: evaluationResults.latencyScore,
        costScore: evaluationResults.costScore,
        userImpactScore: evaluationResults.userImpactScore,
        policyComplianceScore: evaluationResults.policyComplianceScore,
        overallScore: evaluationResults.overallScore,
        status: evaluationResults.status,
        notes: evaluationResults.notes,
        createdAt: evaluationResults.createdAt
      })
      .from(evaluationResults)
      .where(scopedWhere(conditions))
      .orderBy(desc(evaluationResults.createdAt), asc(evaluationResults.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listAuditEvents(projectId: string, query: AuditListQuery) {
    const project = await requireReadableProject(this.db, this.session, projectId);
    const conditions: SQL[] = [eq(auditEvents.workspaceId, project.workspaceId), eq(auditEvents.projectId, projectId)];

    if (query.actorUserId) {
      conditions.push(eq(auditEvents.actorUserId, query.actorUserId));
    }

    if (query.targetType) {
      conditions.push(eq(auditEvents.targetType, query.targetType));
    }

    const rows = await this.db
      .select({
        id: auditEvents.id,
        workspaceId: auditEvents.workspaceId,
        projectId: auditEvents.projectId,
        actorUserId: auditEvents.actorUserId,
        action: auditEvents.action,
        targetType: auditEvents.targetType,
        targetId: auditEvents.targetId,
        beforeSummary: auditEvents.beforeSummary,
        afterSummary: auditEvents.afterSummary,
        reason: auditEvents.reason,
        correlationId: auditEvents.correlationId,
        createdAt: auditEvents.createdAt
      })
      .from(auditEvents)
      .where(scopedWhere(conditions))
      .orderBy(desc(auditEvents.createdAt), asc(auditEvents.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listUsage(projectId: string, query: UsageListQuery) {
    const project = await requireReadableProject(this.db, this.session, projectId);
    const conditions: SQL[] = [eq(usageCounters.workspaceId, project.workspaceId), eq(usageCounters.projectId, projectId)];

    if (query.meterKey) {
      conditions.push(eq(usageCounters.meterKey, query.meterKey));
    }

    const rows = await this.db
      .select({
        id: usageCounters.id,
        workspaceId: usageCounters.workspaceId,
        projectId: usageCounters.projectId,
        meterKey: usageCounters.meterKey,
        periodStart: usageCounters.periodStart,
        periodEnd: usageCounters.periodEnd,
        used: usageCounters.used,
        limitValue: usageCounters.limitValue,
        hardLimit: usageCounters.hardLimit,
        updatedAt: usageCounters.updatedAt
      })
      .from(usageCounters)
      .where(scopedWhere(conditions))
      .orderBy(asc(usageCounters.meterKey), asc(usageCounters.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listWorkspaceEntitlements(workspaceId: string, query: PaginationInput) {
    assertWorkspaceReadable(this.session, workspaceId);

    const rows = await this.db
      .select({
        id: workspaceEntitlements.id,
        workspaceId: workspaceEntitlements.workspaceId,
        entitlementId: workspaceEntitlements.entitlementId,
        entitlementKey: entitlements.key,
        description: entitlements.description,
        source: workspaceEntitlements.source,
        status: workspaceEntitlements.status,
        expiresAt: workspaceEntitlements.expiresAt,
        createdAt: workspaceEntitlements.createdAt
      })
      .from(workspaceEntitlements)
      .innerJoin(entitlements, eq(workspaceEntitlements.entitlementId, entitlements.id))
      .where(and(eq(workspaceEntitlements.workspaceId, workspaceId), eq(workspaceEntitlements.status, "active")))
      .orderBy(asc(entitlements.key), asc(workspaceEntitlements.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

  async listWorkspacePlanLimits(workspaceId: string, query: PaginationInput) {
    assertWorkspaceReadable(this.session, workspaceId);

    const rows = await this.db
      .select({
        id: usageCounters.id,
        workspaceId: usageCounters.workspaceId,
        projectId: usageCounters.projectId,
        meterKey: usageCounters.meterKey,
        limitValue: usageCounters.limitValue,
        hardLimit: usageCounters.hardLimit,
        periodStart: usageCounters.periodStart,
        periodEnd: usageCounters.periodEnd,
        updatedAt: usageCounters.updatedAt
      })
      .from(usageCounters)
      .where(eq(usageCounters.workspaceId, workspaceId))
      .orderBy(asc(usageCounters.meterKey), asc(usageCounters.id))
      .limit(addPageLimit(query))
      .offset(query.cursor);

    return pageRows(rows, query);
  }

}

export async function withReadModels<T>(handler: (models: ReadModels) => Promise<T>) {
  let connection: DatabaseConnection;

  try {
    connection = createDatabaseConnection();
  } catch {
    throw databaseUnavailableError();
  }

  try {
    const session = await resolveTemporaryDemoSession(connection.db);
    return await handler(new ReadModels(connection.db, session));
  } catch (error: unknown) {
    if (isApiError(error)) {
      throw error;
    }

    throw databaseUnavailableError();
  } finally {
    await connection.pool.end();
  }
}
