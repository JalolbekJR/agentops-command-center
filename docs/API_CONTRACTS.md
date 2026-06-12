# API Contracts

## Purpose

This document describes the public shape and principles of the AgentOps Command Center API direction without publishing a full endpoint inventory. Detailed internal route notes are kept in ignored private documentation.

## Contract Principles

- Keep API reads and writes explicit.
- Validate all request inputs before database access.
- Use server-side identity and authorization once auth is added.
- Scope every tenant-owned read or write to the current workspace and project boundary.
- Return stable response envelopes with safe public messages.
- Minimize public response fields through DTOs.
- Avoid exposing internal database identifiers, raw audit references, raw trace references, or private operational metadata.
- Use bounded pagination for list responses.
- Keep mutation routes out of scope until auth, RBAC, audit, and transaction rules are implemented.

## Public API Categories

Future API work is organized around high-level categories:

- session context
- workspace and project summaries
- agent summaries
- workflow and run summaries
- approval summaries
- risk and evaluation summaries
- audit summaries
- usage and entitlement summaries
- setup and connector summaries
- future owner/admin operations

The public repository intentionally does not list exact route maps for these categories.

## Response Envelope

Successful responses use a stable envelope:

```json
{
  "data": {},
  "meta": {
    "requestId": "request_reference",
    "mode": "database-readonly"
  }
}
```

List responses add bounded pagination metadata:

```json
{
  "data": [],
  "meta": {
    "requestId": "request_reference",
    "limit": 20,
    "nextCursor": null
  }
}
```

Errors use stable public codes and safe messages:

```json
{
  "error": {
    "code": "validation_invalid",
    "message": "The request input is invalid."
  },
  "meta": {
    "requestId": "request_reference"
  }
}
```

Error responses must not include stack traces, SQL, connection strings, internal file paths, secrets, or private operational details.

## Validation Model

The API contract expects:

- schema validation before database access,
- bounded list limits,
- cursor validation,
- enum allowlists for filters,
- rejection of duplicate or unsupported parameters,
- no user-controlled table or column names,
- no open-ended search helpers until a later reviewed phase.

## Authorization Model

The current backend read layer uses a temporary demo server session. This is not production authorization.

Production authorization must derive identity, workspace membership, permissions, and object access server-side. Client-side role switching remains demo presentation logic and must not be trusted by backend handlers.

## Current Boundary

The current backend remains read-only. It does not add auth, billing, live AI agents, external connectors, workers, or UI-to-database integration.

## Future Contract Work

Before mutations are added, the project should define:

- trusted auth/session handling,
- server-side RBAC,
- object-level authorization tests,
- audit requirements,
- idempotency rules,
- rate limits,
- safe request size limits,
- transaction boundaries,
- production deployment gates.
