# Testing and QA

AgentOps Command Center uses automated checks and local browser tests to keep the deterministic prototype stable. This document explains the current quality strategy, what the tests prove, and what future testing should add.

## Quality strategy

The current QA strategy focuses on:

- Type safety
- Lint quality
- Production build health
- Route loading
- Browser console cleanliness
- Role/access regressions
- Responsive layout
- Screenshot artifacts for visual review
- Static scans for unsafe patterns and secrets

The test suite supports public review of the prototype. It does not claim production security coverage.

## Commands

Run the core checks with:

```powershell
npm run typecheck
npm run lint
npm run build
```

Run the browser suite when route behavior or screenshots need verification:

```powershell
npm run e2e
```

## Typecheck

`npm run typecheck` runs TypeScript without emitting files. It verifies that the app, typed domain data, components, and tests satisfy the current type contracts.

## Lint

`npm run lint` runs ESLint. It checks source and test files for code quality issues covered by the current configuration.

## Production build

`npm run build` runs a Next.js production build. It verifies route compilation, static page generation, and framework-level build health.

The build may regenerate `next-env.d.ts` between development and build route type paths. Restore that file if it is the only generated route-types toggle.

## Playwright E2E

`npm run e2e` runs Playwright tests against the local app.

Current test files:

- `tests/e2e/access-and-console.spec.ts`
- `tests/e2e/responsive-smoke.spec.ts`

## Route, access, and console policy

The access and console suite verifies:

- Core routes load successfully
- `/favicon.ico` returns successfully
- Browser console does not report unexpected errors
- Page errors are treated as failures
- Local request failures are treated as failures, except expected framework prefetch aborts
- Founder/Admin can access Owner Control and Agent Builder
- AI Engineer can access Agent Builder but not Owner Control
- Viewer cannot access Owner Control or Agent Builder
- Product Manager cannot access Owner Control
- Role selection persists across reloads

## Responsive smoke coverage

The responsive suite captures and checks routes across:

- `1440x900`
- `1366x768`
- `390x844`

It verifies:

- Main content renders
- No horizontal page overflow appears
- Visible actions are not clipped outside the viewport
- Mobile drawer opens and closes
- Theme and view-mode screenshots render
- Collapsed and expanded sidebar states render

## Screenshot artifacts

Playwright writes screenshots to:

```text
test-results/phase-3b4-elite-ux/
```

These screenshots are local visual QA artifacts. Regenerate them with `npm run e2e` when layout or screenshot review changes.

## What tests prove

The current tests prove:

- The app builds and compiles
- Primary routes load
- Restricted routes follow local role policy
- Role persistence works in the tested flows
- The browser console stays clean in the tested routes
- Desktop and mobile layouts avoid obvious overflow
- Screenshots can be regenerated for review

## What tests do not prove yet

The current tests do not prove:

- Production authentication security
- Server-side RBAC enforcement
- Database transaction correctness
- Real connector behavior
- Live agent execution safety
- Payment or billing behavior
- Real browser recording ingestion
- Full accessibility compliance
- Load or performance under production data volume

Those checks belong to future backend, connector, and production-hardening phases.

## Future testing roadmap

Future QA work should add:

- Unit tests for permission helpers
- Unit tests for workflow graph validation
- Unit tests for run state transitions
- Unit tests for release-gate logic
- Component tests for tables, cards, badges, dialogs, and drawers
- Accessibility checks with keyboard and screen-reader review
- Backend authorization tests once API routes exist
- Database transaction tests once persistence exists
- Connector policy tests once connector writes exist
- Worker/runtime tests once live execution exists
