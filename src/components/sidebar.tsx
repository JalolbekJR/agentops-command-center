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
    <nav className="space-y-1" aria-label="Primary navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-300",
              isActive
                ? "bg-cyan-300/10 text-cyan-100 shadow-[inset_0_0_0_1px_rgba(103,232,249,0.18)]"
                : "text-slate-400 hover:bg-white/5 hover:text-white"
            ].join(" ")}
          >
            <span className={["grid size-7 place-items-center rounded-md border text-[10px] font-semibold", isActive ? "border-cyan-300/40 bg-cyan-300/10 text-cyan-200" : "border-white/10 bg-white/5 text-slate-500"].join(" ")}>
              {item.code}
            </span>
            <span>{item.label}</span>
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
      className="flex items-center gap-3 rounded-lg px-1 py-2 text-left transition hover:bg-white/[0.03] focus:outline-none focus:ring-2 focus:ring-cyan-300"
    >
      <div className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-sm font-bold text-cyan-200">
          AO
      </div>
      <div>
        <p className="text-sm font-semibold text-white">AgentOps</p>
        <p className="text-xs text-slate-400">Command Center</p>
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
      <aside className="hidden h-full w-72 shrink-0 border-r border-white/10 bg-slate-950/90 px-5 py-6 backdrop-blur lg:flex lg:flex-col">
        <BrandLink />

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto pr-1">
          <NavLinks />
        </div>

        <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-semibold uppercase text-slate-500">Local Demo</p>
          <p className="mt-2 text-sm leading-6 text-slate-300">Deterministic workspace. Details live in Settings.</p>
        </div>
      </aside>

      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <button type="button" aria-label="Close navigation menu" className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={onCloseMobileNav} />
          <aside className="relative flex h-full w-[min(22rem,calc(100vw-2rem))] flex-col border-r border-white/10 bg-slate-950 px-4 py-4 shadow-command">
            <div className="flex items-center justify-between gap-3">
              <BrandLink onNavigate={onCloseMobileNav} />
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onCloseMobileNav}
                className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-300"
              >
                <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5" fill="none">
                  <path d="m6 6 8 8M14 6l-8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="mt-5 min-h-0 flex-1 overflow-y-auto">
              <NavLinks onNavigate={onCloseMobileNav} />
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
