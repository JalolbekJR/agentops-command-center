import type { OwnerControlAction, OwnerControlSetting, PlatformLicenseRule } from "@/types/owner-control";

export const mockOwnerControlSettings: OwnerControlSetting[] = [
  {
    id: "owner_global_deployment",
    category: "deployment",
    label: "Global deployment mode",
    valueLabel: "Local Developer Mode",
    ownerOnly: true,
    status: "demo_visible",
    summary: "Controls the global platform operating mode. Customers configure only their workspace.",
    customerImpact: "Customers see workspace setup options, not global infrastructure controls."
  },
  {
    id: "owner_connector_templates",
    category: "connector_templates",
    label: "Connector templates",
    valueLabel: "7 modeled connector types",
    ownerOnly: true,
    status: "planned_backend_enforced",
    summary: "Defines global connector templates such as Native Protocol, SDK, MCP, and private worker.",
    customerImpact: "Customers can instantiate allowed connector types within plan limits."
  },
  {
    id: "owner_builtin_catalog",
    category: "built_in_agents",
    label: "Built-in agent catalog",
    valueLabel: "Website QA first",
    ownerOnly: true,
    status: "demo_visible",
    summary: "Owner controls which AgentOps-built agents are published and monetized.",
    customerImpact: "Customers can enable available agents, but cannot modify source/control."
  },
  {
    id: "owner_pricing_rules",
    category: "pricing",
    label: "Pricing and usage rules",
    valueLabel: "Free, Starter, Pro, Enterprise",
    ownerOnly: true,
    status: "demo_visible",
    summary: "Plan limits and usage meters are conceptually owner-controlled.",
    customerImpact: "Customers see plan availability and usage limits only."
  },
  {
    id: "owner_security_policy",
    category: "security_policy",
    label: "Global security policies",
    valueLabel: "Default deny",
    ownerOnly: true,
    status: "planned_backend_enforced",
    summary: "Default event validation, target allowlisting, and secret reference rules.",
    customerImpact: "Workspace policies can tighten rules but not bypass global deny-by-default controls."
  },
  {
    id: "owner_license_controls",
    category: "license",
    label: "License controls",
    valueLabel: "Conceptual only",
    ownerOnly: true,
    status: "future",
    summary: "Self-hosted license enforcement is planned but not implemented.",
    customerImpact: "Enterprise customers would receive controlled packages, not unrestricted source by default."
  }
];

export const mockPlatformLicenseRules: PlatformLicenseRule[] = [
  {
    id: "license_free_demo",
    planId: "free_demo",
    deploymentMode: "local_developer",
    ruleLabel: "Public demo safety",
    enforcedBy: "local_demo_note",
    ownerOnly: true,
    summary: "Allowlisted demo targets only; no real tokens, private URLs, or external execution."
  },
  {
    id: "license_pro_native_protocol",
    planId: "pro",
    deploymentMode: "hosted_saas",
    ruleLabel: "Native Protocol access",
    enforcedBy: "future_backend",
    ownerOnly: true,
    summary: "Custom agent ingestion requires server-side token hashing, event validation, and usage metering."
  },
  {
    id: "license_enterprise_self_hosted",
    planId: "enterprise_self_hosted",
    deploymentMode: "self_hosted_enterprise",
    ruleLabel: "Controlled enterprise package",
    enforcedBy: "future_license_service",
    ownerOnly: true,
    summary: "Private workers and self-hosted features require license and package controls later."
  }
];

export const mockOwnerControlActions: OwnerControlAction[] = [
  { id: "publish_builtin_agent", label: "Publish built-in agent", ownerOnly: true, workspaceConfigurable: false, auditRequired: true },
  { id: "change_plan_limits", label: "Change global plan limits", ownerOnly: true, workspaceConfigurable: false, auditRequired: true },
  { id: "configure_workspace_target", label: "Configure workspace target", ownerOnly: false, workspaceConfigurable: true, auditRequired: true },
  { id: "connect_workspace_agent", label: "Connect workspace agent", ownerOnly: false, workspaceConfigurable: true, auditRequired: true },
  { id: "edit_global_security_policy", label: "Edit global security policy", ownerOnly: true, workspaceConfigurable: false, auditRequired: true }
];
