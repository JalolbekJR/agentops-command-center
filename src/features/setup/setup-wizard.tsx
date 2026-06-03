import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAllowedTargets } from "@/data/mock-connectors";
import { mockDeploymentModes, mockSetupHealthChecks, mockSetupSteps } from "@/data/mock-setup";
import { getSetupHealthTone, getSetupStepTone, summarizeSetupHealth } from "@/lib/setup-health";

export function SetupWizard() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup foundation"
        title="Configure the path from safe demo to real agent operations."
        description="This setup model separates owner controls from customer workspace setup while keeping the current app deterministic and local."
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {mockDeploymentModes.map((mode) => (
          <article key={mode.mode} className="data-card">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">{mode.label}</p>
                <p className="muted-copy mt-2 text-sm">{mode.bestFor}</p>
              </div>
              <StatusBadge label={mode.mode === "hosted_saas" ? "recommended" : "mode"} tone={mode.mode === "hosted_saas" ? "success" : "info"} />
            </div>
            <div className="mt-4 space-y-3">
              <div className="data-card-muted p-3">
                <p className="meta-label">Owner controls</p>
                <p className="muted-copy mt-2 text-sm">{mode.ownerControls.join(", ")}</p>
              </div>
              <div className="data-card-muted p-3">
                <p className="meta-label">Workspace controls</p>
                <p className="muted-copy mt-2 text-sm">{mode.customerControls.join(", ")}</p>
              </div>
            </div>
            <p className="subtle-copy mt-4 text-xs">{mode.protectionNotes[0]}</p>
          </article>
        ))}
      </div>

      <SectionCard title="Setup wizard" description="The steps are modeled locally now; backend enforcement and worker checks come later.">
        <div className="grid gap-3 lg:grid-cols-2">
          {mockSetupSteps.map((step) => (
            <article key={step.id} className="data-card">
              <div className="flex items-start gap-3">
                <div className="timeline-index">{step.sequence}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{step.title}</p>
                      <p className="muted-copy mt-1 text-sm">{step.summary}</p>
                    </div>
                    <StatusBadge label={step.status} tone={getSetupStepTone(step.status)} />
                  </div>
                  <p className="subtle-copy mt-3 text-xs">Owner level: {step.ownerLevel.replaceAll("_", " ")}. Required plan: {step.requiredPlan.replaceAll("_", " ")}.</p>
                  <p className="data-card-muted mt-3 p-3 text-xs leading-5 text-slate-400">{step.securityNotes[0]}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <SectionCard title="Setup health" description={summarizeSetupHealth(mockSetupHealthChecks)}>
          <div className="space-y-3">
            {mockSetupHealthChecks.map((check) => (
              <div key={check.id} className="data-card-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{check.label}</p>
                    <p className="muted-copy mt-1 text-sm">{check.summary}</p>
                  </div>
                  <StatusBadge label={check.status} tone={getSetupHealthTone(check.status)} />
                </div>
                <p className="subtle-copy mt-3 text-xs">{check.remediation}</p>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Allowed targets" description="Public demo targets are local or reserved demo patterns only.">
          <div className="grid gap-3 sm:grid-cols-2">
            {mockAllowedTargets.map((target) => (
              <article key={target.id} className="data-card-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{target.label}</p>
                  <StatusBadge label={target.requiresApproval ? "approval" : "allowed"} tone={target.requiresApproval ? "warning" : "success"} />
                </div>
                <p className="mono-token mt-3 break-words text-xs">{target.targetPattern}</p>
                <p className="muted-copy mt-3 text-sm">{target.notes}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
