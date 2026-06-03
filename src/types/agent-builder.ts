import type { AgentConnectorType, ConnectorCapability, ConnectorPlanTier, ConnectorPrivacyLevel } from "./connectors";
import type { DeploymentMode } from "./setup";
import type { RiskLevel } from "./workflow";

export type BuiltInAgentImplementationStatus = "recommended_demo_foundation" | "demo_ready" | "planned" | "future";
export type AgentBuilderStepKind =
  | "template"
  | "connection"
  | "capabilities"
  | "allowed_targets"
  | "approval_gates"
  | "privacy"
  | "usage_plan"
  | "workflow_outline"
  | "safe_test";

export interface BuiltInAgentDefinition {
  id: string;
  name: string;
  shortDescription: string;
  purpose: string;
  bestFor: string[];
  inputRequirements: string[];
  connectionRequirements: AgentConnectorType[];
  requiredPermissions: string[];
  requiredCapabilities: ConnectorCapability[];
  privacyLevel: ConnectorPrivacyLevel;
  riskLevel: RiskLevel;
  approvalRequirements: string[];
  usageMeter: string;
  monetizationTier: ConnectorPlanTier;
  implementationStatus: BuiltInAgentImplementationStatus;
  securityNotes: string[];
  deploymentModes: DeploymentMode[];
  recommended: boolean;
}

export interface AgentBuilderTemplate {
  id: string;
  name: string;
  summary: string;
  builtInAgentId?: string;
  connectorType: AgentConnectorType;
  planRequired: ConnectorPlanTier;
  recommended: boolean;
  generatedWorkflowSteps: string[];
  planLockReason?: string;
}

export interface AgentBuilderStep {
  id: string;
  kind: AgentBuilderStepKind;
  title: string;
  summary: string;
  selectedLabel: string;
  status: "complete" | "current" | "future" | "locked";
  securityNote: string;
}

export interface AgentBuilderReviewSummary {
  templateId: string;
  connectionMethod: AgentConnectorType;
  privacyMode: ConnectorPrivacyLevel;
  approvalGates: string[];
  allowedTargetIds: string[];
  usageLimitLabel: string;
  generatedWorkflowOutline: string[];
  futureSafeTestSummary: string;
}
