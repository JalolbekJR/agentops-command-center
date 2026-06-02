import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockBrowserSessions } from "@/data/mock-browser-sessions";
import { formatDateTime } from "@/lib/format";

export function BrowserSessionViewer() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Browser QA sessions"
        description="These are deterministic records, not live browser automation. Phase 3 can run browser QA after dependencies and app runtime are ready."
      >
        <div className="space-y-4">
          {mockBrowserSessions.map((session) => (
            <article key={session.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">{session.id}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{session.summary}</p>
                  <p className="mt-2 text-xs text-slate-500">
                    {session.browserName} at {session.viewport}. Started {formatDateTime(session.startedAt)}.
                  </p>
                </div>
                <StatusBadge label={session.status} tone={session.status === "passed" ? "success" : session.status === "failed" ? "danger" : "warning"} />
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {session.steps.map((step) => (
                  <div key={step.id} className="rounded-lg border border-white/10 bg-slate-950/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-white">Step {step.sequence}: {step.action}</p>
                      <StatusBadge label={step.status} tone={step.status === "passed" ? "success" : step.status === "failed" ? "danger" : "warning"} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-400">{step.expectedResult}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.observedResult}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Screenshot: {step.screenshotRef}. Console: {step.consoleIssueCount}. Network: {step.networkIssueCount}.
                    </p>
                    <p className="mt-2 text-xs text-slate-500">{step.accessibilityNote}</p>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
