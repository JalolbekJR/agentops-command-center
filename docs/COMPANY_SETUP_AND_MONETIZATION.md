# Company Setup And Monetization

## Goal

AgentOps must support a safe public demo, small hosted teams, Pro custom-agent teams, and Enterprise/self-hosted customers. The plan model defines what is visible in Phase 3A UI, but real payment and billing enforcement are not implemented.

## Plans

| Plan | Audience | Key Unlocks |
| --- | --- | --- |
| Free Demo | Public demo and portfolio review. | Website QA Agent, allowlisted demo targets, limited runs/events. |
| Starter | Small teams starting with governance. | Hosted dashboard, basic built-ins, more runs and retention. |
| Pro | Teams connecting custom agents. | Native Protocol, webhook/SDK concepts, trace imports, BYOK planning. |
| Enterprise / Self-hosted | Sensitive or regulated teams. | Private workers, MCP connectors, audit export, custom connectors, license controls. |

## Usage Meters

- Seats.
- Connected agents.
- Built-in agents.
- Custom agents.
- Runs per month.
- Browser QA minutes.
- Webhook events.
- Native Protocol events.
- Private workers.
- MCP connectors.
- Trace imports.
- Data retention.
- Audit export.
- BYOK AI provider.
- Custom connectors.
- Support level.

## Monetization Rules

- Free Demo is safe, limited, and public-demo friendly.
- Starter proves hosted team value without private workers.
- Pro unlocks custom/BYO integrations and stronger usage.
- Enterprise covers private worker, self-hosted/license, audit export, and custom connector needs.
- No real Stripe/payment code is added in Phase 3A.

## Customer Workspace Setup

Customers can configure:

- Workspace name.
- Team members.
- Allowed targets.
- Connected agents.
- Workspace-level connector setup.
- Future workspace API keys/tokens conceptually.
- Private worker status where allowed.
- Plan usage within limits.

Customers cannot configure:

- Global deployment defaults.
- Global licensing.
- Built-in agent source/catalog publishing.
- Global connector templates.
- Owner-only security policy.
- Monetization controls.

## Future Enforcement

Plan and usage enforcement must be server-side in future backend phases. Client-side labels are explanatory only.

## Phase 3B Plan UX

Plans are now presented as product packaging:

- Pro is the recommended conceptual plan.
- Free Demo, Starter, Pro, and Enterprise/Self-hosted are compared side by side.
- Usage meters show current local demo consumption.
- A feature matrix explains what unlocks built-in agents, Native Protocol, webhook, SDK, MCP, private workers, and audit export.
- No real payments, Stripe code, checkout, billing portal, invoices, or webhooks are implemented.
