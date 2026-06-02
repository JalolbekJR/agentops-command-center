"use client";

import { DemoStateProvider } from "@/lib/demo-state";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoStateProvider>
      <div className="surface-grid min-h-screen">
        <div className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col lg:flex-row">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <Topbar />
            <main className="flex-1 px-4 pb-10 pt-4 sm:px-6 lg:px-8">{children}</main>
          </div>
        </div>
      </div>
    </DemoStateProvider>
  );
}
