import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockBrowserSessions } from "@/data/mock-browser-sessions";
import { formatDateTime } from "@/lib/format";

export function BrowserSessionViewer() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Browser QA"
        title="Review browser evidence tied to workflow runs."
        description="Sessions capture route checks, assertions, issue counts, and accessibility notes for future visual evidence."
      />
      <SectionCard
        title="Session records"
        description="Deterministic QA evidence for the scaffold."
      >
        <div className="space-y-4">
          {mockBrowserSessions.map((session) => (
            <article key={session.id} className="data-card">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{session.id}</p>
                  <p className="muted-copy mt-1 text-sm">{session.summary}</p>
                  <p className="subtle-copy mt-2 text-xs">
                    {session.browserName} at {session.viewport}. Started {formatDateTime(session.startedAt)}.
                  </p>
                </div>
                <StatusBadge label={session.status} tone={session.status === "passed" ? "success" : session.status === "failed" ? "danger" : "warning"} />
              </div>
              <div className="mt-4 grid gap-3 lg:grid-cols-2">
                {session.steps.map((step) => (
                  <div key={step.id} className="data-card-muted p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm font-semibold text-white">Step {step.sequence}: {step.action}</p>
                      <StatusBadge label={step.status} tone={step.status === "passed" ? "success" : step.status === "failed" ? "danger" : "warning"} />
                    </div>
                    <p className="muted-copy mt-3 text-sm">{step.expectedResult}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{step.observedResult}</p>
                    <p className="subtle-copy mt-3 text-xs">
                      Screenshot: {step.screenshotRef}. Console: {step.consoleIssueCount}. Network: {step.networkIssueCount}.
                    </p>
                    <p className="subtle-copy mt-2 text-xs">{step.accessibilityNote}</p>
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
