# Connector Security Model

## Goal

Connectors are powerful because they let external agents, workers, tools, and traces write into AgentOps. They must be validated, scoped, rate-limited, redacted, and auditable before any real integration exists.

## Default Controls

- Default deny.
- Allowlisted targets only.
- Secret references only.
- No raw tokens in client data.
- No raw secrets in events.
- No private URLs in public demo.
- Summaries over raw payloads.
- Artifact references over embedded files.
- Future connector tokens stored hashed.
- Future write actions audited.

## Threats

| Threat | Control |
| --- | --- |
| Token leakage | Store only secret references in client/demo data. |
| Webhook replay | Future signatures, timestamps, replay cache. |
| Prompt injection | Treat external content as data, not instruction. |
| Tool injection | Validate tool output and require permission gate. |
| Unsafe target scanning | Allowlist targets and block random domains. |
| Tenant confusion | Server-side project/team isolation later. |
| Sensitive logs | Redact and store summaries/references. |
| Plan abuse | Meter events, runs, browser minutes, worker usage. |

## Public Demo Rules

- Use local or reserved invalid demo targets only.
- Do not run login/private website tests.
- Do not include real URLs, tokens, customer names, or personal data.
- Do not create real connector credentials.
- Keep Website QA and connector cards clearly marked as demo/future foundation.

## Future Backend Enforcement

- Authenticated connector ingest.
- Hashed token verification.
- Event schema validation.
- Workspace plan checks.
- Rate limits.
- Audit log writes.
- Role-aware redaction.
- Object storage for artifacts.
- Private worker heartbeat validation.
