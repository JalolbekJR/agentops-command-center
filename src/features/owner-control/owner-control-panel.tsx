import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge } from "@/components/permission-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockOwnerControlActions, mockOwnerControlSettings, mockPlatformLicenseRules } from "@/data/mock-owner-control";
import { getOwnerControlTone, isWorkspaceLevelAction, summarizeOwnerControls } from "@/lib/owner-control";

const controlCategories = [
  { label: "Global deployment mode", category: "deployment" },
  { label: "Built-in agent publishing", category: "built_in_agents" },
  { label: "Connector templates", category: "connector_templates" },
  { label: "Global security policy", category: "security_policy" },
  { label: "Pricing and plan rules", category: "pricing" },
  { label: "License/self-hosted rules", category: "license" },
  { label: "Private worker templates", category: "worker_templates" },
  { label: "Agent marketplace", category: "marketplace" }
] as const;

export function OwnerControlPanel() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Owner Control"
        title="Platform control plane for global product rules."
        description="Founder/Admin can inspect owner-only deployment, catalog, connector, security, pricing, license, worker, and audit boundaries."
        action={<PermissionBadge level="full" />}
      />

      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="data-card border-white/[0.16] bg-white/[0.04]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Owner boundary</p>
              <p className="muted-copy mt-2 text-sm">{summarizeOwnerControls(mockOwnerControlSettings)} Customers configure workspaces; platform owner controls product-wide policy.</p>
            </div>
            <StatusBadge label="owner-only" tone="warning" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="detail-tile">
              <p className="meta-label">Global mode</p>
              <p className="mt-1 text-sm font-semibold text-white">Local Developer</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Product modules</p>
              <p className="mt-1 text-sm font-semibold text-white">Website QA first</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Policy model</p>
              <p className="mt-1 text-sm font-semibold text-white">Default deny</p>
            </div>
          </div>
        </article>

        <article className="data-card">
          <p className="meta-label">Customer action boundary</p>
          <div className="mt-4 space-y-3">
            {mockOwnerControlActions.map((action) => (
              <div key={action.id} className="data-card-muted flex items-center justify-between gap-3 p-3">
                <div>
                  <p className="text-sm font-semibold text-white">{action.label}</p>
                  <p className="subtle-copy mt-1 text-xs">Audit required: {action.auditRequired ? "yes" : "no"}</p>
                </div>
                <StatusBadge label={isWorkspaceLevelAction(action) ? "workspace" : "owner"} tone={isWorkspaceLevelAction(action) ? "success" : "warning"} />
              </div>
            ))}
          </div>
        </article>
      </div>

      <SectionCard title="Global controls" description="These controls define the product package and future backend enforcement boundary.">
        <div className="grid gap-4 xl:grid-cols-4">
          {controlCategories.map((control) => {
            const setting = mockOwnerControlSettings.find((item) => item.category === control.category);

            return (
              <article key={control.category} className="data-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-white">{control.label}</p>
                    <p className="subtle-copy mt-1 text-xs">{control.category.replaceAll("_", " ")}</p>
                  </div>
                  <StatusBadge label={setting?.status ?? "future"} tone={setting ? getOwnerControlTone(setting) : "neutral"} />
                </div>
                <p className="mt-4 text-lg font-semibold text-white">{setting?.valueLabel ?? "Defined later"}</p>
                <p className="muted-copy mt-2 text-sm">{setting?.summary ?? "Reserved owner-only control for future enterprise packaging."}</p>
                <div className="mt-4">
                  <ActionButton disabled={setting?.status !== "demo_visible"}>{setting?.status === "demo_visible" ? "Inspect policy" : "Backend-enforced later"}</ActionButton>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>

      <SectionCard title="License and plan rules" description="Rules are visible for product clarity, but enforcement belongs to future server-side owner authorization.">
        <div className="grid gap-3 lg:grid-cols-3">
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
    </div>
  );
}
