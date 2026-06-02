"use client";

import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { roleDefinitions } from "@/lib/rbac";
import { useDemoState } from "@/lib/demo-state";

export function RbacSettings() {
  const { selectedRole } = useDemoState();

  return (
    <div className="space-y-6">
      <SectionCard
        title="Settings and RBAC"
        description="The role switcher is a local demo control. Phase 7 must replace this with real authentication and server-side authorization."
      >
        <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 p-4 text-sm leading-6 text-amber-100">
          Current demo role: <strong>{selectedRole}</strong>. This affects helper text and local permission labels only; it is not auth.
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
