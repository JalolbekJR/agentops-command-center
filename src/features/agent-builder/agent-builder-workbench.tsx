import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAgentBuilderReview, mockAgentBuilderSteps, mockAgentBuilderTemplates } from "@/data/mock-agent-builder";
import { mockAllowedTargets } from "@/data/mock-connectors";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { getRecommendedBuilderTemplate, getTemplateAvailabilityLabel, isAgentTemplateAvailableForPlan } from "@/lib/agent-builder";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "free_demo") ?? mockWorkspacePlans[0];
const recommendedTemplate = getRecommendedBuilderTemplate(mockAgentBuilderTemplates);

export function AgentBuilderWorkbench() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agent Builder"
        title="Create an agent setup plan without unsafe execution."
        description="This studio models template choice, connection method, capabilities, targets, approvals, privacy, usage limits, workflow outline, and future safe test steps."
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionCard title="Template selection" description="Website QA is the recommended first path for a real demo later.">
          <div className="space-y-3">
            {mockAgentBuilderTemplates.map((template) => {
              const available = isAgentTemplateAvailableForPlan(template, currentPlan);

              return (
                <article key={template.id} className={["data-card-muted p-4", template.id === recommendedTemplate.id ? "border-white/[0.14]" : ""].join(" ")}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{template.name}</p>
                      <p className="muted-copy mt-1 text-sm">{template.summary}</p>
                    </div>
                    <StatusBadge label={getTemplateAvailabilityLabel(template, currentPlan)} tone={available ? "success" : "warning"} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">{template.connectorType}</span>
                    <span className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">{template.planRequired}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </SectionCard>

        <SectionCard title="Builder steps" description="Local UI foundation only; backend generation and safe test execution come later.">
          <div className="space-y-3">
            {mockAgentBuilderSteps.map((step, index) => (
              <article key={step.id} className="data-card-muted p-4">
                <div className="flex items-start gap-3">
                  <div className="timeline-index">{index + 1}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                        <p className="muted-copy mt-1 text-sm">{step.summary}</p>
                      </div>
                      <StatusBadge label={step.status} tone={step.status === "complete" ? "success" : step.status === "current" ? "warning" : "info"} />
                    </div>
                    <p className="subtle-copy mt-2 text-xs">Selected: {step.selectedLabel}</p>
                    <p className="data-card-muted mt-3 p-3 text-xs leading-5 text-slate-400">{step.securityNote}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard title="Allowed targets" description="Builder targets stay local/demo safe in this phase.">
          <div className="grid gap-3 sm:grid-cols-2">
            {mockAllowedTargets.slice(0, 3).map((target) => (
              <article key={target.id} className="data-card-muted p-4">
                <p className="text-sm font-semibold text-white">{target.label}</p>
                <p className="mono-token mt-2 break-words text-xs">{target.targetPattern}</p>
                <p className="subtle-copy mt-3 text-xs">{target.notes}</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Review summary" description="The generated outline maps directly into future Workflow and WorkflowRun entities.">
          <div className="space-y-3">
            <div className="data-card-muted p-4">
              <p className="meta-label">Connection</p>
              <p className="mt-2 text-sm font-semibold text-white">{mockAgentBuilderReview.connectionMethod.replaceAll("_", " ")}</p>
              <p className="subtle-copy mt-2 text-xs">Privacy mode: {mockAgentBuilderReview.privacyMode.replaceAll("_", " ")}</p>
            </div>
            <div className="data-card-muted p-4">
              <p className="meta-label">Generated workflow outline</p>
              <div className="mt-3 space-y-2">
                {mockAgentBuilderReview.generatedWorkflowOutline.map((step) => (
                  <p key={step} className="text-sm text-slate-300">{step}</p>
                ))}
              </div>
            </div>
            <p className="data-card-muted p-3 text-xs leading-5 text-slate-400">{mockAgentBuilderReview.futureSafeTestSummary}</p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
