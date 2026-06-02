"use client";

import { useState } from "react";
import { DemoStateProvider } from "@/lib/demo-state";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { BackToTop } from "@/components/back-to-top";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <DemoStateProvider>
      <div className="surface-grid h-dvh overflow-hidden bg-[var(--background)]">
        <div className="mx-auto flex h-full w-full max-w-[1760px] overflow-hidden">
          <Sidebar isMobileNavOpen={isMobileNavOpen} onCloseMobileNav={() => setIsMobileNavOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <Topbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />
            <main id="app-main-scroll" className="premium-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-28 pt-4 sm:px-6 sm:pb-24 sm:pt-5 lg:px-8 xl:px-10">
              {children}
            </main>
          </div>
        </div>
        <BackToTop targetId="app-main-scroll" />
      </div>
    </DemoStateProvider>
  );
}
