import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockWorkflows } from "@/data/mock-workflows";
import { formatDateTime } from "@/lib/format";
import { workflowStatusTone } from "@/lib/status";

export function WorkflowList() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workflow model"
        title="Controlled automation pipelines with visible gates."
        description="Workflow definitions expose status, version, dependencies, and approval checkpoints before simulation is added."
      />
      <SectionCard
        title="Workflow definitions"
        description="Read-only definitions for the current scaffold."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {mockWorkflows.map((workflow) => (
            <article key={workflow.id} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{workflow.name}</p>
                  <p className="muted-copy mt-1 text-sm">{workflow.description}</p>
                </div>
                <StatusBadge label={workflow.status} tone={workflowStatusTone(workflow.status)} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="detail-tile">
                  <p className="meta-label">Version</p>
                  <p className="mt-1 font-semibold text-white">v{workflow.version}</p>
                </div>
                <div className="detail-tile">
                  <p className="meta-label">Steps</p>
                  <p className="mt-1 font-semibold text-white">{workflow.steps.length}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {workflow.steps.map((step) => (
                  <div key={step.id} className="data-card-muted px-3 py-2">
                    <p className="text-sm font-medium text-slate-100">{step.name}</p>
                    <p className="subtle-copy text-xs">{step.type} step - depends on {step.dependsOnStepKeys.length || "none"}</p>
                  </div>
                ))}
              </div>
              <p className="subtle-copy mt-4 text-xs">Updated {formatDateTime(workflow.updatedAt)}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
