"use client";

import { RoleSwitcher } from "@/components/role-switcher";
import { ViewPreferenceControls } from "@/components/view-preference-controls";
import { useDemoState } from "@/lib/demo-state";

export function Topbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const { isRoleReady, selectedRole } = useDemoState();

  return (
    <header className="topbar-shell z-30 shrink-0 px-4 py-2 sm:px-6 lg:px-8 xl:px-10">
      <div className="grid gap-2 lg:grid-cols-[minmax(15rem,1fr)_auto_minmax(23rem,auto)] lg:items-center">
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
            <div className="flex items-center gap-2">
              <h1 className="truncate text-base font-semibold text-slate-50 sm:text-lg">AgentOps Command Center</h1>
            </div>
            <p className="mt-0.5 text-xs text-slate-500">
              <span className="hidden sm:inline">Portfolio workspace</span>
              <span className="sm:hidden">Portfolio</span>
              <span className="sr-only sm:hidden">. Current role: {isRoleReady ? selectedRole : "Loading"}</span>
            </p>
          </div>
        </div>
        <div className="environment-pill hidden justify-self-center md:inline-flex">
          Local simulation
        </div>
        <div className="topbar-utilities grid min-w-0 gap-2 sm:grid-cols-[minmax(12rem,16rem)_auto] sm:items-end lg:items-center lg:justify-end">
          <RoleSwitcher />
          <ViewPreferenceControls />
        </div>
      </div>
    </header>
  );
}
