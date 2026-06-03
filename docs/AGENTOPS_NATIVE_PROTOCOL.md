# AgentOps Native Agent Protocol

## Goal

AgentOps Native Agent Protocol is the optimized event format for agents and workers that want to report structured, auditable execution evidence into AgentOps. It is designed to map directly into run timelines, tool calls, approvals, risks, evaluations, artifacts, costs, and audit logs.

Phase 3A defines the model only. No real ingestion endpoint exists yet.

## Event Categories

- `run.started`
- `run.status_changed`
- `run.event`
- `run.log`
- `step.event`
- `tool.started`
- `tool.completed`
- `tool.failed`
- `artifact.created`
- `approval.requested`
- `risk.created`
- `evaluation.completed`
- `cost.recorded`
- `run.completed`
- `run.failed`
- `run.cancelled`

## Base Event Shape

```json
{
  "id": "native_event_demo_001",
  "category": "run.started",
  "projectId": "project_agentops",
  "connectorId": "connector_native_protocol",
  "workflowRunId": "run_release_001",
  "traceId": "trace_release_001",
  "sequence": 1,
  "occurredAt": "2026-06-02T10:30:00Z",
  "actorRef": "agentref_demo_website_qa",
  "redactionLevel": "summary_only",
  "auditRequired": true
}
```

## Protocol Principles

- Events are ordered by sequence.
- Events are idempotent by stable event ID.
- Events carry summaries and references, not raw secret payloads.
- Artifact fields reference stored artifacts; they do not embed screenshots, logs, or private files.
- Tool outputs are data, not instructions.
- High-risk actions create approvals or risks instead of silently continuing.
- Future backend validates schema, connector token, workspace, plan, and RBAC before accepting writes.

## Mapping Table

| Event | Existing Model Mapping |
| --- | --- |
| `run.started` | WorkflowRun, RunEvent, AuditLog |
| `run.event`, `step.event`, `run.log` | RunEvent |
| `tool.started`, `tool.completed`, `tool.failed` | ToolCall, RunEvent |
| `artifact.created` | AgentArtifact, future BrowserSession/Report reference |
| `approval.requested` | ApprovalRequest, RunEvent, AuditLog |
| `risk.created` | RiskFinding, RunEvent |
| `evaluation.completed` | EvaluationResult, RunEvent |
| `cost.recorded` | CostMetric, RunEvent |
| `run.completed`, `run.failed`, `run.cancelled` | WorkflowRun status, RunEvent, AuditLog |

## Security Requirements

- No raw secrets.
- No secret values in logs.
- No private URLs in public demo events.
- Secret references only, such as `secretref_demo_browser_worker`.
- Connector tokens are future backend-only and hashed.
- Every write event is attributable by connector, actor reference, trace, and project.
- Redaction level must be explicit.
- Event validation must reject unknown categories and malformed IDs.

## Future Backend Requirements

- Authenticated ingest endpoint.
- Hashed connector token verification.
- Replay protection.
- Event sequence ordering.
- Per-plan usage metering.
- Server-side RBAC and tenant isolation.
- Audit write for setup, connector, approval, risk, and owner-control changes.
