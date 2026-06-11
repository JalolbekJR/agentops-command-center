# Build phases

This document defines how future work should move through AgentOps Command Center without weakening the product boundary. Each phase should inspect the repository, read relevant docs, select minimal tools, make reviewable changes, run checks, and summarize results.

## Build rule

Do not skip ahead to live integrations before the deterministic product model is coherent. Backend, auth, database, payment, external API, deployment, and live agent execution work require explicit scope and approval.

## Phase 1: Documentation foundation

Status: complete.

The foundation phase created the product, architecture, security, RBAC, workflow, API, database, QA, roadmap, and design documentation.

Acceptance criteria:

- Core docs exist
- README links to relevant docs
- No secrets or `.env` files are created
- Prototype scope is honest

## Phase 2: App scaffold

Status: complete.

The scaffold phase created the application foundation.

Expected work:

- Next.js App Router
- TypeScript
- Tailwind CSS
- Route structure
- Domain model files
- Deterministic seed data
- Base shell

Acceptance criteria:

- App runs locally
- Routes compile
- Domain types match docs
- Seed data is deterministic
- No real APIs or secrets are added

## Phase 3: Premium UI shell

Status: complete.

The shell phase built the core product frame.

Expected work:

- Sidebar navigation
- Workspace topbar
- Role switcher
- Environment/demo boundary language
- Dashboard overview
- Navigation states
- Empty, loading, and error components
- Responsive structure

Acceptance criteria:

- Dashboard first viewport communicates product purpose
- UI is polished on desktop and mobile
- Text does not overlap
- Responsive layout works
- Role and environment are visible

## Phase 3A: Secure agent platform foundation

Status: complete.

This phase added customer-connected agent concepts without adding real backend execution.

Expected work:

- Agent connection model
- AgentOps Native Agent Protocol model
- Built-in AgentOps agent catalog
- AI Agent Builder foundation
- Setup and deployment-mode model
- Owner Control model
- Workspace plan and usage-limit model
- Connector security/privacy model
- Deterministic TypeScript data and UI pages

Acceptance criteria:

- Existing domain model remains intact
- Connector/setup/billing concepts map back to existing architecture
- No real database, auth, external API, payment, deployment, secrets, or agent execution is added
- Public prototype remains allowlisted, deterministic, and honest

## Phase 3B: Local access modeling and premium UX polish

Status: complete.

This phase improved the frontend control-plane prototype and made local role behavior clearer.

Expected work:

- Role persistence
- Role-aware navigation
- Restricted route fallback behavior
- Owner Control access rules
- Agent Builder access rules
- Premium shell, sidebar, topbar, mobile, and card polish
- Agent Builder and marketplace layout polish
- Playwright route, console, responsive, theme, mode, and access checks

Acceptance criteria:

- Restricted content does not render for roles that cannot access it
- Role selection does not reset unexpectedly
- App shell fits desktop and mobile viewports
- Checks pass
- No backend/auth/database/payment/API/secrets are added

## Phase 3C: Public documentation cleanup

Status: current documentation phase.

This phase cleans public documentation and preserves private notes outside the repository.

Expected work:

- Back up private-style notes outside the repo
- Rename private-style public docs to professional public docs
- Update README links
- Clean public wording risks
- Keep prototype boundary language honest
- Run typecheck, lint, build, and documentation scans

Acceptance criteria:

- Private backups exist outside the repo
- Public docs do not contain private preparation language
- Docs explain deterministic frontend prototype boundaries
- Source code and UI remain unchanged
- Checks pass

## Future phase: Workflow simulation

This phase should implement deterministic run simulation without external calls.

Expected work:

- Run state machine
- Step transition logic
- Approval pause/resume logic
- Failure replay
- Evaluation and risk derivation
- Release gate logic

Acceptance criteria:

- Simulated runs are traceable and replayable
- State transitions are tested
- High-risk actions pause for approval

## Future phase: Testing and release gates

This phase should broaden automated and manual quality gates.

Expected work:

- Unit tests for permissions and run transitions
- Unit tests for graph validation
- Unit tests for release gate logic
- Browser QA for critical routes
- Accessibility and performance review

Acceptance criteria:

- Checks pass
- Known risks are documented
- Screenshots are review-ready

## Future phase: Backend and database upgrade

This phase should make the documented authorization and audit model enforceable.

Expected work:

- Auth strategy
- PostgreSQL schema or Prisma model
- API route handlers
- Server-side RBAC
- Audit writer
- Data validation
- Migration plan

Acceptance criteria:

- API enforces RBAC
- Audit writes exist
- Database schema matches docs
- Secret values are not stored in client state or logs

## Future phase: AI integration boundary

This phase should add real AI/tool execution only behind permissions, logging, and evaluation.

Expected work:

- Current official provider documentation review
- Model routing
- Tool registry
- Permission gate
- Prompt/tool-injection safeguards
- Cost tracking
- Evaluation hooks

Acceptance criteria:

- Real tool execution is gated
- High-risk actions require approval
- Model context excludes secrets
- Tool calls are logged and evaluated

## Future phase: Deployment and release documentation

This phase should prepare the project for public hosting only after quality gates pass.

Expected work:

- Deployment plan
- Environment variable documentation
- Screenshot guide
- Public changelog
- Case-study polish
- Stakeholder walkthrough

Acceptance criteria:

- Deployment is approved
- All checks pass
- Public docs remain accurate
- No misleading production claims are introduced
