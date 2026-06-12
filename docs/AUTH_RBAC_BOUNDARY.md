# Auth/RBAC Boundary Foundation

Phase 4C.1 introduces a server-side authorization boundary for the read-only backend. The goal is to make identity, permissions, object-scoped access, and safe errors explicit before any UI integration, public deployment, mutations, billing, AI agents, connectors, or workers.

This phase is defensive hardening only. It does not add a real auth provider, login UI, cookies, mutations, billing, live AI calls, external connectors, workers, hosted credentials, `.env` files, or secrets.

## What Changed

- A typed server auth context now represents temporary demo mode, future authenticated mode, and anonymous/missing identity mode.
- Read-only permission keys are centralized for current backend actions.
- Route handlers pass an explicit required permission into the read-model boundary.
- Central policy helpers enforce authenticated context, permission checks, workspace access, and project access.
- Workspace and project reads are object-scoped before child resources are returned.
- Public responses continue to use DTO mappers so internal identifiers remain server-side.
- The temporary demo session remains clearly marked as demo-only and deployment-gated.
- Local verification checks now cover both response exposure and auth-boundary behavior.

## Security Posture

The backend now follows a fail-closed structure for current read-only routes:

- identity is resolved on the server,
- permissions are checked server-side,
- workspace and project access are explicit,
- not-visible objects use safe not-found responses,
- validation errors stay bounded and consistent,
- database unavailable behavior stays safe,
- route errors avoid stack traces, SQL, internal identifiers, and raw auth context.

This is not production authorization. Public deployment should remain gated until a real auth provider, trusted sessions, full server-side RBAC, rate limits, observability, and deployment review are completed.

## Demo Boundary

The current server session is a temporary seeded demo identity used only for local read-only verification. It is not derived from client role state, local storage, query parameters, request body, or headers.

The client role switcher remains presentation-only and is not accepted as backend authority.

## What This Does Not Add

- No UI-to-API or UI-to-database connection.
- No write routes or mutations.
- No auth provider.
- No login, signup, cookies, or persistent sessions.
- No billing or payment code.
- No live AI agents.
- No external connectors.
- No workers or queues.
- No hosted database credentials.
- No secrets or `.env` files.

## Verification

Phase 4C.1 keeps the existing response exposure verifier and adds a local auth-boundary verifier. Together they check that read-only routes still return minimized DTOs, invalid input fails safely, object-scoped reads fail closed, and raw server auth context is not exposed.

## Next Phase Recommendation

The next backend phase should decide whether to add a real auth provider boundary or an explicitly approved public demo mode. UI integration should wait until trusted identity, server-side RBAC, browser QA, and deployment gates are accepted.
