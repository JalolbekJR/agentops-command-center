import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { getBestRouteForRole, getAppRouteLabel } from "@/lib/navigation-policy";
import type { RouteAccess } from "@/lib/role-access";
import type { RoleName } from "@/types/rbac";

export function LockedPage({ access, currentRole }: { access: RouteAccess; currentRole: RoleName }) {
  const fallbackRoute = getBestRouteForRole(currentRole);
  const fallbackLabel = getAppRouteLabel(fallbackRoute);

  return (
    <section className="mx-auto flex min-h-[52vh] max-w-4xl items-center">
      <div className="surface-panel w-full rounded-xl p-5 sm:p-7">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <p className="meta-label">Access boundary</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-50">This view is locked for {currentRole}.</h1>
            <p className="muted-copy mt-3 max-w-2xl text-sm">{access.reason}</p>
          </div>
          <StatusBadge label="locked" tone="warning" />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="detail-tile">
            <p className="meta-label">Page</p>
            <p className="mt-1 text-sm font-semibold text-white">{access.label}</p>
          </div>
          <div className="detail-tile">
            <p className="meta-label">Current role</p>
            <p className="mt-1 text-sm font-semibold text-white">{currentRole}</p>
          </div>
          <div className="detail-tile">
            <p className="meta-label">Required access</p>
            <p className="mt-1 text-sm font-semibold text-white">{access.requiredRole}</p>
          </div>
        </div>

        <div className="notice-card notice-card-neutral mt-5">
          <p className="text-sm font-semibold text-slate-100">What you can do instead</p>
          <p className="muted-copy mt-2 text-sm">{access.recommendedAction}</p>
          <div className="mt-4">
            <Link href={fallbackRoute} className="primary-action w-full sm:w-auto">
              Go to {fallbackLabel}
            </Link>
          </div>
        </div>

        <p className="subtle-copy mt-4 text-xs">
          Local demo note: this is client-side access modeling only. A production backend must enforce the same permissions server-side before returning sensitive data.
        </p>
      </div>
    </section>
  );
}
