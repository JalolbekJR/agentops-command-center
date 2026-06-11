# Case study

AgentOps Command Center is a deterministic frontend control-plane prototype for governing AI agent workflows. This case study explains the product problem, the architecture decisions, the current prototype boundary, and the roadmap to backend enforcement.

## Problem

AI agents can browse, call tools, summarize data, generate code, and propose operational actions. Teams need a way to understand what an agent was allowed to do, what it did, which actions were risky, who approved sensitive decisions, how the result was evaluated, and what evidence remains for audit.

Without a control plane, AI automation becomes difficult to debug, govern, and explain to stakeholders.

## Product thesis

AgentOps Command Center models AI automation as an operations and governance problem. The product connects agents, workflows, runs, risks, approvals, evaluations, browser QA evidence, cost records, and audit logs into one reviewable flow.

The prototype starts with deterministic local data so reviewers can inspect product behavior without external accounts, secrets, backend services, live AI calls, or production-side effects.

## Users and stakeholders

- **Founder/Admin**: reviews operating health, owner controls, setup, plans, and full local workspace visibility
- **AI Engineer**: investigates agents, workflows, run timelines, tool calls, and builder configuration
- **QA Reviewer**: checks release readiness, browser QA records, evaluations, and workflow evidence
- **Security Reviewer**: reviews high-risk findings, sensitive tool outputs, approvals, and audit trails
- **Product Manager**: reviews outcomes, packaging, plan limits, and release impact
- **Viewer**: inspects read-only status without access to restricted configuration surfaces

## Core workflow

The central product chain is:

```text
Agent -> Workflow -> Run -> Risk -> Approval -> Evaluation -> Audit
```

The workflow begins with an agent and a workflow definition. A run emits traceable events, tool-call summaries, risk findings, and approval checkpoints. Evaluation results and unresolved risks can block release gates. Audit records preserve who changed what, why it changed, and which run or policy the decision belongs to.

## Architecture decisions

### Deterministic frontend prototype first

The current application uses local deterministic data and client state to prove the product language, navigation model, and governance flows before adding backend complexity.

### Modular monolith before services

The future backend should start as a modular monolith. This keeps RBAC, audit logging, API contracts, workflow logic, and database transactions coherent while the domain model matures.

### Event timeline for runs

Runs are represented as ordered events. This supports debugging, replay, audit review, failure analysis, and timeline-based user interfaces.

### PostgreSQL upgrade path

The domain is relational. Teams, users, projects, agents, workflows, runs, tool calls, approvals, risks, evaluations, browser sessions, cost metrics, and audit logs need reliable joins, indexes, and historical traceability.

### Queue and worker execution later

Real AI and tool execution should happen in workers with retries, policy checks, environment boundaries, rate limits, secret references, and live event updates.

## Deterministic prototype boundary

The current product is not a production system. It does not include:

- Backend authentication
- Database persistence
- Server-side RBAC enforcement
- External APIs
- Payments
- Live agent execution
- Real browser recordings
- Deployed infrastructure
- Production customers

Backend enforcement is intentionally scoped to the roadmap. The local role switcher demonstrates product behavior, but a production system must enforce permissions server-side.

## Safety and governance model

The safety model uses:

- Least-privilege roles
- Route and navigation gating in the local prototype
- Approval checkpoints for high-risk actions
- Risk findings with severity and category
- Evaluation scores tied to release gates
- Secret references rather than raw secrets
- Redacted or summarized sensitive tool output
- Append-only audit-log direction for the future backend

## RBAC and access model

The role model separates product surfaces by responsibility:

- Founder/Admin can access owner controls and all local workspace surfaces
- AI Engineer can access Agent Builder and engineering surfaces, but not Owner Control
- Viewer cannot access Agent Builder or Owner Control
- Settings remains visible while owner-only settings are gated inside the product model

The local product prevents restricted content from rendering for roles that cannot access it. Future backend routes must enforce the same permissions server-side.

## Tradeoffs

| Tradeoff | Decision |
| --- | --- |
| Deterministic prototype vs live integrations | Use deterministic local behavior first to keep review, testing, and scope honest |
| Role switcher vs production auth | Use a local role switcher for product walkthroughs and document the server-side enforcement requirement |
| Modular monolith vs microservices | Start with a modular monolith until scale or team boundaries justify services |
| Dense operations UI vs marketing layout | Use an operations layout because the target workflow needs scanning, comparison, and repeated review |
| Mock billing model vs live payments | Model plans and limits without payment code until backend and billing scope are approved |

## Current implementation

The current application includes:

- Premium responsive app shell
- Role-aware navigation and route gates
- Custom role switcher
- Dark and light themes
- Simple and Professional view modes
- Dashboard overview
- Agents, workflows, runs, approvals, evaluations, risks, audit, settings, setup, connectors, built-in agents, plans, Owner Control, and Agent Builder surfaces
- Deterministic local data
- Playwright route, console, access, responsive, theme, mode, and screenshot checks

## Future backend roadmap

The production path should add:

1. Authentication and workspace membership
2. Server-side RBAC enforcement
3. PostgreSQL persistence
4. API validation and typed error contracts
5. Append-only audit writer
6. Queue and worker execution
7. Connector token hashing and secret references
8. Real agent/tool execution behind approval gates
9. Evaluation and release-gate enforcement
10. Observability, rate limits, data retention, and deployment controls

## Engineering outcomes

The project demonstrates:

- Product modeling for governed AI operations
- Domain modeling across agents, workflows, runs, approvals, evaluations, risks, browser QA, cost, and audit
- Frontend implementation with deterministic state and role-aware product behavior
- Security and governance planning before live integrations
- QA discipline through typecheck, lint, build, Playwright, responsive screenshots, and static scans
- A credible roadmap from frontend prototype to backend-enforced platform
