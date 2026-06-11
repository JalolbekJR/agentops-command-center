"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDemoState } from "@/lib/demo-state";
import { getNavigationGroups } from "@/lib/navigation-policy";

function NavLinks({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const pathname = usePathname();
  const { isRoleReady, selectedRole } = useDemoState();

  if (!isRoleReady) {
    return (
      <nav className="space-y-2 px-1" aria-label="Primary navigation">
        <div className="rounded-md border border-white/[0.05] bg-white/[0.025] px-3 py-2 text-xs text-slate-500">
          Loading role navigation...
        </div>
      </nav>
    );
  }

  const navGroups = getNavigationGroups(selectedRole);

  return (
    <nav className={["space-y-5 px-1", collapsed ? "sidebar-rail-nav" : ""].join(" ")} aria-label="Primary navigation">
      {navGroups.map((group) => (
        <div key={group.label} className="space-y-1">
          <p className={["px-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-600", collapsed ? "sr-only" : ""].join(" ")}>{group.label}</p>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

              if (item.state === "locked") {
                return (
                  <div
                    key={item.href}
                    title={item.reason}
                    aria-label={`${item.label}. ${item.reason}`}
                    aria-disabled="true"
                    className={[
                      "nav-link nav-link-locked",
                      collapsed ? "nav-link-collapsed" : "",
                      isActive ? "nav-link-active" : ""
                    ].join(" ")}
                  >
                    <span className="nav-initial">{item.code}</span>
                    <span className={["nav-label min-w-0 truncate", collapsed ? "sr-only" : ""].join(" ")}>{item.label}</span>
                    <span className={["nav-lock-pill", collapsed ? "hidden" : ""].join(" ")}>Locked</span>
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  aria-label={item.label}
                  title={collapsed ? item.label : undefined}
                  className={[
                    "nav-link focus-ring",
                    collapsed ? "nav-link-collapsed" : "",
                    isActive ? "nav-link-active" : ""
                  ].join(" ")}
                >
                  <span className="nav-initial">{item.code}</span>
                  <span className={["nav-label min-w-0 truncate", collapsed ? "sr-only" : ""].join(" ")}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function BrandLink({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      aria-label="AgentOps dashboard"
      title={collapsed ? "AgentOps dashboard" : undefined}
      className={["brand-card focus-ring flex items-center gap-3 px-2 py-2 text-left transition", collapsed ? "justify-center" : ""].join(" ")}
    >
      <div className="brand-mark grid size-9 place-items-center text-xs font-semibold">
        AO
      </div>
      <div className={["min-w-0", collapsed ? "sr-only" : ""].join(" ")}>
        <p className="truncate text-sm font-semibold text-slate-50">AgentOps</p>
        <p className="truncate text-xs text-slate-500">Command Center</p>
      </div>
    </Link>
  );
}

export function Sidebar({
  isMobileNavOpen,
  onCloseMobileNav
}: {
  isMobileNavOpen: boolean;
  onCloseMobileNav: () => void;
}) {
  const { isSidebarCollapsed, setSidebarCollapsed } = useDemoState();

  return (
    <>
      <aside
        className={[
          "shell-sidebar desktop-sidebar relative hidden h-full shrink-0 overflow-hidden py-5 backdrop-blur lg:flex lg:flex-col",
          isSidebarCollapsed ? "sidebar-collapsed w-[5.15rem] px-3" : "sidebar-expanded w-[17.25rem] px-4"
        ].join(" ")}
        data-collapsed={isSidebarCollapsed ? "true" : "false"}
      >
        <div className={isSidebarCollapsed ? "sidebar-rail-header" : "sidebar-header"}>
          <BrandLink collapsed={isSidebarCollapsed} />
          <button
            type="button"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!isSidebarCollapsed}
            title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
            className="sidebar-collapse-button focus-ring"
          >
            <svg aria-hidden="true" viewBox="0 0 20 20" className="size-4">
              <path d="m8 5 5 5-5 5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
            </svg>
          </button>
        </div>

        <div className={["sidebar-scroll min-h-0 flex-1 overflow-y-auto pb-2", isSidebarCollapsed ? "mt-4 pr-0" : "mt-5 pr-3"].join(" ")}>
          <NavLinks collapsed={isSidebarCollapsed} />
        </div>

        <div className={["sidebar-demo-card mt-5 rounded-md border border-white/[0.055] bg-white/[0.028] p-3", isSidebarCollapsed ? "hidden" : ""].join(" ")}>
          <p className="text-[11px] font-semibold uppercase text-slate-500">Workspace</p>
          <p className="mt-1.5 text-xs leading-5 text-slate-500">Deterministic workspace. Details live in Settings.</p>
        </div>
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" aria-label="Close navigation menu" className="absolute inset-0 bg-slate-950/72 backdrop-blur-sm" onClick={onCloseMobileNav} />
          <aside className="shell-sidebar relative flex h-full w-[min(20.5rem,calc(100vw-1.25rem))] flex-col overflow-x-hidden px-4 py-4 shadow-command">
            <div className="flex items-center justify-between gap-3">
              <BrandLink onNavigate={onCloseMobileNav} />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onCloseMobileNav}
                className="focus-ring grid size-10 shrink-0 place-items-center rounded-md border border-white/[0.06] bg-white/[0.045] text-slate-300 transition hover:bg-white/[0.07]"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
                  <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="sidebar-scroll mt-4 min-h-0 flex-1 overflow-y-auto pb-4 pr-3">
              <NavLinks onNavigate={onCloseMobileNav} />
            </div>
            <div className="mt-3 rounded-md border border-white/[0.055] bg-white/[0.028] p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-500">Boundary</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Deterministic workspace. Details live in Settings.</p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
