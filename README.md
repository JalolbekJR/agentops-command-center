# AgentOps Command Center

A governance and observability command center for AI agent workflows, approvals, evaluations, risks, audit trails, and role-based operations.

AgentOps Command Center is a deterministic frontend control-plane prototype for AI agent operations. It shows how teams can inspect agent work through run evidence, approval gates, risk findings, evaluation results, browser QA records, and audit history before adding live backend enforcement.

## Why it matters

AI agents can call tools, browse sites, generate files, summarize data, and propose operational actions. Teams need visibility, approvals, evaluation, risk tracking, and auditability before they can safely rely on those workflows.

AgentOps Command Center models that operating layer. It connects agents, workflows, runs, approvals, evaluations, risks, connectors, plans, setup, and role-based access into one reviewable product surface.

## What this project is

This repository contains a premium product prototype built with deterministic local state. The app demonstrates product flows, local role/access behavior, responsive shell design, Agent Builder, connector/setup concepts, evaluation, risk, approval, and audit surfaces.

The current prototype is safe, repeatable, and reviewable because it does not depend on external accounts, live services, secrets, or production data.

## Core product areas

- **Dashboard / mission control**: summarizes active agents, run health, evidence, approvals, risks, evaluations, and audit readiness
- **Agents**: lists operating agents, owners, capabilities, status, and risk posture
- **Built-in agents**: presents AgentOps-provided agents, led by Website QA Agent
- **Agent Builder**: guides template selection, connector policy, safety gates, and local draft readiness
- **Workflows**: models governed multi-step AI automation
- **Runs**: shows trace timelines, evidence, risk, and approval state
- **Approvals**: queues human decisions for high-risk or policy-blocked actions
- **Evaluations**: summarizes quality, safety, cost, and release readiness
- **Risks**: tracks security, policy, QA, reliability, and cost findings
- **Browser QA**: records deterministic browser quality evidence for release review
- **Audit**: preserves actor, action, reason, target, and correlation context
- **Connectors**: compares built-in agents, Native Protocol, webhook, software development kit (SDK), Model Context Protocol (MCP), private worker, and trace import paths
- **Plans**: models future packaging and usage limits without payment code
- **Setup**: explains workspace setup, allowed targets, and environment boundaries
- **Settings / RBAC**: controls role view, display mode, theme, and local boundary explanation

## Demo boundary

The current prototype intentionally stays local and deterministic:

- No live backend
- No real authentication provider
- No database writes
- No payments
- No external API calls
- No secrets
- No live agent execution
- Deterministic local state only

Client-side role switching demonstrates product behavior, not production authorization. Backend enforcement is intentionally scoped to the roadmap, where server-side RBAC, transactional approvals, append-only audit events, connector policies, and persistence can enforce the same product rules.

## Architecture summary

The current app uses:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Modular feature folders
- Typed domain data
- Deterministic local demo state
- Role/access logic for local route and sidebar behavior
- Playwright browser coverage for routes, console errors, access rules, responsive states, themes, modes, and screenshots

The future backend path adds authenticated API routes, PostgreSQL persistence, server-side RBAC, queue/worker execution, connector policies, secret references, append-only audit events, and production hardening.

## Quality checks

Run these checks before presenting or merging changes:

```powershell
npm run typecheck
npm run lint
npm run build
npm run e2e
```

The E2E suite is optional for documentation-only work unless screenshots or route behavior need verification.

## Documentation map

Start with the public project pack:

- [Project Summary](docs/PROJECT_SUMMARY.md)
- [Demo Walkthrough](docs/DEMO_WALKTHROUGH.md)
- [Local Demo Boundary](docs/LOCAL_DEMO_BOUNDARY.md)
- [Testing and QA](docs/TESTING_AND_QA.md)
- [Backend Roadmap](docs/BACKEND_ROADMAP.md)
- [Screenshot Guide](docs/SCREENSHOT_GUIDE.md)
- [Case Study](docs/CASE_STUDY.md)
- [Technical Discussion Notes](docs/TECHNICAL_DISCUSSION_NOTES.md)
- [Project Outcomes](docs/PROJECT_OUTCOMES.md)

Deeper technical references:

- [Product Brief](docs/PRODUCT_BRIEF.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Backend Implementation Plan](docs/BACKEND_IMPLEMENTATION_PLAN.md)
- [Database Foundation](docs/DATABASE_FOUNDATION.md)
- [Database Runtime Readiness](docs/DATABASE_RUNTIME_READINESS.md)
- [API Read-Only Foundation](docs/API_READONLY_FOUNDATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Contracts](docs/API_CONTRACTS.md)
- [Security Model](docs/SECURITY_MODEL.md)
- [RBAC Matrix](docs/RBAC_MATRIX.md)
- [AI Agent Run Model](docs/AI_AGENT_RUN_MODEL.md)
- [Workflow Engine Design](docs/WORKFLOW_ENGINE_DESIGN.md)
- [Evaluation and Risk Model](docs/EVALUATION_AND_RISK_MODEL.md)
- [UI/UX Direction](docs/UI_UX_DIRECTION.md)
- [QA Test Plan](docs/QA_TEST_PLAN.md)
- [Roadmap](docs/ROADMAP.md)
- [Build Phases](docs/BUILD_PHASES.md)
- [Agent Connection Model](docs/AGENT_CONNECTION_MODEL.md)
- [AgentOps Native Protocol](docs/AGENTOPS_NATIVE_PROTOCOL.md)
- [Built-In Agents Catalog](docs/BUILT_IN_AGENTS_CATALOG.md)
- [Deployment Setup Model](docs/DEPLOYMENT_SETUP_MODEL.md)
- [Company Setup And Monetization](docs/COMPANY_SETUP_AND_MONETIZATION.md)
- [Connector Security Model](docs/CONNECTOR_SECURITY_MODEL.md)
- [AI Agent Builder Model](docs/AI_AGENT_BUILDER_MODEL.md)
- [Owner Control Plane](docs/OWNER_CONTROL_PLANE.md)
- [Phase 3B.3 Pre-Polish Audit](docs/PHASE_3B3_PRE_POLISH_AUDIT.md)
- [Phase 3B.4 Elite UX Polish](docs/PHASE_3B4_ELITE_UX_POLISH.md)

## Screenshot artifacts

Playwright screenshots are local artifacts stored under:

```text
test-results/phase-3b4-elite-ux/
```

They are not required to be tracked in Git. Regenerate them with `npm run e2e` when visual QA needs fresh evidence.

## Roadmap summary

The roadmap keeps the prototype honest while showing a clear production path:

- Backend architecture with authenticated API routes
- Server-side RBAC for every sensitive read and write
- PostgreSQL persistence
- Append-only audit events
- Transactional approvals
- Run event persistence
- Evaluation and risk records
- Safe connector runtime with allowlists and policy checks
- Secret references instead of raw secrets
- Queue/worker execution for live agent and tool work
- Observability, rate limits, retention, deployment controls, and production hardening

See [Backend Roadmap](docs/BACKEND_ROADMAP.md) and [Roadmap](docs/ROADMAP.md) for details.
