import type { AgentBuilderReviewSummary, AgentBuilderStep, AgentBuilderTemplate } from "@/types/agent-builder";

export const mockAgentBuilderTemplates: AgentBuilderTemplate[] = [
  {
    id: "template_website_qa",
    name: "Website QA Agent",
    summary: "Recommended first build: local route checks, responsive evidence, accessibility notes, and release gate summaries.",
    builtInAgentId: "builtin_website_qa",
    connectorType: "built_in_agentops_agent",
    planRequired: "free_demo",
    recommended: true,
    generatedWorkflowSteps: ["Select allowlisted route", "Run QA checks", "Create browser session evidence", "Score release readiness", "Record audit summary"]
  },
  {
    id: "template_native_custom",
    name: "Custom Native Protocol Agent",
    summary: "Best for company agents that can emit structured AgentOps events.",
    connectorType: "agentops_native_protocol",
    planRequired: "pro",
    recommended: true,
    generatedWorkflowSteps: ["Validate connector token", "Ingest run.started", "Order run events", "Map tool/risk/evaluation events", "Create audit-linked summary"],
    planLockReason: "Requires Pro for custom Native Protocol ingestion."
  },
  {
    id: "template_private_worker",
    name: "Private Worker Agent",
    summary: "Enterprise template for sensitive environments and company-controlled execution.",
    connectorType: "private_worker",
    planRequired: "enterprise_self_hosted",
    recommended: false,
    generatedWorkflowSteps: ["Register worker", "Validate health", "Check license", "Run private task", "Sync summarized events"],
    planLockReason: "Requires Enterprise/Self-hosted private worker support."
  }
];

export const mockAgentBuilderSteps: AgentBuilderStep[] = [
  {
    id: "builder_step_template",
    kind: "template",
    title: "Choose agent template",
    summary: "Website QA is the recommended first template because it is easy to prove safely.",
    selectedLabel: "Website QA Agent",
    status: "complete",
    securityNote: "Template uses allowlisted local/demo targets only."
  },
  {
    id: "builder_step_connection",
    kind: "connection",
    title: "Select connection method",
    summary: "Built-in AgentOps Agent now; Native Protocol later for custom agents.",
    selectedLabel: "Built-in AgentOps Agent",
    status: "complete",
    securityNote: "No external connector is created in this phase."
  },
  {
    id: "builder_step_capabilities",
    kind: "capabilities",
    title: "Choose capabilities",
    summary: "Browser QA evidence, run events, risk findings, and evaluations.",
    selectedLabel: "QA + evaluation + risk summary",
    status: "current",
    securityNote: "Capabilities are scoped and approval-aware."
  },
  {
    id: "builder_step_targets",
    kind: "allowed_targets",
    title: "Configure allowed targets",
    summary: "Use localhost and reserved invalid demo domains only.",
    selectedLabel: "Local app dashboard",
    status: "complete",
    securityNote: "No random website scanning or private login testing."
  },
  {
    id: "builder_step_approvals",
    kind: "approval_gates",
    title: "Set approval gates",
    summary: "Require review when a target is staging-like or a risk is high.",
    selectedLabel: "Security Reviewer for high risk",
    status: "complete",
    securityNote: "Future backend must enforce gates server-side."
  },
  {
    id: "builder_step_plan",
    kind: "usage_plan",
    title: "Select usage limits",
    summary: "Free Demo supports the first Website QA flow; Pro unlocks custom connectors.",
    selectedLabel: "Free Demo",
    status: "complete",
    securityNote: "Plan enforcement is UI-only until backend billing exists."
  },
  {
    id: "builder_step_test",
    kind: "safe_test",
    title: "Future safe test",
    summary: "A later worker will run a local route test and emit Native Protocol events.",
    selectedLabel: "Not implemented yet",
    status: "future",
    securityNote: "No browser or external execution is added in this phase."
  }
];

export const mockAgentBuilderReview: AgentBuilderReviewSummary = {
  templateId: "template_website_qa",
  connectionMethod: "built_in_agentops_agent",
  privacyMode: "public_demo_safe",
  approvalGates: ["Security Reviewer approval for high risk", "Admin override for release gate bypass"],
  allowedTargetIds: ["target_local_dashboard", "target_demo_domain"],
  usageLimitLabel: "20 demo browser QA minutes",
  generatedWorkflowOutline: ["Trigger Website QA", "Record browser session evidence", "Create evaluation summary", "Flag risks", "Write audit event"],
  futureSafeTestSummary: "Future worker will run only against allowlisted local/demo targets."
};
