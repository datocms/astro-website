# astro-website

Astro standalone Node server, deployed via `cubo` to Kubernetes on AWS. Three environments: `production`, `staging1`, `staging2`.

## Environment variables

Three distinct mechanisms — pick the right one by asking: **when is the value needed, and is it secret?**

### 1. Build-time public — `cubo.json5` `build.args` + Dockerfile `ARG`

Use for values that need to be baked into the build (client-side bundles, server modules that read `astro:env/client`). The value is committed in cleartext in `cubo.json5` per environment.

Wiring (all four steps are required):

1. **`astro.config.ts`** — declare with `context: 'client', access: 'public'`:
   ```ts
   MY_VAR: envField.string({ context: 'client', access: 'public' }),
   ```
2. **`Dockerfile`** — `ARG MY_VAR` in the base stage, `ENV MY_VAR=$MY_VAR` in the build stage before `RUN npm run build`.
3. **`cubo.json5`** — add `MY_VAR: 'literal-value'` under `build.args` in each environment where it should be set.
4. **`.env.example`** — add `MY_VAR=` for local dev discoverability.

Examples in repo: `PUBLIC_HOSTNAME`, `RECAPTCHA_KEY`, `KNOWLEDGE_BASE_URL`, `LINKEDIN_PARTNER_ID`.

### 2. Build-time secret — `cubo.json5` `envVarSecrets` + Dockerfile `--mount=type=secret`

Use for secrets needed during `docker build` (e.g. fetching a schema). Cubo passes these via BuildKit secret mounts so they never land in image layers.

Wiring:

1. **`Dockerfile`** — consume with `RUN --mount=type=secret,id=MY_SECRET,env=MY_SECRET ...`.
2. **`cubo.json5`** — list the name in `envVarSecrets` (an array of strings, not values).
3. The actual value comes from the build host's environment / CI secret store.

Example in repo: `DATOCMS_API_TOKEN` (used by the `gql.tada` step).

### 3. Runtime secret — `cubo config:set`, nothing in `cubo.json5`

Use for secrets read at request time by the running app (server actions, API routes, anything imported from `astro:env/server`). Values are stored in AWS Secrets Manager and injected into the pod at startup. They are **not** declared in `cubo.json5` and **not** in the Dockerfile.

Wiring:

1. **`astro.config.ts`** — declare with `context: 'server', access: 'secret'`.
2. **Set the value:**
   ```
   cubo config:set MY_SECRET=value --env production
   ```
   This writes to AWS Secrets Manager and triggers a rolling restart (override with `--strategy recreate`).
3. **`.env.example`** — add `MY_SECRET=` for local dev.

Examples in repo: `DATOCMS_API_TOKEN` (also build-time, see above), `ROLLBAR_TOKEN`, `PIPEDRIVE_TOKEN`, `MAILERLITE_TOKEN`, `RECAPTCHA_SECRET_KEY`, `LINKEDIN_ACCESS_TOKEN`, etc.

## Common pitfalls

- **`cubo config:set` cannot set build-time vars.** Values are injected at pod startup, after `docker build` has already baked client bundles. If a var needs to appear in client JS or `astro:env/client`, it must go through mechanism 1.
- **`envVarSecrets` is not for runtime secrets.** It only declares build-time secret mounts. Listing a var there without a corresponding `--mount=type=secret` in the Dockerfile does nothing.
- **Production-only vars:** declare them `optional: true` in `astro.config.ts` and guard their use in code, so staging/dev don't crash when the value is absent. Only populate them in the `production` block of `cubo.json5` / via `config:set --env production`.
- **`context: 'client'` does not mean "client-only".** It means "can be read from both client and server, baked at build time". `context: 'server'` is the runtime-only one.

## Deployment

- Edit `cubo.json5` for declarative changes (build args, secret declarations, resources, scaling, cron jobs). Commit and deploy via the normal pipeline.
- Use `cubo config:set` for ad-hoc runtime secret rotation; no code change needed.

## Migrations (`migrations/`)

DatoCMS schema/data migrations live in `migrations/`, prefixed with a unix timestamp, and are tracked in the `schema_migration` model (re-running requires clearing that record).

- **Scaffold with `datocms migrations:new <name> --schema=<api_keys>` (or `--schema=all`).** This embeds a **frozen, inline schema snapshot** (the `ItemTypeDefinition` types + `{ ID, REF }` consts) into the migration file. A migration must be self-contained and reproducible forever.
- **Never `import … from '../src/lib/cma-schema'` in a migration.** That file is regenerated (`npm run generate-cma-schema`) whenever the schema changes — so a later migration that drops a field will break the _type-checking_ of every earlier migration that referenced it via the shared file. The inline snapshot from `--schema` is immune to this.
- The scaffold imports must be type-only where needed (`verbatimModuleSyntax` is on): `import { type Client, type ItemTypeDefinition } from 'datocms/lib/cma-client-node'`.
- **Running:** `npx dotenv -e .env.development -- npx datocms migrations:run --in-place --allow-primary` runs un-run migrations against primary. Add `--dry-run` first to validate (it simulates without executing the body, so `console.log` counts won't print). `migrations:run` does **not** run the `cma:script` structural validator, so `error: unknown` etc. are fine there.
- **`--allow-primary` is meant for strictly additive changes** (no rollback on partial failure). Destructive migrations (e.g. `client.fields.destroy`) work but are irreversible — confirm first, and make them idempotent (look the field up by `api_key`, skip if absent) so a re-run is a no-op.
- After a schema-changing migration, regenerate both schemas: `npm run generate-cma-schema` and `npm run generate-schema`, then `npx astro check`.
