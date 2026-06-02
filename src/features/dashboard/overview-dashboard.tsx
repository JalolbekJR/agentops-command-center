import Link from "next/link";
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
      <section className="rounded-lg border border-white/10 bg-slate-950/70 p-5 shadow-command">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-cyan-200">Local deterministic demo</p>
            <h2 className="mt-2 max-w-4xl text-3xl font-semibold tracking-normal text-white">
              Govern agent workflows with traceable runs, approval gates, evaluations, risks, and audit evidence.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              This scaffold uses mock data only. It is intentionally separated from future backend, auth, database, AI, and browser automation integrations.
            </p>
          </div>
          <Link href="/runs" className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-300/15 focus:outline-none focus:ring-2 focus:ring-cyan-300">
            Inspect run timeline
          </Link>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active agents" value={String(activeAgents)} detail="Specialized demo agents with owners and risk levels." tone="success" />
        <StatCard label="Running workflows" value={String(runningRuns)} detail="Includes runs paused for human approval." tone="info" />
        <StatCard label="Failed runs" value={String(failedRuns)} detail="Failures stay replayable through timeline events." tone={failedRuns > 0 ? "danger" : "success"} />
        <StatCard label="Pending approvals" value={String(pendingApprovals)} detail="High-risk actions remain approval-gated." tone={pendingApprovals > 0 ? "warning" : "success"} />
        <StatCard label="Risk findings" value={String(openRisks)} detail="Open or triaged findings linked to runs." tone={openRisks > 0 ? "danger" : "success"} />
        <StatCard label="Avg evaluation" value={formatPercent(averageEvaluation, 1)} detail="Weighted score across safety, quality, cost, and policy." tone="warning" />
        <StatCard label="Browser QA pass rate" value={formatPercent(browserPassRate, 0)} detail="Deterministic session records for route smoke checks." tone="success" />
        <StatCard label="Token/cost trend" value={formatCents(totalCost)} detail={`${formatNumber(totalTokens)} mock tokens tracked this window.`} tone="info" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Recent workflow runs" description="Operational run history with statuses, trace IDs, and short reviewer summaries.">
          <div className="space-y-3">
            {mockRuns.slice(0, 4).map((run) => (
              <Link key={run.id} href="/runs" className="block rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.05]">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{run.id}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{run.summary}</p>
                    <p className="mt-2 text-xs text-slate-500">{run.traceId} started {formatDateTime(run.startedAt)}</p>
                  </div>
                  <StatusBadge label={run.status} tone={runStatusTone(run.status)} />
                </div>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Pending approvals" description="Risky work stays paused until the assigned reviewer decides.">
          <div className="space-y-3">
            {mockApprovals.map((approval) => (
              <div key={approval.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{approval.assignedRole}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{approval.reason}</p>
                  </div>
                  <StatusBadge label={approval.status} tone={approvalStatusTone(approval.status)} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard title="Top risks" description="Findings are connected to workflow runs and future release gates.">
          <div className="space-y-3">
            {mockRisks.slice(0, 3).map((risk) => (
              <div key={risk.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{risk.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-400">{risk.evidenceSummary}</p>
                  </div>
                  <RiskBadge riskLevel={risk.severity} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent audit events" description="Audited activity proves the future governance model.">
          <div className="space-y-3">
            {mockAuditLogs.slice(0, 4).map((audit) => (
              <div key={audit.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <p className="text-sm font-semibold text-white">{audit.action}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{audit.reason}</p>
                <p className="mt-2 text-xs text-slate-500">{formatDateTime(audit.createdAt)} via {audit.correlationId}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

