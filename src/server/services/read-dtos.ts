import { createHash } from "node:crypto";
import type { DemoSession } from "@/server/auth/demo-session";

function publicRef(prefix: string, rawId: string) {
  const digest = createHash("sha256").update(rawId).digest("hex").slice(0, 10);

  return `${prefix}_${digest}`;
}

function labelFromKey(value: string) {
  return value
    .replace(/[:_.-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function workspacePlanLabel(planKey: string) {
  const labels: Record<string, string> = {
    portfolio_demo: "Portfolio demo",
    free_demo: "Free demo",
    starter: "Starter",
    pro: "Pro",
    enterprise_self_hosted: "Enterprise / Self-hosted"
  };

  return labels[planKey] ?? labelFromKey(planKey);
}

function meterLabel(meterKey: string) {
  const labels: Record<string, string> = {
    audit_retention_days: "Audit retention",
    browser_qa_minutes: "Browser QA minutes",
    connected_agents: "Connected agents",
    native_protocol_events: "Native protocol events",
    private_workers: "Private workers",
    runs_per_month: "Runs per month",
    seats: "Seats",
    trace_imports: "Trace imports",
    webhook_events: "Webhook events"
  };

  return labels[meterKey] ?? labelFromKey(meterKey);
}

function entitlementLabel(entitlementKey: string) {
  const labels: Record<string, string> = {
    "feature:dashboard": "Dashboard access",
    "feature:deterministic_demo": "Demo mode",
    "feature:rbac_preview": "Role preview",
    "agent:builtin_website_qa": "Website QA agent"
  };

  if (labels[entitlementKey]) {
    return labels[entitlementKey];
  }

  if (entitlementKey.startsWith("agent:")) {
    return `${labelFromKey(entitlementKey.slice("agent:".length))} agent`;
  }

  if (entitlementKey.startsWith("feature:")) {
    return labelFromKey(entitlementKey.slice("feature:".length));
  }

  return labelFromKey(entitlementKey);
}

function actionCategory(action: string) {
  return labelFromKey(action.split(".")[0] ?? "event");
}

function actionLabel(action: string) {
  return labelFromKey(action);
}

export function toSessionDto(session: DemoSession) {
  return {
    mode: session.mode,
    displayName: session.user.name,
    initials: session.user.avatarInitials,
    workspaceName: session.workspace.name,
    roleName: session.role.name,
    isTemporaryDemoSession: true
  };
}

export function toWorkspaceDto(row: {
  id: string;
  name: string;
  planKey: string;
  status: string;
}) {
  return {
    workspaceRef: publicRef("workspace", row.id),
    name: row.name,
    planLabel: workspacePlanLabel(row.planKey),
    status: row.status
  };
}

export function toProjectDto(row: {
  id: string;
  name: string;
  status: string;
  description: string;
}) {
  return {
    projectRef: publicRef("project", row.id),
    name: row.name,
    status: row.status,
    description: row.description
  };
}

export function toAgentDto(row: {
  id: string;
  name: string;
  description: string;
  status: string;
  riskLevel: string;
  lastRunAt: string | null;
  successRate: number;
  averageCostCents: number;
}) {
  return {
    agentRef: publicRef("agent", row.id),
    name: row.name,
    description: row.description,
    status: row.status,
    riskLevel: row.riskLevel,
    lastRunAt: row.lastRunAt,
    successRate: row.successRate,
    averageCostCents: row.averageCostCents
  };
}

export function toRunDto(row: {
  id: string;
  status: string;
  environment: string;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  totalCostCents: number;
  failureReason: string | null;
  summary: string;
  eventCount: number;
  approvalCount: number;
  riskCount: number;
  latestEventAt: string | null;
}) {
  return {
    runRef: publicRef("run", row.id),
    status: row.status,
    environment: row.environment,
    startedAt: row.startedAt,
    completedAt: row.completedAt,
    durationMs: row.durationMs,
    totalCostCents: row.totalCostCents,
    failureReason: row.failureReason,
    summary: row.summary,
    eventCount: row.eventCount,
    approvalCount: row.approvalCount,
    riskCount: row.riskCount,
    latestEventAt: row.latestEventAt
  };
}

export function toApprovalDto(row: {
  id: string;
  status: string;
  riskLevel: string;
  reason: string;
  decision: string | null;
  requestedAt: string;
  decidedAt: string | null;
  expiresAt: string | null;
}) {
  return {
    approvalRef: publicRef("approval", row.id),
    status: row.status,
    riskLevel: row.riskLevel,
    reason: row.reason,
    decision: row.decision,
    requestedAt: row.requestedAt,
    decidedAt: row.decidedAt,
    expiresAt: row.expiresAt
  };
}

export function toRiskDto(row: {
  id: string;
  category: string;
  severity: string;
  status: string;
  title: string;
  description: string;
  evidenceSummary: string;
  recommendedMitigation: string;
  createdAt: string;
  resolvedAt: string | null;
  updatedAt: string;
}) {
  return {
    riskRef: publicRef("risk", row.id),
    category: labelFromKey(row.category),
    severity: row.severity,
    status: row.status,
    title: row.title,
    description: row.description,
    evidenceSummary: row.evidenceSummary,
    recommendedAction: row.recommendedMitigation,
    createdAt: row.createdAt,
    resolvedAt: row.resolvedAt,
    updatedAt: row.updatedAt
  };
}

export function toEvaluationDto(row: {
  id: string;
  evaluatorType: string;
  correctnessScore: number;
  safetyScore: number;
  reliabilityScore: number;
  latencyScore: number;
  costScore: number;
  userImpactScore: number;
  policyComplianceScore: number;
  overallScore: number;
  status: string;
  notes: string;
  createdAt: string;
}) {
  return {
    evaluationRef: publicRef("evaluation", row.id),
    evaluatorLabel: labelFromKey(row.evaluatorType),
    correctnessScore: row.correctnessScore,
    safetyScore: row.safetyScore,
    reliabilityScore: row.reliabilityScore,
    latencyScore: row.latencyScore,
    costScore: row.costScore,
    userImpactScore: row.userImpactScore,
    policyComplianceScore: row.policyComplianceScore,
    overallScore: row.overallScore,
    status: row.status,
    notes: row.notes,
    createdAt: row.createdAt
  };
}

export function toAuditEventDto(row: {
  id: string;
  action: string;
  reason: string;
  createdAt: string;
}) {
  return {
    auditRef: publicRef("audit", row.id),
    category: actionCategory(row.action),
    actionLabel: actionLabel(row.action),
    summary: row.reason,
    createdAt: row.createdAt
  };
}

export function toUsageDto(row: {
  meterKey: string;
  periodStart: string;
  periodEnd: string;
  used: number;
  limitValue: number | null;
  hardLimit: boolean;
  updatedAt: string;
}) {
  return {
    meterLabel: meterLabel(row.meterKey),
    periodStart: row.periodStart,
    periodEnd: row.periodEnd,
    used: row.used,
    limitValue: row.limitValue,
    hardLimit: row.hardLimit,
    updatedAt: row.updatedAt
  };
}

export function toEntitlementDto(row: {
  entitlementKey: string;
  description: string;
  status: string;
  expiresAt: string | null;
  createdAt: string;
}) {
  return {
    featureLabel: entitlementLabel(row.entitlementKey),
    description: row.description,
    status: row.status,
    expiresAt: row.expiresAt,
    createdAt: row.createdAt
  };
}
