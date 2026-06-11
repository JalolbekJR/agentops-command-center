"use client";

import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge } from "@/components/permission-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAllowedTargets } from "@/data/mock-connectors";
import { mockDeploymentModes, mockSetupHealthChecks, mockSetupSteps } from "@/data/mock-setup";
import { useDemoState } from "@/lib/demo-state";
import { getRouteAccess, canEditWorkspaceSetup } from "@/lib/role-access";
import { getSetupHealthTone, getSetupStepTone, summarizeSetupHealth } from "@/lib/setup-health";

const selectedMode = mockDeploymentModes.find((mode) => mode.mode === "hosted_saas") ?? mockDeploymentModes[0];
const nextStep = mockSetupSteps.find((step) => step.status === "needs_input") ?? mockSetupSteps[0];
const quickSetupFlow = [
  ["1", "Choose hosted SaaS", "Fastest local-demo baseline with owner-controlled defaults."],
  ["2", "Verify safe targets", "Workspace admins connect only allowlisted local/demo targets."],
  ["3", "Connect Website QA", "Teams produce visible evidence before backend execution exists."]
] as const;

export function SetupWizard() {
  const { selectedRole } = useDemoState();
  const access = getRouteAccess(selectedRole, "/setup");
  const canEdit = canEditWorkspaceSetup(selectedRole);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Setup"
        title="Three steps to a safe workspace."
        description="Choose the deployment path, verify safe targets, and connect the first evidence-producing agent."
        action={<PermissionBadge level={access.level} />}
      />

      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Owner-controlled setup" tone="warning" />
              <StatusBadge label="Workspace-safe configuration" tone="success" />
              <StatusBadge label="Local demo baseline" tone="neutral" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">Start with safe defaults, then connect agents through workspace controls.</h2>
            <p className="muted-copy mt-3 max-w-3xl text-sm">
              Owner settings and workspace setup stay separate, so teams can prepare targets and connectors without touching platform-global policy.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {quickSetupFlow.map(([step, title, detail]) => (
                <div key={step} className="detail-tile">
                  <div className="timeline-index size-7 text-[0.7rem]">{step}</div>
                  <p className="mt-3 text-sm font-semibold text-white">{title}</p>
                  <p className="muted-copy mt-1 text-sm">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Recommended path</p>
            <p className="mt-2 text-lg font-semibold text-white">{selectedMode.label}</p>
            <p className="muted-copy mt-2 text-sm">Best for small teams that want fast setup, safe defaults, and no private worker complexity.</p>
            <ActionButton disabled={!canEdit} variant="primary" className="mt-4 w-full">
              Continue setup
            </ActionButton>
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {mockDeploymentModes.map((mode) => {
          const isSelected = mode.mode === selectedMode.mode;

          return (
            <article key={mode.mode} className={["data-card", isSelected ? "border-white/[0.18] bg-white/[0.045]" : ""].join(" ")}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{mode.label}</p>
                  <p className="muted-copy mt-2 text-sm">{mode.bestFor}</p>
                </div>
                <StatusBadge label={isSelected ? "selected" : "available"} tone={isSelected ? "success" : "info"} />
              </div>

              <div className="mt-4 grid gap-3">
                <div className="detail-tile">
                  <p className="meta-label">Owner controls</p>
                  <p className="muted-copy mt-2 text-sm">{mode.ownerControls.slice(0, 3).join(", ")}</p>
                </div>
                <div className="detail-tile">
                  <p className="meta-label">Workspace setup</p>
                  <p className="muted-copy mt-2 text-sm">{mode.customerControls.slice(0, 3).join(", ")}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge label={mode.mode === "self_hosted_enterprise" ? "enterprise" : mode.mode === "local_developer" ? "demo safe" : "recommended path"} tone={isSelected ? "success" : "neutral"} />
                <StatusBadge label={mode.mode === "self_hosted_enterprise" ? "high effort" : mode.mode === "hosted_saas" ? "low effort" : "developer"} tone="info" />
              </div>
            </article>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard
          title="Setup checklist"
          description={`Next step: ${nextStep.title}. ${summarizeSetupHealth(mockSetupHealthChecks)}`}
          action={<ActionButton disabled={!canEdit || nextStep.status === "future_backend"}>Next step</ActionButton>}
        >
          <div className="space-y-3">
            {mockSetupSteps.map((step) => {
              const isNext = step.id === nextStep.id;

              return (
                <article key={step.id} className={["data-card-muted p-4", isNext ? "border-white/[0.16] bg-white/[0.04]" : ""].join(" ")}>
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
                      <div className="mt-3 flex flex-wrap gap-2">
                        <StatusBadge label={step.ownerLevel.replaceAll("_", " ")} tone={step.ownerLevel === "platform_owner" ? "warning" : "info"} />
                        <StatusBadge label={step.requiredPlan.replaceAll("_", " ")} tone="neutral" />
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Health and boundaries" description="One control lane for platform owner; one for customer workspace setup.">
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
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Safe targets" description="The setup flow only offers allowlisted local or reserved demo targets.">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {mockAllowedTargets.map((target) => (
            <article key={target.id} className="data-card-muted p-4">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-semibold text-white">{target.label}</p>
                <StatusBadge label={target.requiresApproval ? "approval" : "allowed"} tone={target.requiresApproval ? "warning" : "success"} />
              </div>
              <p className="mono-token mt-3 break-words text-xs">{target.targetPattern}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
