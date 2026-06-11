# Database Foundation

Phase 4B.1 adds the first backend database foundation for AgentOps Command Center. It creates a Drizzle + PostgreSQL schema, migration generation path, and deterministic seed script while keeping the current product UI on `src/data/mock-*`.

This phase does not connect the UI to the database and does not add API routes.

## What Phase 4B.1 Adds

- Drizzle ORM and Drizzle Kit.
- PostgreSQL driver through `pg` / node-postgres.
- `drizzle.config.ts` for schema and migration generation.
- Modular schema files under `src/server/db/schema`.
- A database client factory under `src/server/db/client.ts`.
- Deterministic seed logic under `src/server/db/seed.ts`.
- A seed script entrypoint under `scripts/seed-db.ts`.
- `.env.example` with a local placeholder `DATABASE_URL`.
- Initial migration output under `drizzle/` after `npm run db:generate`.

## What It Does Not Add

- No UI-to-database connection.
- No API routes.
- No authentication provider.
- No billing or payment provider.
- No live AI agents.
- No external connector execution.
- No hosted database connection.
- No workers.
- No desktop app code.
- No real `.env`.
- No real secrets.

## Package Choices

Phase 4B.1 uses:

- `drizzle-orm`
- `pg`
- `drizzle-kit`
- `@types/pg`
- `tsx`

Drizzle was selected because AgentOps needs a small, SQL-visible, migration-first foundation with explicit indexes, constraints, and tenant boundaries. `pg` is used first because it works well with local Postgres and keeps the foundation portable before any hosted Neon or Supabase decision.

## Local Postgres Requirement

Database commands that connect to Postgres require a local `DATABASE_URL`.

Example local-only placeholder:

```env
DATABASE_URL="postgres://postgres:postgres@localhost:5432/agentops_command_center"
```

Do not commit a real `.env` file. Use `.env.example` as a placeholder only.

## Commands

Generate migrations:

```powershell
npm run db:generate
```

Run migrations against a safe local database:

```powershell
npm run db:migrate
```

Seed a safe local database:

```powershell
npm run db:seed
```

`db:migrate` and `db:seed` require a local `DATABASE_URL`. Do not point these commands at hosted services until a later deployment phase is explicitly approved.

## Tables

Phase 4B.1 defines:

- `users`
- `workspaces`
- `workspace_members`
- `roles`
- `permissions`
- `role_permissions`
- `projects`
- `agents`
- `agent_capabilities`
- `built_in_agents`
- `agent_products`
- `workflows`
- `workflow_steps`
- `runs`
- `run_events`
- `tool_calls`
- `approvals`
- `risk_findings`
- `evaluation_results`
- `audit_events`
- `plans`
- `plan_limits`
- `usage_counters`
- `entitlements`
- `workspace_entitlements`
- `feature_flags`

Subscriptions, invoices, billing events, connector credentials, workers, artifacts, and real auth sessions are intentionally out of scope.

## Security Rules Applied

This foundation is designed to be secure-by-design, hardened, audit-ready, and injection-resistant. It is not described as "hacking-proof."

### SQL Injection Resistance

- Schema and future queries should use Drizzle ORM/query builder patterns.
- No application raw SQL is added in this phase.
- No dynamic SQL helpers are added.
- No user-controlled table names are supported.
- No user-controlled column names are supported.
- Search/filter/sort helpers are deferred to API phases and must use allowlists.

Generated migration SQL should be reviewed before being applied.

### Authorization Boundary

- Tenant-owned data is scoped by `workspace_id` and/or `project_id`.
- RBAC foundation tables are present: `users`, `workspaces`, `workspace_members`, `roles`, `permissions`, and `role_permissions`.
- Client-side role switcher state remains demo-only and is not trusted by any backend code.
- Future API phases must derive identity and permissions server-side.

### Audit And Approval Readiness

- `audit_events` is append-only by application design.
- No update/delete audit helpers are created.
- Sensitive mutable records include `version` where optimistic concurrency will be useful later.
- Approval, run event, audit event, and usage counter tables can support transaction-safe mutations in future phases.

### Secret Handling

- No raw secrets are stored.
- No API keys are stored.
- No connector credentials are stored.
- No payment/card data is stored.
- Future connector credentials must use secret references only.
- Future payment records must store provider IDs only.

### Deterministic Seed Safety

- Seed data uses fixed IDs.
- Seed data uses fixed timestamps.
- Seed data does not use `Date.now()`.
- Seed data does not use `Math.random()`.
- Seed data does not call external networks.
- Seed data contains no real customer data.
- Seed data contains no real or fake-looking secret tokens.
- Seed inserts lookup and policy data before workspace/project/operational data.

### Broad Injection Planning

API routes are not implemented yet, but the schema avoids patterns that would encourage:

- SQL injection
- search/filter/sort injection
- JSON path injection
- log injection
- webhook payload injection
- prompt injection
- tool-output injection
- connector input injection
- billing webhook abuse
- desktop IPC injection later

Future API phases must add input schemas, enum validation, ID validation, request size limits, and allowlisted filters.

### Performance And Cost-Abuse Boundaries

- Indexes are present for workspace/project authorization checks.
- Runs are indexed by project, status, and start time.
- Approvals are indexed by project, status, and request time.
- Risks are indexed by project, severity, and status.
- Audit events are indexed by workspace/project and timestamp.
- Usage counters are indexed for meter lookups.
- Hot dashboard tables include summary fields to avoid huge joins.
- High-volume lists are designed for cursor pagination later.

## Current Demo Mode

The current UI still reads deterministic local data from `src/data/mock-*`.

The database foundation is parallel infrastructure only. It does not change route access, role persistence, drawer behavior, role switcher behavior, dashboard data, approvals, risks, runs, or settings.

## Next Phases

Recommended next steps:

1. API read routes for safe backend summaries.
2. Auth/session design and implementation.
3. Server-side RBAC and object authorization.
4. Transactional approvals.
5. Audit writer service.
6. Backend reads behind a feature flag.

Live agents, billing, hosted services, connector execution, workers, and desktop runtime remain later phases.
