"use client";

import { EnvironmentBadge } from "@/components/environment-badge";
import { RoleSwitcher } from "@/components/role-switcher";
import { activeProject } from "@/data/mock-projects";
import { useDemoState } from "@/lib/demo-state";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { roleNote, selectedRole } = useDemoState();

  return (
    <header className="topbar-shell z-30 shrink-0 px-4 py-3 sm:px-6 lg:px-8 xl:px-10">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
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
              <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg">{activeProject.name}</h1>
              <EnvironmentBadge label={activeProject.environment} />
            </div>
            <p className="mt-1 text-xs text-slate-500 sm:hidden">
              Role: <span className="font-semibold text-slate-300">{selectedRole}</span>
            </p>
            <p className="mt-1 hidden max-w-3xl truncate text-xs text-slate-500 sm:block sm:text-sm">
              {selectedRole}: {roleNote}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end xl:items-center xl:justify-end">
          <div className="hidden rounded-md border border-white/[0.055] bg-white/[0.026] px-3 py-2 text-xs text-slate-500 md:block">
            Local demo. No live integrations.
          </div>
          <RoleSwitcher />
        </div>
      </div>
    </header>
  );
}
