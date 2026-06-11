"use client";

import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge } from "@/components/permission-badge";
import { RiskBadge } from "@/components/risk-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockBuiltInAgents } from "@/data/mock-built-in-agents";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { getBuiltInAgentAvailabilityLabel } from "@/lib/agent-builder";
import { useDemoState } from "@/lib/demo-state";
import { canUseBuiltInAgent, getRouteAccess } from "@/lib/role-access";
import { isBuiltInAgentUsageAllowed } from "@/lib/usage-limits";
import type { BuiltInAgentDefinition } from "@/types/agent-builder";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "pro") ?? mockWorkspacePlans[0];
const featuredAgent = mockBuiltInAgents.find((agent) => agent.id === "builtin_website_qa") ?? mockBuiltInAgents[0];

const categoryByAgentId: Record<string, string> = {
  builtin_website_qa: "QA and Release",
  builtin_code_review: "QA and Release",
  builtin_release_readiness: "QA and Release",
  builtin_security_review: "Security and Risk",
  builtin_prompt_injection: "Security and Risk",
  builtin_docs_rag: "Knowledge and Docs",
  builtin_workflow_monitor: "Monitoring and Analytics",
  builtin_data_analytics: "Monitoring and Analytics",
  builtin_research_competitor: "Research"
};

const categories = ["QA and Release", "Security and Risk", "Knowledge and Docs", "Monitoring and Analytics", "Research"];
const categoryMeta: Record<string, { description: string; plannedModule: string; output: string }> = {
  "QA and Release": {
    description: "Modules that produce route evidence, release-gate signals, and reviewer-ready summaries.",
    plannedModule: "Accessibility Regression Agent",
    output: "Evidence, approval checkpoints, evaluations, audit records"
  },
  "Security and Risk": {
    description: "Modules that detect unsafe automation, policy drift, prompt injection, and sensitive tool risk.",
    plannedModule: "Secret Exposure Review Agent",
    output: "Risk findings, reviewer ownership, mitigation notes"
  },
  "Knowledge and Docs": {
    description: "Modules that turn documents into cited, reviewable answers without treating retrieved text as instruction.",
    plannedModule: "Policy Knowledge Agent",
    output: "Source-linked artifacts and evaluation notes"
  },
  "Monitoring and Analytics": {
    description: "Modules that summarize run health, approval age, cost drift, and quality trends.",
    plannedModule: "Cost Anomaly Agent",
    output: "Run signals, cost summaries, trend warnings"
  },
  Research: {
    description: "Modules that organize research into source-backed artifacts for product and founder review.",
    plannedModule: "Launch Brief Agent",
    output: "Research artifacts, review checkpoints, citations"
  }
};

function isFutureAgent(agent: BuiltInAgentDefinition) {
  return agent.implementationStatus === "future" || agent.implementationStatus === "planned";
}

function getImplementationStatusLabel(agent: BuiltInAgentDefinition) {
  if (agent.implementationStatus === "recommended_demo_foundation") {
    return "recommended";
  }

  if (agent.implementationStatus === "demo_ready") {
    return "available";
  }

  return agent.implementationStatus === "planned" ? "planned" : "future";
}

function getAgentActionState({
  agent,
  included,
  canUse
}: {
  agent: BuiltInAgentDefinition;
  included: boolean;
  canUse: boolean;
}) {
  if (isFutureAgent(agent)) {
    return { disabled: true, label: "Coming later", variant: "secondary" as const };
  }

  if (!included) {
    return { disabled: true, label: "Upgrade required", variant: "secondary" as const };
  }

  if (!canUse) {
    return { disabled: true, label: "Role locked", variant: "secondary" as const };
  }

  return { disabled: false, label: "Use in Agent Builder", variant: "primary" as const };
}

export function BuiltInAgentCatalog() {
  const { selectedRole } = useDemoState();
  const access = getRouteAccess(selectedRole, "/built-in-agents");
  const featuredIncluded = isBuiltInAgentUsageAllowed(featuredAgent, currentPlan);
  const featuredCanUse = canUseBuiltInAgent(selectedRole, featuredAgent, currentPlan);
  const featuredAction = getAgentActionState({
    agent: featuredAgent,
    included: featuredIncluded,
    canUse: featuredCanUse
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Built-in agents"
        title="Governed agent modules marketplace."
        description="Browse productized modules, compare plan access, and route available agents into the local builder studio."
        action={<PermissionBadge level={access.level} />}
      />

      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.45fr)]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge label="Monetizable modules" tone="success" />
              <StatusBadge label="Plan-aware access" tone="info" />
              <StatusBadge label="Draft-ready catalog" tone="neutral" />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">Start with Website QA, then expand into security, release, analytics, and research modules.</h2>
            <p className="muted-copy mt-3 max-w-3xl text-sm">
              Each built-in agent should produce operational evidence: run events, artifacts, risks, approvals, evaluations, and audit records.
            </p>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Featured module</p>
            <p className="mt-2 text-lg font-semibold text-white">{featuredAgent.name}</p>
            <p className="muted-copy mt-2 text-sm">Recommended first because it creates visible Browser QA evidence without requiring real external integrations.</p>
            <ActionButton href="/agent-builder" variant={featuredAction.variant} disabled={featuredAction.disabled} className="mt-4 w-full">
              {featuredAction.label}
            </ActionButton>
          </div>
        </div>
      </section>

      <article className="data-card data-card-strong">
        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold text-white">{featuredAgent.name}</h2>
              <StatusBadge label="recommended first demo agent" tone="success" />
              <RiskBadge riskLevel={featuredAgent.riskLevel} />
            </div>
            <p className="muted-copy mt-3 max-w-3xl text-sm">{featuredAgent.purpose}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="detail-tile">
                <p className="meta-label">Primary proof</p>
                <p className="mt-1 text-sm font-semibold text-white">Visible QA evidence</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Meter</p>
                <p className="mt-1 text-sm font-semibold text-white">{featuredAgent.usageMeter.replaceAll("_", " ")}</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Tier</p>
                <p className="mt-1 text-sm font-semibold text-white">{featuredAgent.monetizationTier.replaceAll("_", " ")}</p>
              </div>
            </div>
          </div>
          <div className="data-card-muted p-4">
            <p className="meta-label">Module output</p>
            <div className="mt-3 space-y-2">
              {featuredAgent.bestFor.map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <ActionButton href="/agent-builder" variant={featuredAction.variant} disabled={featuredAction.disabled} className="w-full sm:w-auto">
                {featuredAction.label}
              </ActionButton>
              <ActionButton className="w-full sm:w-auto">View run example</ActionButton>
            </div>
          </div>
        </div>
      </article>

      {categories.map((category) => {
        const agents = mockBuiltInAgents.filter((agent) => categoryByAgentId[agent.id] === category);

        if (agents.length === 0) {
          return null;
        }

        const meta = categoryMeta[category];

        return (
          <SectionCard key={category} title={category} description={meta.description}>
            <div className="marketplace-grid">
              {agents.map((agent) => {
                const included = isBuiltInAgentUsageAllowed(agent, currentPlan);
                const canUse = canUseBuiltInAgent(selectedRole, agent, currentPlan);
                const actionState = getAgentActionState({ agent, included, canUse });

                return (
                  <article key={agent.id} className={["data-card flex min-h-[20rem] min-w-0 flex-col", agent.recommended ? "border-white/[0.14]" : ""].join(" ")}>
                    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white">{agent.name}</p>
                        <p className="muted-copy mt-2 text-sm">{agent.shortDescription}</p>
                      </div>
                      <div className="shrink-0">
                        <RiskBadge riskLevel={agent.riskLevel} />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="detail-tile">
                        <p className="meta-label">Tier</p>
                        <p className="mt-1 text-sm font-semibold text-white">{agent.monetizationTier.replaceAll("_", " ")}</p>
                      </div>
                      <div className="detail-tile">
                        <p className="meta-label">Meter</p>
                        <p className="mt-1 text-sm font-semibold text-white">{agent.usageMeter.replaceAll("_", " ")}</p>
                      </div>
                    </div>

                    <p className="muted-copy mt-4 text-sm">{agent.purpose}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge label={getImplementationStatusLabel(agent)} tone={agent.implementationStatus === "recommended_demo_foundation" ? "success" : isFutureAgent(agent) ? "warning" : "neutral"} />
                      <StatusBadge label={getBuiltInAgentAvailabilityLabel(agent, currentPlan)} tone={included ? "success" : "warning"} />
                    </div>

                    <div className="mt-auto grid gap-2 pt-5 sm:grid-cols-2">
                      <ActionButton href="/agent-builder" disabled={actionState.disabled} variant={actionState.variant} className="w-full">
                        {actionState.label}
                      </ActionButton>
                      <ActionButton disabled={isFutureAgent(agent)} className="w-full">
                        {isFutureAgent(agent) ? "Coming later" : "View run example"}
                      </ActionButton>
                    </div>
                  </article>
                );
              })}
              {agents.length < 2 ? (
                <article className="data-card-muted flex min-h-[20rem] min-w-0 flex-col justify-between p-4">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{meta.plannedModule}</p>
                        <p className="muted-copy mt-2 text-sm">Planned roadmap module. Shown to clarify category direction without pretending it is implemented.</p>
                      </div>
                      <StatusBadge label="Roadmap" tone="warning" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="detail-tile">
                        <p className="meta-label">Expected output</p>
                        <p className="mt-1 text-sm font-semibold text-white">{meta.output}</p>
                      </div>
                      <div className="detail-tile">
                        <p className="meta-label">Status</p>
                        <p className="mt-1 text-sm font-semibold text-white">Future backend</p>
                      </div>
                    </div>
                  </div>
                  <ActionButton disabled className="mt-5 w-full">
                    Roadmap only
                  </ActionButton>
                </article>
              ) : null}
            </div>
          </SectionCard>
        );
      })}
    </div>
  );
}
