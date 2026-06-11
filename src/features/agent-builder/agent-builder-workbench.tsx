"use client";

import { useRef, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge } from "@/components/permission-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAgentBuilderReview, mockAgentBuilderTemplates } from "@/data/mock-agent-builder";
import { mockAllowedTargets } from "@/data/mock-connectors";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { nativeProtocolMappings } from "@/lib/agent-protocol";
import { isAgentTemplateAvailableForPlan } from "@/lib/agent-builder";
import { useDemoState } from "@/lib/demo-state";
import { canUseAgentBuilder, canUseAgentTemplate, getRouteAccess } from "@/lib/role-access";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "free_demo") ?? mockWorkspacePlans[0];

const builderSteps = [
  { id: "template", label: "Template" },
  { id: "connection", label: "Connection" },
  { id: "capabilities", label: "Capabilities" },
  { id: "targets", label: "Targets" },
  { id: "approvals", label: "Approvals" },
  { id: "limits", label: "Limits" },
  { id: "workflow", label: "Workflow" },
  { id: "test", label: "Safe test" }
] as const;

const studioFlow = ["Template Library", "Configure", "Safety Gates", "Preview", "Readiness"] as const;

const readinessSignals = [
  ["Template", "Website QA selected"],
  ["Connection", "Built-in connector"],
  ["Capabilities", "Browser evidence"],
  ["Targets", "Allowlisted demo targets"],
  ["Approvals", "Owner gate"],
  ["Preview", "Draft preview"],
  ["Evaluation", "Scorecard attached"],
  ["Audit", "Ledger attached"]
] as const;

const connectionOptions = [
  {
    label: "Built-in AgentOps Agent",
    fit: "Fastest safe demo",
    detail: "Recommended for Website QA evidence and local release-readiness proof.",
    tone: "success" as const
  },
  {
    label: "Native Protocol",
    fit: "Best structured path",
    detail: "Custom agents emit run, tool, risk, evaluation, cost, and audit events.",
    tone: "success" as const
  },
  {
    label: "Private Worker",
    fit: "Enterprise private",
    detail: "Company-controlled execution for sensitive networks and secrets later.",
    tone: "warning" as const
  },
  {
    label: "Webhook / SDK / MCP / Trace Import",
    fit: "Migration paths",
    detail: "Valid future options when external systems need to join the control plane.",
    tone: "neutral" as const
  }
];

const previewArtifacts = ["Route smoke evidence", "Console/network notes", "Risk finding", "Approval checkpoint", "Evaluation scorecard", "Audit event"];

const templateStudioCopy: Record<
  string,
  {
    subtitle: string;
    body: string;
    connection: string;
    plan: string;
    risk: string;
    status: string;
    targetIds: string[];
    workflow: string[];
  }
> = {
  template_website_qa: {
    subtitle: "Recommended first demo agent",
    body: "Checks local routes, responsive states, console signals, and release-readiness evidence.",
    connection: "Built-in AgentOps Agent",
    plan: "Free Demo",
    risk: "Medium",
    status: "Available",
    targetIds: ["target_local_dashboard", "target_demo_domain", "target_staging_release"],
    workflow: ["Select allowlisted route", "Run QA checks", "Capture evidence", "Score release readiness", "Create audit summary"]
  },
  template_native_custom: {
    subtitle: "Best custom path",
    body: "For company agents that can emit structured AgentOps events.",
    connection: "Native Protocol",
    plan: "Pro",
    risk: "Medium",
    status: "Locked in demo",
    targetIds: ["target_local_dashboard", "target_demo_domain", "target_demo_repository"],
    workflow: ["Register agent identity", "Validate event schema", "Ingest run events", "Map tools/artifacts/risks", "Create audit timeline"]
  },
  template_private_worker: {
    subtitle: "Enterprise private execution",
    body: "For sensitive environments that need company-controlled worker execution.",
    connection: "Private Worker",
    plan: "Enterprise/Self-hosted",
    risk: "High",
    status: "Enterprise required",
    targetIds: ["target_staging_release", "target_demo_repository"],
    workflow: ["Register private worker", "Verify worker health", "Execute allowlisted job", "Return redacted evidence", "Record approval/audit event"]
  }
};

function getTemplateCopy(templateId: string) {
  return templateStudioCopy[templateId] ?? templateStudioCopy.template_website_qa;
}

function getTemplateActionState({ available, canUse }: { available: boolean; canUse: boolean }) {
  if (!available) {
    return { disabled: true, label: "Upgrade required", variant: "secondary" as const };
  }

  if (!canUse) {
    return { disabled: true, label: "Role locked", variant: "secondary" as const };
  }

  return { disabled: false, label: "Use this template", variant: "primary" as const };
}

export function AgentBuilderWorkbench() {
  const { selectedRole, uiMode } = useDemoState();
  const access = getRouteAccess(selectedRole, "/agent-builder");
  const canEdit = canUseAgentBuilder(selectedRole);
  const configSectionRef = useRef<HTMLElement>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState("template_website_qa");
  const [activeStepId, setActiveStepId] = useState<(typeof builderSteps)[number]["id"]>("template");
  const [draftTemplateId, setDraftTemplateId] = useState<string | null>(null);
  const selectedTemplate = mockAgentBuilderTemplates.find((template) => template.id === selectedTemplateId) ?? mockAgentBuilderTemplates[0];
  const selectedCopy = getTemplateCopy(selectedTemplate.id);
  const templatePlanAvailable = isAgentTemplateAvailableForPlan(selectedTemplate, currentPlan);
  const templateUsable = canUseAgentTemplate(selectedRole, selectedTemplate, currentPlan);
  const selectedTargets = mockAllowedTargets.filter((target) => selectedCopy.targetIds.includes(target.id));
  const draftCreated = draftTemplateId === selectedTemplate.id;

  function selectTemplate(templateId: string) {
    setSelectedTemplateId(templateId);
    setActiveStepId("template");
    setDraftTemplateId(null);
  }

  function focusConfiguration(templateId: string) {
    setSelectedTemplateId(templateId);
    setActiveStepId("connection");
    setDraftTemplateId(null);
    window.setTimeout(() => {
      configSectionRef.current?.focus({ preventScroll: true });
      configSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }

  function createDraft() {
    if (templateUsable) {
      setDraftTemplateId(selectedTemplate.id);
      setActiveStepId("workflow");
    }
  }

  return (
    <div className="space-y-5 sm:space-y-6">
      <PageHeader
        eyebrow="Agent Builder"
        title="Agent Builder Studio."
        description="Choose a module, set the connection, and prepare a safe draft."
        action={<PermissionBadge level={access.level} />}
      />

      <section className="builder-studio command-panel p-4 sm:p-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(13rem,0.72fr)_minmax(0,1.2fr)_minmax(17rem,0.58fr)]">
          <div className="data-card-muted p-4">
            <p className="meta-label">Selected module</p>
            <h2 className="mt-2 text-lg font-semibold text-[var(--text-strong)]">{selectedTemplate.name}</h2>
            <p className="muted-copy mt-2 text-sm">{selectedCopy.subtitle}</p>
            <div className="mt-4 grid gap-2">
              <div className="detail-tile">
                <p className="meta-label">Safest next step</p>
                <p className="mt-1 text-sm font-semibold text-white">Create local draft</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Approval reason</p>
                <p className="mt-1 text-sm font-semibold text-white">Owner gate before execution</p>
              </div>
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Website QA first" tone="success" />
              <StatusBadge label={canEdit ? "Builder enabled" : "Read-only role"} tone={canEdit ? "success" : "info"} />
              <StatusBadge label={selectedCopy.connection} tone="info" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">
              {uiMode === "simple" ? "Start with Website QA and prepare the next safe step." : "Build the draft through governed studio stages."}
            </h2>
            <p className="muted-copy mt-3 max-w-3xl text-sm">
              {uiMode === "simple"
                ? "Review the recommended module, keep the built-in connector, then create a local draft for owner review."
                : "The studio collects the selected module, connector policy, safety gates, evidence preview, and review readiness before execution exists."}
            </p>
            <div className="builder-flow mt-5" aria-label="Agent builder flow">
              {studioFlow.map((step, index) => (
                <div key={step} className={["builder-flow-step", index === 0 ? "builder-flow-step-active" : ""].join(" ")}>
                  <span className="builder-flow-dot" aria-hidden="true" />
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div className="professional-only mt-5 evidence-strip">
              {readinessSignals.map(([label, detail]) => (
                <div key={label} className="evidence-node">
                  <p className="evidence-node-title">{label}</p>
                  <p className="evidence-node-detail">{detail}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Draft readiness</p>
            <p className="mt-2 text-lg font-semibold text-[var(--text-strong)]">{draftCreated ? "Ready for owner review" : "Template selected, draft not created"}</p>
            <p className="muted-copy mt-2 text-sm">Owner/Admin reviews plan, connector policy, and governance before execution.</p>
            <ActionButton disabled={!templateUsable} onClick={createDraft} variant={templateUsable ? "primary" : "secondary"} className="mt-4 w-full">
              {!templatePlanAvailable ? "Upgrade required" : templateUsable ? "Create local draft" : "Role locked"}
            </ActionButton>
          </div>
        </div>
      </section>

      <section className="section-card py-4 professional-only">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="meta-label">Progress</p>
            <p className="mt-1 text-sm text-slate-400">A compact path from selected module to reviewed draft.</p>
          </div>
          <StatusBadge label={draftCreated ? "Draft ready" : "Draft not created"} tone={draftCreated ? "success" : "neutral"} />
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-8">
          {builderSteps.map((step, index) => (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStepId(step.id)}
              className={["data-card-muted flex min-h-14 w-full items-center gap-3 p-3 text-left transition hover:bg-white/[0.05]", activeStepId === step.id ? "border-white/[0.16] bg-white/[0.06]" : ""].join(" ")}
            >
              <span className="timeline-index size-7 shrink-0 text-[0.68rem]">{index + 1}</span>
              <span className="min-w-0 text-sm font-semibold leading-5 text-slate-200">{step.label}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_25rem]">
        <main className="min-w-0 space-y-5">
          <SectionCard title="Template Library" description="Website QA is the recommended first module because it produces visible, low-risk browser evidence.">
            <div className="grid gap-4 lg:grid-cols-2">
              {mockAgentBuilderTemplates.map((template) => {
                const templateCopy = getTemplateCopy(template.id);
                const isSelected = template.id === selectedTemplateId;
                const available = isAgentTemplateAvailableForPlan(template, currentPlan);
                const roleCanUse = canUseAgentTemplate(selectedRole, template, currentPlan);
                const actionState = getTemplateActionState({ available, canUse: roleCanUse });
                const secondaryDisabled = available && !roleCanUse;
                const secondaryLabel = !available ? "View requirements" : roleCanUse ? "Configure" : "Role locked";

                return (
                  <article key={template.id} className={["data-card-muted flex min-h-[21rem] min-w-0 flex-col p-4", isSelected ? "border-white/[0.18] bg-white/[0.055]" : ""].join(" ")}>
                    <div className="flex min-w-0 items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-semibold leading-6 text-[var(--text-strong)]">{template.name}</p>
                        <p className="mt-1 text-sm font-medium text-slate-300">{templateCopy.subtitle}</p>
                      </div>
                      {isSelected ? <StatusBadge label="selected" tone="info" /> : null}
                    </div>

                  <p className="muted-copy mt-4 text-sm leading-6">{templateCopy.body}</p>

                    <div className="professional-only mt-4 grid gap-2">
                      {[
                        ["Connection", templateCopy.connection],
                        ["Plan", templateCopy.plan],
                        ["Risk", templateCopy.risk],
                        ["Status", available ? templateCopy.status : "Upgrade required"]
                      ].map(([label, value]) => (
                        <div key={label} className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-white/[0.055] bg-white/[0.025] px-3 py-2">
                          <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">{label}</span>
                          <span className="min-w-0 text-right text-sm font-semibold text-slate-200">{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
                      <ActionButton disabled={actionState.disabled} onClick={() => selectTemplate(template.id)} variant={actionState.variant} className="w-full">
                        {actionState.label}
                      </ActionButton>
                      <ActionButton disabled={secondaryDisabled} onClick={() => focusConfiguration(template.id)} variant="secondary" className="w-full">
                        {secondaryLabel}
                      </ActionButton>
                    </div>
                  </article>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Connection Method" description="Native Protocol is the preferred structured format; built-in agents are the fastest safe demo path.">
            <div className="decision-matrix">
              {connectionOptions.map((option) => (
                <article key={option.label} className={["decision-tile", option.label === selectedCopy.connection ? "decision-tile-featured" : ""].join(" ")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{option.label}</p>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{option.fit}</p>
                    </div>
                    <StatusBadge label={option.label === selectedCopy.connection ? "Selected" : "Option"} tone={option.tone} />
                  </div>
                  <p className="muted-copy mt-3 text-sm">{option.detail}</p>
                </article>
              ))}
            </div>
          </SectionCard>

          <section ref={configSectionRef} tabIndex={-1} className="focus:outline-none">
          <SectionCard title="Safety Gates & Draft Review" description="Review target boundaries, approval gates, usage limits, and evidence before creating the draft.">
              <div className="grid gap-4 xl:grid-cols-2">
                <article className="data-card-muted p-4">
                  <p className="meta-label">Selected template</p>
                  <h2 className="mt-2 text-lg font-semibold text-white">{selectedTemplate.name}</h2>
                  <p className="muted-copy mt-2 text-sm">{selectedCopy.subtitle}</p>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2">
                    <div className="detail-tile">
                      <p className="meta-label">Connection</p>
                      <p className="mt-1 text-sm font-semibold text-white">{selectedCopy.connection}</p>
                    </div>
                    <div className="detail-tile">
                      <p className="meta-label">Plan</p>
                      <p className="mt-1 text-sm font-semibold text-white">{selectedCopy.plan}</p>
                    </div>
                  </div>
                </article>

                <article className="data-card-muted p-4">
                  <p className="meta-label">Capabilities</p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    {["Run events", "Artifacts", "Risk findings", "Evaluations"].map((capability) => (
                      <div key={capability} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                        {capability}
                      </div>
                    ))}
                  </div>
                </article>

                <article className="data-card-muted p-4">
                  <p className="meta-label">Safe targets</p>
                  <div className="mt-3 space-y-2">
                    {selectedTargets.map((target) => (
                      <div key={target.id} className="rounded-md border border-white/[0.06] bg-white/[0.03] p-3">
                        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-white">{target.label}</p>
                            <p className="mono-token mt-1 break-words text-xs">{target.targetPattern}</p>
                          </div>
                          <StatusBadge label={target.requiresApproval ? "Approval" : "Allowed"} tone={target.requiresApproval ? "warning" : "success"} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="data-card-muted p-4">
                  <p className="meta-label">Approval gates and limits</p>
                  <div className="mt-3 space-y-2">
                    {mockAgentBuilderReview.approvalGates.map((gate) => (
                      <div key={gate} className="rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                        {gate}
                      </div>
                    ))}
                  </div>
                  <p className="muted-copy mt-4 text-sm">Plan limit: {mockAgentBuilderReview.usageLimitLabel}</p>
                </article>
              </div>
            </SectionCard>
          </section>
        </main>

        <aside className="section-card h-fit 2xl:sticky 2xl:top-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="meta-label">Live preview</p>
              <h2 className="mt-2 text-lg font-semibold text-white">{selectedTemplate.name}</h2>
              <p className="muted-copy mt-1 text-sm">{selectedCopy.connection}</p>
            </div>
            <StatusBadge label={templateUsable ? "Ready" : "Locked"} tone={templateUsable ? "success" : "warning"} />
          </div>

          <div className="mt-5 space-y-4">
            <div className="data-card-muted p-4">
              <p className="meta-label">Workflow preview</p>
              <div className="mt-3 space-y-3">
                {selectedCopy.workflow.map((step, index) => (
                  <div key={step} className="flex gap-3 text-sm text-slate-300">
                    <span className="timeline-index size-6 shrink-0 text-[0.65rem]">{index + 1}</span>
                    <span className="leading-5">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-1">
              <div className="detail-tile">
                <p className="meta-label">Targets</p>
                <p className="mt-1 text-sm font-semibold text-white">{selectedTargets.length} allowlisted</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Draft status</p>
                <p className="mt-1 text-sm font-semibold text-white">{draftCreated ? "Local draft ready" : "Not created"}</p>
              </div>
            </div>

            <div className="data-card-muted p-4">
              <p className="meta-label">Native Protocol sample</p>
              <div className="mt-3 space-y-2">
                {nativeProtocolMappings.slice(0, 3).map((mapping) => (
                  <div key={mapping.eventCategory} className="mono-token rounded-md bg-white/[0.035] px-3 py-2 text-xs">
                    {mapping.eventCategory}
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card-muted p-4">
              <p className="meta-label">Evidence artifacts</p>
              <div className="mt-3 grid gap-2">
                {previewArtifacts.map((artifact) => (
                  <div key={artifact} className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                    <span className="text-sm font-semibold text-slate-200">{artifact}</span>
                    <StatusBadge label="Preview" tone="info" />
                  </div>
                ))}
              </div>
            </div>

            <div className="data-card-muted p-4">
              <p className="meta-label">Approval and plan summary</p>
              <p className="muted-copy mt-2 text-sm">Gate: {mockAgentBuilderReview.approvalGates[0]}</p>
              <p className="muted-copy mt-1 text-sm">Limit: {mockAgentBuilderReview.usageLimitLabel}</p>
              <p className="muted-copy mt-1 text-sm">Safe test: queued for a later worker phase.</p>
            </div>

            <div className="data-card-muted p-4">
              <p className="meta-label">Draft summary</p>
              <p className="mt-2 text-sm font-semibold text-white">{draftCreated ? `${selectedTemplate.name} draft prepared` : "No draft created yet"}</p>
              <p className="muted-copy mt-2 text-sm">Draft state stays in this browser for the portfolio workspace.</p>
            </div>

            <ActionButton disabled={!templateUsable} onClick={createDraft} variant={templateUsable ? "primary" : "secondary"} className="w-full">
              {!templatePlanAvailable ? "Upgrade required" : templateUsable ? "Create local draft" : "Role locked"}
            </ActionButton>
          </div>
        </aside>
      </div>
    </div>
  );
}
