import { createDatabaseConnection } from "./client";
import {
  agentCapabilities,
  agentProducts,
  agents,
  approvals,
  auditEvents,
  builtInAgents,
  entitlements,
  evaluationResults,
  featureFlags,
  permissions,
  planLimits,
  plans,
  projects,
  riskFindings,
  rolePermissions,
  roles,
  runEvents,
  runs,
  toolCalls,
  users,
  workflows,
  workflowSteps,
  workspaceEntitlements,
  workspaceMembers,
  workspaces,
  usageCounters
} from "./schema";
import { mockAgents } from "../../data/mock-agents";
import { mockApprovals } from "../../data/mock-approvals";
import { mockAuditLogs } from "../../data/mock-audit-logs";
import { mockBuiltInAgents } from "../../data/mock-built-in-agents";
import { mockEvaluations } from "../../data/mock-evaluations";
import { mockWorkspacePlans } from "../../data/mock-plans";
import { activeProject, mockProjects } from "../../data/mock-projects";
import { mockRisks } from "../../data/mock-risks";
import { mockRunEvents, mockRuns, mockToolCalls } from "../../data/mock-runs";
import { mockTeam, mockUsers } from "../../data/mock-users";
import { mockWorkflows } from "../../data/mock-workflows";
import { roleDefinitions } from "../../lib/rbac";
import type { RoleName } from "../../types/rbac";

const seededAt = "2026-06-02T10:55:00Z";
const periodStart = "2026-06-01T00:00:00Z";
const periodEnd = "2026-06-30T23:59:59Z";

const roleIdByName: Record<RoleName, string> = {
  "Founder/Admin": "role_founder_admin",
  "AI Engineer": "role_ai_engineer",
  "QA Reviewer": "role_qa_reviewer",
  "Security Reviewer": "role_security_reviewer",
  "Product Manager": "role_product_manager",
  Viewer: "role_viewer"
};

function permissionId(key: string) {
  return `permission_${key.replaceAll(".", "_")}`;
}

function entitlementId(key: string) {
  return `entitlement_${key.replaceAll(":", "_")}`;
}

type ProjectEnvironmentValue = "local_demo" | "development" | "staging" | "production";

function projectEnvironmentLabel(environment: string): ProjectEnvironmentValue {
  if (environment === "Development") {
    return "development";
  }

  if (environment === "Staging") {
    return "staging";
  }

  if (environment === "Production") {
    return "production";
  }

  return "local_demo";
}

function runProjectId(runId: string) {
  const run = mockRuns.find((item) => item.id === runId);

  if (!run) {
    throw new Error(`Seed data references unknown run: ${runId}`);
  }

  return run.projectId;
}

export async function seedDatabase() {
  const { db, pool } = createDatabaseConnection();
  const freeDemoPlan = mockWorkspacePlans.find((plan) => plan.id === "free_demo") ?? mockWorkspacePlans[0];
  const uniquePermissions = Array.from(new Set(roleDefinitions.flatMap((role) => role.permissions)));

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(users)
        .values(
          mockUsers.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatarInitials: user.avatarInitials,
            status: user.status,
            lastActiveAt: user.lastActiveAt,
            createdAt: seededAt,
            updatedAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(workspaces)
        .values({
          id: mockTeam.id,
          name: mockTeam.name,
          slug: "ai-factory-demo-team",
          planKey: mockTeam.plan,
          status: "active",
          createdAt: seededAt,
          updatedAt: seededAt
        })
        .onConflictDoNothing();

      await tx
        .insert(roles)
        .values(
          roleDefinitions.map((role) => ({
            id: roleIdByName[role.name],
            workspaceId: mockTeam.id,
            name: role.name,
            description: role.description,
            isSystem: true,
            createdAt: seededAt,
            updatedAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(permissions)
        .values(
          uniquePermissions.map((key) => ({
            id: permissionId(key),
            key,
            category: key.split(".")[0] ?? "general",
            description: `Allows ${key} in server-side policy checks.`,
            createdAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(rolePermissions)
        .values(
          roleDefinitions.flatMap((role) =>
            role.permissions.map((key) => ({
              roleId: roleIdByName[role.name],
              permissionId: permissionId(key),
              createdAt: seededAt
            }))
          )
        )
        .onConflictDoNothing();

      await tx
        .insert(workspaceMembers)
        .values(
          mockUsers.map((user) => ({
            id: `member_${user.id}`,
            workspaceId: mockTeam.id,
            userId: user.id,
            roleId: roleIdByName[user.role],
            status: "active" as const,
            joinedAt: seededAt,
            createdAt: seededAt,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(plans)
        .values(
          mockWorkspacePlans.map((plan, index) => ({
            id: plan.id,
            key: plan.id,
            name: plan.name,
            audience: plan.audience,
            summary: plan.summary,
            priceLabel: plan.priceLabel,
            recommended: plan.recommended,
            status: "active",
            publicRank: index + 1,
            createdAt: seededAt,
            updatedAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(planLimits)
        .values(
          mockWorkspacePlans.flatMap((plan) =>
            plan.limits.map((limit) => ({
              id: `plan_limit_${plan.id}_${limit.meter}`,
              planId: plan.id,
              meterKey: limit.meter,
              limitValue: typeof limit.included === "number" ? limit.included : null,
              unitLabel: limit.unitLabel,
              hardLimit: limit.hardLimit,
              period: limit.meter === "audit_retention_days" ? "retention" : "monthly",
              createdAt: seededAt
            }))
          )
        )
        .onConflictDoNothing();

      const entitlementRows = [
        { key: "feature:deterministic_demo", description: "Access to deterministic local demo workspace." },
        { key: "feature:dashboard", description: "Access to dashboard summaries." },
        { key: "feature:rbac_preview", description: "Access to local role and permission preview." },
        ...mockBuiltInAgents.map((agent) => ({
          key: `agent:${agent.id}`,
          description: `Access to ${agent.name}.`
        }))
      ];

      await tx
        .insert(entitlements)
        .values(
          entitlementRows.map((entitlement) => ({
            id: entitlementId(entitlement.key),
            key: entitlement.key,
            description: entitlement.description,
            sourceType: entitlement.key.startsWith("agent:") ? "agent_product" : "feature",
            status: "active",
            createdAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(workspaceEntitlements)
        .values(
          [
            "feature:deterministic_demo",
            "feature:dashboard",
            "feature:rbac_preview",
            ...freeDemoPlan.builtInAgentIds.map((agentId) => `agent:${agentId}`)
          ].map((key) => ({
            id: `workspace_entitlement_${mockTeam.id}_${key.replaceAll(":", "_")}`,
            workspaceId: mockTeam.id,
            entitlementId: entitlementId(key),
            source: "deterministic_seed",
            status: "active",
            expiresAt: null,
            createdAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(featureFlags)
        .values([
          {
            id: "flag_deterministic_demo_mode",
            key: "deterministic_demo_mode",
            description: "Keeps the frontend on deterministic mock data until API reads are approved.",
            defaultState: true,
            scope: "workspace",
            createdAt: seededAt,
            updatedAt: seededAt
          },
          {
            id: "flag_database_reads_enabled",
            key: "database_reads_enabled",
            description: "Future guard for switching selected pages from mock data to backend reads.",
            defaultState: false,
            scope: "workspace",
            createdAt: seededAt,
            updatedAt: seededAt
          },
          {
            id: "flag_live_agents_enabled",
            key: "live_agents_enabled",
            description: "Future guard for live agent execution. Remains off in the database foundation.",
            defaultState: false,
            scope: "workspace",
            createdAt: seededAt,
            updatedAt: seededAt
          }
        ])
        .onConflictDoNothing();

      await tx
        .insert(projects)
        .values(
          mockProjects.map((project) => ({
            id: project.id,
            workspaceId: project.teamId,
            name: project.name,
            slug: project.slug,
            environment: projectEnvironmentLabel(project.environment),
            status: project.status,
            description: project.description,
            createdAt: seededAt,
            updatedAt: project.updatedAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(builtInAgents)
        .values(
          mockBuiltInAgents.map((agent) => ({
            id: agent.id,
            name: agent.name,
            shortDescription: agent.shortDescription,
            purpose: agent.purpose,
            privacyLevel: agent.privacyLevel,
            riskLevel: agent.riskLevel,
            usageMeter: agent.usageMeter,
            monetizationTier: agent.monetizationTier,
            implementationStatus: agent.implementationStatus,
            recommended: agent.recommended,
            bestFor: agent.bestFor,
            inputRequirements: agent.inputRequirements,
            connectionRequirements: agent.connectionRequirements,
            requiredPermissions: agent.requiredPermissions,
            requiredCapabilities: agent.requiredCapabilities,
            approvalRequirements: agent.approvalRequirements,
            securityNotes: agent.securityNotes,
            deploymentModes: agent.deploymentModes,
            createdAt: seededAt,
            updatedAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(agentProducts)
        .values(
          mockBuiltInAgents.map((agent) => ({
            id: `agent_product_${agent.id}`,
            builtInAgentId: agent.id,
            productKey: agent.id,
            requiredPlanKey: agent.monetizationTier,
            trialSupported: agent.monetizationTier !== "free_demo",
            status: "active",
            createdAt: seededAt,
            updatedAt: seededAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(agents)
        .values(
          mockAgents.map((agent) => ({
            id: agent.id,
            projectId: agent.projectId,
            name: agent.name,
            description: agent.description,
            ownerUserId: agent.ownerUserId,
            status: agent.status,
            riskLevel: agent.riskLevel,
            defaultModel: agent.defaultModel,
            lastRunAt: agent.lastRunAt,
            successRate: agent.successRate,
            averageCostCents: agent.averageCostCents,
            builtInAgentId: null,
            createdAt: seededAt,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(agentCapabilities)
        .values(
          mockAgents.flatMap((agent) =>
            agent.capabilities.map((capability) => ({
              id: capability.id,
              agentId: capability.agentId,
              name: capability.name,
              category: capability.category,
              requiresApproval: capability.requiresApproval,
              riskLevel: capability.riskLevel,
              toolName: capability.toolName,
              createdAt: seededAt
            }))
          )
        )
        .onConflictDoNothing();

      await tx
        .insert(workflows)
        .values(
          mockWorkflows.map((workflow) => ({
            id: workflow.id,
            projectId: workflow.projectId,
            name: workflow.name,
            description: workflow.description,
            status: workflow.status,
            version: workflow.version,
            ownerUserId: workflow.ownerUserId,
            triggerType: workflow.triggerType,
            publishedAt: workflow.status === "published" ? workflow.updatedAt : null,
            createdAt: seededAt,
            updatedAt: workflow.updatedAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(workflowSteps)
        .values(
          mockWorkflows.flatMap((workflow) =>
            workflow.steps.map((step) => ({
              id: step.id,
              workflowId: step.workflowId,
              stepKey: step.stepKey,
              name: step.name,
              type: step.type,
              dependsOnStepKeys: step.dependsOnStepKeys,
              agentId: step.agentId ?? null,
              toolName: step.toolName ?? null,
              approvalPolicyId: step.approvalPolicyId ?? null,
              retryPolicy: step.retryPolicy ?? null,
              timeoutSeconds: step.timeoutSeconds ?? null,
              positionX: step.position.x,
              positionY: step.position.y,
              createdAt: seededAt,
              updatedAt: seededAt,
              version: 1
            }))
          )
        )
        .onConflictDoNothing();

      await tx
        .insert(runs)
        .values(
          mockRuns.map((run) => ({
            id: run.id,
            projectId: run.projectId,
            workflowId: run.workflowId,
            workflowVersion: run.workflowVersion,
            triggeredByUserId: run.triggeredByUserId,
            status: run.status,
            environment: run.environment,
            traceId: run.traceId,
            startedAt: run.startedAt,
            completedAt: run.completedAt ?? null,
            durationMs: run.durationMs ?? null,
            totalCostCents: run.totalCostCents,
            failureReason: run.failureReason ?? null,
            summary: run.summary,
            eventCount: mockRunEvents.filter((event) => event.workflowRunId === run.id).length,
            approvalCount: mockApprovals.filter((approval) => approval.workflowRunId === run.id).length,
            riskCount: mockRisks.filter((risk) => risk.workflowRunId === run.id).length,
            latestEventAt: mockRunEvents.filter((event) => event.workflowRunId === run.id).at(-1)?.createdAt ?? null,
            createdAt: seededAt,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(runEvents)
        .values(
          mockRunEvents.map((event) => ({
            id: event.id,
            runId: event.workflowRunId,
            stepId: event.stepId ?? null,
            eventType: event.eventType,
            severity: event.severity,
            message: event.message,
            metadataSummary: event.metadata ?? {},
            sequence: event.sequence,
            createdAt: event.createdAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(toolCalls)
        .values(
          mockToolCalls.map((toolCall) => ({
            id: toolCall.id,
            runId: toolCall.workflowRunId,
            stepId: toolCall.stepId,
            agentId: toolCall.agentId,
            toolName: toolCall.toolName,
            inputSummary: toolCall.inputSummary,
            outputSummary: toolCall.outputSummary,
            status: toolCall.status,
            riskLevel: toolCall.riskLevel,
            approvalRequestId: toolCall.approvalRequestId ?? null,
            startedAt: toolCall.startedAt,
            completedAt: toolCall.completedAt ?? null,
            durationMs: toolCall.durationMs ?? null,
            errorCode: toolCall.errorCode ?? null,
            createdAt: seededAt,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(approvals)
        .values(
          mockApprovals.map((approval) => ({
            id: approval.id,
            projectId: approval.projectId,
            runId: approval.workflowRunId,
            toolCallId: approval.toolCallId ?? null,
            assignedRoleId: roleIdByName[approval.assignedRole],
            assignedUserId: approval.assignedUserId ?? null,
            status: approval.status,
            riskLevel: approval.riskLevel,
            reason: approval.reason,
            decision: approval.decision ?? null,
            decidedByUserId: approval.decidedByUserId ?? null,
            decisionComment: approval.decisionComment ?? null,
            requestedAt: approval.requestedAt,
            decidedAt: approval.decidedAt ?? null,
            expiresAt: approval.expiresAt ?? null,
            createdAt: seededAt,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(riskFindings)
        .values(
          mockRisks.map((risk) => ({
            id: risk.id,
            projectId: risk.projectId,
            runId: risk.workflowRunId,
            toolCallId: risk.toolCallId ?? null,
            category: risk.category,
            severity: risk.severity,
            status: risk.status,
            title: risk.title,
            description: risk.description,
            evidenceSummary: risk.evidenceSummary,
            ownerRoleId: roleIdByName[risk.ownerRole],
            ownerUserId: risk.ownerUserId ?? null,
            recommendedMitigation: risk.recommendedMitigation,
            createdAt: risk.createdAt,
            resolvedAt: risk.resolvedAt ?? null,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(evaluationResults)
        .values(
          mockEvaluations.map((evaluation) => ({
            id: evaluation.id,
            projectId: runProjectId(evaluation.workflowRunId),
            runId: evaluation.workflowRunId,
            evaluatorType: evaluation.evaluatorType,
            correctnessScore: evaluation.correctnessScore,
            safetyScore: evaluation.safetyScore,
            reliabilityScore: evaluation.reliabilityScore,
            latencyScore: evaluation.latencyScore,
            costScore: evaluation.costScore,
            userImpactScore: evaluation.userImpactScore,
            policyComplianceScore: evaluation.policyComplianceScore,
            overallScore: evaluation.overallScore,
            status: evaluation.status,
            notes: evaluation.notes,
            createdAt: evaluation.createdAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(auditEvents)
        .values(
          mockAuditLogs.map((audit) => ({
            id: audit.id,
            workspaceId: mockTeam.id,
            projectId: audit.projectId,
            actorUserId: audit.actorUserId,
            action: audit.action,
            targetType: audit.targetType,
            targetId: audit.targetId,
            beforeSummary: audit.beforeSummary ?? null,
            afterSummary: audit.afterSummary ?? null,
            reason: audit.reason,
            requestId: null,
            correlationId: audit.correlationId,
            createdAt: audit.createdAt
          }))
        )
        .onConflictDoNothing();

      await tx
        .insert(usageCounters)
        .values(
          freeDemoPlan.limits.map((limit) => ({
            id: `usage_counter_${mockTeam.id}_${limit.meter}_${periodStart.slice(0, 10)}`,
            workspaceId: mockTeam.id,
            projectId: activeProject.id,
            meterKey: limit.meter,
            periodStart,
            periodEnd,
            used: limit.used,
            limitValue: typeof limit.included === "number" ? limit.included : null,
            hardLimit: limit.hardLimit,
            updatedAt: seededAt,
            version: 1
          }))
        )
        .onConflictDoNothing();
    });
  } finally {
    await pool.end();
  }
}
