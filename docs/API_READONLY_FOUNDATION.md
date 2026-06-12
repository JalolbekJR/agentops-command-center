# API Read-Only Foundation

Phase 4B.2 adds the first read-only API route foundation for AgentOps Command Center. It proves server-only database access, input validation, bounded response sizes, workspace/project scoped reads, safe error envelopes, and a temporary demo session boundary.

This phase does not connect the visible UI to the API or database. The current product screens continue to use deterministic local data from `src/data/mock-*`.

## What Phase 4B.2 Adds

- Direct `zod` dependency for server request validation.
- Backend-only API helpers under `src/server/api`.
- Temporary demo session resolver under `src/server/auth/demo-session.ts`.
- Read access policy helpers under `src/server/policy/read-access.ts`.
- Read model service under `src/server/services/read-models.ts`.
- GET-only route handlers under `src/app/api`.
- Safe `503 database_unavailable` behavior when `DATABASE_URL` is missing.
- Stable success, list, and error response envelopes.

## Read-Only Routes

Phase 4B.2 adds only read-only routes in these categories:

- session read
- workspace reads
- project reads
- project child resource reads
- workspace entitlement/plan reads

No POST, PATCH, PUT, or DELETE routes are added.

## Temporary Demo Session Boundary

There is no real auth provider in this phase. API handlers use a clearly labeled temporary server-side demo session:

- user: a fixed seeded demo user
- workspace: a fixed seeded demo workspace
- source: seeded database rows
- mode: `temporary-demo-session`

The API does not accept a role from query parameters, request body, headers, local storage, cookies, or the client-side role switcher. Client role state remains demo presentation logic only.

This is not production authorization. A future auth phase must replace this resolver with trusted identity, workspace membership, role, entitlement, and object-level access checks.

## Validation Rules

All route inputs are validated before database access:

- `projectId` and `workspaceId` are restricted to bounded identifier characters.
- `limit` defaults to `20`.
- `limit` is capped at `50`.
- `cursor` is a bounded numeric offset with a maximum of `10000`.
- Status, severity, and risk-level filters are enum allowlists.
- Unsupported query parameters are rejected with `validation_invalid`.
- Duplicate query parameters are rejected to avoid ambiguous input.
- No open-ended search helpers are added.
- No user-controlled table names are accepted.
- No user-controlled column names are accepted.
- No sort parameters are added in this phase.

## SQL Injection Defense Rules

The read models use Drizzle query builder APIs with explicit selected fields:

- No application raw SQL.
- No `sql.raw`.
- No string-concatenated SQL.
- No dynamic table names from request input.
- No dynamic column names from request input.
- Filters use typed Drizzle operators.
- Pagination uses bounded `limit` and `offset`.
- Each tenant-owned project read is scoped to the temporary demo workspace.

This is designed to be injection-resistant and reviewable, not described as "hacking-proof."

## Object-Level Read Boundaries

The API checks workspace/project scope before returning tenant-owned resources:

- workspace routes require the requested workspace to match the fixed seeded demo workspace.
- project routes first verify that the requested project belongs to the fixed seeded demo workspace.
- project child routes call the same project-scope guard before list queries.
- unavailable or out-of-scope resources use safe not-found style errors.

The current demo session is intentionally narrow. Future auth must repeat these checks using real user identity and membership.

## Response Format

Single-resource success:

```json
{
  "data": {},
  "meta": {
    "requestId": "req_example",
    "mode": "database-readonly"
  }
}
```

List success:

```json
{
  "data": [],
  "meta": {
    "requestId": "req_example",
    "mode": "database-readonly",
    "limit": 20,
    "nextCursor": null
  }
}
```

Error:

```json
{
  "error": {
    "code": "database_unavailable",
    "message": "Database is not configured for this environment."
  },
  "meta": {
    "requestId": "req_example"
  }
}
```

Errors do not include raw stack traces, connection strings, SQL, secrets, or internal file paths.

## Database Unavailable Behavior

Route handlers do not connect to the database at import time. If `DATABASE_URL` is missing or the database cannot be reached during a request, the API returns:

```json
{
  "error": {
    "code": "database_unavailable",
    "message": "Database is not configured for this environment."
  }
}
```

This keeps `npm run typecheck`, `npm run lint`, and `npm run build` working without a local or hosted database.

## What This Does Not Add

- No UI-to-API connection.
- No replacement of `src/data/mock-*`.
- No mutations.
- No auth provider.
- No billing/payment provider.
- No live AI agents.
- No external connectors.
- No workers.
- No hosted database connection.
- No `.env`.
- No real secrets.
- No `DATABASE_URL` hardcoding.
- No database URL exposure to the browser.

## Why The UI Is Not Connected Yet

The current UI is a deterministic portfolio demo. Keeping it on local data preserves stable screenshots, route behavior, role-switcher demos, and zero-cost review while the backend foundation is tested behind it.

The API layer should be verified independently before any screen consumes database-backed data. UI integration should wait until:

- auth is designed or the demo API mode is explicitly accepted.
- read responses are verified against local and hosted Postgres.
- loading and error states are designed.
- access behavior is tested in browser QA.
- server-side authorization is ready for sensitive reads.

## Security References

Phase 4B.2 follows defensive guidance from:

- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
- [OWASP API Top 10 2023](https://owasp.org/API-Security/editions/2023/en/0x11-t10/)
- [OWASP Web Security Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle select queries](https://orm.drizzle.team/docs/select)
- [Zod](https://zod.dev/)

Relevant Phase 4B.2 controls map to OWASP API risks around object-level authorization, property-level exposure, function-level authorization, resource consumption, security misconfiguration, and API inventory.

## Next Phase Recommendation

Phase 4B.3 should verify these routes against a running local Postgres database, add lightweight API tests, and decide whether the next implementation step is:

- read-only UI integration behind loading/error states, or
- real auth/session foundation before any UI consumes database-backed data.

Mutations should still wait until server-side identity, RBAC, audit writes, and transaction rules are implemented.
