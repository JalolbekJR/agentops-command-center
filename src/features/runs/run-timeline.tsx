import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockRunEvents, mockRuns, mockToolCalls } from "@/data/mock-runs";
import { formatCents, formatDateTime } from "@/lib/format";
import { runStatusTone } from "@/lib/status";

export function RunTimeline() {
  const selectedRun = mockRuns[0];
  const events = mockRunEvents
    .filter((event) => event.workflowRunId === selectedRun.id)
    .sort((a, b) => a.sequence - b.sequence);
  const toolCalls = mockToolCalls.filter((toolCall) => toolCall.workflowRunId === selectedRun.id);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Run operations"
        title="Replay a workflow from trigger to approval gate."
        description="Runs are shown as ordered events, tool calls, status changes, cost, trace IDs, and reviewer evidence."
      />
      <SectionCard title="Run timeline" description="Ordered events make the agent run explainable.">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{selectedRun.id}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{selectedRun.summary}</p>
              </div>
              <StatusBadge label={selectedRun.status} tone={runStatusTone(selectedRun.status)} />
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-md border border-white/10 bg-slate-950/50 p-3">
                <dt className="text-xs uppercase text-slate-500">Trace</dt>
                <dd className="mt-1 font-mono text-xs text-cyan-100">{selectedRun.traceId}</dd>
              </div>
              <div className="rounded-md border border-white/10 bg-slate-950/50 p-3">
                <dt className="text-xs uppercase text-slate-500">Cost</dt>
                <dd className="mt-1 text-white">{formatCents(selectedRun.totalCostCents)}</dd>
              </div>
              <div className="rounded-md border border-white/10 bg-slate-950/50 p-3">
                <dt className="text-xs uppercase text-slate-500">Environment</dt>
                <dd className="mt-1 text-white">{selectedRun.environment}</dd>
              </div>
              <div className="rounded-md border border-white/10 bg-slate-950/50 p-3">
                <dt className="text-xs uppercase text-slate-500">Started</dt>
                <dd className="mt-1 text-white">{formatDateTime(selectedRun.startedAt)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 grid size-8 shrink-0 place-items-center rounded-full border border-cyan-300/30 bg-cyan-300/10 text-xs font-semibold text-cyan-100">
                    {event.sequence}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white">{event.eventType}</p>
                      <StatusBadge label={event.severity} tone={event.severity === "error" ? "danger" : event.severity === "warning" ? "warning" : event.severity === "success" ? "success" : "info"} />
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{event.message}</p>
                    <p className="mt-2 text-xs text-slate-500">{formatDateTime(event.createdAt)}</p>
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
            <article key={toolCall.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{toolCall.toolName}</p>
                  <p className="mt-1 text-xs text-slate-500">{toolCall.id}</p>
                </div>
                <StatusBadge label={toolCall.status} tone={toolCall.status === "succeeded" ? "success" : toolCall.status === "waiting_for_approval" ? "warning" : "danger"} />
              </div>
              <p className="mt-4 text-sm leading-6 text-slate-400">{toolCall.inputSummary}</p>
              <p className="mt-3 rounded-md border border-white/10 bg-slate-950/50 p-3 text-sm leading-6 text-slate-300">{toolCall.outputSummary}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
