# Technical discussion notes

These notes summarize the product, architecture, governance model, and roadmap decisions behind AgentOps Command Center. They are written for technical reviewers and stakeholders who want to understand why the prototype is structured around traceability, approvals, evaluation, and auditability.

## Product summary

AgentOps Command Center is a deterministic frontend control-plane prototype for AI agent operations. It models how teams can create agents, run workflows, inspect timelines, review tool calls, approve risky actions, evaluate quality, track cost, and audit decisions.

The current implementation focuses on local deterministic product behavior. Backend enforcement, live agent execution, authentication, database persistence, external APIs, billing, and deployment are intentionally scoped to the roadmap.

## Architecture discussion

The product is built around a set of core entities:

- Agent
- Workflow
- Workflow run
- Run event
- Tool call
- Approval request
- Evaluation result
- Risk finding
- Browser QA session
- Cost metric
- Audit log
- Role and permission

A workflow is modeled as a graph of steps. A run emits ordered events, and high-risk tool calls can pause for human approval. Evaluation scores and risk findings feed into release gates, while audit logs record sensitive decisions.

The recommended backend path is a modular monolith with Next.js, TypeScript, PostgreSQL, server-side role-based access control (RBAC), a queue/worker model for run execution, and live timeline updates. Real AI integration belongs behind tool permission gates, secret references, prompt-injection controls, cost tracking, and evaluation hooks.

## Agent run model

An AI agent run is modeled as a governed operation, not a black-box response. The run model separates:

- Run state
- Workflow step state
- Tool call state
- Approval state
- Failure category
- Evaluation result
- Risk finding
- Cost and token record
- Audit event

This structure supports debugging, review, replay, and release decisions.

## Workflow engine model

A workflow is a directed graph of steps with dependencies, tool permissions, approval checkpoints, retry rules, and evaluation gates.

Supported step concepts include:

- Trigger
- Agent task
- Tool call
- Approval checkpoint
- Evaluation
- Browser QA
- Release gate
- Notification

Cycles are invalid. Published versions should be immutable in the future backend. High-risk steps pause for approval, failures create timeline events, and risk findings can block release gates.

## Security and RBAC discussion

The local role switcher demonstrates role-specific product behavior, but it is not a production authorization boundary. A real backend must enforce RBAC server-side for every sensitive read and write.

The security model uses:

- Least-privilege roles
- Approval gates for high-risk actions
- Secret references instead of secret values
- Audit logs for sensitive decisions
- Prompt-injection and tool-injection awareness
- Environment boundaries for local, development, staging, and production-like contexts
- Redaction of sensitive tool details

## Data model discussion

The domain is relational because agents, workflows, runs, events, approvals, evaluations, risks, cost metrics, and audit logs need consistent relationships and indexes.

The future database direction uses:

- PostgreSQL persistence
- Immutable run events
- Append-only audit logs
- Indexes on project, status, severity, timestamp, workflow, and trace identifiers
- Secret references rather than raw secret values

## Testing and QA discussion

The quality strategy covers:

- Type checking
- Linting
- Build verification
- Route and console smoke tests
- Role and access regression tests
- Responsive screenshots
- Browser QA records
- Accessibility review
- Security review
- Performance checks for tables, timelines, filtering, and charts

The current Playwright suite focuses on route stability, console cleanliness, role/access behavior, responsive layout, theme and mode screenshots, and sidebar state screenshots.

## Engineering tradeoffs

| Tradeoff | Decision |
| --- | --- |
| Deterministic frontend prototype before backend | Keeps scope honest while proving product flows and domain language |
| Modular monolith before services | Keeps RBAC, audit, API contracts, and workflow logic coherent during early product development |
| Role switcher before production auth | Demonstrates product behavior while making the backend enforcement boundary explicit |
| Local seeded data before external integrations | Enables repeatable QA, screenshots, and review without secrets or external accounts |
| Dense operations UI over marketing layout | Matches the needs of engineers, reviewers, and operators who scan state repeatedly |

## Backend roadmap

The next backend phases should add:

1. Authentication and workspace membership
2. Server-side RBAC enforcement
3. PostgreSQL persistence
4. API validation and error contracts
5. Append-only audit writer
6. Queue and worker execution for long-running agent tasks
7. Connector token hashing and secret references
8. Evaluation and release-gate enforcement
9. Observability, rate limits, retention, and deployment controls

## Discussion checklist

- Explain the product as an AI agent operations control plane
- Show how runs connect agents, workflows, risks, approvals, evaluations, and audit logs
- Distinguish deterministic frontend behavior from future backend enforcement
- Emphasize server-side RBAC as a required production upgrade
- Show how the roadmap adds live integrations without weakening governance
