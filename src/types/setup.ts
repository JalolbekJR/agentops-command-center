import type { AgentConnectorType } from "./connectors";
import type { WorkspacePlanTier } from "./plans";

export type DeploymentMode = "hosted_saas" | "self_hosted_enterprise" | "local_developer";
export type SetupStepStatus = "ready" | "needs_input" | "future_backend" | "blocked_by_plan";

export interface SetupStep {
  id: string;
  sequence: number;
  title: string;
  summary: string;
  ownerLevel: "platform_owner" | "workspace_admin" | "shared";
  status: SetupStepStatus;
  recommended: boolean;
  requiredPlan: WorkspacePlanTier;
  relatedConnectorTypes: AgentConnectorType[];
  securityNotes: string[];
}

export interface SetupHealthCheck {
  id: string;
  label: string;
  status: "healthy" | "warning" | "not_configured" | "future";
  summary: string;
  ownerLevel: "platform_owner" | "workspace_admin" | "shared";
  remediation: string;
}

export interface DeploymentModeSummary {
  mode: DeploymentMode;
  label: string;
  bestFor: string;
  ownerControls: string[];
  customerControls: string[];
  protectionNotes: string[];
}
