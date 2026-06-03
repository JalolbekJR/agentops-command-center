import type { DeploymentModeSummary, SetupHealthCheck, SetupStep } from "@/types/setup";

export const mockDeploymentModes: DeploymentModeSummary[] = [
  {
    mode: "hosted_saas",
    label: "Hosted SaaS",
    bestFor: "Small teams that want the fastest setup and do not need private network execution.",
    ownerControls: ["Global infrastructure", "connector templates", "plan limits", "built-in catalog"],
    customerControls: ["Workspace name", "allowed targets", "connected agents", "team members"],
    protectionNotes: ["Best protection model for small teams because customers do not receive unrestricted source."]
  },
  {
    mode: "self_hosted_enterprise",
    label: "Self-hosted / Enterprise",
    bestFor: "Companies that require private workers, internal networks, or controlled package distribution.",
    ownerControls: ["License rules", "built-in catalog publishing", "global defaults"],
    customerControls: ["Database", "worker runtime", "network controls", "workspace policies within license limits"],
    protectionNotes: ["Source distribution cannot be fully protected; licensed container/package delivery is the safer model."]
  },
  {
    mode: "local_developer",
    label: "Local Developer Mode",
    bestFor: "Portfolio development and deterministic local demos with no paid APIs.",
    ownerControls: ["Demo data", "local feature flags", "setup defaults"],
    customerControls: ["None in public demo"],
    protectionNotes: ["No secrets, production controls, or private customer data should exist in local demo mode."]
  }
];

export const mockSetupSteps: SetupStep[] = [
  {
    id: "setup_deployment_mode",
    sequence: 1,
    title: "Choose deployment mode",
    summary: "Start with Hosted SaaS for small teams, Self-hosted for private workers, or Local Developer for demos.",
    ownerLevel: "shared",
    status: "ready",
    recommended: true,
    requiredPlan: "free_demo",
    relatedConnectorTypes: ["built_in_agentops_agent"],
    securityNotes: ["Deployment mode decides who controls infrastructure, secrets, and worker boundaries."]
  },
  {
    id: "setup_persistence",
    sequence: 2,
    title: "Connect future persistence",
    summary: "PostgreSQL is planned later for runs, audit, plans, connectors, and owner policies.",
    ownerLevel: "platform_owner",
    status: "future_backend",
    recommended: false,
    requiredPlan: "enterprise_self_hosted",
    relatedConnectorTypes: [],
    securityNotes: ["No real database is connected in this phase."]
  },
  {
    id: "setup_connector_method",
    sequence: 3,
    title: "Choose agent connection method",
    summary: "Use built-in agents first, then Native Protocol for custom agents.",
    ownerLevel: "workspace_admin",
    status: "ready",
    recommended: true,
    requiredPlan: "free_demo",
    relatedConnectorTypes: ["built_in_agentops_agent", "agentops_native_protocol", "byo_webhook", "sdk_client"],
    securityNotes: ["Connector tokens are future backend-only and never shown in client data."]
  },
  {
    id: "setup_allowed_targets",
    sequence: 4,
    title: "Configure allowlisted targets",
    summary: "Public demo stays limited to local/demo targets; staging-like targets require approval.",
    ownerLevel: "workspace_admin",
    status: "ready",
    recommended: true,
    requiredPlan: "free_demo",
    relatedConnectorTypes: ["built_in_agentops_agent", "agentops_native_protocol"],
    securityNotes: ["No random website scanning or private login flows in public demo mode."]
  },
  {
    id: "setup_health_checks",
    sequence: 5,
    title: "Verify worker and connector health",
    summary: "Health cards show what would be checked before real execution starts.",
    ownerLevel: "shared",
    status: "needs_input",
    recommended: false,
    requiredPlan: "starter",
    relatedConnectorTypes: ["private_worker", "agentops_native_protocol"],
    securityNotes: ["Future health checks must avoid leaking internal hostnames or secrets."]
  },
  {
    id: "setup_safe_test",
    sequence: 6,
    title: "Run first safe test",
    summary: "The first test should target an allowlisted local route and produce reviewable run events.",
    ownerLevel: "workspace_admin",
    status: "future_backend",
    recommended: false,
    requiredPlan: "free_demo",
    relatedConnectorTypes: ["built_in_agentops_agent"],
    securityNotes: ["Future safe tests must be explicit, rate-limited, and audited when high risk."]
  }
];

export const mockSetupHealthChecks: SetupHealthCheck[] = [
  {
    id: "health_allowlist",
    label: "Allowed targets",
    status: "healthy",
    summary: "Local/demo targets are configured and production-like targets require approval.",
    ownerLevel: "workspace_admin",
    remediation: "Keep demo targets allowlisted and avoid private login flows."
  },
  {
    id: "health_native_protocol",
    label: "Native protocol",
    status: "warning",
    summary: "Protocol model is defined locally; backend ingestion is not implemented yet.",
    ownerLevel: "shared",
    remediation: "Implement backend validation in Phase 3C before accepting real events."
  },
  {
    id: "health_private_worker",
    label: "Private worker",
    status: "not_configured",
    summary: "Enterprise private worker is modeled but not connected.",
    ownerLevel: "platform_owner",
    remediation: "Use licensed worker packaging in a later enterprise phase."
  },
  {
    id: "health_billing",
    label: "Plan enforcement",
    status: "future",
    summary: "Plan and usage limits are deterministic UI concepts only.",
    ownerLevel: "platform_owner",
    remediation: "Enforce limits server-side when real billing/subscription state exists."
  }
];
