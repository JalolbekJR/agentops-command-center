# AgentOps Command Center

AgentOps Command Center is a portfolio-grade enterprise dashboard concept for controlling AI agent workflows with traceable runs, approval gates, evaluation scores, risk findings, and audit-ready operations.

## Status

Current phase: **Phase 3A - secure agent platform foundation, connector/setup model, built-in agent catalog, owner controls, and monetization planning**.

Phase 1 documentation is complete and remains the source of truth for product, architecture, domain model, security, RBAC, API contracts, workflow engine, QA strategy, roadmap, and portfolio positioning.

Phase 2 introduced a manually created Next.js App Router scaffold with TypeScript, Tailwind CSS, typed domain models, deterministic mock data, route structure, reusable components, and a premium responsive shell.

Phase 3A extends the same architecture with local deterministic models for agent connection methods, AgentOps Native Agent Protocol, built-in AgentOps agents, setup modes, owner-only controls, AI Agent Builder foundation, and plan/usage limits. It does not add real auth, database persistence, agent execution, external APIs, payments, deployment, or secrets.

Honest scope: this is a portfolio/demo system in progress. It is designed to demonstrate production-minded engineering decisions, but it does not yet include a live backend, real AI integrations, real browser recordings, production customers, or deployed infrastructure.

## Problem

AI agents can now run multi-step workflows, call tools, write files, browse sites, and make decisions that affect users or internal operations. Most demos show the happy path. Real teams need a way to answer harder questions:

- Which agent ran, and why?
- What tools did it call?
- Which step failed?
- Was a risky action approved by a human?
- Did the run pass quality, safety, cost, and release gates?
- Can a reviewer replay or audit the decision trail?
- Can security teams see sensitive tool calls and prompt-injection risk?

Without this control plane, AI automation becomes difficult to trust, debug, and govern.

## Solution

AgentOps Command Center models an enterprise AI operations platform where teams can create agents, define workflows, inspect run timelines, review tool calls, approve high-risk actions, evaluate quality, track cost, and audit every important change.

The Phase 1 docs define the system before implementation so future UI and backend work has a real architecture instead of a thin dashboard shell.

## Key Features Planned

- Agent registry with capabilities, risk level, ownership, status, success rate, and cost.
- Workflow builder model with steps, dependencies, tools, retries, and human approval checkpoints.
- GitHub Actions-style run timelines with structured events, traces, failures, and replay data.
- Tool call history with input and output summaries, approval requirements, and risk severity.
- Human approval queue for production-impacting, sensitive, or policy-blocked actions.
- Evaluation dashboard for correctness, safety, reliability, latency, cost, user impact, and policy compliance.
- Risk and security dashboard for prompt injection, tool misuse, data exposure, access, and unsafe automation.
- Browser QA session viewer for deterministic demo sessions, steps, screenshots, console issues, network issues, and accessibility notes.
- Cost and token analytics by project, workflow, agent, model, and time window.
- Audit log for approvals, role changes, workflow edits, release gates, and sensitive activity.
- Team and RBAC model for Founder/Admin, AI Engineer, QA Reviewer, Security Reviewer, Product Manager, and Viewer roles.
- Agent connection center for built-in agents, Native Protocol, BYO webhook, SDK, MCP, private worker, and trace import concepts.
- Built-in AgentOps agents catalog with Website QA Agent as the first recommended monetizable agent.
- AI Agent Builder foundation for selecting templates, connector methods, capabilities, allowed targets, approval gates, and plan limits.
- Setup, deployment-mode, owner-control, and plan/usage views for future SaaS and enterprise packaging.

## Why This Project Exists

This project is meant to show more than UI taste. It is designed to demonstrate:

- Computer science fundamentals through state machines, graph workflows, event timelines, queues, retries, and deterministic replay.
- Full-stack architecture through API contracts, domain modeling, database design, RBAC, and future backend boundaries.
- AI systems thinking through agent run models, tool permissions, evaluation, risk scoring, and prompt/tool-injection awareness.
- Product judgment through role-specific workflows, realistic enterprise use cases, and careful MVP boundaries.
- Security maturity through least privilege, approval gates, auditability, secret handling, and trust boundaries.
- QA discipline through release gates, browser QA plans, accessibility checks, and performance criteria.

## Architecture Summary

Phase 1 defines a staged architecture:

1. **Static demo foundation**: deterministic local data, typed domain models, and polished UI once the app is scaffolded.
2. **Interactive simulation**: local workflow run engine, approval actions, filters, failure replay, and role switching.
3. **Backend upgrade path**: authenticated API, PostgreSQL database, RBAC enforcement, queue/worker processing, WebSocket updates, and real AI/browser automation boundaries.
4. **Production hardening path**: observability, rate limits, audit retention, secret references, environment boundaries, and deployment controls.

The recommended future stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component composition
- Local deterministic seed data first
- Future PostgreSQL with Prisma or an equivalent typed data layer
- Future queue/worker model for runs
- Future WebSocket or server-sent events for live run updates

## Documentation Map

- [Product Brief](docs/PRODUCT_BRIEF.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [API Contracts](docs/API_CONTRACTS.md)
- [Security Model](docs/SECURITY_MODEL.md)
- [RBAC Matrix](docs/RBAC_MATRIX.md)
- [AI Agent Run Model](docs/AI_AGENT_RUN_MODEL.md)
- [Workflow Engine Design](docs/WORKFLOW_ENGINE_DESIGN.md)
- [Evaluation and Risk Model](docs/EVALUATION_AND_RISK_MODEL.md)
- [UI/UX Direction](docs/UI_UX_DIRECTION.md)
- [QA Test Plan](docs/QA_TEST_PLAN.md)
- [Case Study](docs/CASE_STUDY.md)
- [Roadmap](docs/ROADMAP.md)
- [Interview Talking Points](docs/INTERVIEW_TALKING_POINTS.md)
- [Build Phases](docs/BUILD_PHASES.md)
- [Resume Bullets](docs/RESUME_BULLETS.md)
- [Agent Connection Model](docs/AGENT_CONNECTION_MODEL.md)
- [AgentOps Native Protocol](docs/AGENTOPS_NATIVE_PROTOCOL.md)
- [Built-In Agents Catalog](docs/BUILT_IN_AGENTS_CATALOG.md)
- [Deployment Setup Model](docs/DEPLOYMENT_SETUP_MODEL.md)
- [Company Setup And Monetization](docs/COMPANY_SETUP_AND_MONETIZATION.md)
- [Connector Security Model](docs/CONNECTOR_SECURITY_MODEL.md)
- [AI Agent Builder Model](docs/AI_AGENT_BUILDER_MODEL.md)
- [Owner Control Plane](docs/OWNER_CONTROL_PLANE.md)

## Screenshots

Screenshots will be added after the Phase 2 and Phase 3 app shell and dashboard UI are implemented.

Planned screenshot set:

- Executive dashboard overview.
- Agent registry.
- Workflow run timeline.
- Human approval queue.
- Risk and evaluation dashboard.
- Browser QA session detail.
- Audit log and RBAC settings.

## Local Development

The app scaffold exists, but dependencies may not be installed yet. Package installation is intentionally approval-gated.

After dependency installation is approved, the expected local flow is:

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The current scaffold uses local deterministic mock data only. It does not connect to external APIs, auth providers, databases, AI services, browser automation, deployment services, or secrets.

## Roadmap

- Phase 1: Documentation and architecture foundation.
- Phase 2: Next.js scaffold, TypeScript setup, route map, domain types, seed data, and first dashboard UI.
- Phase 3: Premium UI shell and dashboard overview.
- Phase 3A: Secure agent platform foundation, connector/setup model, owner controls, built-in agents, Native Protocol, builder UI, and plan limits.
- Phase 4: Mock interactions, role switcher, filters, approvals, and run details.
- Phase 5: Workflow simulation, deterministic event replay, evaluation, and risk logic.
- Phase 6: Tests, browser QA, accessibility, performance checks, and release gates.
- Phase 7: Backend/database upgrade path with auth, RBAC, PostgreSQL, and API handlers.
- Phase 8: Real AI integration boundary with tool permissions and observability.
- Phase 9: Deployment plan, screenshots, and case-study polish.

## Portfolio Value

This project is intended to prove that I can design and build a serious product system, not just prompt a UI into existence. The docs and future implementation are structured to show product thinking, architecture, domain modeling, AI operations, security, QA, and practical delivery judgment.
