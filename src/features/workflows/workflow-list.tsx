import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockWorkflows } from "@/data/mock-workflows";
import { formatDateTime } from "@/lib/format";
import { workflowStatusTone } from "@/lib/status";

export function WorkflowList() {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Workflow builder model"
        description="Phase 2 keeps workflows read-only and structured. Future phases can add visual editing, graph validation, and simulation."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {mockWorkflows.map((workflow) => (
            <article key={workflow.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{workflow.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{workflow.description}</p>
                </div>
                <StatusBadge label={workflow.status} tone={workflowStatusTone(workflow.status)} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-xs uppercase text-slate-500">Version</p>
                  <p className="mt-1 font-semibold text-white">v{workflow.version}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-950/50 p-3">
                  <p className="text-xs uppercase text-slate-500">Steps</p>
                  <p className="mt-1 font-semibold text-white">{workflow.steps.length}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                {workflow.steps.map((step) => (
                  <div key={step.id} className="rounded-md border border-white/10 bg-slate-950/40 px-3 py-2">
                    <p className="text-sm font-medium text-slate-100">{step.name}</p>
                    <p className="text-xs text-slate-500">{step.type} step - depends on {step.dependsOnStepKeys.length || "none"}</p>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-slate-500">Updated {formatDateTime(workflow.updatedAt)}</p>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
