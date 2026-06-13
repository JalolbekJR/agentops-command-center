# Database Foundation

Phase 4B.1 adds the first database foundation for AgentOps Command Center while keeping the visible UI on deterministic local data.

This public document describes the database posture at a high level. Detailed table lists, internal columns, indexes, and relationship notes are kept out of public documentation.

## What Phase 4B.1 Adds

- Drizzle ORM.
- PostgreSQL driver support.
- Committed SQL migration execution.
- Modular server-side schema files.
- A server-only database connection factory.
- Deterministic seed support for local verification.
- A placeholder environment example for local development.

## What It Does Not Add

- No UI-to-database connection.
- No API route mutations.
- No authentication provider.
- No billing or payment provider.
- No live AI agents.
- No external connector execution.
- No hosted database connection.
- No workers.
- No real secrets.

## Data Domains

The foundation supports these high-level domains:

- identity and workspace membership,
- roles and permissions,
- projects and agents,
- workflows and runs,
- approvals and risk review,
- evaluations and audit summaries,
- plans, usage, and entitlement state.

The public repo intentionally avoids publishing full internal table maps.

## Package Choices

Drizzle was selected because the project needs a small, typed, SQL-visible foundation that supports explicit migrations and reviewable query behavior.

PostgreSQL was selected because AgentOps needs relational integrity, transactions, indexes, historical run records, and future auditability.

## Local Development

Database commands require a local or approved hosted database connection supplied through environment variables. Do not commit a real environment file or connection URL.

Useful local commands:

```powershell
npm run db:migrate
npm run db:seed
```

Run migration and seed commands only against a safe local database unless a hosted migration phase is explicitly approved.

Migration generation is intentionally not exposed in the current public toolchain. Add future migrations as reviewed committed SQL plus compatible migration metadata in a dedicated backend phase.

## Security Posture

- Keep database access server-only.
- Keep secrets out of source control.
- Use typed query builders for application queries.
- Review committed migrations before applying them.
- Validate API inputs before database access.
- Keep public API responses minimized through DTOs.
- Treat client-side role switching as demo-only.
- Add trusted auth and server-side RBAC before production deployment.

## Current Boundary

The current app remains deterministic and local. The database foundation exists for backend readiness and verification, not as a live production backend.
