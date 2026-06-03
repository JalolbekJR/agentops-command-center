import type { AgentConnectorType } from "./connectors";

export type WorkspacePlanTier = "free_demo" | "starter" | "pro" | "enterprise_self_hosted";
export type BillingMeter =
  | "seats"
  | "connected_agents"
  | "built_in_agents"
  | "custom_agents"
  | "runs_per_month"
  | "browser_qa_minutes"
  | "webhook_events"
  | "native_protocol_events"
  | "private_workers"
  | "trace_imports"
  | "audit_retention_days";

export interface UsageLimit {
  meter: BillingMeter;
  included: number | "unlimited";
  used: number;
  unitLabel: string;
  hardLimit: boolean;
}

export interface WorkspacePlan {
  id: WorkspacePlanTier;
  name: string;
  audience: string;
  summary: string;
  recommended: boolean;
  priceLabel: string;
  limits: UsageLimit[];
  builtInAgentIds: string[];
  connectorAccess: AgentConnectorType[];
  sdkAccess: boolean;
  mcpConnectors: boolean;
  privateWorkers: boolean;
  traceImports: boolean;
  byokAiProvider: boolean;
  customConnectors: boolean;
  auditExport: boolean;
  dataRetentionDays: number | "custom";
  supportLevel: "community" | "email" | "priority" | "enterprise";
  ownerOnlyControls: boolean;
  selfHostedLicense: boolean;
  upgradeReason: string;
}

export interface UsageStatus {
  meter: BillingMeter;
  label: string;
  used: number;
  included: number | "unlimited";
  percentUsed: number;
  status: "available" | "near_limit" | "locked" | "exceeded";
}
