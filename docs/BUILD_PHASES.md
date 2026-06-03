# Build Phases

## Build Rule

Do not scaffold or code ahead of the current phase. Each phase should inspect the existing repo, read the relevant docs, select minimal skills/tools, implement small reviewable changes, run checks, and summarize results.

## Phase 1: Documentation Foundation

Current phase.

Codex should:

- Inspect repo.
- Read `AGENTS.md`.
- Create/update requested docs.
- Preserve the docs-only rule.
- Avoid app scaffolding.
- Avoid package installs.

Commands/checks expected:

- `rg --files`
- `git status --short`
- Documentation existence checks.
- Text scan for forbidden claims.

Should not do:

- `npm install`
- `pnpm install`
- `pip install`
- Next.js scaffold.
- Deployment.
- External account connection.

Acceptance criteria:

- All Phase 1 docs exist.
- README links to docs.
- No app scaffold exists.
- No secrets or `.env` files are created.

## Phase 2: App Scaffold

Codex should:

- Inspect all Phase 1 docs first.
- Confirm package manager before installing anything.
- Ask before dependency installation.
- Scaffold Next.js App Router with TypeScript after approval.
- Add Tailwind/component setup after approval.
- Create route structure matching docs.
- Create domain model files.
- Create deterministic seed data.
- Create base app shell.

Recommended skills/tools:

- AI Factory Director.
- Frontend app builder.
- React best practices.
- Design-system guidance.
- Secure-by-design thinking.

Commands/checks expected after scaffold:

- Package manager install command only after approval.
- `npm run lint` or equivalent if script exists.
- `npm run typecheck` if script exists.
- `npm run build` if script exists.

Should not do:

- Real AI API calls.
- Real auth provider connection.
- Real database integration.
- Deployment.
- Secrets.

Acceptance criteria:

- App runs locally.
- Routes exist.
- Domain types match docs.
- Seed data is deterministic.
- README remains honest about phase.

## Phase 3: Premium UI Shell

Codex should:

- Build the actual app shell, not a landing page.
- Implement navigation, workspace header, role switcher, and overview route.
- Add loading, empty, and error components.
- Use design tokens and consistent components.
- Browser-test desktop and mobile if runnable.

Recommended skills/tools:

- Frontend app builder.
- Design-system token architect.
- Visual polish/motion director.
- Browser QA skill after app runs.

Commands/checks:

- Lint.
- Typecheck.
- Build.
- Browser screenshot QA.

Acceptance criteria:

- Dashboard feels premium and operational.
- Text does not overlap.
- Responsive layout works.
- Role and environment are visible.

## Phase 4: Mock Data And Interactions

Codex should:

- Wire routes to seed data.
- Implement agents, workflows, runs, approvals, evaluations, risks, browser QA, cost, audit, and settings views.
- Add filters/search.
- Add local approve/reject/comment interactions.
- Keep all data deterministic.

Recommended skills/tools:

- Frontend app builder.
- AI agent pipeline thinking.
- Secure-by-design.
- QA planning.

Commands/checks:

- Lint.
- Typecheck.
- Tests if available.
- Browser smoke tests.

Acceptance criteria:

- Every core module has a useful route.
- Role switcher changes actions and redaction.
- Approvals update local state and audit records.

## Phase 3A: Secure Agent Platform Foundation

Codex should:

- Preserve the current premium shell and core domain model.
- Add connector, Native Protocol, setup, built-in agent, owner-control, builder, and plan-limit concepts as local deterministic foundation.
- Keep all customer/company setup concepts separate from platform owner controls.
- Keep monetization as planning and UI only.
- Avoid real backend, database migrations, external APIs, auth, payments, deployment, secrets, or agent execution.

Recommended skills/tools:

- Principal enterprise architecture.
- Production SaaS architecture.
- Secure-by-design.
- AI agent pipeline thinking.
- Technical documentation.
- Premium frontend/design system guidance.

Commands/checks:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Static scan for secrets, external calls, random data, and forbidden APIs.

Acceptance criteria:

- New routes compile and match the existing design language.
- TypeScript types and deterministic seed data are safe and realistic.
- Helper logic is pure and testable.
- Owner-only and workspace-level controls are clearly separated.
- No fake production claims are introduced.

## Phase 5: Workflow Simulation

Codex should:

- Implement deterministic run simulation.
- Add run state machine.
- Add step transition logic.
- Add approval pause/resume logic.
- Add failure replay.
- Derive evaluation/risk/release gate state from seeded or simulated events.

Recommended skills/tools:

- AI agent pipeline builder.
- Principal architect.
- QA/test planner.

Commands/checks:

- Unit tests for transitions.
- Unit tests for graph validation.
- Unit tests for release gate logic.
- Browser QA for run detail.

Acceptance criteria:

- Simulated runs are traceable and replayable.
- State transitions are tested.
- High-risk actions pause for approval.

## Phase 6: Testing And Release Gates

Codex should:

- Add test coverage around core logic and routes.
- Add browser QA smoke tests.
- Add accessibility checks.
- Add performance checks.
- Add release checklist.

Recommended skills/tools:

- Quality gate release director.
- Browser QA/Playwright.
- Security review.
- Performance review.

Commands/checks:

- Lint.
- Typecheck.
- Unit tests.
- Build.
- Browser QA.
- Accessibility checks where available.

Acceptance criteria:

- Checks pass.
- Known risks are documented.
- Screenshots are portfolio-ready.

## Phase 7: Backend And Database Upgrade

Codex should:

- Re-read database, API, security, and RBAC docs.
- Choose backend approach.
- Ask before installing packages or creating database resources.
- Implement auth and RBAC server-side if approved.
- Implement PostgreSQL schema or Prisma model if approved.
- Add API validation and audit writer.

Recommended skills/tools:

- Principal enterprise architect.
- Database/RLS migration guardian.
- Secure-by-design architect.
- Supabase or Neon only if explicitly selected and approved.

Commands/checks:

- Migration dry-run when available.
- Tests.
- Security review.

Should not do:

- Production migrations without explicit approval.
- Live secrets.
- Unapproved cloud resources.

Acceptance criteria:

- API enforces RBAC.
- Audit writes exist.
- Database schema matches docs.
- Secrets are references only.

## Phase 8: AI Integration Boundary

Codex should:

- Use current official AI/provider docs before implementation.
- Define model routing and tool registry.
- Add permission gate.
- Add prompt/tool-injection safeguards.
- Add cost tracking.
- Add evaluation hooks.

Recommended skills/tools:

- OpenAI docs if OpenAI APIs are used.
- AI agent pipeline builder.
- Prompt-injection safety.
- Secure-by-design.

Acceptance criteria:

- Real tool execution is gated.
- High-risk actions require approval.
- Model context excludes secrets.
- Tool calls are logged and evaluated.

## Phase 9: Deployment And Portfolio Polish

Codex should:

- Add deployment plan.
- Ask before any deployment.
- Run full quality gate.
- Add screenshots.
- Polish README and case study.
- Prepare demo script.

Recommended skills/tools:

- DevOps/release manager.
- Quality gate release director.
- Documentation writer.
- SEO only for public case-study page.

Acceptance criteria:

- Deployment is approved.
- All checks pass.
- Portfolio story is honest and strong.
- No misleading production claims.
