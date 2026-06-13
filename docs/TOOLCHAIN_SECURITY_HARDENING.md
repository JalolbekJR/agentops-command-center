# Toolchain Security Hardening

Phase 4C.4a removes project-controllable high-severity `esbuild` exposure from local database and TypeScript helper tooling without changing the product UI, API behavior, schema, seed data, or migration history.

## What Changed

- Drizzle ORM remains the runtime database library.
- Drizzle Kit was removed from the committed toolchain because its CLI path pulled deprecated loader packages and vulnerable `esbuild` versions.
- Database migration application now uses the committed SQL migration folder through the Drizzle ORM runtime migrator.
- API verification helpers now run as plain Node `.mjs` scripts.
- The deterministic seed command compiles the narrow seed import graph with the existing TypeScript compiler, then runs the emitted JavaScript with Node.
- `tsx`, direct `esbuild`, and platform `@esbuild/*` packages are absent from the project toolchain.
- Existing deterministic local seed behavior remains on the same npm script entry point.

## What Did Not Change

- No Auth.js implementation was added.
- No hosted database was connected.
- No environment file or secret was created.
- No schema files or committed migration SQL were rewritten.
- No UI route, API route, role behavior, or mock data model was changed.
- No database reset, migration history rewrite, or destructive database command was introduced.

## Database Commands

```powershell
npm run db:migrate
npm run db:seed
```

`db:migrate` applies only committed migrations from the repository's `drizzle/` folder. It requires `DATABASE_URL` at runtime and does not print connection strings.

`db:seed` still uses the deterministic seed script for local database verification. It emits temporary JavaScript into `.tooling-build/`, which is ignored by Git.

## Migration Creation Workflow

This phase intentionally removes the local migration generation CLI. New migrations should be added in a dedicated backend phase as reviewed SQL plus compatible migration metadata, then applied with `npm run db:migrate`.

Do not reintroduce a generator, hosted database branch, or migration automation unless the toolchain is reviewed first and the audit result is clean enough for the project policy.

## Verification Expectations

The hardened toolchain should show:

- no `drizzle-kit` package in the installed dependency tree,
- no deprecated `@esbuild-kit/*` packages,
- no `tsx`, direct `esbuild`, or platform `@esbuild/*` packages in the installed dependency tree,
- no high-severity controllable toolchain advisory in the full audit,
- Drizzle ORM still installed for runtime queries and migrations,
- production audit limited to currently accepted framework-level advisories only.

The current remaining audit item is the framework-owned moderate PostCSS advisory nested under Next.js. Do not use `npm audit fix --force`, downgrade Next.js, or move to canary Next.js just to silence that advisory.

## Security Notes

- Database migrations are server-side commands only.
- Migration execution requires an explicit database URL supplied outside source control.
- Migration application uses a Postgres advisory lock to avoid concurrent local migration runs.
- Public documentation avoids publishing exact audit traces, dependency vulnerability paths, or environment-specific database details.

## Next Recommendation

Keep this branch focused on toolchain hardening. A later backend phase can choose a safe migration generation workflow after reviewing current Drizzle tooling, package advisories, and migration-review requirements.
