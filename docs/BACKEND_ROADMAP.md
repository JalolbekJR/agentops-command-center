# Backend Roadmap

## Purpose

This roadmap explains how AgentOps Command Center can evolve from deterministic frontend demo to production-minded backend platform without exposing internal implementation maps in public docs.

## Current State

- Premium deterministic frontend demo.
- Local role/access modeling for portfolio review.
- PostgreSQL and Drizzle foundation.
- Read-only API foundation with validation and response minimization.
- UI remains disconnected from API/database.

## Roadmap Phases

### Foundation

- Keep deterministic demo mode stable.
- Add typed database schema and migrations.
- Add local runtime verification.
- Add read-only API foundations.
- Minimize public API responses through DTOs.

### Auth And Access Control

- Add trusted authentication.
- Resolve workspace membership server-side.
- Enforce RBAC server-side.
- Add object-level authorization tests.
- Keep client-side role switching as demo-only.

### Safe Read Integration

- Connect selected UI surfaces to read-only APIs only after loading, error, and access states are designed.
- Preserve deterministic demo fallback where useful.
- Add browser QA for API-backed screens.

### Mutations And Audit

- Add mutations only after auth/RBAC.
- Require validation, idempotency, transaction boundaries, and audit events.
- Keep high-impact actions gated by approval policy.

### Agent Runtime

- Add live agent execution only after persistence, approvals, risk controls, auditability, worker isolation, and cost controls are in place.

### Deployment

- Use hosted database and deployment provider secrets.
- Keep public deployment gated until auth/RBAC or an approved safe demo mode exists.
- Add monitoring, rate limits, and rollback procedures.

## Non-Goals For Current Phase

- No production auth.
- No billing.
- No live AI providers.
- No external connector execution.
- No background workers.
- No UI-to-database migration.
- No public production deployment.
