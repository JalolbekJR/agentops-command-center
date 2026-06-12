# Auth Provider Integration Plan

## Overview

AgentOps Command Center now has a server-side auth/RBAC boundary for the read-only backend, but it still resolves identity from a temporary demo context. Real auth provider integration is required before any public deployment, UI-to-API connection, write routes, billing, live AI work, external connectors, or workers.

This plan describes the recommended future auth boundary without implementing provider code in this phase. The goal is to keep the backend deployment-gated, fail-closed, and ready for a trusted session resolver.

## Current State

The current backend has:

- a typed server auth context,
- a centralized RBAC boundary,
- a temporary demo identity,
- read-only backend routes,
- server-side permission helpers,
- workspace and project object-scoped read helpers,
- minimized DTO responses,
- local verification scripts for response exposure and auth-boundary behavior.

The current UI is not connected to database-backed APIs. Client-side role switching remains presentation-only and is not accepted as backend authority. Public deployment remains gated until trusted auth, session validation, workspace membership mapping, and policy tests are complete.

## Target Auth Boundary

The target backend boundary should map identity and access in this order:

External Auth Provider
to Trusted Server Session
to Internal User
to Workspace Membership
to Role
to Permission Set
to Object-Scoped API Authorization
to Minimized DTO Response

Every API request should derive authorization from server-side state. No public API should trust client-submitted user IDs, display emails, local storage, session storage, client role state, or UI-only access modeling.

## Recommended Provider Options

The provider decision should remain open until the implementation phase. The main candidates are:

- **Auth.js / NextAuth**: a flexible open-source option for teams that want more ownership over identity persistence, adapters, and provider composition.
- **Clerk**: a managed auth and user-management option that can reduce implementation time, especially if future workspace or organization management needs are significant.
- **Supabase Auth**: a strong fit when the product wants auth tightly aligned with Supabase-managed Postgres and server-side token validation patterns.

The final provider choice should depend on:

- deployment target,
- cost and budget,
- user management needs,
- team and workspace model,
- future monetization needs,
- vendor lock-in tolerance,
- database ownership preference,
- operational support expectations.

This phase does not choose or install a provider. The next phase should compare these options against the project deployment model and decide whether auth ownership or managed user operations matter more.

## Provider-Agnostic Session Contract

Any future provider must resolve a trusted server session before authorization. The backend should normalize provider output into the existing server auth context shape.

Conceptually, the backend needs:

- external provider subject or user reference,
- verified email status,
- normalized display identity,
- session freshness,
- account status,
- optional organization or workspace hints when supported,
- provider and session metadata needed for auditability.

The normalized session contract should not expose raw provider tokens, provider secrets, or implementation-specific claims to public DTO responses.

## Internal User Mapping

External identity must map to an internal user record on the server.

Rules:

- no public API should trust raw client-submitted user IDs,
- no client role switcher authority,
- no direct authorization from display email alone,
- server must resolve internal user identity before permissions,
- inactive or missing internal users should fail closed,
- internal user records should be the stable bridge between auth provider identity and AgentOps workspace access.

Provider identity should prove who the user is. The AgentOps database should still decide what that user can access.

## Workspace Membership Mapping

Every protected API request must resolve:

- internal user,
- workspace membership,
- membership status,
- workspace role,
- permission set,
- object access scope.

Workspace membership should be required before workspace or project data is returned. Missing, disabled, or ambiguous memberships should fail closed with safe public errors.

## Role and Permission Mapping

The current read-only permission model should evolve into a broader server-side permission system. Future roles may include:

- founder/admin,
- operator,
- reviewer,
- viewer,
- future billing or workspace administration roles.

Roles should map to permission sets server-side. The UI may display role state, but API authorization must come from resolved membership and policy helpers. Future write actions should require separate permissions, audit writes, and transaction rules before they are exposed.

## API Request Authorization Flow

Future authenticated API requests should follow this flow:

1. Request arrives.
2. Server validates the trusted provider session.
3. Server maps external identity to an internal user.
4. Server resolves workspace membership.
5. Server resolves role permissions.
6. Server validates request input.
7. Server performs object-level authorization.
8. Server loads only authorized data.
9. Server maps database rows through DTOs.
10. Server returns a minimized response.
11. Server emits audit and rate-limit signals in future phases.

Route handlers should continue to rely on server-side policy helpers. Provider-specific session code should remain isolated behind the server auth context resolver so routes and read models do not depend on a specific vendor.

## Demo Session Migration Strategy

Phase A:

- keep demo mode local-only and deployment-gated,
- keep the current read-only API verification scripts passing,
- keep public documentation high-level.

Phase B:

- add a real provider session resolver behind the same auth context contract,
- keep temporary demo mode available only where explicitly allowed for local verification,
- avoid changing route authorization semantics.

Phase C:

- map provider identities to internal users and workspace memberships,
- reject missing, inactive, or ambiguous mappings safely,
- keep client role state presentation-only.

Phase D:

- disable public demo identity for production,
- require trusted session validation before protected API reads,
- keep deployment blocked until authorization tests pass.

Phase E:

- add tests, audit write strategy, rate-limit strategy, and deployment checks,
- review rollback behavior before enabling public access.

## Deployment Gates

Before production deployment, the project should require:

- real auth provider configured,
- session validation implemented,
- internal user mapping implemented,
- workspace membership mapping implemented,
- RBAC policy tests passing,
- object-level authorization tests passing,
- public docs scan clean,
- secrets scan clean,
- rate-limit strategy defined,
- audit write strategy defined,
- demo identity disabled or explicitly local-only,
- rollback plan documented.

The backend should remain deployment-gated until these controls are complete and reviewed.

## Security Requirements

Future auth implementation must preserve:

- fail-closed behavior,
- least privilege,
- server-side authorization only,
- no trust in client role state,
- no trust in local storage or session storage for authorization,
- response minimization,
- safe error handling,
- object-level access checks,
- no raw provider tokens in responses,
- no internal IDs in public DTOs unless explicitly safe,
- no secrets in the repository,
- no production deployment with temporary demo identity.

The result should be described as hardened and defense-in-depth, not as fully secure, compliance certified, or complete production authorization.

## Test Requirements

Before real auth is considered safe, future tests should cover:

- unauthenticated request behavior,
- expired session behavior,
- inactive user behavior,
- missing workspace membership behavior,
- insufficient permission behavior,
- cross-workspace object access behavior,
- nonexistent object behavior,
- safe 401, 403, 404, and 503 behavior,
- response minimization,
- no raw auth context leakage,
- no internal ID leakage,
- deployment gate checks.

The test suite should include unit-level policy checks and runtime API verification against a local database. Browser QA should wait until UI-to-API integration is intentionally scoped.

## Future Implementation Phases

- Phase 4C.3 Auth provider selection and local spike
- Phase 4C.4 Real session resolver
- Phase 4C.5 Internal user and membership mapping
- Phase 4C.6 Route-level authenticated enforcement
- Phase 4C.7 Auth/RBAC test suite
- Phase 4C.8 Deployment gate and production readiness review

Each future phase should keep changes small, testable, rollback-friendly, and public-repo-safe.

## Explicit Non-Goals

This planning phase does not add:

- provider installation,
- login UI,
- cookies or session persistence,
- middleware auth enforcement,
- mutations,
- UI-to-API connection,
- production deployment,
- billing,
- live AI calls,
- external connectors,
- workers or queues,
- hosted credentials,
- secrets or `.env` files.

## Remaining Risks

- Temporary demo identity still exists.
- Real provider has not been selected.
- Real session validation is not implemented.
- Internal user and membership mapping is planned but not implemented.
- Audit writes and rate limits remain future work.
- Deployment must remain gated until real auth and policy tests are complete.
