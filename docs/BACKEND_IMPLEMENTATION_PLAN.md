# Backend Implementation Plan

## Executive Summary

AgentOps Command Center should move from deterministic frontend prototype to real backend platform in small, secure phases. The current product remains useful as a safe portfolio demo while backend foundations are added behind it.

Recommended direction:

- Keep the current Next.js App Router frontend.
- Preserve deterministic demo mode until a backend integration phase is explicitly approved.
- Use PostgreSQL with Drizzle for typed, reviewable data access.
- Keep database access server-only.
- Use server-side validation before every database operation.
- Add trusted authentication before treating roles as production authorization.
- Enforce workspace/project scoping and RBAC server-side.
- Keep auditability, response minimization, and safe errors as baseline controls.
- Defer mutations, live agents, external connectors, billing, workers, and production deployment until their own reviewed phases.

## Security Standards

This plan uses security standards as guidance, not as a certification claim:

- OWASP ASVS for application security requirements.
- OWASP API Security for object authorization, function authorization, safe API inventory, and resource controls.
- OWASP Web Security Testing Guide for repeatable verification.
- NIST SSDF for secure implementation and review discipline.
- Data-minimization principles for user-like and operational data.

The project should use precise language: hardened, defense-in-depth, least privilege, fail-closed, validated, bounded, and deployment-gated.

## Architecture Direction

The backend should start as a modular monolith inside the existing Next.js app:

- Next.js route handlers for short API requests.
- Server-only service modules for database reads and future writes.
- PostgreSQL for persistence.
- Drizzle for typed query construction and migrations.
- DTO mappers for public response minimization.
- Future auth/RBAC layer before production deployment.
- Future queue/worker layer only after persistence, approvals, audit, and policy checks are stable.

Long-running agent work should not run inside request handlers. It should move to a worker model later, with scoped tool permissions and auditable run events.

## Backend Phases

### Phase 4B.1: Database Foundation

Add the database schema, migration path, local placeholder configuration, and deterministic seed script. Keep the UI disconnected from the database.

### Phase 4B.1.1: Runtime Readiness

Document and verify local database runtime options, hosted deployment readiness, and safe secret handling. Keep hosted service connection out of the repo.

### Phase 4B.2: Read-Only API Foundation

Add read-only API routes with server-side validation, safe response envelopes, bounded pagination, workspace/project scoping, and database-unavailable behavior.

### Phase 4B.3: Runtime API Verification

Verify that local database reads work against a real Postgres runtime. Confirm validation behavior, safe errors, and missing database configuration behavior.

### Phase 4B.3.1: API Exposure Hardening

Reduce public API response exposure through DTO mapping and response minimization. Keep internal identifiers server-side.

### Future Auth/RBAC Phase

Add trusted identity, workspace membership, server-side RBAC, and object-level authorization checks before any production-like deployment.

### Future Mutation Phase

Add carefully scoped writes only after auth, RBAC, audit logging, validation, idempotency, and transaction rules are implemented.

### Future Agent Runtime Phase

Add live agent execution only after persistence, approvals, risk controls, auditability, worker isolation, and cost controls are in place.

## Data Model Posture

The public architecture describes domains rather than internal table maps:

- identity and workspace membership,
- projects and agents,
- workflows and runs,
- approvals and risk review,
- evaluations and audit summaries,
- plans, usage, and entitlements.

Detailed table names, internal columns, indexes, and relationship maps are kept out of public documentation.

## API Hardening Principles

Every backend phase should preserve these controls:

- validate inputs before database access,
- use allowlisted filters and bounded pagination,
- keep database access server-only,
- use query builders instead of string-built SQL,
- scope reads and writes to workspace/project boundaries,
- return DTOs instead of raw database rows,
- avoid public exposure of internal identifiers,
- return safe error envelopes,
- avoid stack traces and internal implementation details in responses,
- keep secrets outside source code and public docs,
- keep deployment gated until auth/RBAC or an approved safe demo mode exists.

## Demo Mode Boundary

The current UI remains deterministic and local. It should not consume the API until loading, error, auth, and access-control behavior are designed and tested.

Client-side role switching is only a demo affordance. Backend authorization must not trust client role state.

## Deployment Gate

The backend should not be treated as production-ready until:

- trusted auth is implemented,
- server-side RBAC is active,
- API response minimization is verified,
- public demo mode is explicitly approved or disabled,
- rate limits and request size limits exist,
- database secrets are configured through the deployment provider,
- hosted database migration and rollback procedures are reviewed,
- logs and audit behavior are safe for the target environment.

## Testing Strategy

Backend testing should cover:

- validation failures,
- unknown and duplicate query parameters,
- bounded pagination,
- database unavailable behavior,
- response minimization,
- object access boundaries,
- safe error envelopes,
- no client role trust,
- no secrets in responses,
- no UI regression while the UI remains demo-data backed.

## Current Non-Goals

This plan does not add:

- production authentication,
- billing,
- live AI providers,
- external connector execution,
- background workers,
- hosted database credentials,
- production deployment,
- UI-to-database connection.

## Next Recommended Step

Finish public documentation hardening, then review whether the next backend phase should be auth/RBAC or additional read-only API tests. Mutations should remain blocked until auth and audit foundations exist.
