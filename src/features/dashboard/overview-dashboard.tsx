import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatCard } from "@/components/stat-card";
import { StatusBadge } from "@/components/status-badge";
import { RiskBadge } from "@/components/risk-badge";
import { mockAgents } from "@/data/mock-agents";
import { mockApprovals } from "@/data/mock-approvals";
import { mockAuditLogs } from "@/data/mock-audit-logs";
import { mockBrowserSessions } from "@/data/mock-browser-sessions";
import { mockCostMetrics } from "@/data/mock-costs";
import { mockEvaluations } from "@/data/mock-evaluations";
import { mockRisks } from "@/data/mock-risks";
import { mockRuns } from "@/data/mock-runs";
import { formatCents, formatDateTime, formatNumber, formatPercent } from "@/lib/format";
import { approvalStatusTone, runStatusTone } from "@/lib/status";

export function OverviewDashboard() {
  const activeAgents = mockAgents.filter((agent) => agent.status === "active").length;
  const runningRuns = mockRuns.filter((run) => run.status === "running" || run.status === "waiting_for_approval").length;
  const failedRuns = mockRuns.filter((run) => run.status === "failed").length;
  const pendingApprovals = mockApprovals.filter((approval) => approval.status === "pending").length;
  const openRisks = mockRisks.filter((risk) => risk.status === "open" || risk.status === "triaged").length;
  const averageEvaluation = mockEvaluations.reduce((sum, evaluation) => sum + evaluation.overallScore, 0) / mockEvaluations.length;
  const browserPassRate = mockBrowserSessions.filter((session) => session.status === "passed").length / mockBrowserSessions.length;
  const totalCost = mockCostMetrics.reduce((sum, metric) => sum + metric.estimatedCostCents, 0);
  const totalTokens = mockCostMetrics.reduce((sum, metric) => sum + metric.inputTokens + metric.outputTokens, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command overview"
        title="Operational health for governed agent workflows."
        description="Runs, approvals, evaluations, risks, QA evidence, and audit signals stay visible without turning the workspace into noise."
        action={
          <Link href="/runs" className="primary-action focus-ring w-full sm:w-auto">
            Inspect run timeline
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active agents" value={String(activeAgents)} detail="Owned agents with scoped capabilities." tone="success" />
        <StatCard label="Running workflows" value={String(runningRuns)} detail="Includes approval-paused runs." tone="info" />
        <StatCard label="Failed runs" value={String(failedRuns)} detail="Replayable from timeline events." tone={failedRuns > 0 ? "danger" : "success"} />
        <StatCard label="Pending approvals" value={String(pendingApprovals)} detail="Risky actions stay gated." tone={pendingApprovals > 0 ? "warning" : "success"} />
        <StatCard label="Risk findings" value={String(openRisks)} detail="Open findings with owners." tone={openRisks > 0 ? "danger" : "success"} />
        <StatCard label="Avg evaluation" value={formatPercent(averageEvaluation, 1)} detail="Weighted score across safety, quality, cost, and policy." tone="warning" />
        <StatCard label="Browser QA pass rate" value={formatPercent(browserPassRate, 0)} detail="Recorded route smoke checks." tone="success" />
        <StatCard label="Token/cost trend" value={formatCents(totalCost)} detail={`${formatNumber(totalTokens)} mock tokens tracked this window.`} tone="info" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Recent workflow runs" description="Traceable runs with status, reviewer context, and correlation IDs.">
          <div className="space-y-3">
            {mockRuns.slice(0, 4).map((run) => (
              <Link key={run.id} href="/runs" className="data-row-link focus-ring p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{run.id}</p>
                    <p className="muted-copy mt-1 text-sm">{run.summary}</p>
                    <p className="subtle-copy mt-2 break-words text-xs"><span className="mono-token">{run.traceId}</span> started {formatDateTime(run.startedAt)}</p>
                  </div>
                  <StatusBadge label={run.status} tone={runStatusTone(run.status)} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Approval watch" description="Risky work stays paused until the assigned reviewer decides.">
          <div className="space-y-3">
            {mockApprovals.map((approval) => (
              <div key={approval.id} className="data-card-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{approval.assignedRole}</p>
                    <p className="muted-copy mt-1 text-sm">{approval.reason}</p>
                  </div>
                  <StatusBadge label={approval.status} tone={approvalStatusTone(approval.status)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Top risks" description="Findings are connected to workflow runs and release gates.">
          <div className="space-y-3">
            {mockRisks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="data-card-muted p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{risk.title}</p>
                    <p className="muted-copy mt-1 text-sm">{risk.evidenceSummary}</p>
                  </div>
                  <RiskBadge riskLevel={risk.severity} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent audit events" description="Sensitive decisions are recorded with actor and correlation context.">
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 4).map((audit) => (
              <div key={audit.id} className="data-card-muted p-4">
                <p className="text-sm font-semibold text-white">{audit.action}</p>
                <p className="muted-copy mt-1 text-sm">{audit.reason}</p>
                <p className="subtle-copy mt-2 break-words text-xs">{formatDateTime(audit.createdAt)} via <span className="mono-token">{audit.correlationId}</span></p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

