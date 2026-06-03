import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockOwnerControlActions, mockOwnerControlSettings, mockPlatformLicenseRules } from "@/data/mock-owner-control";
import { getOwnerControlTone, isWorkspaceLevelAction, summarizeOwnerControls } from "@/lib/owner-control";

export function OwnerControlPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Owner control"
        title="Platform-global controls stay separate from customer setup."
        description="This page is local demo UI only. Future backend must enforce platform owner authorization server-side."
      />

      <SectionCard
        title="Owner-only controls"
        description={summarizeOwnerControls(mockOwnerControlSettings)}
        action={<StatusBadge label="owner-only" tone="warning" />}
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {mockOwnerControlSettings.map((setting) => (
            <article key={setting.id} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{setting.label}</p>
                  <p className="subtle-copy mt-1 text-xs">{setting.category.replaceAll("_", " ")}</p>
                </div>
                <StatusBadge label={setting.status} tone={getOwnerControlTone(setting)} />
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{setting.valueLabel}</p>
              <p className="muted-copy mt-2 text-sm">{setting.summary}</p>
              <p className="data-card-muted mt-4 p-3 text-xs leading-5 text-slate-400">{setting.customerImpact}</p>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard title="License and plan rules" description="Conceptual only; no billing or license enforcement is implemented.">
          <div className="space-y-3">
            {mockPlatformLicenseRules.map((rule) => (
              <article key={rule.id} className="data-card-muted p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">{rule.ruleLabel}</p>
                    <p className="muted-copy mt-1 text-sm">{rule.summary}</p>
                  </div>
                  <StatusBadge label={rule.enforcedBy} tone={rule.enforcedBy === "local_demo_note" ? "info" : "warning"} />
                </div>
                <p className="subtle-copy mt-3 text-xs">Plan: {rule.planId.replaceAll("_", " ")}. Mode: {rule.deploymentMode.replaceAll("_", " ")}.</p>
              </article>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Action boundary" description="Customers configure workspaces; platform owner controls global product rules.">
          <div className="space-y-3">
            {mockOwnerControlActions.map((action) => (
              <article key={action.id} className="data-card-muted p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <StatusBadge label={isWorkspaceLevelAction(action) ? "workspace" : "owner"} tone={isWorkspaceLevelAction(action) ? "success" : "warning"} />
                </div>
                <p className="subtle-copy mt-2 text-xs">Audit required: {action.auditRequired ? "yes" : "no"}</p>
              </article>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
