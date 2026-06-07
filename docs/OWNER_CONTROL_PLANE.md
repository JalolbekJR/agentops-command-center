# Owner Control Plane

## Goal

AgentOps needs a platform owner control plane separate from customer workspace setup. This protects global product, licensing, security, built-in agent catalog, connector templates, and monetization controls from customer-level configuration.

Phase 3A shows local demo UI only. No real owner enforcement exists yet.

## Owner-Only Controls

Only the platform owner/developer/admin should control:

- Global deployment mode.
- Global connector templates.
- Built-in agent catalog.
- Built-in agent publishing.
- Global setup defaults.
- Pricing and plan rules.
- License rules.
- Usage limits.
- Private worker templates.
- Monetization controls.
- Billing settings conceptually.
- Global security policies.
- Agent marketplace/catalog control.
- Default environment policies.

## Customer Workspace Controls

Customers can configure:

- Workspace name.
- Team members.
- Allowed targets.
- Connected agents.
- Workspace connector setup.
- Future workspace API keys/tokens conceptually.
- Private worker status if plan allows.
- Workspace rules within plan limits.

Customers must not control:

- Global platform setup.
- Global licensing.
- Built-in agent source/control.
- Global connector templates.
- Deployment defaults.
- Owner-only security policies.
- Monetization rules.

## Source Protection Reality

If unrestricted source code is delivered to a customer, it cannot be fully protected from reverse engineering. Hosted SaaS is the best model for small teams. Enterprise/private deployments should use licensed packages, controlled container distribution, private workers, and clear license terms.

## Future Enforcement

- Real platform owner identity.
- Server-side owner-only authorization.
- License state validation.
- Audit logs for owner actions.
- Separate owner and customer admin routes.
- Deployment/package controls for enterprise distribution.

## Phase 3B Local Boundary

Owner Control is Founder/Admin only in the local demo. Non-owner roles that directly visit `/owner-control` see a locked page instead of global deployment, connector, pricing, license, security, worker, or marketplace controls.

This is a product logic preview, not production security. Future backend enforcement must check platform owner identity before returning owner-control data or accepting owner-control actions.
