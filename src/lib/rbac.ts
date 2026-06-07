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
      "rbac.manage",
      "platform.setup.read",
      "platform.setup.write",
      "platform.connectors.read",
      "platform.connectors.write",
      "platform.builtInAgents.read",
      "platform.builtInAgents.publish",
      "platform.agentBuilder.read",
      "platform.agentBuilder.write",
      "platform.plans.read",
      "platform.plans.manage",
      "platform.ownerControl.manage"
    ],
    demoNote: "Full local workspace visibility for portfolio review."
  },
  {
    name: "AI Engineer",
    description: "Builds agents and workflows, starts runs, and debugs tool calls.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "agent.write",
      "workflow.read",
      "workflow.write",
      "run.read",
      "run.start",
      "approval.read",
      "evaluation.read",
      "risk.read",
      "browserQa.read",
      "cost.read",
      "platform.setup.read",
      "platform.setup.write",
      "platform.connectors.read",
      "platform.connectors.write",
      "platform.builtInAgents.read",
      "platform.agentBuilder.read",
      "platform.agentBuilder.write",
      "platform.plans.read"
    ],
    demoNote: "Builds and debugs agent workflows with limited approval authority."
  },
  {
    name: "QA Reviewer",
    description: "Reviews browser QA sessions, evaluations, failed runs, and release gate readiness.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "workflow.read",
      "run.read",
      "approval.read",
      "evaluation.read",
      "evaluation.write",
      "risk.read",
      "browserQa.read",
      "browserQa.write",
      "cost.read",
      "audit.read",
      "platform.builtInAgents.read",
      "platform.agentBuilder.read"
    ],
    demoNote: "Reviews QA evidence, failed runs, and release readiness."
  },
  {
    name: "Security Reviewer",
    description: "Reviews high-risk tool calls, sensitive data warnings, policy violations, and audit logs.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "workflow.read",
      "run.read",
      "approval.read",
      "approval.decide",
      "evaluation.read",
      "risk.read",
      "risk.resolve",
      "browserQa.read",
      "audit.read",
      "platform.connectors.read",
      "platform.builtInAgents.read",
      "platform.agentBuilder.read",
      "platform.plans.read"
    ],
    demoNote: "Owns high-risk security findings and approval gates."
  },
  {
    name: "Product Manager",
    description: "Reviews business outcomes, evaluation quality, release gates, and customer-impacting decisions.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "workflow.read",
      "run.read",
      "approval.read",
      "approval.decide",
      "evaluation.read",
      "risk.read",
      "browserQa.read",
      "cost.read",
      "platform.setup.read",
      "platform.connectors.read",
      "platform.builtInAgents.read",
      "platform.agentBuilder.read",
      "platform.plans.read"
    ],
    demoNote: "Reviews business outcomes and product-level decisions."
  },
  {
    name: "Viewer",
    description: "Read-only access to selected dashboards, reports, and redacted operational summaries.",
    permissions: [
      "dashboard.read",
      "agent.read",
      "workflow.read",
      "run.read",
      "evaluation.read",
      "risk.read",
      "browserQa.read",
      "cost.read",
      "platform.connectors.read",
      "platform.builtInAgents.read",
      "platform.plans.read"
    ],
    demoNote: "Read-only access to redacted operational summaries."
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
