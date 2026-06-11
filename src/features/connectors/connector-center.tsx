"use client";

import { useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { PermissionBadge, getAccessLevelLabel } from "@/components/permission-badge";
import { SectionCard } from "@/components/section-card";
import { StatusBadge } from "@/components/status-badge";
import { mockConnectors } from "@/data/mock-connectors";
import { mockWorkspacePlans } from "@/data/mock-plans";
import { connectorSecuritySummary, getConnectorCapabilities, isConnectorAllowedForPlan } from "@/lib/connector-policy";
import { nativeProtocolMappings } from "@/lib/agent-protocol";
import { useDemoState } from "@/lib/demo-state";
import { canUseConnector, getRouteAccess } from "@/lib/role-access";

type ConnectorFilter = "recommended" | "demo" | "pro" | "enterprise" | "future";

const currentPlan = mockWorkspacePlans.find((plan) => plan.id === "pro") ?? mockWorkspacePlans[0];
const filters: Array<{ id: ConnectorFilter; label: string }> = [
  { id: "recommended", label: "Recommended" },
  { id: "demo", label: "Available in demo" },
  { id: "pro", label: "Pro" },
  { id: "enterprise", label: "Enterprise" },
  { id: "future", label: "Future" }
];

const connectorDecisionGuide = [
  {
    question: "Fastest setup",
    badge: "Fastest",
    answer: "Built-in AgentOps agents",
    detail: "Use Website QA first to create visible local evidence.",
    tone: "success" as const
  },
  {
    question: "Best custom format",
    badge: "Recommended",
    answer: "Native Protocol",
    detail: "Structured events map cleanly into runs, risks, evaluations, costs, and audit.",
    tone: "success" as const
  },
  {
    question: "Safest private path",
    badge: "Enterprise",
    answer: "Private Worker connector",
    detail: "Enterprise teams keep sensitive execution and secrets inside their boundary later.",
    tone: "warning" as const
  },
  {
    question: "Existing external agents",
    badge: "External",
    answer: "BYO Webhook or SDK",
    detail: "Future signed callbacks or typed client helpers can feed the control plane.",
    tone: "info" as const
  },
  {
    question: "Internal tools",
    badge: "Internal",
    answer: "MCP/tool connector",
    detail: "Tool output stays data; permission and approval gates decide follow-up action.",
    tone: "warning" as const
  },
  {
    question: "Old run history",
    badge: "Import",
    answer: "Trace/import connector",
    detail: "Backfill governance views from existing logs after redaction.",
    tone: "neutral" as const
  }
];

export function ConnectorCenter() {
  const { selectedRole, uiMode } = useDemoState();
  const access = getRouteAccess(selectedRole, "/connectors");
  const [activeFilter, setActiveFilter] = useState<ConnectorFilter>("recommended");

  const filteredConnectors = mockConnectors.filter((connector) => {
    if (activeFilter === "recommended") {
      return connector.isRecommended;
    }

    if (activeFilter === "demo") {
      return connector.status === "demo_ready";
    }

    if (activeFilter === "pro") {
      return connector.minimumPlan === "pro";
    }

    if (activeFilter === "enterprise") {
      return connector.minimumPlan === "enterprise_self_hosted";
    }

    return connector.status === "future";
  });
  const visibleDecisionGuide = uiMode === "simple" ? connectorDecisionGuide.slice(0, 3) : connectorDecisionGuide;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Connector center"
        title="Choose how agents connect."
        description="Compare built-in modules, Native Protocol, private workers, and migration paths by evidence, privacy, and setup effort."
        action={<PermissionBadge level={access.level} />}
      />

      <section className="command-panel p-4 sm:p-5">
        <div className="grid gap-5 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="min-w-0">
            <p className="meta-label">10-second decision guide</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text-strong)] sm:text-2xl">Pick the connector by evidence, privacy, and setup effort.</h2>
            <p className="muted-copy mt-3 text-sm">
              {uiMode === "simple"
                ? "Start with built-in Website QA. Use Native Protocol when a custom agent needs structured governance events."
                : "Native Protocol is the recommended structured path because it preserves run events, tool calls, risks, approvals, evaluations, costs, and audit records in one contract."}
            </p>
            <div className="professional-only mt-4 grid gap-3 sm:grid-cols-3">
              <div className="detail-tile">
                <p className="meta-label">Current plan</p>
                <p className="mt-1 text-sm font-semibold text-white">{currentPlan.name}</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Role control</p>
                <p className="mt-1 text-sm font-semibold text-white">{getAccessLevelLabel(access.level)}</p>
              </div>
              <div className="detail-tile">
                <p className="meta-label">Best default</p>
                <p className="mt-1 text-sm font-semibold text-white">Native Protocol</p>
              </div>
            </div>
          </div>
          <div className="decision-matrix">
            {visibleDecisionGuide.map((item) => (
              <article key={item.question} className={["decision-tile", item.answer === "Native Protocol" ? "decision-tile-featured" : ""].join(" ")}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="meta-label">{item.question}</p>
                    <p className="mt-1 text-sm font-semibold text-white">{item.answer}</p>
                  </div>
                  <StatusBadge label={item.badge} tone={item.tone} />
                </div>
                <p className="muted-copy mt-2 text-sm">{item.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="professional-only grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="data-card data-card-strong">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-white">Recommended connection path</p>
              <p className="muted-copy mt-2 text-sm">Start with built-in Website QA, then graduate custom agents to AgentOps Native Protocol when structured ingestion is ready.</p>
            </div>
            <StatusBadge label={currentPlan.name} tone="success" />
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="detail-tile">
              <p className="meta-label">Fastest demo</p>
              <p className="mt-1 text-sm font-semibold text-white">Built-in AgentOps Agent</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Best custom path</p>
              <p className="mt-1 text-sm font-semibold text-white">Native Protocol</p>
            </div>
            <div className="detail-tile">
              <p className="meta-label">Security posture</p>
              <p className="mt-1 text-sm font-semibold text-white">Allowlist + audit</p>
            </div>
          </div>
        </article>

        <article className="data-card data-card-strong">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white">Native Protocol event preview</p>
              <p className="muted-copy mt-2 text-sm">The custom-agent contract maps structured events into runs, tools, risks, evaluations, costs, and audit records.</p>
            </div>
            <StatusBadge label="recommended" tone="success" />
          </div>
          <div className="mt-4 space-y-2">
            {nativeProtocolMappings.slice(0, 4).map((mapping) => (
              <div key={mapping.eventCategory} className="data-card-muted flex items-center justify-between gap-3 p-3">
                <span className="mono-token text-xs">{mapping.eventCategory}</span>
                <span className="text-xs text-slate-400">{mapping.mapsTo.slice(0, 2).join(" + ")}</span>
              </div>
            ))}
          </div>
        </article>
      </div>

      <SectionCard
        title="Connector methods"
        description={uiMode === "simple" ? "Recommended paths stay first; Pro mode keeps the deeper implementation notes." : "Role and plan state determine whether actions are configurable, read-only, locked by plan, or reserved for a later service phase."}
      >
        <div className="sidebar-scroll -mx-1 flex gap-2 overflow-x-auto px-1 pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              onClick={() => setActiveFilter(filter.id)}
              className={["secondary-action shrink-0", activeFilter === filter.id ? "border-white/[0.16] bg-white/[0.075] text-white" : ""].join(" ")}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-4 xl:grid-cols-2">
          {(uiMode === "simple" ? filteredConnectors.slice(0, 3) : filteredConnectors).map((connector) => {
            const planAvailable = isConnectorAllowedForPlan(connector, currentPlan);
            const roleCanUse = canUseConnector(selectedRole, connector, currentPlan);
            const capabilities = getConnectorCapabilities(connector.type);
            const disabledReason = !planAvailable ? "Locked by plan" : connector.status === "future" ? "Future backend" : !roleCanUse ? "Read-only role" : "Use in builder";

            return (
              <article key={connector.id} className={["data-card", connector.isRecommended ? "border-white/[0.16] bg-white/[0.04]" : ""].join(" ")}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-white">{connector.name}</p>
                      {connector.isRecommended ? <StatusBadge label="recommended" tone="success" /> : null}
                    </div>
                    <p className="muted-copy mt-2 text-sm">{connector.summary}</p>
                  </div>
                  <StatusBadge label={connector.status} tone={connector.status === "demo_ready" ? "success" : connector.status === "planned" ? "warning" : "neutral"} />
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="detail-tile">
                    <p className="meta-label">Setup</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.setupDifficulty}</p>
                  </div>
                  <div className="detail-tile">
                    <p className="meta-label">Privacy</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.privacyLevel.replaceAll("_", " ")}</p>
                  </div>
                  <div className="detail-tile">
                    <p className="meta-label">Minimum plan</p>
                    <p className="mt-1 text-sm font-semibold text-white">{connector.minimumPlan.replaceAll("_", " ")}</p>
                  </div>
                </div>

                <p className="muted-copy mt-4 text-sm">{connector.bestFor}</p>
                <p className="data-card-muted mt-3 p-3 text-xs leading-5 text-slate-400">{connectorSecuritySummary(connector)}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <StatusBadge label={planAvailable ? "plan available" : "locked by plan"} tone={planAvailable ? "success" : "warning"} />
                  {capabilities.slice(0, 4).map((capability) => (
                    <span key={capability} className="mono-token rounded-md border border-white/[0.075] bg-white/[0.035] px-2 py-1 text-[11px]">
                      {capability}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <ActionButton disabled={connector.status === "future"}>View decision notes</ActionButton>
                  <ActionButton disabled={!roleCanUse || connector.status === "future"} variant={roleCanUse ? "primary" : "secondary"}>
                    {disabledReason}
                  </ActionButton>
                </div>
              </article>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
}
