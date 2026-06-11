# AGENTS.md: AgentOps Command Center

This file defines local agent-assisted development rules for this repository.

## Product

AgentOps Command Center is a premium enterprise AI agent operations platform prototype for creating, running, monitoring, evaluating, and approving AI agent workflows.

The project should feel like a serious product prototype, not a generic prototype or low-quality generated interface.

## Development behavior

Before non-trivial work:

1. Inspect the repository.
2. Read this `AGENTS.md`.
3. Read relevant files in `docs/`.
4. Classify the task.
5. Select only the minimum useful skills and tools.
6. Explain selected and skipped skills when the task is substantial.
7. Plan before coding.
8. Implement small reviewable changes.
9. Run available checks.
10. Summarize changed files, commands, risks, and next steps.

## Skill routing

Use relevant skills only. Do not use every installed skill.

Recommended routing:

- Product and roadmap planning for scope, success criteria, and feature priority
- AI agent architecture for workflow, run, evaluation, and approval concepts
- Premium frontend and design-system guidance for UI quality, hierarchy, spacing, typography, responsiveness, and design quality review
- Security review for RBAC, approvals, audit logs, secrets, permissions, and risk controls
- QA/testing review for test plans, browser QA, accessibility, and release gates
- Performance review for dashboards, client state, rendering, data volume, and interaction speed
- Documentation writing for README, architecture docs, public case study, and project handoff notes
- SEO only for public landing or case-study pages
- Browser tools only after the app is runnable and browser QA is needed

## Permission rules

Ask before:

- Installing packages
- Running `npm install`, `pnpm install`, or `pip install`
- Cloning new repositories
- Running unknown scripts
- Deleting files
- Changing `.env` files or secrets
- Running database migrations
- Deploying
- Running browser automation on logged-in or private websites
- Sending messages or emails
- Connecting private accounts

## Product quality standard

Every feature should feel intentional and production-minded.

Required quality:

- Realistic enterprise workflows
- Realistic deterministic seed data
- Clear domain model
- Strong information architecture
- Polished responsive UI
- Thoughtful empty, loading, and error states
- Accessible labels and contrast
- Security boundaries
- Auditability
- Testability
- No misleading production claims
- No hardcoded secrets

## Engineering standard

Prefer:

- TypeScript
- Modular architecture
- Clean folder structure
- Typed domain models
- Reusable components
- Validation
- Testable logic
- Clear API boundaries
- Deterministic mock data first
- Future upgrade path to real backend and database enforcement

## Current status

The repository now contains a deterministic frontend control-plane prototype with documentation, local role modeling, premium shell polish, and Playwright coverage.

Backend authentication, database persistence, server-side RBAC, external APIs, payments, live agent execution, deployment, and secrets remain intentionally scoped to the roadmap.
