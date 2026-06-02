import { PageHeader } from "@/components/page-header";
import { SectionCard } from "@/components/section-card";
import { mockAuditLogs } from "@/data/mock-audit-logs";
import { mockUsers } from "@/data/mock-users";
import { formatDateTime } from "@/lib/format";

export function AuditLogTable() {
  const usersById = new Map(mockUsers.map((user) => [user.id, user]));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit"
        title="Trace sensitive decisions with actor and correlation context."
        description="Approvals, risks, workflow changes, and review events stay explainable."
      />
      <SectionCard title="Audit log" description="Recent governance events.">
        <div className="hidden overflow-hidden rounded-lg border border-white/10 lg:block">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm">
              <thead className="bg-white/[0.03] text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Actor</th>
                  <th className="px-4 py-3">Action</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Correlation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {mockAuditLogs.map((audit) => (
                  <tr key={audit.id} className="bg-slate-950/35 align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-slate-400">{formatDateTime(audit.createdAt)}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-300">{usersById.get(audit.actorUserId)?.name ?? "System"}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-cyan-100">{audit.action}</td>
                    <td className="px-4 py-4 text-slate-300">{audit.targetType}: {audit.targetId}</td>
                    <td className="max-w-md px-4 py-4 text-slate-400">{audit.reason}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-xs text-slate-500">{audit.correlationId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="space-y-3 lg:hidden">
          {mockAuditLogs.map((audit) => (
            <article key={audit.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
              <p className="font-mono text-xs text-cyan-100">{audit.action}</p>
              <p className="mt-2 text-sm font-semibold text-white">{usersById.get(audit.actorUserId)?.name ?? "System"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{audit.reason}</p>
              <dl className="mt-4 grid gap-3 text-sm">
                <div>
                  <dt className="text-xs uppercase text-slate-500">Target</dt>
                  <dd className="mt-1 break-words text-slate-300">{audit.targetType}: {audit.targetId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Correlation</dt>
                  <dd className="mt-1 break-words font-mono text-xs text-slate-400">{audit.correlationId}</dd>
                </div>
                <div>
                  <dt className="text-xs uppercase text-slate-500">Time</dt>
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
