# Deployment Setup Model

## Goal

AgentOps should be easy to set up without giving customers inappropriate control over global platform settings. This model separates platform owner controls from customer workspace setup.

Phase 3A is UI and documentation only. No deployment, database, worker, or external service is created.

## Setup Modes

| Mode | Best For | Control Model |
| --- | --- | --- |
| Hosted SaaS | Small teams that want the easiest setup. | Platform owner controls infrastructure; customers configure workspace, targets, agents, and plan. |
| Self-hosted / Enterprise | Companies requiring private workers and controlled package distribution. | Customer controls database, worker, secrets, and network; platform owner controls license/catalog defaults. |
| Local Developer Mode | Portfolio development and safe deterministic demos. | No paid APIs, secrets, or real external execution. |

## Setup Wizard Steps

1. Choose deployment mode.
2. Connect database or future persistence.
3. Choose agent connection method.
4. Configure allowlisted targets.
5. Verify worker and connector health.
6. Run first safe test.

## Protection Reality

If full source code is distributed to a customer, it cannot be fully protected from reverse engineering. The safer small-team model is hosted SaaS. Enterprise/private options should use licensed deployment, controlled package/container delivery, private workers, and clear legal/license terms.

## Local Demo Constraints

- No `.env` files.
- No secrets.
- No production database.
- No real workers.
- No external scanning.
- No browser execution.
- No payment or deployment setup.

## Future Backend Requirements

- Server-side setup state.
- Database connection validation.
- Worker health checks.
- License/plan enforcement.
- Connector token hashing.
- Audit logs for setup changes.
- Owner-only controls enforced by platform identity.
