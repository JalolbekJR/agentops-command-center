"use client";

import { EnvironmentBadge } from "@/components/environment-badge";
import { RoleSwitcher } from "@/components/role-switcher";
import { activeProject } from "@/data/mock-projects";
import { useDemoState } from "@/lib/demo-state";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { roleNote, selectedRole } = useDemoState();

  return (
    <header className="z-30 shrink-0 border-b border-white/10 bg-slate-950/90 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open navigation menu"
            onClick={onOpenMobileNav}
            className="grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300 lg:hidden"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
              <path d="M4 6h12M4 10h12M4 14h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="truncate text-base font-semibold text-white sm:text-lg">{activeProject.name}</h1>
              <EnvironmentBadge label={activeProject.environment} />
            </div>
            <p className="mt-1 max-w-3xl truncate text-xs text-slate-400 sm:text-sm">
              {selectedRole}: {roleNote}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center xl:justify-end">
          <div className="hidden rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-400 md:block">
            Demo data. No live integrations.
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
