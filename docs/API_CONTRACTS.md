# API Contracts

## Contract Goal

These contracts define the future REST-style API shape for AgentOps Command Center. Phase 1 does not implement an API. The goal is to make the domain model concrete enough that the future Next.js demo and backend upgrade can share consistent names, IDs, statuses, validation rules, and RBAC expectations.

## API Principles

- Use project-scoped endpoints where possible.
- Keep write actions explicit and auditable.
- Return reviewer-friendly summaries, not raw sensitive tool payloads.
- Support pagination for high-volume resources.
- Use stable error codes.
- Enforce RBAC server-side in future backend phases.
- Treat the role switcher as demo-only until real auth exists.

## Shared Response Shapes

### Pagination

```json
{
  "data": [],
  "page": {
    "cursor": "run_2026_06_02_001",
    "nextCursor": "run_2026_06_02_002",
    "limit": 25
  }
}
```

### Error

```json
{
  "error": {
    "code": "approval.not_authorized",
    "message": "The current role cannot decide this approval request.",
    "requestId": "req_demo_001"
  }
}
```

Common errors:

- `auth.required`
- `rbac.denied`
- `validation.invalid_input`
- `resource.not_found`
- `resource.conflict`
- `approval.not_pending`
- `workflow.invalid_transition`
- `rate_limit.exceeded`

## Projects

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects` | List projects visible to the current user. |
| `GET` | `/api/projects/{projectId}` | Get project summary. |
| `PATCH` | `/api/projects/{projectId}` | Update project metadata. |

Request example:

```json
{
  "name": "AgentOps Command Center",
  "status": "active"
}
```

Response example:

```json
{
  "id": "project_agentops",
  "teamId": "team_ai_factory",
  "name": "AgentOps Command Center",
  "slug": "agentops-command-center",
  "environment": "demo",
  "status": "active",
  "updatedAt": "2026-06-02T10:15:00Z"
}
```

Auth/RBAC note: viewers may read project data; Admin controls project settings.

Validation note: project slug must be unique within a team.

Possible errors: `resource.not_found`, `rbac.denied`, `validation.invalid_input`.

## Agents

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/agents` | List agents with filters for status, owner, and risk level. |
| `POST` | `/api/projects/{projectId}/agents` | Create an agent. |
| `GET` | `/api/projects/{projectId}/agents/{agentId}` | Get agent details. |
| `PATCH` | `/api/projects/{projectId}/agents/{agentId}` | Update agent configuration. |

Request example:

```json
{
  "name": "Browser QA Agent",
  "description": "Runs deterministic browser QA checks for release readiness.",
  "ownerUserId": "user_qa",
  "riskLevel": "medium",
  "defaultModel": "mock-evaluator",
  "capabilities": [
    {
      "name": "Browser QA",
      "category": "qa",
      "requiresApproval": false,
      "riskLevel": "medium",
      "toolName": "browser_session_runner"
    }
  ]
}
```

Response example:

```json
{
  "id": "agent_browser_qa",
  "projectId": "project_agentops",
  "name": "Browser QA Agent",
  "status": "active",
  "riskLevel": "medium",
  "successRate": 0.92,
  "averageCostCents": 18
}
```

Auth/RBAC note: AI Engineer and Admin can create or edit agents. Security Reviewer may review risk configuration.

Validation note: capability names and tool names must be from allowed project policies.

Possible errors: `rbac.denied`, `validation.invalid_input`, `resource.conflict`.

## Workflows

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/workflows` | List workflows. |
| `POST` | `/api/projects/{projectId}/workflows` | Create draft workflow. |
| `GET` | `/api/projects/{projectId}/workflows/{workflowId}` | Get workflow definition. |
| `PATCH` | `/api/projects/{projectId}/workflows/{workflowId}` | Update draft workflow metadata. |
| `POST` | `/api/projects/{projectId}/workflows/{workflowId}/publish` | Publish a new workflow version. |

Request example:

```json
{
  "name": "Release Readiness Review",
  "triggerType": "manual",
  "description": "Runs QA, risk, and evaluation checks before release."
}
```

Response example:

```json
{
  "id": "workflow_release_review",
  "projectId": "project_agentops",
  "name": "Release Readiness Review",
  "status": "draft",
  "version": 1,
  "triggerType": "manual"
}
```

Auth/RBAC note: AI Engineer can draft; Admin or configured approver can publish high-risk workflows.

Validation note: publish requires a valid graph, no missing dependencies, and policy-compatible tools.

Possible errors: `workflow.invalid_graph`, `rbac.denied`, `resource.conflict`.

## Workflow Steps

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/workflows/{workflowId}/steps` | List workflow steps. |
| `POST` | `/api/projects/{projectId}/workflows/{workflowId}/steps` | Add step to a draft workflow. |
| `PATCH` | `/api/projects/{projectId}/workflows/{workflowId}/steps/{stepId}` | Update step. |
| `DELETE` | `/api/projects/{projectId}/workflows/{workflowId}/steps/{stepId}` | Remove draft step. |

Request example:

```json
{
  "stepKey": "security_review",
  "name": "Review high-risk findings",
  "type": "approval",
  "dependsOnStepKeys": ["risk_scan"],
  "approvalPolicyId": "policy_high_risk_security"
}
```

Response example:

```json
{
  "id": "step_security_review",
  "workflowId": "workflow_release_review",
  "stepKey": "security_review",
  "type": "approval",
  "status": "draft"
}
```

Auth/RBAC note: AI Engineer and Admin can edit draft steps; Viewer cannot write.

Validation note: `dependsOnStepKeys` must not create cycles.

Possible errors: `workflow.invalid_graph`, `validation.invalid_input`, `rbac.denied`.

## Workflow Runs

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/runs` | List workflow runs. |
| `POST` | `/api/projects/{projectId}/workflows/{workflowId}/runs` | Start a workflow run. |
| `GET` | `/api/projects/{projectId}/runs/{runId}` | Get run detail summary. |
| `POST` | `/api/projects/{projectId}/runs/{runId}/cancel` | Cancel a queued or running workflow run. |

Request example:

```json
{
  "environment": "demo",
  "input": {
    "releaseCandidate": "v0.3-dashboard-shell"
  }
}
```

Response example:

```json
{
  "id": "run_release_001",
  "workflowId": "workflow_release_review",
  "status": "waiting_for_approval",
  "traceId": "trace_release_001",
  "startedAt": "2026-06-02T10:30:00Z",
  "totalCostCents": 42
}
```

Auth/RBAC note: AI Engineer and Admin can start runs; Product Manager or QA Reviewer may trigger approved review workflows depending on policy.

Validation note: workflow must be published and active.

Possible errors: `workflow.invalid_transition`, `resource.not_found`, `rbac.denied`.

## Run Events

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/runs/{runId}/events` | Get timeline events. |
| `GET` | `/api/projects/{projectId}/runs/{runId}/events/stream` | Future live event stream. |

Request example:

```json
{
  "cursor": "event_010",
  "limit": 50
}
```

Response example:

```json
{
  "data": [
    {
      "id": "event_011",
      "workflowRunId": "run_release_001",
      "sequence": 11,
      "eventType": "approval_requested",
      "severity": "warning",
      "message": "Security approval required for external publish step.",
      "createdAt": "2026-06-02T10:34:12Z"
    }
  ]
}
```

Auth/RBAC note: all project roles may read allowed run events; sensitive metadata may be redacted for Viewer.

Validation note: pagination limit should be bounded.

Possible errors: `resource.not_found`, `rbac.denied`, `rate_limit.exceeded`.

## Tool Calls

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/runs/{runId}/tool-calls` | List tool calls for a run. |
| `GET` | `/api/projects/{projectId}/tool-calls/{toolCallId}` | Get tool call detail. |

Request example:

```json
{
  "status": "waiting_for_approval",
  "riskLevel": "high"
}
```

Response example:

```json
{
  "id": "toolcall_publish_check",
  "workflowRunId": "run_release_001",
  "toolName": "deployment_preflight_check",
  "inputSummary": "Check release candidate v0.3 before publish.",
  "outputSummary": "One high-risk finding requires security review.",
  "status": "waiting_for_approval",
  "riskLevel": "high",
  "approvalRequestId": "approval_security_001"
}
```

Auth/RBAC note: AI Engineer and Security Reviewer can inspect more detail; Viewer gets summaries only.

Validation note: raw inputs and outputs must be redacted before storage or response.

Possible errors: `resource.not_found`, `rbac.denied`.

## Approvals

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/approvals` | List approval queue. |
| `GET` | `/api/projects/{projectId}/approvals/{approvalId}` | Get approval detail. |
| `POST` | `/api/projects/{projectId}/approvals/{approvalId}/approve` | Approve pending request. |
| `POST` | `/api/projects/{projectId}/approvals/{approvalId}/reject` | Reject pending request. |

Request example:

```json
{
  "decisionComment": "Approved for demo environment only. Production-like environments still require release owner review."
}
```

Response example:

```json
{
  "id": "approval_security_001",
  "status": "approved",
  "decision": "approved",
  "decidedByUserId": "user_security",
  "decidedAt": "2026-06-02T10:42:00Z"
}
```

Auth/RBAC note: only roles assigned by policy can decide approvals; all decisions are audited.

Validation note: approval must be pending and comment is required for high or critical risk.

Possible errors: `approval.not_pending`, `approval.not_authorized`, `validation.invalid_input`.

## Evaluations

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/evaluations` | List evaluation results. |
| `GET` | `/api/projects/{projectId}/runs/{runId}/evaluations` | Get evaluations for a run. |
| `POST` | `/api/projects/{projectId}/runs/{runId}/evaluations` | Future create evaluation result. |

Request example:

```json
{
  "evaluatorType": "deterministic_mock",
  "correctnessScore": 0.91,
  "safetyScore": 0.86,
  "reliabilityScore": 0.88,
  "latencyScore": 0.78,
  "costScore": 0.81,
  "userImpactScore": 0.9,
  "policyComplianceScore": 0.84,
  "notes": "Passed with one policy warning."
}
```

Response example:

```json
{
  "id": "eval_release_001",
  "workflowRunId": "run_release_001",
  "overallScore": 0.86,
  "status": "warning",
  "createdAt": "2026-06-02T10:45:00Z"
}
```

Auth/RBAC note: QA Reviewer, Product Manager, AI Engineer, and Admin can read; evaluation writes require system or authorized reviewer.

Validation note: scores must be between 0 and 1.

Possible errors: `validation.invalid_input`, `rbac.denied`, `resource.not_found`.

## Risks

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/risks` | List risk findings. |
| `GET` | `/api/projects/{projectId}/risks/{riskId}` | Get risk detail. |
| `PATCH` | `/api/projects/{projectId}/risks/{riskId}` | Update risk status or owner. |
| `POST` | `/api/projects/{projectId}/risks/{riskId}/comments` | Add reviewer note. |

Request example:

```json
{
  "status": "mitigated",
  "ownerUserId": "user_security",
  "resolutionComment": "Policy updated to block this tool in production-like environments."
}
```

Response example:

```json
{
  "id": "risk_prompt_injection_001",
  "severity": "high",
  "category": "prompt_injection",
  "status": "mitigated",
  "ownerRole": "Security Reviewer"
}
```

Auth/RBAC note: Security Reviewer and Admin can resolve security risks; QA Reviewer can resolve QA risks.

Validation note: status transitions require a reason for high/critical findings.

Possible errors: `rbac.denied`, `validation.invalid_input`, `resource.not_found`.

## Browser Sessions

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/browser-sessions` | List browser QA sessions. |
| `GET` | `/api/projects/{projectId}/browser-sessions/{sessionId}` | Get session detail and steps. |
| `GET` | `/api/projects/{projectId}/browser-sessions/{sessionId}/steps` | List steps. |

Request example:

```json
{
  "status": "failed",
  "workflowRunId": "run_release_001"
}
```

Response example:

```json
{
  "id": "browser_session_001",
  "workflowRunId": "run_release_001",
  "status": "failed",
  "targetUrl": "http://localhost:3000/dashboard",
  "browserName": "chromium",
  "viewport": "1440x900",
  "summary": "Dashboard loaded, but approval queue empty state had insufficient context."
}
```

Auth/RBAC note: QA Reviewer, AI Engineer, Product Manager, Security Reviewer, and Admin can read; Viewer may see summary only.

Validation note: target URL should be allowed by environment boundary.

Possible errors: `resource.not_found`, `rbac.denied`.

## Cost Metrics

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/cost-metrics` | List cost records. |
| `GET` | `/api/projects/{projectId}/cost-metrics/summary` | Get dashboard aggregates. |

Request example:

```json
{
  "from": "2026-06-01T00:00:00Z",
  "to": "2026-06-02T23:59:59Z",
  "groupBy": "agent"
}
```

Response example:

```json
{
  "totalEstimatedCostCents": 1240,
  "totalInputTokens": 740000,
  "totalOutputTokens": 186000,
  "budgetWarningCount": 2
}
```

Auth/RBAC note: Admin, Founder, Product Manager, and AI Engineer can read cost summaries; Viewer may see limited totals.

Validation note: date range must be bounded.

Possible errors: `validation.invalid_input`, `rbac.denied`.

## Audit Logs

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/audit-logs` | List audit records. |
| `GET` | `/api/projects/{projectId}/audit-logs/{auditLogId}` | Get audit detail. |

Request example:

```json
{
  "targetType": "approval_request",
  "actorUserId": "user_security",
  "limit": 25
}
```

Response example:

```json
{
  "id": "audit_approval_001",
  "actorUserId": "user_security",
  "action": "approval.approved",
  "targetType": "approval_request",
  "targetId": "approval_security_001",
  "reason": "Approved for demo environment only.",
  "createdAt": "2026-06-02T10:42:01Z"
}
```

Auth/RBAC note: Admin and Security Reviewer can read full audit logs; Viewer cannot inspect sensitive audit details.

Validation note: audit logs are append-only; no public update/delete endpoints.

Possible errors: `rbac.denied`, `resource.not_found`.

## Team And RBAC

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/teams/{teamId}/members` | List team members. |
| `PATCH` | `/api/teams/{teamId}/members/{userId}` | Update role. |
| `GET` | `/api/teams/{teamId}/roles` | List roles and permissions. |
| `GET` | `/api/teams/{teamId}/permissions` | List permission keys. |

Request example:

```json
{
  "role": "Security Reviewer",
  "reason": "Assigning security review ownership for high-risk automation findings."
}
```

Response example:

```json
{
  "userId": "user_security",
  "teamId": "team_ai_factory",
  "role": "Security Reviewer",
  "updatedAt": "2026-06-02T10:50:00Z"
}
```

Auth/RBAC note: only Founder/Admin can change roles; all role changes are audited.

Validation note: role must be known and cannot remove the last Admin from a team.

Possible errors: `rbac.denied`, `validation.invalid_input`, `resource.conflict`.

## Release Gates

Representative endpoints:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/release-gates` | List release gates. |
| `GET` | `/api/projects/{projectId}/release-gates/{gateId}` | Get gate detail. |
| `POST` | `/api/projects/{projectId}/release-gates/{gateId}/check` | Recalculate release gate status. |
| `POST` | `/api/projects/{projectId}/release-gates/{gateId}/override` | Future controlled override. |

Request example:

```json
{
  "workflowRunId": "run_release_001"
}
```

Response example:

```json
{
  "id": "gate_demo_release",
  "status": "blocked",
  "requiredEvaluationScore": 0.85,
  "blockers": [
    {
      "type": "risk",
      "id": "risk_prompt_injection_001",
      "severity": "high",
      "message": "Unresolved high-risk prompt injection finding."
    }
  ]
}
```

Auth/RBAC note: QA Reviewer, Product Manager, Security Reviewer, and Admin can inspect gates; overrides require Admin and audit record.

Validation note: override requires a comment and cannot bypass critical security policies without explicit future policy support.

Possible errors: `rbac.denied`, `release_gate.blocked`, `validation.invalid_input`.

## Phase 3A Connector And Setup Contracts

These endpoints are future contracts only. Phase 3A implements local deterministic UI, types, and helpers.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/projects/{projectId}/connectors` | List workspace connector configurations and plan availability. |
| `POST` | `/api/projects/{projectId}/connectors` | Future create connector from an owner-approved template. |
| `GET` | `/api/projects/{projectId}/allowed-targets` | List workspace allowlisted targets. |
| `POST` | `/api/projects/{projectId}/allowed-targets` | Future add target with risk/approval policy. |
| `POST` | `/api/projects/{projectId}/native-events` | Future AgentOps Native Protocol ingest endpoint. |
| `GET` | `/api/built-in-agents` | List owner-published built-in AgentOps agents. |
| `GET` | `/api/projects/{projectId}/setup` | Get workspace setup state and health checks. |
| `GET` | `/api/projects/{projectId}/usage` | Get plan usage and limit status. |
| `GET` | `/api/owner/control-plane` | Future owner-only platform controls. |

Security/RBAC notes:

- Connector creation requires server-side RBAC and plan checks.
- Native events require hashed token verification, schema validation, replay protection, and audit attribution.
- Allowed targets must be deny-by-default and environment-aware.
- Owner control endpoints are not customer workspace settings.
- No raw secret values should be returned by any endpoint.
