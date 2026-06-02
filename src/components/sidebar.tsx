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

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5 lg:py-6">
      <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-2 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-300">
        <div className="grid size-10 place-items-center rounded-lg border border-cyan-300/30 bg-cyan-300/10 text-sm font-bold text-cyan-200">
          AO
        </div>
        <div>
          <p className="text-sm font-semibold text-white">AgentOps</p>
          <p className="text-xs text-slate-400">Command Center</p>
        </div>
      </Link>

      <nav className="mt-5 flex gap-2 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0" aria-label="Primary navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname === "/" && item.href === "/dashboard");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex min-w-max items-center gap-3 rounded-lg px-3 py-2 text-sm transition focus:outline-none focus:ring-2 focus:ring-cyan-300",
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

      <div className="mt-6 hidden rounded-lg border border-white/10 bg-white/[0.03] p-4 lg:block">
        <p className="text-xs font-semibold uppercase text-slate-500">Demo boundary</p>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          Local deterministic data only. No external requests, auth provider, database, secrets, or deployment are connected.
        </p>
      </div>
    </aside>
  );
}
