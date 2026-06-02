"use client";

import { EnvironmentBadge } from "@/components/environment-badge";
import { RoleSwitcher } from "@/components/role-switcher";
import { activeProject } from "@/data/mock-projects";
import { useDemoState } from "@/lib/demo-state";

export function Topbar() {
  const { roleNote, selectedRole } = useDemoState();

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 px-4 py-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-lg font-semibold text-white">{activeProject.name}</h1>
            <EnvironmentBadge label={activeProject.environment} />
          </div>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            {selectedRole} view: {roleNote}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg border border-amber-300/20 bg-amber-300/10 px-3 py-2 text-xs text-amber-100">
            Demo RBAC labels only. Future backend must enforce permissions server-side.
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
