"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        eyebrow="Approval queue"
        title="Human review for gated agent actions."
        description="Decision cards show who can approve, why the action paused, and what evidence triggered review."
      />
      <SectionCard
        title="Pending and recent approvals"
        description="Decisions update local UI state only."
      >
        <div className="space-y-4">
          {approvals.map((approval) => {
            const canDecide = approval.status === "pending" && canDecideApproval(selectedRole, approval.assignedRole);

            return (
              <article key={approval.id} className="data-card">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{approval.id}</p>
                      <StatusBadge label={approval.status} tone={approvalStatusTone(approval.status)} />
                      <RiskBadge riskLevel={approval.riskLevel} />
                    </div>
                    <p className="muted-copy mt-3 text-sm text-slate-300">{approval.reason}</p>
                    <p className="subtle-copy mt-3 text-xs">
                      Assigned to {approval.assignedRole}. Requested {formatDateTime(approval.requestedAt)}.
                    </p>
                    <p className="data-card-muted mt-2 px-3 py-2 text-xs text-slate-400">
                      Current role permission: {canDecide ? "Can decide this local demo approval." : "Read-only for this approval in the demo RBAC model."}
                    </p>
                    {approval.decisionComment ? <p className="muted-copy mt-3 text-sm">{approval.decisionComment}</p> : null}
                  </div>
                  <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto">
                    <button
                      type="button"
                      disabled={!canDecide}
                      onClick={() => decideApproval(approval.id, "approved")}
                      className="decision-button decision-approve focus-ring"
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      disabled={!canDecide}
                      onClick={() => decideApproval(approval.id, "rejected")}
                      className="decision-button decision-reject focus-ring"
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
