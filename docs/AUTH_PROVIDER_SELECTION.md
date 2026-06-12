# Auth Provider Selection

## Executive Recommendation

The recommended first local spike provider is **Auth.js / NextAuth**.

This is a planning decision, not an implementation. No auth provider is installed in this phase, the app is not production-auth-ready, and deployment remains gated.

Auth.js is the best first spike candidate for AgentOps Command Center because the project already has its own PostgreSQL-backed internal user, workspace, role, permission, and object-authorization model. The first real auth step should validate whether a trusted external session can populate the existing `ServerAuthContext` without rewriting route handlers or moving authorization authority into a vendor-specific organization model.

Clerk and Supabase Auth remain strong alternatives. Clerk becomes more attractive if the highest priority becomes fastest managed user and organization experience. Supabase Auth becomes more attractive if the project intentionally standardizes on Supabase-managed Postgres and Supabase Auth as a combined platform.

## Decision Context

The current backend has:

- a server-side auth/RBAC boundary,
- a typed server auth context,
- centralized policy helpers,
- object-scoped workspace and project read access,
- minimized DTO responses,
- read-only API routes,
- local API exposure and auth-boundary verification,
- a temporary demo identity that remains deployment-gated.

The project does not yet have:

- a real auth provider,
- trusted provider sessions,
- login or signup UI,
- middleware session enforcement,
- UI-to-API integration,
- mutations,
- production authorization readiness.

Client-side role switching remains presentation-only. Backend authorization must continue to come from server-side identity, workspace membership, role, permissions, and object access checks.

## Project Requirements

The provider direction should satisfy these AgentOps-specific needs:

- Works well with Next.js App Router.
- Supports server-side session validation.
- Can map external identity to internal users.
- Can support workspace and team membership.
- Can support role and permission mapping.
- Does not force trust in client-side role state.
- Can keep the current server-side policy helpers.
- Allows minimized DTO response strategy.
- Supports future billing/admin separation.
- Supports local development safely.
- Has a reasonable free or low-cost development path.
- Keeps vendor lock-in understandable.
- Works with a PostgreSQL-backed internal domain model.
- Can support future audit and rate-limit flows.
- Can be deployment-gated before production.
- Is understandable for portfolio and interview explanation.
- Avoids unnecessary architecture complexity.

## Provider Options Considered

**Auth.js / NextAuth** is an open-source authentication library for modern JavaScript apps. Official docs describe multiple authentication methods, database adapter support, and session strategy choices. It is a good candidate when the project wants to own internal identity, membership, and authorization tables.

**Clerk** is a managed auth and user-management provider. Official docs describe Next.js middleware, server-side auth helpers, organizations, roles, and permissions. It is a good candidate when speed of user-management implementation and managed organization UX are more important than owning every auth-adjacent workflow.

**Supabase Auth** is part of the Supabase platform. Official docs describe Next.js and SSR auth setup, cookie-based flows, and server-side claim validation guidance. It is a good candidate if the project commits to Supabase-managed Postgres/Auth as a combined backend platform.

Official sources checked:

- [Next.js Authentication Guide](https://nextjs.org/docs/app/guides/authentication)
- [Next.js Data Security Guide](https://nextjs.org/docs/app/guides/data-security)
- [Auth.js Getting Started](https://authjs.dev/getting-started)
- [Auth.js Database Adapters](https://authjs.dev/getting-started/database)
- [Auth.js Session Strategies](https://authjs.dev/concepts/session-strategies)
- [Clerk Organizations Overview](https://clerk.com/docs/guides/organizations/overview)
- [Clerk Roles and Permissions](https://clerk.com/docs/guides/organizations/control-access/roles-and-permissions)
- [Clerk Next.js Middleware](https://clerk.com/docs/reference/nextjs/clerk-middleware)
- [Supabase Auth with Next.js](https://supabase.com/docs/guides/auth/quickstarts/nextjs)
- [Supabase Server-Side Auth](https://supabase.com/docs/guides/auth/server-side)
- [Supabase SSR Client Guidance](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

Pricing, current usage limits, and commercial plan details were not verified in this phase.

## Evaluation Matrix

| Criteria | Auth.js / NextAuth | Clerk | Supabase Auth |
| --- | --- | --- | --- |
| Next.js App Router fit | Strong | Strong | Strong |
| Server-side validation | Strong | Strong | Strong |
| Internal DB ownership | Strong | Medium | Depends |
| Workspace/team model | Medium | Strong | Medium |
| RBAC compatibility | Strong | Strong | Medium |
| Local development | Strong | Medium | Medium |
| Operational complexity | Medium | Strong | Medium |
| Vendor lock-in | Strong | Medium | Medium |
| Portfolio explanation value | Strong | Strong | Medium |
| Future monetization fit | Strong | Medium | Depends |
| PostgreSQL internal domain fit | Strong | Medium | Strong if Supabase is selected |
| Current architecture fit | Strong | Medium | Depends |

Ratings are intentionally qualitative. They reflect fit for this repository's current architecture, not a universal ranking.

## Recommended Path

Use **Auth.js / NextAuth as the first local spike candidate**.

Why it fits now:

- The project already owns its internal user, workspace, role, permission, and object-access model.
- The current `ServerAuthContext` can remain the stable contract between provider identity and route authorization.
- The policy layer can stay provider-agnostic.
- The first spike can focus on resolving a trusted server session and mapping it into internal records.
- The resulting architecture is easy to explain in a serious engineering portfolio: provider proves identity; AgentOps decides workspace access and permissions.

Risk it reduces:

- Avoids moving core authorization rules into a vendor-specific organization model too early.
- Avoids committing to a hosted database/auth bundle before database hosting is finalized.
- Keeps the current backend policy helpers and DTO minimization strategy intact.

Risk it adds:

- More implementation responsibility stays with the project.
- Login UI, account lifecycle, invitation flows, session hardening, and operational auth details require more engineering care.
- The team must make explicit choices about session strategy, adapter use, and account-linking behavior during the spike.

Why it should be tested before implementation:

- The spike must prove the provider session can populate `ServerAuthContext`.
- The spike must prove internal user and workspace membership mapping can fail closed.
- The spike must prove route handlers do not need vendor-specific rewrites.
- The spike must prove demo mode can remain local-only and deployment-gated.

What would change the decision:

- Choose **Clerk** first if the priority becomes fastest managed user, invitation, and organization experience.
- Choose **Supabase Auth** first if the project commits to Supabase-managed Postgres and wants auth tightly aligned with that backend stack.
- Revisit the decision if production deployment target, cost constraints, compliance needs, or workspace administration requirements become more concrete.

## Why Not the Others Yet

**Clerk is not selected for the first spike now** because AgentOps already has a domain-specific internal workspace/RBAC model. Clerk may still be the right choice later if managed organizations, prebuilt user-management UX, and reduced auth UI work become more important than keeping more auth-adjacent behavior in the project database.

**Supabase Auth is not selected for the first spike now** because database hosting has not been finalized as Supabase-specific. Supabase Auth is a strong candidate if the project chooses Supabase as the primary hosted Postgres and auth platform, but selecting it now would bundle the auth decision with a broader backend platform decision.

## Local Spike Plan

The local spike should answer these questions only. It should not ship production auth.

- Can provider sessions be resolved server-side?
- Can external identity map to internal users?
- Can workspace membership be loaded server-side?
- Can the current `ServerAuthContext` be populated without route rewrites?
- Can demo mode stay local-only?
- Can public deployment remain gated?
- Can tests prove anonymous and insufficient-permission paths?
- Can provider-specific code stay isolated behind the auth context resolver?
- Can public responses remain minimized through existing DTO mappers?

The spike should be small, reversible, and isolated to an auth resolver branch. It should not connect the UI to database-backed APIs until auth behavior is verified independently.

## Future Implementation Phases

- Phase 4C.4 Local auth provider spike
- Phase 4C.5 Real session resolver
- Phase 4C.6 Internal user and membership mapping
- Phase 4C.7 Route authenticated enforcement
- Phase 4C.8 Auth/RBAC runtime tests
- Phase 4C.9 Deployment gate review

Each phase should keep provider-specific behavior behind the auth context resolver and preserve centralized policy helpers.

## Security Gates

Future implementation must require:

- no public deployment with demo identity,
- server-side session validation,
- internal user mapping,
- workspace membership mapping,
- server-side role and permission resolution,
- object-level authorization tests,
- response minimization tests,
- secret scans,
- public documentation scans,
- rollback path,
- deployment gate review.

The backend should continue to fail closed when identity, membership, permission, database, or deployment configuration is missing or invalid.

## Testing Gates

Future auth work should add tests for:

- anonymous request behavior,
- expired or invalid session behavior,
- missing internal user,
- inactive user,
- missing workspace membership,
- insufficient permission,
- cross-workspace access,
- nonexistent object,
- safe 401, 403, 404, and 503 behavior,
- response minimization,
- no raw auth context leakage,
- no internal ID leakage,
- deployment-gate checks.

Runtime API verification should remain separate from browser UI testing until UI-to-API integration is intentionally scoped.

## Rollback Strategy

The rollback strategy is to keep provider code isolated behind the auth context resolver.

- Avoid route rewrites.
- Keep read-model authorization provider-agnostic.
- Keep demo mode local-only for verification.
- Feature-gate auth rollout.
- Keep the local spike branch small and reviewable.
- Preserve the current read-only API verification scripts during the spike.
- Do not remove the deployment gate until real auth and RBAC tests pass.

If the spike fails, the project should be able to revert the provider resolver changes while keeping the existing auth/RBAC boundary intact.

## Explicit Non-Goals

This phase does not:

- install an auth provider,
- add login UI,
- add cookies or session persistence,
- change runtime auth behavior,
- connect UI to API,
- add mutations,
- deploy production auth,
- add billing,
- add live AI calls,
- add external connectors,
- add workers or queues,
- create `.env`,
- add hosted credentials or secrets.

## Remaining Risks

- Provider behavior still needs local spike verification.
- Real session mapping is not implemented.
- Real workspace membership mapping is not implemented.
- Audit writes and rate limits remain future work.
- Deployment remains gated.
- Pricing and commercial plan limits were not verified in this phase.
