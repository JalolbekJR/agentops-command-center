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
    <nav className="space-y-0.5" aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={[
              "group relative mr-2 flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition duration-150 focus:outline-none focus:ring-2 focus:ring-slate-400/40",
              isActive
                ? "bg-white/[0.075] text-slate-50"
                : "text-slate-500 hover:bg-white/[0.045] hover:text-slate-200"
            ].join(" ")}
          >
            {isActive ? <span className="absolute left-0 top-1/2 h-5 w-px -translate-y-1/2 rounded-full bg-slate-300/80" /> : null}
            <span className={["grid size-6 place-items-center rounded-md text-[9px] font-semibold", isActive ? "bg-white/[0.08] text-slate-100" : "bg-white/[0.035] text-slate-600 group-hover:text-slate-300"].join(" ")}>
              {item.code}
            </span>
            <span className="truncate">{item.label}</span>
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
      className="flex items-center gap-3 rounded-md px-1 py-2 text-left transition hover:bg-white/[0.025] focus:outline-none focus:ring-2 focus:ring-slate-400/40"
    >
      <div className="grid size-9 place-items-center rounded-md bg-white/[0.055] text-xs font-semibold text-slate-100">
        AO
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-50">AgentOps</p>
        <p className="text-xs text-slate-500">Command Center</p>
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
      <aside className="hidden h-full w-[17rem] shrink-0 border-r border-white/[0.07] bg-[#080b12]/95 px-4 py-5 backdrop-blur lg:flex lg:flex-col">
        <BrandLink />

        <div className="premium-scroll mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
          <NavLinks />
        </div>

        <div className="mt-5 rounded-md bg-white/[0.035] p-3">
          <p className="text-[11px] font-semibold uppercase text-slate-500">Local Demo</p>
          <p className="mt-1.5 text-xs leading-5 text-slate-400">Deterministic workspace. Details live in Settings.</p>
        </div>
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" aria-label="Close navigation menu" className="absolute inset-0 bg-slate-950/72 backdrop-blur-sm" onClick={onCloseMobileNav} />
          <aside className="relative flex h-full w-[min(21rem,calc(100vw-2rem))] flex-col border-r border-white/[0.08] bg-[#080b12] px-4 py-4 shadow-command">
            <div className="flex items-center justify-between gap-3">
              <BrandLink onNavigate={onCloseMobileNav} />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onCloseMobileNav}
                className="grid size-10 place-items-center rounded-md bg-white/[0.055] text-slate-300 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-slate-400/40"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
                  <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="premium-scroll mt-5 min-h-0 flex-1 overflow-y-auto pr-2">
              <NavLinks onNavigate={onCloseMobileNav} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
