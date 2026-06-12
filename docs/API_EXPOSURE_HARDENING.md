# API Exposure Hardening

Phase 4B.3.1 hardens the read-only API layer by reducing public response detail and keeping internal operational identifiers server-side.

This phase is defensive hardening only. It does not connect the UI to the API or database, add mutations, add auth, add billing, add live AI agents, add connectors, add workers, create secrets, or connect hosted services.

## What Changed

- Public API responses now pass through DTO mappers.
- Raw database rows are not returned directly from read handlers.
- Public responses use minimized display fields.
- Internal identifiers remain server-side for database scoping and future authorization checks.
- Session responses return display context only.
- Audit, usage, and entitlement responses are summarized for portfolio-safe review.

## Response Minimization

The public API response strategy follows least-exposure principles:

- return only fields needed by a future UI,
- avoid raw internal identifiers in public JSON,
- avoid fake personal contact data in responses,
- avoid implementation-specific runtime references,
- keep audit output as public-safe timeline summaries,
- keep detailed runtime notes in ignored private docs.

## Current Boundary

The API remains read-only and uses a temporary demo server session. This is not production authorization.

The UI remains disconnected from the API and database.

## Deployment Gate

The API should not be treated as production-ready until real auth/RBAC or an explicitly approved safe public demo mode exists.

## Verification

This phase adds a local exposure verification script that checks read-only API response JSON for forbidden public exposure terms without dumping full response bodies.

## Remaining Work

- trusted authentication,
- server-side RBAC,
- object-level authorization tests,
- rate limits,
- production deployment boundaries,
- audit rules for future sensitive reads and writes.
