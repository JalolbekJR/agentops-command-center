# Changelog

This changelog summarizes public project milestones for AgentOps Command Center. It focuses on product, engineering, design, QA, and documentation outcomes.

## Public project story and documentation pack

- Added public documentation for project summary, demo walkthrough, local demo boundary, testing and QA, backend roadmap, and screenshot review.
- Updated README into a stronger public landing page.
- Connected the documentation map to the new public docs.
- Clarified that the project is a deterministic frontend control-plane prototype.
- Kept backend enforcement scoped to the roadmap.

## Public documentation cleanup

- Separated internal preparation material from the public documentation set.
- Renamed public-facing discussion docs to `TECHNICAL_DISCUSSION_NOTES.md` and `PROJECT_OUTCOMES.md`.
- Cleaned README, roadmap, case study, AGENTS, UI/UX direction, and phase notes for public-safe wording.
- Removed non-public preparation language from public documentation.

## Elite UX polish

- Refined the premium product shell, sidebar, topbar, mobile density, and View switcher.
- Improved Agent Builder and marketplace layout quality.
- Added Simple and Professional modes.
- Strengthened dark and light theme behavior.
- Expanded Playwright screenshots for desktop, mobile, theme, mode, and sidebar states.

## Playwright pre-polish audit

- Added route, console, role/access, and responsive smoke coverage.
- Captured screenshot artifacts for visual review.
- Verified restricted route behavior for Founder/Admin, AI Engineer, Product Manager, and Viewer roles.

## App shell and core modules

- Built the Next.js App Router scaffold with TypeScript and Tailwind CSS.
- Added deterministic domain data and typed product models.
- Created routes and surfaces for dashboard, agents, workflows, runs, approvals, evaluations, risks, browser QA, audit, connectors, setup, built-in agents, Agent Builder, plans, settings, and Owner Control.
- Added local role-aware navigation and route behavior.

## Documentation foundation

- Defined product brief, architecture, database schema, API contracts, security model, RBAC matrix, AI agent run model, workflow engine design, evaluation and risk model, QA plan, UI/UX direction, roadmap, and build phases.
- Established the deterministic frontend boundary and future backend path before adding live integrations.
