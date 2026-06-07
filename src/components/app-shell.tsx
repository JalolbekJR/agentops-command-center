"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DemoStateProvider, useDemoState } from "@/lib/demo-state";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";
import { BackToTop } from "@/components/back-to-top";
import { canViewAppRoute, getFallbackRouteForRole, getAppRouteLabel } from "@/lib/navigation-policy";

const pendingAccessNoticeKey = "agentops-command-center:pending-access-notice";
const noticeAutoDismissMs = 10000;

interface RoleRedirectNotice {
  role: string;
  from: string;
  to: string;
  toPath: string;
  requiredAccess: string;
  reason: string;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isRoleRedirectNotice(value: unknown): value is RoleRedirectNotice {
  if (!value || typeof value !== "object") {
    return false;
  }

  const notice = value as Partial<RoleRedirectNotice>;
  return (
    isNonEmptyString(notice.role) &&
    isNonEmptyString(notice.from) &&
    isNonEmptyString(notice.to) &&
    isNonEmptyString(notice.toPath) &&
    isNonEmptyString(notice.requiredAccess) &&
    isNonEmptyString(notice.reason)
  );
}

function readPendingAccessNotice() {
  try {
    const rawNotice = window.sessionStorage.getItem(pendingAccessNoticeKey);

    if (!rawNotice) {
      return null;
    }

    window.sessionStorage.removeItem(pendingAccessNoticeKey);
    const parsedNotice: unknown = JSON.parse(rawNotice);
    return isRoleRedirectNotice(parsedNotice) ? parsedNotice : null;
  } catch {
    return null;
  }
}

function writePendingAccessNotice(notice: RoleRedirectNotice) {
  try {
    window.sessionStorage.setItem(pendingAccessNoticeKey, JSON.stringify(notice));
  } catch {
    // The in-memory notice still covers the current shell when session storage is unavailable.
  }
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <DemoStateProvider>
      <ShellFrame>{children}</ShellFrame>
    </DemoStateProvider>
  );
}

function ShellFrame({ children }: { children: React.ReactNode }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [notice, setNotice] = useState<RoleRedirectNotice | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { isRoleReady, selectedRole } = useDemoState();
  const lastDeniedPathRef = useRef<string | null>(null);
  const isCurrentRouteRestricted = isRoleReady && !canViewAppRoute(selectedRole, pathname);

  useEffect(() => {
    if (!isRoleReady) {
      return;
    }

    if (canViewAppRoute(selectedRole, pathname)) {
      lastDeniedPathRef.current = null;
      return;
    }

    if (lastDeniedPathRef.current === `${selectedRole}:${pathname}`) {
      return;
    }

    lastDeniedPathRef.current = `${selectedRole}:${pathname}`;
    const fallback = getFallbackRouteForRole(selectedRole, pathname);
    const nextNotice: RoleRedirectNotice = {
      role: selectedRole,
      from: fallback.attemptedLabel,
      to: getAppRouteLabel(fallback.route),
      toPath: fallback.route,
      requiredAccess: fallback.requiredAccess,
      reason: fallback.reason
    };
    const timeoutId = window.setTimeout(() => {
      writePendingAccessNotice(nextNotice);
      setNotice(nextNotice);
      router.replace(fallback.route);
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [isRoleReady, pathname, router, selectedRole]);

  useEffect(() => {
    if (!isRoleReady || isCurrentRouteRestricted) {
      return;
    }

    const pendingNotice = readPendingAccessNotice();

    if (pendingNotice && pendingNotice.toPath === pathname) {
      const timeoutId = window.setTimeout(() => setNotice(pendingNotice), 0);
      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [isCurrentRouteRestricted, isRoleReady, pathname]);

  useEffect(() => {
    if (!notice) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setNotice(null), noticeAutoDismissMs);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  return (
    <div className="surface-grid h-dvh overflow-hidden bg-[var(--background)]">
      <div className="mx-auto flex h-full w-full max-w-[1760px] overflow-hidden">
        <Sidebar isMobileNavOpen={isMobileNavOpen} onCloseMobileNav={() => setIsMobileNavOpen(false)} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar onOpenMobileNav={() => setIsMobileNavOpen(true)} />
          {notice ? (
            <div className="role-redirect-notice px-4 pt-3 sm:px-6 lg:px-8 xl:px-10" role="status" aria-live="polite">
              <div className="rounded-lg border border-white/[0.08] bg-slate-950/92 px-4 py-3 text-sm text-slate-300 shadow-command backdrop-blur">
                <span className="font-semibold text-slate-100">Access restricted.</span>{" "}
                {notice.role} cannot access {notice.from}. Redirected to {notice.to}. Required access: {notice.requiredAccess}. {notice.reason}
              </div>
            </div>
          ) : null}
          <main id="app-main-scroll" className="premium-scroll min-w-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-36 pt-4 sm:px-6 sm:pb-28 sm:pt-5 lg:px-8 xl:px-10">
            {isRoleReady && !isCurrentRouteRestricted ? children : (
              <div className="surface-panel rounded-xl p-5 text-sm text-slate-400">
                {isRoleReady ? "Redirecting to an allowed role view..." : "Loading role view..."}
              </div>
            )}
          </main>
        </div>
      </div>
      <BackToTop targetId="app-main-scroll" />
    </div>
  );
}
