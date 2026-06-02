import { SectionCard } from "@/components/section-card";
import { mockAuditLogs } from "@/data/mock-audit-logs";
import { mockUsers } from "@/data/mock-users";
import { formatDateTime } from "@/lib/format";

export function AuditLogTable() {
  const usersById = new Map(mockUsers.map((user) => [user.id, user]));

  return (
    <div className="space-y-6">
      <SectionCard title="Audit log" description="The demo audit log shows the future append-only trail for approvals, risks, workflow publication, and sensitive decisions.">
        <div className="overflow-hidden rounded-lg border border-white/10">
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
      </SectionCard>
    </div>
  );
}
