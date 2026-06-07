export type RoleName =
  | "Founder/Admin"
  | "AI Engineer"
  | "QA Reviewer"
  | "Security Reviewer"
  | "Product Manager"
  | "Viewer";

export type PermissionLevel = "admin" | "write" | "read" | "limited" | "none";

export type PermissionKey =
  | "dashboard.read"
  | "agent.read"
  | "agent.write"
  | "workflow.read"
  | "workflow.write"
  | "run.read"
  | "run.start"
  | "approval.read"
  | "approval.decide"
  | "evaluation.read"
  | "evaluation.write"
  | "risk.read"
  | "risk.resolve"
  | "browserQa.read"
  | "browserQa.write"
  | "cost.read"
  | "audit.read"
  | "rbac.manage"
  | "platform.setup.read"
  | "platform.setup.write"
  | "platform.connectors.read"
  | "platform.connectors.write"
  | "platform.builtInAgents.read"
  | "platform.builtInAgents.publish"
  | "platform.agentBuilder.read"
  | "platform.agentBuilder.write"
  | "platform.plans.read"
  | "platform.plans.manage"
  | "platform.ownerControl.manage";

export interface RoleDefinition {
  name: RoleName;
  description: string;
  permissions: PermissionKey[];
  demoNote: string;
}

export interface FeaturePermission {
  feature: string;
  founderAdmin: PermissionLevel;
  aiEngineer: PermissionLevel;
  qaReviewer: PermissionLevel;
  securityReviewer: PermissionLevel;
  productManager: PermissionLevel;
  viewer: PermissionLevel;
}
