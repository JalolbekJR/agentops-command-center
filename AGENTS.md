# AGENTS.md — AgentOps Command Center

This repository is a flagship professional portfolio project.

## Product

AgentOps Command Center is a premium enterprise AI agent operations platform for creating, running, monitoring, evaluating, and approving AI agent workflows.

It must feel like a real $20k–$200k product, not a generic student demo or AI slop.

## Codex behavior

Use the existing global Codex AI Factory setup and skills architecture.

Before serious work:
1. Inspect the repository.
2. Read this AGENTS.md.
3. Read docs/ if present.
4. Classify the task.
5. Select only the minimum useful skills/tools.
6. Explain selected and skipped skills.
7. Plan before coding.
8. Implement in small reviewable steps.
9. Run available checks.
10. Summarize changed files, commands, risks, and next steps.

## Skill routing

Use relevant skills only. Do not use every installed skill.

Recommended skill/team routing:

- Product/director thinking: for scope, roadmap, success criteria, and feature priority.
- AI agent architecture: for workflow/run/evaluation/approval concepts.
- Premium frontend/design: for UI quality, hierarchy, spacing, typography, responsiveness, and anti-AI-slop review.
- Security review: for RBAC, approvals, audit logs, secrets, permissions, and risk controls.
- QA/testing review: for test plans, browser QA, accessibility, and release gates.
- Performance review: for dashboards, client state, rendering, data volume, and interaction speed.
- Documentation/case-study writing: for README, architecture docs, and portfolio explanation.
- Humanizer: only for public-facing copy, README polish, and case-study polish.
- SEO: only for landing/case-study pages.
- Repomix: only when the repo becomes large enough that full-context packing helps.
- Agent-browser/browser tools: only after the app is runnable and browser QA is needed.

## Permission rules

Ask before:
- installing packages
- running npm install / pnpm install / pip install
- cloning new repos
- running unknown scripts
- deleting files
- changing .env or secrets
- database migrations
- deployments
- browser automation on logged-in/private websites
- sending messages/emails
- connecting private accounts

## Product quality standard

Every feature must feel intentional and production-minded.

Required quality:
- realistic enterprise workflows
- realistic seed data
- clear domain model
- strong information architecture
- polished responsive UI
- thoughtful empty/loading/error states
- accessible labels and contrast
- security boundaries
- auditability
- testability
- no fake magic
- no hardcoded secrets
- no misleading production claims

## Engineering standard

Prefer:
- TypeScript
- modular architecture
- clean folder structure
- typed domain models
- reusable components
- validation
- testable logic
- clear API boundaries
- mock data first
- future upgrade path to real backend/database

## Current phase

Phase 1 is documentation and architecture foundation only.

Do not scaffold the Next.js app until the architecture docs are created and reviewed.
