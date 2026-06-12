# AgentOps Native Protocol

## Purpose

The AgentOps Native Protocol is the future event contract for agent runtimes that want to report runs, tool activity, approvals, risks, evaluations, artifacts, and cost summaries into AgentOps Command Center.

This public document describes goals and safety principles only. Detailed event examples, internal mappings, and runtime identifiers are kept in ignored private documentation.

## Goals

- Give future agents a consistent way to report operational evidence.
- Support run timelines, review queues, evaluations, risk summaries, and audit summaries.
- Keep untrusted tool output separate from system instructions.
- Preserve human review points before high-impact automation.
- Avoid exposing secrets or raw sensitive payloads to the UI.
- Keep public examples generic and non-operational.

## Event Categories

The protocol is organized around high-level event categories:

- run lifecycle
- run timeline
- tool summary
- approval request or decision summary
- risk summary
- evaluation summary
- cost summary
- artifact reference
- audit summary

Exact event shapes and mapping details are intentionally not published in this public file.

## Safety Principles

- Treat external content and tool output as untrusted data.
- Validate event payloads server-side before persistence.
- Scope every event to an authorized workspace/project boundary.
- Store summaries by default, not raw sensitive payloads.
- Never include secret values in event payloads.
- Use redaction and retention rules for logs, artifacts, and screenshots.
- Require human review for high-impact or policy-sensitive actions.
- Keep ingestion disabled until auth, token handling, replay protection, and audit rules are implemented.

## Current Status

The current application does not ingest live native protocol events. The public demo uses deterministic local data only.

## Future Work

Before this protocol becomes live, the project should add:

- authenticated ingestion,
- schema validation,
- replay protection,
- source attribution,
- rate limits,
- payload size limits,
- secret redaction,
- audit rules,
- safe retention policy,
- worker isolation for live agent execution.
