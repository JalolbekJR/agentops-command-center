# Database Runtime Readiness

Phase 4B.1.1 verifies that the database foundation can run safely and prepares the path for future hosted deployment. Local verification is a safe developer path, not the final production architecture.

## Purpose

- Verify migrations and seed data against a real Postgres runtime.
- Preserve deterministic demo mode while backend foundations are added.
- Prepare a hosted deployment path without committing secrets.
- Document safe local and hosted database practices.

## Local Verification

Use either a local Postgres instance or the local Docker helper. Provide the database connection only through a session environment variable or deployment-provider secret management.

Typical local verification flow:

```powershell
npm run db:migrate
npm run db:seed
```

Do not commit real connection values, private environment files, or terminal output that includes credentials.

## Hosted Deployment Readiness

The future hosted path should use a managed Postgres provider and deployment-provider environment variables.

Hosted setup should happen only after explicit approval. Credentials must stay in provider dashboards or secret managers, not in source code or public docs.

## Security Rules

- Do not commit real environment files.
- Do not hardcode database URLs.
- Do not expose database connection values to the browser.
- Keep database access server-only.
- Require SSL for hosted database traffic.
- Use least-privilege users where supported.
- Separate migration and runtime privileges where practical.
- Review migrations before applying them to shared or hosted environments.
- Keep API responses minimized.
- Keep production deployment gated until auth/RBAC or approved safe demo mode exists.

## Cost Controls

- Keep seed data small.
- Avoid always-on workers until needed.
- Avoid live AI calls by default.
- Avoid unbounded logs and events.
- Monitor hosted storage, compute, and connection limits.
- Prefer simple polling before realtime features.

## Next Phase

The next backend phases should focus on safe read-only APIs, response minimization, and trusted auth/RBAC before public deployment.

## References

- [Drizzle PostgreSQL](https://orm.drizzle.team/docs/get-started-postgresql)
- [Drizzle migrations](https://orm.drizzle.team/docs/migrations)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/)
- [OWASP API Security Project](https://owasp.org/www-project-api-security/)
