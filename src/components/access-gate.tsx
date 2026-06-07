"use client";

import { LockedPage } from "@/components/locked-page";
import { useDemoState } from "@/lib/demo-state";
import { getRouteAccess, type PlatformRoute } from "@/lib/role-access";

export function AccessGate({ route, children }: { route: PlatformRoute; children: React.ReactNode }) {
  const { isRoleReady, selectedRole } = useDemoState();

  if (!isRoleReady) {
    return (
      <section className="surface-panel rounded-xl p-5 text-sm text-slate-400">
        Loading role view...
      </section>
    );
  }

  const access = getRouteAccess(selectedRole, route);

  if (access.level === "locked") {
    return <LockedPage access={access} currentRole={selectedRole} />;
  }

  return <>{children}</>;
}
