# AgentOps Command Center

AgentOps Command Center is a portfolio-grade enterprise dashboard concept for controlling AI agent workflows with traceable runs, approval gates, evaluation scores, risk findings, and audit-ready operations.

## Status

Current phase: **Phase 3C.1, public documentation cleanup after Phase 3B.4 premium product UX polish**.

The repository contains a deterministic frontend control-plane prototype. It demonstrates product flows, role-aware local access behavior, premium shell design, Agent Builder, connector/setup concepts, evaluation, risk, approval, and audit surfaces.

The prototype does not include backend authentication, database persistence, live agent execution, external APIs, payments, deployment, production customers, or secrets. Backend enforcement is intentionally scoped to the roadmap.

## Problem

AI agents can run multi-step workflows, call tools, write files, browse sites, and make decisions that affect users or internal operations. Real teams need a way to answer operational questions:

- Which agent ran, and why?
- What tools did it call?
- Which step failed?
- Was a risky action approved by a human?
- Did the run pass quality, safety, cost, and release gates?
- Can a reviewer replay or audit the decision trail?
- Can security teams see sensitive tool calls and prompt-injection risk?

Without this control plane, AI automation becomes difficult to trust, debug, and govern.

## Solution

AgentOps Command Center models an enterprise AI operations platform where teams can create agents, define workflows, inspect run timelines, review tool calls, approve high-risk actions, evaluate quality, track cost, and audit important changes.

The project starts with deterministic local data and public architecture documentation so the product surface, domain model, security model, and backend roadmap share the same language.

## Key features

- Agent registry with capabilities, risk level, ownership, status, success rate, and cost
- Workflow model with steps, dependencies, tools, retries, and human approval checkpoints
- Run timelines with structured events, traces, failures, and replay context
- Tool call history with input and output summaries, approval requirements, and risk severity
- Human approval queue for sensitive or policy-blocked actions
- Evaluation dashboard for correctness, safety, reliability, latency, cost, user impact, and policy compliance
- Risk and security dashboard for prompt injection, tool misuse, data exposure, access, and unsafe automation
- Browser QA session viewer for deterministic session records and quality evidence
- Cost and token analytics by project, workflow, agent, model, and time window
- Audit log for approvals, role changes, workflow edits, release gates, and sensitive activity
- Role model for Founder/Admin, AI Engineer, QA Reviewer, Security Reviewer, Product Manager, and Viewer roles
- Agent connection center for built-in agents, Native Protocol, bring-your-own webhook, software development kit (SDK), Model Context Protocol (MCP), private worker, and trace import concepts
- Built-in AgentOps agents catalog with Website QA Agent as the first recommended agent
- AI Agent Builder foundation for templates, connector methods, capabilities, allowed targets, approval gates, and plan limits
- Setup, deployment-mode, owner-control, and plan/usage views for future SaaS and enterprise packaging

## Product and engineering scope

This project is designed to demonstrate:

- State machines, workflow graphs, event timelines, retries, and deterministic replay
- API contracts, domain modeling, database design, RBAC, and future backend boundaries
- AI systems thinking through agent run models, tool permissions, evaluation, risk scoring, and prompt/tool-injection awareness
- Product judgment through role-specific workflows, realistic enterprise use cases, and careful minimum viable product boundaries
- Security maturity through least privilege, approval gates, auditability, secret handling, and trust boundaries
- QA discipline through release gates, browser QA plans, accessibility checks, and performance criteria

## Architecture summary

The architecture follows a staged path:

1. **Deterministic frontend foundation**: local data, typed domain models, and a polished product shell
2. **Interactive simulation**: local workflow run engine, approval actions, filters, failure replay, and role switching
3. **Backend upgrade path**: authenticated API, PostgreSQL database, RBAC enforcement, queue/worker processing, live updates, and real AI/browser automation boundaries
4. **Production hardening path**: observability, rate limits, audit retention, secret references, environment boundaries, and deployment controls

The recommended future stack is:

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui-style component composition
- Local deterministic seed data first
- Future PostgreSQL with Prisma or an equivalent typed data layer
- Future queue/worker model for runs
- Future WebSocket or server-sent events for live run updates

## Documentation map

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
- [Technical Discussion Notes](docs/TECHNICAL_DISCUSSION_NOTES.md)
- [Build Phases](docs/BUILD_PHASES.md)
- [Project Outcomes](docs/PROJECT_OUTCOMES.md)
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

## Screenshots

The Playwright screenshot suite writes visual review captures to:

```text
test-results/phase-3b4-elite-ux/
```

Important captures include:

- Dashboard at 1440x900, 1366x768, and 390x844
- Agent Builder at 1440x900, 1366x768, and 390x844
- Light mode dashboard, Agent Builder, and Connectors
- Simple mode dashboard, Agent Builder, Connectors, and Runs
- Expanded and collapsed sidebar dashboard states

## Local development

Install dependencies only after reviewing the project scripts and package manager state.

```bash
npm install
npm run dev
npm run lint
npm run typecheck
npm run build
```

The current scaffold uses local deterministic mock data only. It does not connect to external APIs, auth providers, databases, AI services, browser automation services, deployment services, or secrets.

## Quality checks

Use these checks before presenting or merging documentation and frontend changes:

```bash
npm run typecheck
npm run lint
npm run build
```

The broader Playwright suite is available when visual or route QA is needed:

```bash
npm run e2e
```

## Roadmap

- Phase 1: Documentation and architecture foundation
- Phase 2: Next.js scaffold, TypeScript setup, route map, domain types, seed data, and first dashboard UI
- Phase 3: Premium UI shell and dashboard overview
- Phase 3A: Secure agent platform foundation, connector/setup model, owner controls, built-in agents, Native Protocol, builder UI, and plan limits
- Phase 3B: Local RBAC product logic, route gates, role-aware navigation, and premium platform UX
- Phase 3C: Public documentation cleanup, case study, walkthrough, and release-readiness documentation
- Future backend: authentication, PostgreSQL persistence, server-side RBAC, API handlers, audit writer, queue/worker execution, and governed AI/tool integration

## Project outcomes

AgentOps Command Center demonstrates product and engineering judgment beyond surface-level UI. The repository connects product reasoning, architecture, domain modeling, AI operations, security, QA, and practical delivery constraints into one reviewable project.
