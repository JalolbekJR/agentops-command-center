# Agent Connection Model

## Goal

AgentOps Command Center must adapt to company-owned agents while also supporting AgentOps-built agents. This model extends the existing Agent, Workflow, WorkflowRun, RunEvent, ToolCall, ApprovalRequest, EvaluationResult, RiskFinding, BrowserSession, CostMetric, and AuditLog architecture. It does not replace it.

Phase 3A is local deterministic UI and typed architecture only. No real ingestion, webhooks, SDK, workers, secrets, or external calls exist yet.

## Connector Types

| Connector | Best For | Phase 3A Status | Security Posture |
| --- | --- | --- | --- |
| Built-in AgentOps Agent | Fastest safe demo path and monetizable AgentOps agents. | Demo-ready foundation | Allowlisted local/demo targets only. |
| AgentOps Native Agent Protocol | Best recommended path for custom company agents. | Planned foundation | Structured events, future backend validation, hashed tokens. |
| BYO Agent Webhook | Existing company agent runtimes sending callbacks. | Future | Signed webhooks and replay protection required. |
| SDK Client | Product teams that want typed instrumentation helpers. | Future | Backend-issued keys; no raw secrets in logs. |
| MCP Tool Connector | Tool-rich agent systems that need governance. | Future enterprise | Treat tool output as data, validate schemas, require approvals. |
| Private Worker | Sensitive company data and internal network execution. | Planned enterprise | Company-controlled secrets/network with licensed worker package. |
| Trace Importer | Backfilling existing agent traces for review. | Future | Redact before import; store summaries and references. |

## Connection Flow

1. Workspace chooses connector type allowed by plan.
2. Workspace configures allowed targets.
3. Future backend issues or stores connector secret references, never raw client-side values.
4. Agent or worker emits events or summaries.
5. Events map into existing AgentOps entities.
6. Risk, approval, evaluation, cost, and audit records are created from structured events.

## Mapping To Core Model

| Connector Output | AgentOps Entity |
| --- | --- |
| Run start/status | WorkflowRun, RunEvent |
| Step/log event | RunEvent |
| Tool call | ToolCall, RunEvent |
| Approval pause | ApprovalRequest, AuditLog |
| Risk signal | RiskFinding |
| Evaluation score | EvaluationResult |
| Screenshot/report/log bundle | AgentArtifact and future BrowserSession artifact references |
| Usage/cost | CostMetric |
| Sensitive setup change | AuditLog |

## Security Rules

- Default deny.
- No raw secrets in client, events, logs, or artifacts.
- Connector tokens are future backend-only and stored hashed.
- Targets must be allowlisted before execution.
- Public demo targets are local or reserved demo patterns only.
- Private workers are required for sensitive company data.
- Every future connector write must be attributable and auditable.

## Acceptance Criteria

- Every connector type maps back to existing AgentOps run/evidence entities.
- AgentOps Native Protocol is the recommended custom-agent path.
- Built-in agents remain a first-class monetizable path.
- Public demo remains safe and deterministic.
