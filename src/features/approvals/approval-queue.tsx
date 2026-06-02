"use client";

import { useState } from "react";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockApprovals } from "@/data/mock-approvals";
import { useDemoState } from "@/lib/demo-state";
import { canDecideApproval } from "@/lib/rbac";
import { approvalStatusTone } from "@/lib/status";
import { formatDateTime } from "@/lib/format";
import type { ApprovalRequest } from "@/types/domain";

export function ApprovalQueue() {
  const { selectedRole } = useDemoState();
  const [approvals, setApprovals] = useState<ApprovalRequest[]>(mockApprovals);

  function decideApproval(approvalId: string, decision: "approved" | "rejected") {
    setApprovals((currentApprovals) =>
      currentApprovals.map((approval) =>
        approval.id === approvalId
          ? {
              ...approval,
              status: decision,
              decision,
              decidedByUserId: "demo_current_role",
              decidedAt: "2026-06-02T11:00:00Z",
              decisionComment: `${decision === "approved" ? "Approved" : "Rejected"} locally by ${selectedRole} in demo state.`
            }
          : approval
      )
    );
  }

  return (
    <div className="space-y-6">
      <SectionCard
        title="Human approval queue"
        description="Approval decisions are local demo state only. They show the intended RBAC workflow but do not execute real tools."
      >
        <div className="space-y-4">
          {approvals.map((approval) => {
            const canDecide = approval.status === "pending" && canDecideApproval(selectedRole, approval.assignedRole);

            return (
              <article key={approval.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{approval.id}</p>
                      <StatusBadge label={approval.status} tone={approvalStatusTone(approval.status)} />
                      <RiskBadge riskLevel={approval.riskLevel} />
                    </div>
                    <p className="mt-3 text-sm leading-6 text-slate-300">{approval.reason}</p>
                    <p className="mt-3 text-xs text-slate-500">
                      Assigned to {approval.assignedRole}. Requested {formatDateTime(approval.requestedAt)}.
                    </p>
                    <p className="mt-2 rounded-md border border-white/10 bg-slate-950/50 px-3 py-2 text-xs text-slate-400">
                      Current role permission: {canDecide ? "Can decide this local demo approval." : "Read-only for this approval in the demo RBAC model."}
                    </p>
                    {approval.decisionComment ? <p className="mt-3 text-sm leading-6 text-slate-400">{approval.decisionComment}</p> : null}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={!canDecide}
                      onClick={() => decideApproval(approval.id, "approved")}
                      className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-slate-600"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={!canDecide}
                      onClick={() => decideApproval(approval.id, "rejected")}
                      className="rounded-lg border border-rose-300/25 bg-rose-300/10 px-3 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-300/15 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-slate-600"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
