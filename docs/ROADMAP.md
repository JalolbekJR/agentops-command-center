# Roadmap

AgentOps Command Center is built in phases that preserve product clarity, deterministic behavior, security boundaries, QA discipline, and a credible backend path. The roadmap keeps the current prototype honest while showing how it can become a backend-enforced platform.

## Roadmap principle

Do not add live AI integrations, external APIs, payments, deployment, or production data before the control-plane model is coherent. The frontend prototype should prove the product workflow first, then backend enforcement can make the same policies durable.

## Completed: Documentation foundation

The project began with product and architecture documentation before implementation.

Completed outputs:

- README
- Product brief
- Architecture
- Database schema
- API contracts
- Security model
- RBAC matrix
- AI agent run model
- Workflow engine design
- Evaluation and risk model
- UI/UX direction
- QA test plan
- Case study
- Roadmap
- Build phases

## Completed: App scaffold

The app scaffold established the technical foundation.

Completed outputs:

- Next.js App Router with TypeScript
- Tailwind CSS styling foundation
- Route structure
- Typed domain models
- Deterministic seed data
- Base app shell and navigation
- Local development scripts

## Completed: Premium product shell

The product shell now supports a professional command-center experience.

Completed outputs:

- Desktop sidebar and mobile drawer
- Topbar with role and view controls
- Role switcher
- Dark and light themes
- Simple and Professional modes
- Responsive dashboard surface
- Reusable cards, badges, tables, notices, and action styles

## Completed: Secure agent platform foundation

Phase 3A extended the deterministic prototype into the platform concepts needed for governed agents.

Completed outputs:

- Agent connection model
- AgentOps Native Agent Protocol model
- Built-in AgentOps agent catalog
- AI Agent Builder foundation
- Setup and deployment-mode model
- Owner Control model
- Workspace plan and usage-limit model
- Connector security and privacy model
- Deterministic TypeScript data, helpers, and UI pages

## Completed: Local access modeling and UX polish

Phase 3B added product-grade local route access behavior and major shell polish.

Completed outputs:

- Local role persistence
- Role-aware sidebar visibility
- Route gates for restricted pages
- Owner Control restricted to Founder/Admin
- Agent Builder restricted away from Viewer
- Settings visible across roles with owner-only concepts gated inside product logic
- Premium shell/sidebar/topbar cleanup
- Agent Builder and marketplace layout polish
- Mobile density improvements
- Playwright route, console, access, responsive, theme, mode, and screenshot coverage

## Current: Public documentation cleanup

Phase 3C makes the repository read like public product documentation.

Planned outputs:

- Public-safe README
- Public case study
- Technical discussion notes
- Project outcomes summary
- Updated roadmap and build-phase docs
- Cleaned wording around prototype boundaries
- Clear demo walkthrough and screenshot guide in a future documentation pass

Acceptance criteria:

- Public docs avoid private preparation language
- Documentation links are current
- Prototype boundaries are clear
- Backend enforcement remains scoped to the roadmap
- Technical reviewers can understand what exists now and what comes later

## Next: Demo walkthrough and QA documentation

The next documentation phase should make the product easier to review.

Recommended outputs:

- `docs/DEMO_WALKTHROUGH.md`
- `docs/TESTING_AND_QA.md`
- `docs/LOCAL_DEMO_BOUNDARY.md`
- `docs/SCREENSHOT_GUIDE.md`
- `CHANGELOG.md`

## Future: Workflow simulation

The next product phase should simulate agent operations without external calls.

Planned outputs:

- Deterministic workflow run engine
- Step state transitions
- Timeline event generation
- Approval pause/resume logic
- Failure replay
- Evaluation and risk derivation
- Release gate checks

Acceptance criteria:

- Runs are replayable
- Approval decisions affect run status
- Release gates reflect QA, risk, and evaluation state
- Simulation remains deterministic

## Future: Testing and release gates

The test suite should expand as local workflow behavior grows.

Planned outputs:

- Unit tests for domain logic
- Component or route-level tests for core UI
- Browser QA smoke tests
- Accessibility checks
- Visual screenshots
- Performance review
- Release checklist

Acceptance criteria:

- `lint`, `typecheck`, test, and build commands pass when configured
- Browser QA covers key routes
- Mobile and desktop screenshots are clean
- Major accessibility blockers are documented and resolved

## Future: Backend and database upgrade

The backend phase should make the documented security model enforceable.

Planned outputs:

- Authentication strategy
- PostgreSQL schema or Prisma model
- API route handlers
- Server-side RBAC
- Audit writer
- Data validation
- Migration plan
- Seed script

Acceptance criteria:

- Client role switching is replaced or clearly separated from real auth
- Permissions are enforced server-side
- Database schema matches documented entities
- Audit records are append-only by design

## Future: AI integration boundary

Real AI and tool execution should be added only behind permissions, logging, and evaluation.

Planned outputs:

- Model/provider boundary
- Tool registry
- Permission gate
- Prompt/tool-injection safeguards
- Cost tracking
- Evaluation hooks
- Human approval checkpoints

Acceptance criteria:

- High-risk tools require approval
- Secrets are never exposed to model context
- Tool calls are logged and auditable
- Costs and evaluation outcomes are visible

## Future: Deployment and public case-study polish

Deployment should happen only after quality gates and environment handling are ready.

Planned outputs:

- Deployment plan
- Production-safe environment handling
- Screenshot guide
- Public changelog
- Public case-study page or portfolio entry
- Stakeholder walkthrough

Acceptance criteria:

- Deployment is approved and documented
- The project stays honest about deterministic prototype behavior versus production behavior
- Screenshots and documentation support technical review

## Roadmap risks

- Adding real AI integrations before permissions and audit are implemented
- Letting UI polish hide weak domain modeling
- Claiming production readiness before backend enforcement exists
- Skipping accessibility and browser QA
- Letting private planning notes leak into public product docs

## Roadmap success definition

The project succeeds when a technical reviewer can inspect the docs, run the app, follow a workflow run, understand approval, risk, evaluation, and audit decisions, and see a credible path from deterministic frontend prototype to backend-enforced platform.
