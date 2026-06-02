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
        title="Replay workflow state with ordered evidence."
        description="Run events, tool calls, status changes, cost, trace IDs, and reviewer evidence stay connected."
      />
      <SectionCard title="Run timeline" description="Ordered events make the agent run explainable.">
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
                <dd className="mono-token mt-1 break-words text-xs">{selectedRun.traceId}</dd>
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

          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="data-card">
                <div className="flex items-start gap-3">
                  <div className="timeline-index mt-1">{event.sequence}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white">{event.eventType}</p>
                      <StatusBadge label={event.severity} tone={event.severity === "error" ? "danger" : event.severity === "warning" ? "warning" : event.severity === "success" ? "success" : "info"} />
                    </div>
                    <p className="muted-copy mt-2 text-sm">{event.message}</p>
                    <p className="subtle-copy mt-2 text-xs">{formatDateTime(event.createdAt)}</p>
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
