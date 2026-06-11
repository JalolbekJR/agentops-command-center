import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockAuditLogs } from "@/data/mock-audit-logs";
import { mockUsers } from "@/data/mock-users";
import { formatDateTime } from "@/lib/format";

export function AuditLogTable() {
  const usersById = new Map(mockUsers.map((user) => [user.id, user]));
  const latestAudit = mockAuditLogs[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit"
        title="Trace sensitive decisions with actor context."
        description="Approvals, risks, workflow changes, and review events stay readable and correlated."
      />
      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label={`${mockAuditLogs.length} records`} tone="success" />
              <StatusBadge label="Actor/action/reason" tone="info" />
              <StatusBadge label="Export-ready story" tone="neutral" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white sm:text-2xl">Audit records preserve who decided, what changed, and why it mattered.</h2>
            <p className="muted-copy mt-3 text-sm">
              This local table models the future append-only trail for approvals, risks, workflow changes, and owner-controlled actions.
            </p>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Latest record</p>
            <p className="mt-2 text-sm font-semibold text-white">{latestAudit.action}</p>
            <p className="muted-copy mt-2 text-sm">{latestAudit.reason}</p>
            <p className="mono-token mt-3 break-words text-xs">{latestAudit.correlationId}</p>
          </div>
        </div>
      </section>
      <SectionCard title="Audit log" description="Recent governance events.">
        <div className="data-table-shell hidden lg:block">
          <div className="premium-scroll overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Correlation</th>
                </tr>
              </thead>
              <tbody>
                {mockAuditLogs.map((audit) => (
                  <tr key={audit.id}>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-400">{formatDateTime(audit.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-300">{usersById.get(audit.actorUserId)?.name ?? "System"}</td>
                    <td className="mono-token whitespace-nowrap px-4 py-4 text-xs">{audit.action}</td>
                    <td className="px-4 py-4 text-slate-300">{audit.targetType}: {audit.targetId}</td>
                    <td className="max-w-md px-4 py-4 text-slate-400">{audit.reason}</td>
                    <td className="mono-token whitespace-nowrap px-4 py-4 text-xs text-slate-500">{audit.correlationId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-3 lg:hidden">
          {mockAuditLogs.map((audit) => (
            <article key={audit.id} className="data-card">
              <p className="mono-token break-words text-xs">{audit.action}</p>
              <p className="mt-2 text-sm font-semibold text-white">{usersById.get(audit.actorUserId)?.name ?? "System"}</p>
              <p className="muted-copy mt-2 text-sm">{audit.reason}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="meta-label">Target</dt>
                  <dd className="mt-1 break-words text-slate-300">{audit.targetType}: {audit.targetId}</dd>
                </div>
                <div>
                  <dt className="meta-label">Correlation</dt>
                  <dd className="mono-token mt-1 break-words text-xs">{audit.correlationId}</dd>
                </div>
                <div>
                  <dt className="meta-label">Time</dt>
                  <dd className="mt-1 text-slate-300">{formatDateTime(audit.createdAt)}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
