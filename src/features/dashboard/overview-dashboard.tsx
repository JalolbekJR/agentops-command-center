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

const evidenceChain = [
  ["Agent", "Browser QA + Security Sentinel"],
  ["Workflow", "Release readiness review"],
  ["Run", "run_release_001 paused"],
  ["Evidence", "QA route proof captured"],
  ["Risk", "External publish requires review"],
  ["Approval", "Security Reviewer pending"],
  ["Evaluation", "Quality gate scored"],
  ["Audit", "Decision trail ready"]
] as const;

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
  const currentApproval = mockApprovals.find((approval) => approval.status === "pending") ?? mockApprovals[0];
  const highestRisk = mockRisks.find((risk) => risk.severity === "high" || risk.severity === "critical") ?? mockRisks[0];

  return (
    <div className="space-y-5 sm:space-y-6">
      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(22rem,0.85fr)]">
        <div className="command-panel p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="meta-label">Operations baseline</p>
              <h1 className="mt-2 max-w-4xl text-2xl font-semibold leading-tight text-white sm:text-[2rem]">
                Control agent work from draft to audited decision.
              </h1>
              <p className="muted-copy mt-3 max-w-3xl text-sm">
                AgentOps connects agents, workflows, runs, evidence, risks, approvals, evaluations, and audit records into one local demo baseline ready for backend integration.
              </p>
            </div>
            <Link href="/runs" className="primary-action focus-ring shrink-0">
              Inspect run timeline
            </Link>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            <div className="detail-tile">
              <p className="meta-label">Active agents</p>
              <p className="mt-1 text-2xl font-semibold text-white">{activeAgents}</p>
              <p className="subtle-copy mt-1 text-xs">Scoped builders and reviewers</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Run health</p>
              <p className="mt-1 text-2xl font-semibold text-white">{runningRuns} active</p>
              <p className="subtle-copy mt-1 text-xs">{failedRuns} replayable failure</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Evidence captured</p>
              <p className="mt-1 text-2xl font-semibold text-white">{formatPercent(browserPassRate, 0)}</p>
              <p className="subtle-copy mt-1 text-xs">Browser QA pass rate</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Evaluation</p>
              <p className="mt-1 text-2xl font-semibold text-white">{formatPercent(averageEvaluation, 1)}</p>
              <p className="subtle-copy mt-1 text-xs">Quality, safety, cost, policy</p>
            </div>
          </div>

          <div className="mt-5 evidence-strip">
            {evidenceChain.map(([label, detail]) => (
              <div key={label} className="evidence-node">
                <p className="evidence-node-title">{label}</p>
                <p className="evidence-node-detail">{detail}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="command-panel-muted p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="meta-label">Needs attention</p>
              <h2 className="mt-2 text-xl font-semibold text-white">Human approval is holding the risky step.</h2>
              <p className="muted-copy mt-2 text-sm">{currentApproval.reason}</p>
            </div>
            <StatusBadge label={`${pendingApprovals} waiting`} tone={pendingApprovals > 0 ? "warning" : "success"} />
          </div>

          <div className="mt-4 signal-list">
            <Link href="/approvals" className="signal-item focus-ring block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">Approval gate</p>
                  <p className="muted-copy mt-1 text-sm">{currentApproval.assignedRole} decides whether this local run can continue.</p>
                </div>
                <StatusBadge label={currentApproval.status} tone={approvalStatusTone(currentApproval.status)} />
              </div>
            </Link>
            <Link href="/risks" className="signal-item focus-ring block">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{highestRisk.title}</p>
                  <p className="muted-copy mt-1 text-sm">{highestRisk.evidenceSummary}</p>
                </div>
                <RiskBadge riskLevel={highestRisk.severity} />
              </div>
            </Link>
            <Link href="/audit" className="signal-item focus-ring block">
              <p className="text-sm font-semibold text-white">Audit readiness</p>
              <p className="muted-copy mt-1 text-sm">{mockAuditLogs.length} sensitive events are correlated to decisions and run evidence.</p>
            </Link>
          </div>

          <div className="mt-4 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] p-3">
            <p className="text-sm font-semibold text-emerald-100">Recommended operator action</p>
            <p className="mt-1 text-sm leading-6 text-emerald-100/78">Open the approval queue, inspect the high-risk publish check, then verify evaluation and audit records before continuing the workflow.</p>
          </div>
        </aside>
      </section>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open risks" value={String(openRisks)} detail="Findings with owner and mitigation context." tone={openRisks > 0 ? "danger" : "success"} />
        <StatCard label="Pending approvals" value={String(pendingApprovals)} detail="Risky actions stay gated." tone={pendingApprovals > 0 ? "warning" : "success"} />
        <StatCard label="Cost baseline" value={formatCents(totalCost)} detail={`${formatNumber(totalTokens)} deterministic mock tokens.`} tone="info" />
        <StatCard label="Audit events" value={String(mockAuditLogs.length)} detail="Actor, action, reason, correlation." tone="success" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="Run control lane" description="Every workflow run keeps status, evidence, cost, trace ID, and reviewer context together.">
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

        <SectionCard title="Review queues" description="Risk, approval, evaluation, and audit records expose the human control layer.">
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
        <SectionCard title="Risk evidence" description="Findings are connected to workflow runs, owners, and release gates.">
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

        <SectionCard title="Audit trail" description="Sensitive decisions are recorded with actor, reason, and correlation context.">
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

