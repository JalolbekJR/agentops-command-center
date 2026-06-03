import type { DeploymentMode } from "./setup";
import type { WorkspacePlanTier } from "./plans";

export type OwnerControlCategory =
  | "deployment"
  | "connector_templates"
  | "built_in_agents"
  | "pricing"
  | "license"
  | "security_policy"
  | "worker_templates"
  | "marketplace";

export interface OwnerControlSetting {
  id: string;
  category: OwnerControlCategory;
  label: string;
  valueLabel: string;
  ownerOnly: true;
  status: "demo_visible" | "planned_backend_enforced" | "future";
  summary: string;
  customerImpact: string;
}

export interface PlatformLicenseRule {
  id: string;
  planId: WorkspacePlanTier;
  deploymentMode: DeploymentMode;
  ruleLabel: string;
  enforcedBy: "future_backend" | "future_license_service" | "local_demo_note";
  ownerOnly: boolean;
  summary: string;
}

export interface OwnerControlAction {
  id: string;
  label: string;
  ownerOnly: boolean;
  workspaceConfigurable: boolean;
  auditRequired: boolean;
}
