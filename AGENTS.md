# astro-website

Astro standalone Node server, deployed via `cubo` to Kubernetes on AWS. Three environments: `production`, `staging1`, `staging2`.

## The layout

The site has one layout family. Its rules are in `src/REDESIGN.md`: read it before you touch the pages or the components.

- **Pages**: `src/layouts/Layout.astro`. It imports `src/styles/global.css` and the scene kit CSS, has no router (a full load), and has the layer statement `@layer reset, tokens, base, vendor, blocks, sections, pages;`.
- **Docs pages** (`src/pages/docs/`): `src/layouts/docs/BaseLayout` is the layout of the docs. It imports `src/styles/global.css`, has the same layer statement, uses the view transitions router, and its components are in `src/components/docs/` (tokens from `src/styles/tokens.css`).
- Both use `src/layouts/BaseLayout` for the head (SEO, favicon, canonical, RSS, cookie consent, analytics, draft mode). BaseLayout imports no global stylesheet and puts the layer statement as the first child of `<head>`. Its props are `theme` (the `data-theme` of `<body>`) and `clientRouter` (the view transitions router, off by default).
- **Cascade layers**: the Vite plugin `cssLayers` (`astro.config.ts`) wraps each CSS module of `src/` in a layer: `pages` for `src/pages/`, `sections` for the rest, unless line 1 of the file is a marker such as `/* @layer blocks */`. `css-scope.mjs` holds the scope. `npm run lint:css` uses the same scope.

## Client scripts

Each client `<script>` (not `is:inline`) is a custom element that extends `WebComponent` (`src/lib/WebComponent.ts`). Examples: `src/components/docs/TargetToggler/Component.astro`, `src/components/Lightbox/Component.astro`.

- The root element of the markup is the custom element. Define it with `customElements.define('kebab-name', class extends WebComponent { … })`.
- Put the setup in `parsedCallback()`, not in `connectedCallback()`: it runs when the children are parsed.
- Find parts with `this.$(selector)` and lists with `this.$$(selector)`. `this.$` throws `[tag-name]: Could not find <selector>`, so a missing part shows as a clear error. Do not use `querySelector(...)!`, and do not use `if (!el) return` guards for parts that the same file renders.
- Add listeners with `this.on(element, event, [selector], callback)`. It returns a function that removes the listener.
- Do not loop over `document.querySelectorAll('[data-x]')` to start a behaviour. Each instance of the element starts itself.
- A custom element is `display: inline` by default. Set its `display` in the CSS. When the root must be a semantic element (`<form>`, `<nav>`, `<button>`, `<table>`), put the custom element around it.
- Keep a plain script only when no element owns the behaviour, for example analytics or cookie consent.

## Images from DatoCMS

The browser must download a file that has the width of the image on the screen, not more. `@datocms/astro` gives a lazy image `sizes="auto"`: Chrome and Firefox then measure the image. Safari has no `auto` and uses the next value of `sizes`. Thus each `sizes` starts with `auto` and continues with a real width for Safari, never with `100vw` alone.

- Show a raster image of the CMS with `ResponsiveImage` (`src/components/ResponsiveImage`) and `ResponsiveImageFragment`. Use a plain `<img src={asset.url}>` only for an SVG, or for a URL with a fixed imgix width at a fixed size on the screen (an avatar: `url(imgixParams: { w: 80, h: 80 })`).
- Do not ask for `sizes` in a `responsiveImage` query: not the field, not the `sizes:` argument. A `sizes` from the query wins over `auto`.
- Set `imgixParams.w` to the largest CSS width at which the layout shows the image. Do not double it for retina screens: the srcset goes from 0.25 to 4 times `w`.
- Without a `sizes` prop, `ResponsiveImage` gives `auto, (max-width: Wpx) 100vw, Wpx`, with W the width of the query. This is correct when `w` is the largest width on the screen.
- When the image is much smaller than `w`, or its width changes with the breakpoints (a card in a grid, a row, a carousel), give `sizes="auto, <widths>"`. Measure the widths in the browser at 390, 800, 1200 and 1440px, and use the breakpoints of the layout (768, 1152). Examples: `PluginCard` (`auto, 96px` for a row), `carouselCardImageSizes` in `src/components/CarouselCard/index.ts` (each image in the `image` slot of a `CarouselCard`), the `sizes` prop of `src/pages/partners/_Card.astro`.
- Leave out `auto` only when the box of the image is not the width that the file needs:
  - The image has `width: auto` (`ImageCarousel`): the browser cannot measure it before it loads. Calculate the width from the height and the ratio.
  - The image covers a box of a different shape (`object-fit: cover`): the file must be wider than the box. Give the width of the cover crop (`TextWithImage`, `CaseStudyGrid`).
  - The size is fixed: give it in px (`sizes="48px"` for an avatar).
- To check, open the page in a new `agent-browser` session. Chrome uses a larger file from its cache, thus an old session can show wrong results. For each image, compare the width on the screen with the file of `currentSrc` (`w` times `dpr`). The `srcset` and the `sizes` are on the `<source>` of the `<picture>`, not on the `<img>`.
- In the copy and the code samples, do not ask for `sizes` in a query. When the copy speaks of `sizes`, it says that they are automatic. Text about `srcSet` is correct.

## Dev servers, checks and worktrees

Many agents can work on this repo at the same time. Each agent must use its own port and its own processes.

### Dev servers

- Always start `astro dev` with `--ignore-lock` and `--port`. Start it with the Bash tool's `run_in_background`:
  ```
  npx dotenv -e .env.development -- npx astro dev --ignore-lock --port 4701
  ```
- Do not start `astro dev` without `--ignore-lock`. Astro finds the agent and starts a background server. If a server already runs on the same tree, Astro prints `Dev server already running at <url>`, ignores your `--port`, and exits with 0. Your server does not start.
- Use a port that is not the default port 4321. Before you start, make sure that the port is free. This command must print nothing:
  ```
  lsof -nP -iTCP:4701 -sTCP:LISTEN
  ```
- Vite does not stop when the port is busy. It takes the next free port and logs `Port 4701 is in use, trying another one...`. Then your requests go to the server of a different agent. Read the `Local` URL in your log.
- Wait for the server with `/_astro/status`. It answers when the server is ready:
  ```
  curl -sf --retry 60 --retry-connrefused --retry-delay 1 -o /dev/null http://localhost:4701/_astro/status
  ```
- Stop only your server. Stop it by its port:
  ```
  kill $(lsof -nP -iTCP:4701 -sTCP:LISTEN -t)
  ```
- Do not use `astro dev stop`, `pkill` or `killall`. `astro dev stop` stops the background server of the tree, and that server can belong to the user or to a different agent.
- Two servers on the same tree see the same files. An edit from one agent changes the pages of all the servers on that tree.

### Checks and builds

- You can run `astro check` and `astro build` while a dev server runs on the same tree. The dev server continues to answer.
- `astro check` takes approximately 45 s. `astro build` takes approximately 5 s.
- Run them in a worktree, not in the main tree, when a different agent works in the main tree. `astro build` writes `dist/`, and `astro check` and `astro build` write `.astro/`.

### Worktrees

- Use a worktree when you change files that a different agent also changes, or when you want your own `dist/`.
- Put the worktree outside the main tree. Make it with the script. The script runs `npm ci` (approximately 15 s):
  ```
  scripts/agent-worktree.sh /path/to/worktree
  ```
- Use `--clone` when you have no network. The script then makes an APFS clone of `node_modules` (approximately 22 s).
- Do not make `node_modules` a symlink. Vite resolves the symlink to a path outside the worktree. Then every page gives a 500 error (`No cached compile metadata found`), or the React islands do not load (`outside of Vite serving allow list`).
- Do not put the worktree below a directory that has a `node_modules`, with no `node_modules` in the worktree. The same 403 error occurs.
- Do not copy `.env.development` into the worktree. Read the file of the main tree with an absolute path:
  ```
  cd /path/to/worktree && npx dotenv -e /path/to/main/.env.development -- npx astro dev --ignore-lock --port 4702
  cd /path/to/worktree && npx dotenv -e /path/to/main/.env.development -- npx astro check
  cd /path/to/worktree && npx dotenv -e /path/to/main/.env.development -- npx astro build
  ```
- When you copy the tree with `rsync` or `cp`, do not copy `.astro/`. It contains `dev.json`, the lock of a server that runs in the main tree.
- When you finish, stop your servers and remove the worktree:
  ```
  git worktree remove --force /path/to/worktree
  ```

### Browsers

- Give each `agent-browser` call your own session: `agent-browser --session <your-name> ...`. Without `--session`, all agents share the `default` session.
- Close only your session: `agent-browser --session <your-name> close`. Do not use `close --all`.

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
