"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Overview", code: "OV" },
  { href: "/agents", label: "Agents", code: "AG" },
  { href: "/workflows", label: "Workflows", code: "WF" },
  { href: "/runs", label: "Runs", code: "RN" },
  { href: "/approvals", label: "Approvals", code: "AP" },
  { href: "/evaluations", label: "Evaluations", code: "EV" },
  { href: "/risks", label: "Risks", code: "RK" },
  { href: "/browser-qa", label: "Browser QA", code: "QA" },
  { href: "/audit", label: "Audit", code: "AU" },
  { href: "/settings", label: "Settings", code: "ST" }
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="space-y-0.5 px-1" aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={[
              "nav-link focus-ring",
              isActive ? "nav-link-active" : ""
            ].join(" ")}
          >
            <span className="nav-initial">{item.code}</span>
            <span className="min-w-0 truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function BrandLink({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link
      href="/dashboard"
      onClick={onNavigate}
      className="brand-card focus-ring flex items-center gap-3 px-2 py-2 text-left transition"
    >
      <div className="brand-mark grid size-9 place-items-center text-xs font-semibold">
        AO
      </div>
      <div className="min-w-0">
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
  return (
    <>
      <aside className="shell-sidebar hidden h-full w-[17.25rem] shrink-0 overflow-x-hidden px-4 py-5 backdrop-blur lg:flex lg:flex-col">
        <BrandLink />

        <div className="sidebar-scroll mt-5 min-h-0 flex-1 overflow-y-auto pb-2 pr-3">
          <NavLinks />
        </div>

        <div className="mt-5 rounded-md border border-white/[0.055] bg-white/[0.028] p-3">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Local Demo</p>
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
              <p className="text-[11px] font-semibold uppercase text-slate-500">Local Demo</p>
              <p className="mt-1 text-xs leading-5 text-slate-500">Local data only. No live integrations.</p>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
