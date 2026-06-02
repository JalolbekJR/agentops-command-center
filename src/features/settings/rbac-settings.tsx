"use client";

import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { roleDefinitions } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";

export function RbacSettings() {
  const { selectedRole } = useDemoState();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Settings"
        title="Demo boundary and RBAC model."
        description="This page keeps implementation caveats out of the operational screens."
      />
      <SectionCard
        title="Settings and RBAC"
        description="Role switching is local UI state for portfolio review."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
            Current role: <strong>{selectedRole}</strong>. It affects helper text and local permission labels only.
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-sm leading-6 text-slate-300">
            Local demo boundary: no external requests, auth provider, database, live agents, secrets, deployment, or private data.
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {roleDefinitions.map((role) => (
            <article key={role.name} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{role.name}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{role.description}</p>
                </div>
                {role.name === selectedRole ? <StatusBadge label="selected" tone="info" /> : null}
              </div>
              <p className="mt-4 text-xs text-slate-500">{role.demoNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span key={permission} className="rounded-md border border-white/10 bg-slate-950/60 px-2 py-1 font-mono text-[11px] text-slate-300">
                    {permission}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
