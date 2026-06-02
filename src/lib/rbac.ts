import type { PermissionKey, RoleDefinition, RoleName } from "@/types/rbac";

export const roleDefinitions: RoleDefinition[] = [
  {
    name: "Founder/Admin",
    description: "Full demo access to projects, roles, workflows, approvals, risks, settings, and audit logs.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "agent.write",
      "workflow.read",
      "workflow.write",
      "run.read",
      "run.start",
      "approval.read",
      "approval.decide",
      "evaluation.read",
      "evaluation.write",
      "risk.read",
      "risk.resolve",
      "browserQa.read",
      "browserQa.write",
      "cost.read",
      "audit.read",
      "rbac.manage"
    ],
    demoNote: "Demo role with full local visibility. Future production auth must enforce this server-side."
  },
  {
    name: "AI Engineer",
    description: "Builds agents and workflows, starts runs, and debugs tool calls.",
    permissions: ["dashboard.read", "agent.read", "agent.write", "workflow.read", "workflow.write", "run.read", "run.start", "approval.read", "evaluation.read", "risk.read", "browserQa.read", "cost.read"],
    demoNote: "Can inspect technical run details but does not own security approval decisions."
  },
  {
    name: "QA Reviewer",
    description: "Reviews browser QA sessions, evaluations, failed runs, and release gate readiness.",
    permissions: ["dashboard.read", "agent.read", "workflow.read", "run.read", "approval.read", "evaluation.read", "evaluation.write", "risk.read", "browserQa.read", "browserQa.write", "cost.read"],
    demoNote: "Can judge release quality and QA blockers, but cannot override security gates."
  },
  {
    name: "Security Reviewer",
    description: "Reviews high-risk tool calls, sensitive data warnings, policy violations, and audit logs.",
    permissions: ["dashboard.read", "agent.read", "workflow.read", "run.read", "approval.read", "approval.decide", "evaluation.read", "risk.read", "risk.resolve", "browserQa.read", "audit.read"],
    demoNote: "Can decide security approvals and resolve high-risk findings in the demo model."
  },
  {
    name: "Product Manager",
    description: "Reviews business outcomes, evaluation quality, release gates, and customer-impacting decisions.",
    permissions: ["dashboard.read", "agent.read", "workflow.read", "run.read", "approval.read", "approval.decide", "evaluation.read", "risk.read", "browserQa.read", "cost.read"],
    demoNote: "Can approve product-level decisions, with technical and security gates still separated."
  },
  {
    name: "Viewer",
    description: "Read-only access to selected dashboards, reports, and redacted operational summaries.",
    permissions: ["dashboard.read", "agent.read", "workflow.read", "run.read", "evaluation.read", "risk.read", "browserQa.read", "cost.read"],
    demoNote: "Read-only demo role. Sensitive tool detail and audit records are intentionally limited."
  }
];

export const demoRoles = roleDefinitions.map((role) => role.name);

export function getRoleDefinition(roleName: RoleName) {
  return roleDefinitions.find((role) => role.name === roleName) ?? roleDefinitions[0];
}

export function can(roleName: RoleName, permission: PermissionKey) {
  return getRoleDefinition(roleName).permissions.includes(permission);
}

export function canDecideApproval(roleName: RoleName, assignedRole: RoleName) {
  return roleName === "Founder/Admin" || roleName === assignedRole;
}
