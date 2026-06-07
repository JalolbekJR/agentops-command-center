"use client";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { useDemoState } from "@/lib/demo-state";
import { getRoleAccessSummary } from "@/lib/role-access";
import { roleDefinitions } from "@/lib/rbac";
import type { RoleName } from "@/types/rbac";

const roleBoundaries: Record<RoleName, { can: string; cannot: string }> = {
  "Founder/Admin": {
    can: "Inspect every local product area, owner setting, plan, approval, risk, and audit surface.",
    cannot: "Bypass the demo boundary: no live agents, external services, database writes, or secrets exist in this client model."
  },
  "AI Engineer": {
    can: "Build workspace-level drafts, configure connectors, inspect runs, and use the Agent Builder.",
    cannot: "Manage owner-only policy, approve high-risk security decisions, or access global ownership controls."
  },
  "QA Reviewer": {
    can: "Review Browser QA, runs, evaluations, release evidence, and safe marketplace previews.",
    cannot: "Configure setup, connectors, owner policy, or create live agent execution."
  },
  "Security Reviewer": {
    can: "Review risks, approvals, audit records, connector summaries, and security-sensitive evidence.",
    cannot: "Manage Owner Control or configure the Agent Builder workflow."
  },
  "Product Manager": {
    can: "Review plans, packaged modules, outcomes, evaluation quality, and product-facing readiness.",
    cannot: "Configure technical connectors, owner policy, or live execution settings."
  },
  Viewer: {
    can: "Browse redacted product context, plans, safe summaries, and demo boundary details.",
    cannot: "Create drafts, configure platform settings, approve work, or access owner controls."
  }
};

const demoBoundaryItems = ["No external requests", "No auth provider", "No database", "No live agents", "No secrets"];

export function RbacSettings() {
  const { selectedRole } = useDemoState();
  const selectedBoundary = roleBoundaries[selectedRole];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Demo boundary and RBAC model."
        description="A concise view of local role behavior, demo limits, and the backend policy shape this portfolio app is ready to enforce later."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <SectionCard title="Current role" description={getRoleAccessSummary(selectedRole)}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="meta-label">Role view</p>
              <h2 className="mt-2 text-xl font-semibold text-white">{selectedRole}</h2>
            </div>
            <StatusBadge label="Local UI state" tone="info" />
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <div className="data-card-muted p-4">
              <p className="meta-label">Can do</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedBoundary.can}</p>
            </div>
            <div className="data-card-muted p-4">
              <p className="meta-label">Cannot do</p>
              <p className="mt-2 text-sm leading-6 text-slate-300">{selectedBoundary.cannot}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Demo boundary" description="These constraints are intentional for a safe local portfolio showcase.">
          <div className="grid gap-2">
            {demoBoundaryItems.map((item) => (
              <div key={item} className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.03] px-3 py-2">
                <span className="text-sm font-semibold text-slate-200">{item}</span>
                <StatusBadge label="off" tone="neutral" />
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Role model" description="Permission details stay available without overwhelming the first view.">
        <div className="grid gap-4 lg:grid-cols-2">
          {roleDefinitions.map((role) => (
            <article key={role.name} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{role.name}</p>
                  <p className="muted-copy mt-2 text-sm">{role.description}</p>
                </div>
                {role.name === selectedRole ? <StatusBadge label="selected" tone="info" /> : null}
              </div>
              <p className="subtle-copy mt-4 text-xs">{role.demoNote}</p>
              <details className="settings-disclosure mt-4">
                <summary className="focus-ring cursor-pointer rounded-md border border-white/[0.07] bg-white/[0.035] px-3 py-2 text-sm font-semibold text-slate-200">
                  View permissions
                </summary>
                <div className="mt-3 flex flex-wrap gap-2">
                  {role.permissions.map((permission) => (
                    <span key={permission} className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">
                      {permission}
                    </span>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>
      </SectionCard>

      <div className="notice-card notice-card-neutral">
        <p className="text-sm font-semibold text-slate-100">Backend readiness note</p>
        <p className="muted-copy mt-2 text-sm">
          This phase models route, navigation, feature, and action permissions in client-side TypeScript only. A production backend must enforce the same policy before returning data or accepting actions.
        </p>
      </div>
    </div>
  );
}
