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
        description="Implementation caveats live here so operational screens can stay focused."
      />
      <SectionCard
        title="Settings and RBAC"
        description="Role switching is local UI state for portfolio review."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="notice-card notice-card-warning text-sm leading-6">
            Current role: <strong>{selectedRole}</strong>. It affects helper text and local permission labels only.
          </div>
          <div className="notice-card notice-card-neutral text-sm leading-6">
            Local demo boundary: no external requests, auth provider, database, live agents, secrets, deployment, or private data.
          </div>
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {roleDefinitions.map((role) => (
            <article key={role.name} className="data-card">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white">{role.name}</p>
                  <p className="muted-copy mt-1 text-sm">{role.description}</p>
                </div>
                {role.name === selectedRole ? <StatusBadge label="selected" tone="info" /> : null}
              </div>
              <p className="subtle-copy mt-4 text-xs">{role.demoNote}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {role.permissions.map((permission) => (
                  <span key={permission} className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">
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
