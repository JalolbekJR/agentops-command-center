"use client";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockRunEvents, mockRuns, mockToolCalls } from "@/data/mock-runs";
import { formatCents, formatDateTime } from "@/lib/format";
import { runStatusTone } from "@/lib/status";
import { useDemoState } from "@/lib/demo-state";

const lifecycle = [
  ["Queued", "Run accepted"],
  ["Browser QA", "Evidence captured"],
  ["Risk scan", "Publish check flagged"],
  ["Approval", "Human gate pending"],
  ["Evaluation", "Release score feeds gate"],
  ["Audit", "Decision trail preserved"]
] as const;

export function RunTimeline() {
  const { uiMode } = useDemoState();
  const selectedRun = mockRuns[0];
  const events = mockRunEvents
    .filter((event) => event.workflowRunId === selectedRun.id)
    .sort((a, b) => a.sequence - b.sequence);
  const toolCalls = mockToolCalls.filter((toolCall) => toolCall.workflowRunId === selectedRun.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Run operations"
        title="Trace a run from start to gate."
        description={uiMode === "simple" ? "See why this run paused, what evidence exists, and who decides next." : "Follow ordered events, tool calls, cost, trace IDs, evidence, and the reviewer gate that paused release."}
      />
      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={selectedRun.status} tone={runStatusTone(selectedRun.status)} />
              <StatusBadge label={uiMode === "simple" ? "Paused run" : selectedRun.environment} tone="info" />
              <StatusBadge label="Evidence captured" tone="success" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">{selectedRun.summary}</h2>
            <p className="muted-copy mt-3 text-sm">
              {uiMode === "simple"
                ? "The release check is paused because a Security Reviewer must decide the high-risk publish step."
                : "The run timeline explains what happened, why it paused, which evidence exists, and which reviewer owns the next decision."}
            </p>
            <div className="simple-only mt-5 grid gap-3 sm:grid-cols-3">
              <div className="detail-tile">
                <p className="meta-label">Why paused</p>
                <p className="mt-1 text-sm font-semibold text-white">Approval gate</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Evidence</p>
                <p className="mt-1 text-sm font-semibold text-white">Browser QA captured</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Reviewer</p>
                <p className="mt-1 text-sm font-semibold text-white">Security Reviewer</p>
              </div>
            </div>
            <div className="professional-only mt-5 evidence-strip">
              {lifecycle.map(([label, detail]) => (
                <div key={label} className="evidence-node">
                  <p className="evidence-node-title">{label}</p>
                  <p className="evidence-node-detail">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Current run</p>
            <p className="mono-token mt-2 break-words text-sm">{selectedRun.id}</p>
            <dl className="mt-4 grid gap-3 text-sm">
              <div>
                <dt className="meta-label">Trace</dt>
                <dd className="mono-token professional-only mt-1 break-words text-xs">{selectedRun.traceId}</dd>
                <dd className="simple-only mt-1 text-white">Hidden in Simple Mode</dd>
              </div>
              <div>
                <dt className="meta-label">Cost</dt>
                <dd className="mt-1 text-white">{formatCents(selectedRun.totalCostCents)}</dd>
              </div>
              <div>
                <dt className="meta-label">Started</dt>
                <dd className="mt-1 text-white">{formatDateTime(selectedRun.startedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <SectionCard title="Trace timeline" description="Each span keeps the event, status, evidence, and time in order.">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="data-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{selectedRun.id}</p>
                <p className="muted-copy mt-1 text-sm">{selectedRun.summary}</p>
              </div>
              <StatusBadge label={selectedRun.status} tone={runStatusTone(selectedRun.status)} />
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div className="detail-tile">
                <dt className="meta-label">Trace</dt>
                <dd className="mono-token professional-only mt-1 break-words text-xs">{selectedRun.traceId}</dd>
                <dd className="simple-only mt-1 text-white">Available in Pro</dd>
              </div>
              <div className="detail-tile">
                <dt className="meta-label">Cost</dt>
                <dd className="mt-1 text-white">{formatCents(selectedRun.totalCostCents)}</dd>
              </div>
              <div className="detail-tile">
                <dt className="meta-label">Environment</dt>
                <dd className="mt-1 text-white">{selectedRun.environment}</dd>
              </div>
              <div className="detail-tile">
                <dt className="meta-label">Started</dt>
                <dd className="mt-1 text-white">{formatDateTime(selectedRun.startedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="trace-lane space-y-3">
            {events.map((event) => (
              <div key={event.id} className="trace-event data-card">
                <div className="flex items-start gap-3">
                  <div className="timeline-index mt-1">{event.sequence}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white">{event.eventType}</p>
                      <StatusBadge label={event.severity} tone={event.severity === "error" ? "danger" : event.severity === "warning" ? "warning" : event.severity === "success" ? "success" : "info"} />
                    </div>
                    <p className="muted-copy mt-2 text-sm">{event.message}</p>
                    <p className="professional-only subtle-copy mt-2 text-xs">{formatDateTime(event.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Tool calls" description="Tool inputs and outputs are summarized for review.">
        <div className="grid gap-4 lg:grid-cols-2">
          {toolCalls.map((toolCall) => (
            <article key={toolCall.id} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{toolCall.toolName}</p>
                  <p className="mono-token mt-1 break-words text-xs">{toolCall.id}</p>
                </div>
                <StatusBadge label={toolCall.status} tone={toolCall.status === "succeeded" ? "success" : toolCall.status === "waiting_for_approval" ? "warning" : "danger"} />
              </div>
              <p className="muted-copy mt-4 text-sm">{toolCall.inputSummary}</p>
              <p className="data-card-muted mt-3 p-3 text-sm leading-6 text-slate-300">{toolCall.outputSummary}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
