# Backend Roadmap

Backend work is intentionally staged after the deterministic frontend prototype. This roadmap describes the production path without implementing APIs, databases, auth, payments, connectors, or live agent execution in the current phase.

## Why backend is intentionally staged later

The frontend prototype proves product language, role flows, route structure, and governance surfaces before infrastructure is added. That reduces implementation churn and makes the security boundary explicit.

Backend enforcement becomes necessary when the product handles real users, workspaces, connectors, approvals, audit records, secrets, or agent execution.

## Backend principles

The backend should:

- Enforce authorization server-side
- Treat the client role switcher as demo-only
- Persist run events and audit events with stable IDs
- Keep approvals transactional
- Store secret references, not raw secrets
- Validate connector inputs
- Deny unsafe connector targets by default
- Keep AI/tool execution in workers
- Preserve evidence for review and audit

## Server-side RBAC

Server-side role-based access control (RBAC) must protect every sensitive read and write.

Required checks:

- Route access
- Agent creation and updates
- Workflow publish actions
- Run starts and cancellations
- Approval decisions
- Risk resolution
- Sensitive tool detail access
- Audit log access
- Connector changes
- Owner Control access
- Role and policy changes

## Auth and session model

Future auth should support:

- User identity
- Workspace membership
- Role assignment
- Session validation
- Optional single sign-on (SSO) later
- Audit metadata for sensitive actions

The backend must not trust role values sent from the client.

## Database persistence

PostgreSQL is the preferred persistence direction because the domain is relational and audit-heavy.

Suggested entities:

- `users`
- `workspaces`
- `roles`
- `agents`
- `workflows`
- `runs`
- `run_events`
- `approvals`
- `risks`
- `evaluations`
- `audit_events`
- `connectors`
- `connector_policies`
- `plan_limits`

## Append-only audit events

Audit records should be append-only. Sensitive actions should create audit events with actor, action, target, reason, timestamp, correlation ID, and before/after summary.

Audit should cover:

- Approval decisions
- Role changes
- Policy changes
- Workflow publication
- Connector changes
- Secret reference changes
- Risk status changes
- Release gate overrides
- Owner Control actions

## Transactional approvals

Approval decisions should update approval status, related run state, and audit events in one transaction.

Approval rules should enforce:

- Pending-only decisions
- Role eligibility
- Required comments for high-risk actions
- Idempotency for repeated submissions
- Clear rejection and expiry states

## Run event model

Runs should emit ordered events. Events should be immutable after creation.

Run events should include:

- Run ID
- Step ID
- Sequence
- Event type
- Severity
- Message
- Metadata summary
- Timestamp
- Correlation ID

## Evaluation records

Evaluations should be persisted as structured results linked to a run, workflow version, evaluator type, score categories, notes, and release gate impact.

The backend should validate score ranges and record who or what created the evaluation.

## Risk findings

Risk findings should link to runs, tool calls, browser QA records, evaluations, and policies when possible.

Risk records should include:

- Severity
- Category
- Status
- Owner
- Evidence summary
- Remediation notes
- Release impact
- Audit linkage

## Connector policy and allowlists

Connector writes should be denied by default until policy allows them.

Future connector policy should enforce:

- Allowed connector type
- Allowed target
- Allowed environment
- Plan capability
- Role permission
- Approval requirement
- Rate limit
- Audit requirement

## Secrets boundary

The backend should store only secret references in application records. Secret values should live in a secret manager or equivalent protected store.

Secret values must not appear in:

- Client state
- Seed data
- Logs
- Screenshots
- Model prompts
- Tool summaries
- Audit text

## Worker and runtime boundary

Live AI and tool execution should run outside the request/response path.

Worker responsibilities:

- Execute long-running agent tasks
- Apply retry policies
- Enforce environment boundaries
- Resolve scoped secret references
- Emit run events
- Create approval requests
- Record costs and evaluations
- Stop on policy blockers

## API route direction

Future API routes should follow project/workspace scoping and explicit write actions.

Suggested APIs:

- `GET /api/runs`
- `POST /api/runs`
- `GET /api/runs/:id/events`
- `POST /api/approvals/:id/approve`
- `POST /api/approvals/:id/reject`
- `GET /api/audit`
- `POST /api/agents`
- `POST /api/connectors/test`
- `POST /api/evaluations`

These routes are roadmap items only. The current phase does not implement them.

## Suggested implementation phases

1. **Auth and workspace model**: users, sessions, workspaces, memberships, roles
2. **Persistence foundation**: projects, agents, workflows, runs, run events
3. **RBAC middleware**: route/action policies and server-side permission checks
4. **Approvals and audit**: transactional approval decisions and append-only audit events
5. **Risks and evaluations**: structured findings, scoring, and release gate state
6. **Connector policies**: allowlists, token hashing, schema validation, and audit records
7. **Workers**: queue-based run execution and live event emission
8. **Production hardening**: observability, rate limits, retention, backup, and deployment controls
