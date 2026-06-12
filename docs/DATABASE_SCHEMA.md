# Database Schema

## Schema Goal

The database model supports the AgentOps Command Center demo today and a future PostgreSQL backend later. It is relational because agent operations need durable records, scoped ownership, approval state, evaluation evidence, risk summaries, and auditability.

This public version intentionally avoids a full internal schema map. Detailed table, column, index, and relationship notes are kept in ignored private documentation.

## Conceptual Domains

The schema is organized around:

- workspace identity and membership,
- roles and permissions,
- projects and agents,
- workflows and run history,
- approval and risk review,
- evaluation and audit summaries,
- usage and entitlement state.

## Design Principles

- Keep workspace/project boundaries explicit.
- Keep operational records durable and reviewable.
- Support append-only audit patterns in future backend phases.
- Store summaries and references instead of raw sensitive payloads where possible.
- Preserve deterministic seed behavior for local verification.
- Keep production authorization server-side.
- Avoid exposing internal identifiers in public API responses.

## Security Notes

- Client-side roles are demo-only and not trusted by backend code.
- Future APIs must validate inputs before database access.
- Future reads and writes must enforce object-level authorization.
- Future mutations must be auditable and transaction-safe.
- Secret values must stay out of the database, source code, and public docs.

## Current Boundary

The schema foundation is not a production deployment by itself. It does not add auth, billing, live agents, external connectors, workers, or UI-to-database integration.
