# Roadmap

## Roadmap Principle

Build the project in phases that prove architecture, product thinking, UI quality, deterministic behavior, QA discipline, and future backend readiness. Do not skip directly to real AI integrations or deployment before the demo product is coherent.

## Phase 1: Documentation Foundation

Status: current phase.

Deliverables:

- README.
- Product brief.
- Architecture.
- Database schema.
- API contracts.
- Security model.
- RBAC matrix.
- AI agent run model.
- Workflow engine design.
- Evaluation and risk model.
- UI/UX direction.
- QA test plan.
- Case study.
- Roadmap.
- Interview talking points.
- Build phases.
- Resume bullets.

Acceptance criteria:

- Docs are complete and consistent.
- No app scaffold exists yet.
- No package installs were run.
- No secrets or private integrations exist.
- Phase 2 prompt is ready.

## Phase 2: App Scaffold

Goal: create the technical shell without overbuilding.

Deliverables:

- Confirm package manager.
- Scaffold Next.js App Router with TypeScript.
- Add Tailwind CSS and component foundation after approval.
- Create route structure.
- Create domain types.
- Create deterministic seed data.
- Add base layout and navigation placeholders.
- Add basic checks.

Acceptance criteria:

- App runs locally.
- Routes compile.
- Domain types align with docs.
- No real APIs or secrets.

## Phase 3: Premium UI Shell

Goal: make the product feel like a serious operations dashboard.

Deliverables:

- App shell with sidebar and workspace header.
- Role switcher.
- Environment badge.
- Dashboard overview.
- Navigation states.
- Empty/loading/error components.
- Responsive structure.

Acceptance criteria:

- Dashboard first viewport communicates product purpose.
- UI is polished on desktop and mobile.
- Browser screenshot QA passes for main route.

## Phase 4: Mock Data And Interactions

Goal: connect views to deterministic seed data and local state.

Deliverables:

- Agent registry.
- Workflow list/detail.
- Runs list/detail.
- Tool call history.
- Approval queue.
- Evaluation dashboard.
- Risk dashboard.
- Browser QA session viewer.
- Cost analytics.
- Audit log.

Acceptance criteria:

- Role switcher affects available actions.
- Approve/reject interactions update local state.
- Filters and search work on seeded data.
- Empty states are realistic.

## Phase 5: Workflow And Run Simulation

Goal: simulate agent operations without external calls.

Deliverables:

- Deterministic workflow run engine.
- Step state transitions.
- Timeline event generation.
- Approval pause/resume logic.
- Failure replay.
- Evaluation and risk derivation.
- Release gate checks.

Acceptance criteria:

- Runs are replayable.
- Approval decisions affect run status.
- Release gates reflect QA/risk/evaluation state.
- Simulation remains deterministic.

## Phase 6: Testing And Browser QA

Goal: make the demo reliable enough for portfolio presentation.

Deliverables:

- Unit tests for domain logic.
- Component or route-level tests for core UI.
- Browser QA smoke tests.
- Accessibility checks.
- Visual screenshots.
- Performance review.
- Release checklist.

Acceptance criteria:

- `lint`, `typecheck`, `test`, and `build` pass when configured.
- Browser QA covers key routes.
- Mobile and desktop screenshots are clean.
- No major accessibility blockers.

## Phase 7: Backend And Database Upgrade

Goal: define and optionally implement a real backend path.

Deliverables:

- Auth strategy.
- PostgreSQL schema or Prisma model.
- API route handlers.
- Server-side RBAC.
- Audit writer.
- Data validation.
- Migration plan.
- Seed script.

Acceptance criteria:

- Client role switching is replaced or clearly separated from real auth.
- Permissions are enforced server-side.
- Database schema matches documented entities.
- Audit records are append-only in design.

## Phase 8: AI Integration Boundary

Goal: integrate real AI only behind permissions, logging, and evaluation.

Deliverables:

- Model/provider boundary.
- Tool registry.
- Permission gate.
- Prompt/tool-injection safeguards.
- Cost tracking.
- Evaluation hooks.
- Human approval checkpoints.

Acceptance criteria:

- No model can execute high-risk tools without approval.
- Secrets are never exposed to model context.
- Tool calls are logged and auditable.
- Costs are visible.

## Phase 9: Deployment And Case-Study Polish

Goal: present the project professionally.

Deliverables:

- Deployment plan.
- Production-safe environment handling.
- Screenshots.
- README polish.
- Case-study page or portfolio entry.
- Demo script.
- Recruiter/interview talking points.

Acceptance criteria:

- Deployment is approved and documented.
- The project is honest about demo vs production behavior.
- Screenshots and story support the portfolio goal.

## Roadmap Risks

- Overbuilding before the first app shell exists.
- Adding real AI integrations before permissions and audit are implemented.
- Letting UI polish hide weak domain modeling.
- Claiming production readiness too early.
- Skipping accessibility and browser QA.

## Roadmap Success Definition

The project succeeds when a technical reviewer can inspect the docs, run the app, follow a workflow run, understand approval/risk/evaluation decisions, and see a credible path from deterministic demo to real backend.
