"use client";

import { EnvironmentBadge } from "@/components/environment-badge";
import { RoleSwitcher } from "@/components/role-switcher";
import { activeProject } from "@/data/mock-projects";
import { useDemoState } from "@/lib/demo-state";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { isRoleReady, selectedRole } = useDemoState();

  return (
    <header className="topbar-shell z-30 shrink-0 px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onOpenMobileNav}
            className="focus-ring grid size-10 shrink-0 place-items-center rounded-md border border-white/[0.06] bg-white/[0.045] text-slate-300 transition hover:bg-white/[0.07] lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
              <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg">AgentOps Command Center</h1>
              <EnvironmentBadge label={activeProject.environment} />
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              <span className="hidden sm:inline">Workspace: Portfolio Demo</span>
              <span className="sm:hidden">Local demo</span>
              <span className="sr-only sm:hidden">. Current role: {isRoleReady ? selectedRole : "Loading"}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end lg:items-center lg:justify-end">
          <div className="hidden rounded-md border border-white/[0.055] bg-white/[0.026] px-3 py-2 text-xs text-slate-500 md:block">
            <span className="font-semibold text-slate-300">Local Simulation</span>
            <span className="ml-2 text-slate-600">No live integrations</span>
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
