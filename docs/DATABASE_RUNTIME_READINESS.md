# Database Runtime Readiness

Phase 4B.1.1 verifies that the AgentOps Command Center database foundation can run safely and prepares the path for future hosted deployment. This phase does not connect the UI to the database, add API routes, add auth, add billing, add live AI agents, add workers, or connect hosted services.

Local verification is a developer safety path only. The final online product path should use a hosted PostgreSQL provider with secrets managed by the deployment platform.

## Purpose

- Verify the existing Drizzle and PostgreSQL foundation against a real Postgres runtime.
- Keep the deterministic local demo mode working without a database.
- Prepare for a future Vercel plus hosted Postgres deployment.
- Document how to run migrations and seed data without committing secrets.
- Keep the next backend step small: read-only server API routes behind validation.

## Current Foundation

The repository already includes:

- `drizzle-orm`, `drizzle-kit`, `pg`, `@types/pg`, and `tsx`.
- `drizzle.config.ts` pointing at `src/server/db/schema/index.ts` and `drizzle/`.
- Initial generated migration output under `drizzle/`.
- A server-only database connection factory in `src/server/db/client.ts`.
- Modular schema files under `src/server/db/schema/`.
- Deterministic seed logic in `src/server/db/seed.ts`.
- A seed entrypoint in `scripts/seed-db.ts`.
- A placeholder `.env.example` for local development.

The product UI still reads deterministic local mock data from `src/data`. That is intentional.

## Local Verification Path

### Option A: Docker Postgres

The local-only helper is `docker-compose.db.yml`. It starts only an official Postgres container with local placeholder credentials and a named local volume. It is not a deployment file and must not be used as the public production database.

Start local Postgres:

```powershell
docker compose -f docker-compose.db.yml up -d
```

Use a session-only environment variable:

```powershell
$env:DATABASE_URL="postgres://postgres:postgres@localhost:5432/agentops_command_center"
```

Run migrations and seed data:

```powershell
npm run db:migrate
npm run db:seed
```

### Option B: Local PostgreSQL

If a local PostgreSQL service is already running, create an empty `agentops_command_center` database and use the same session-only placeholder connection value. Do not create or commit a real `.env` file.

Then run:

```powershell
npm run db:migrate
npm run db:seed
```

### Verification Queries

Use `psql` or a temporary local `tsx` check to verify row counts. Do not print a full connection value in logs.

Suggested SQL:

```sql
select 'tables' as name, count(*)::int as count
from information_schema.tables
where table_schema = 'public'
union all
select 'users', count(*)::int from users
union all
select 'workspaces', count(*)::int from workspaces
union all
select 'projects', count(*)::int from projects
union all
select 'audit_events', count(*)::int from audit_events
union all
select 'runs', count(*)::int from runs;
```

If Docker is not running and `psql` is unavailable, runtime verification is pending. Install nothing automatically. Start Docker Desktop, use an existing local Postgres instance, or provide an approved hosted connection through the deployment environment in a later phase.

## Hosted Deployment Path

Recommended first hosted database: Neon Free, after checking current free-tier limits at the time of setup. Supabase Postgres remains a good alternative if the project later wants Supabase Auth, RLS-first workflows, storage, or realtime in the same platform.

The hosted deployment sequence should be:

1. Create the hosted Postgres project manually or through an approved provider CLI.
2. Store the database connection secret in the Vercel project environment variables as `DATABASE_URL`.
3. Keep hosted credentials out of source code, docs, screenshots, terminal transcripts, and commits.
4. Use the provider dashboard or Vercel dashboard for secrets.
5. Run migrations against the hosted database only after explicit approval.
6. Seed only approved demo data, not customer data.
7. Confirm SSL is required and enabled for hosted database connections.
8. Use direct database connections for migrations when the provider recommends direct connections for schema work.
9. Use pooled/serverless-friendly connections for application traffic if the provider recommends pooling for web/serverless workloads.
10. Never point public production at local Docker.

Official guidance checked during this phase:

- Drizzle supports PostgreSQL with `node-postgres` and the existing `pg` package.
- Drizzle Kit supports generated SQL migration files and `drizzle-kit migrate`.
- Vercel environment variables are configured outside source code and can be scoped by environment.
- Neon requires SSL/TLS connections and offers pooled connection strings for web/serverless application traffic, while direct connections are recommended for migrations.
- Supabase offers direct and pooled Postgres connection modes, and recommends SSL wherever possible.

## Security Rules

- Do not commit `.env` or `.env.local`.
- Do not commit real secrets.
- Do not hardcode `DATABASE_URL`.
- Do not expose database connection values to the browser.
- Keep database access server-only.
- Keep the current UI disconnected until a read-only API phase is implemented.
- Do not add API routes in this phase.
- Do not trust the client-side role switcher for backend authorization.
- Add server-side identity, workspace membership, RBAC, and object checks before sensitive reads or writes.
- Add least-privilege database users later.
- Separate migration and runtime database users later if the hosted provider supports that cleanly.
- Require SSL for hosted database traffic.
- Review generated migration SQL before applying it to shared or hosted environments.
- Keep audit, approval, run, and usage writes transaction-safe when mutations are introduced.

## Online Deployment Warning

Hosted database creation is not done in this phase. It should happen only after explicit approval.

If a provider CLI is used later:

- Do not print credentials.
- Do not commit generated secrets.
- Do not write a real connection value into tracked files.
- Prefer provider dashboards and Vercel environment variables for deployment secrets.
- Keep preview and production environment values separate.

## Zero-Cost Rules

- Avoid always-on workers.
- Keep seed data small.
- Do not make AI calls by default.
- Do not add external connectors by default.
- Avoid unbounded logs, events, traces, and audit rows.
- Watch hosted database storage, compute, idle, and connection limits.
- Use polling before realtime.
- Keep the public demo deterministic and cheap to run.

## Next Phase

Phase 4B.2 should add safe read-only API routes behind server-side validation. The first API slice should prove:

- Server-only database access.
- Input validation and allowlisted query parameters.
- Workspace/project scoped reads.
- RBAC checks based on trusted server-side identity once auth exists.
- No mutations at first.
- No live agents, external connectors, billing, workers, or auth provider until separately approved.

## References

- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [Drizzle Kit migrate](https://orm.drizzle.team/docs/drizzle-kit-migrate)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [Neon pricing](https://neon.com/pricing)
- [Neon connection pooling](https://neon.com/docs/connect/connection-pooling)
- [Supabase database connections](https://supabase.com/docs/guides/database/connecting-to-postgres)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [OWASP API Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
