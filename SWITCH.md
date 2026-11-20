# The switch to Cloudflare

The site runs on Cloudflare Workers in two steps:

1. **Now**: the redesign runs on `www-next.datocms.com` (public, in the cache) and `www-draft-next.datocms.com` (drafts). `www.datocms.com` and `www-draft.datocms.com` stay on Fastly and Kubernetes.
2. **At the release**: `www.datocms.com` and `www-draft.datocms.com` go to the Workers. Fastly, cubo and Kubernetes stop.

This file is the procedure of step 2. Delete it after the switch.

## How it works

Two Workers come from the same code and the same `wrangler.jsonc`:

| Worker                | Host now                     | Host after the switch   | Cache | Cron |
| --------------------- | ---------------------------- | ----------------------- | ----- | ---- |
| `astro-website`       | `www-next.datocms.com`       | `www.datocms.com`       | yes   | yes  |
| `astro-website-draft` | `www-draft-next.datocms.com` | `www-draft.datocms.com` | no    | no   |

- They are two Workers because the cache of a Worker does not separate its hostnames. With one Worker, the draft host gives the public page from the cache, with no basic auth.
- `CLOUDFLARE_ENV=draft` at build time selects the draft Worker (`env.draft` in `wrangler.jsonc`).
- Draft mode comes from the host of the request: each host that is not `PUBLIC_HOSTNAME` shows the drafts and asks for basic auth (`src/lib/draftMode.ts`).
- `PUBLIC_HOSTNAME` and the other public values that go in the bundle are in `cloudflare.build.env`. The secrets are secrets of each Worker (`wrangler secret bulk`). Both Workers have the values of `.env.production`.
- DatoCMS purges the pages by cache tag through `/api/cache-tags-invalidate`. The cron purges the data sources every 10 minutes (`src/lib/dataSource.ts`, the KV `DATA_SOURCES`).
- A deploy makes a new version id. The cache provider puts that id in a tag of each page, so after a deploy every page is a MISS one time.

## Workers Builds

Connect each Worker to the repository in the dashboard: Workers & Pages → the Worker → Settings → Build → Connect. Use the repository `datocms/astro-website`.

| Setting                   | `astro-website`                | `astro-website-draft`                     |
| ------------------------- | ------------------------------ | ----------------------------------------- |
| Branch                    | the release branch (see below) | the same branch                           |
| Build command             | `npm run build:cloudflare`     | `npm run build:cloudflare`                |
| Deploy command            | `npx wrangler deploy`          | `npx wrangler deploy`                     |
| Root directory            | `/`                            | `/`                                       |
| Build variables           | `NODE_VERSION=22`              | `NODE_VERSION=22`, `CLOUDFLARE_ENV=draft` |
| Builds for other branches | off                            | off                                       |

- The branch: `ccr-e5063e06-x9ciu5` now, then the redesign branch after the merge, then `main` at the release. Change it in both Workers.
- The build needs no secret.
- Wrangler deploys the config that the build writes (`dist/server/wrangler.json`). A Worker refuses a build whose config has a different `name`. Thus the draft Worker needs `CLOUDFLARE_ENV=draft`.

A deploy by hand does the same:

```sh
npm run build:cloudflare && npx wrangler deploy
CLOUDFLARE_ENV=draft npm run build:cloudflare && npx wrangler deploy
```

## Before the switch

Do these steps a few days before. They do not change the current site.

1. **The Fastly VCL.** Export the active version of the Fastly service and read each snippet. The site already does these:
   - The country of the visitor (`client-geo-country`): the Worker now reads `request.cf.country` (`src/worker.ts`).
   - The host (`x-original-host`): the Worker reads the host of the request.
   - Surrogate keys: they are now `Cache-Tag`.

   Any other snippet (a redirect, a header, a different origin for a path, a rule for a bot) must move to `astro.config.ts`, `src/middleware.ts` or a zone rule. Do this before the switch.

2. **Turnstile.** Add `www-draft.datocms.com` to the widget `[website] production` (`0x4AAAAAAErF5qflV0JALrvh`). It already has `www.datocms.com`.
3. **Other apps.** The CMS, the dashboard, the status site, `sales-tools`, `try.datocms.com` and the assets worker load `https://www.datocms.com/fonts/`. `public/_headers` gives them CORS. Look for other URLs of `www.datocms.com` that the other repos load (`llms-txt`, `knowledge`), and check them on `www-next`.
4. **A full crawl.** Fetch every URL of the sitemap on `www-next` and compare the status codes with `www`. Compare some `.md` pages with `https://www.datocms.com/<path>.md`.

## The switch

Use Worker routes, not custom domains. A custom domain makes a new certificate, and the host can fail until Cloudflare issues it. A route uses the certificate that the zone already has, and you can remove a route in one step.

1. **Proxy the DNS records.** In the zone `datocms.com`, set `www` (CNAME `t.sni.global.fastly.net`) and `www-draft` (CNAME to the ELB `dato-production-website-astro-al-…elb.amazonaws.com`) to _Proxied_. The traffic then goes Cloudflare → Fastly / ELB, as before. Check that `www` and `www-draft` still work. Fastly must accept the requests from Cloudflare: if it gives 4xx or 5xx, set the records back to _DNS only_ and look at the Fastly config before you continue.
2. **Change the config** on the release branch:
   - `cloudflare.build.env`: `PUBLIC_HOSTNAME=www.datocms.com`.
   - `wrangler.jsonc`, in the top level and in `env.draft`: `DEPLOYMENT_DESTINATION: "production"` and `DRAFT_MODE_HOSTNAME: "www-draft.datocms.com"`.
   - `wrangler.jsonc`, the routes:
     ```jsonc
     // astro-website
     "routes": [
       { "pattern": "www-next.datocms.com", "custom_domain": true },
       { "pattern": "www.datocms.com/*", "zone_name": "datocms.com" },
     ],
     // env.draft
     "routes": [
       { "pattern": "www-draft-next.datocms.com", "custom_domain": true },
       { "pattern": "www-draft.datocms.com/*", "zone_name": "datocms.com" },
     ],
     ```
     Keep the `-next` hosts until the end of the switch. They show the drafts now (they are not `PUBLIC_HOSTNAME`), thus they ask for basic auth.
3. **Deploy** both Workers (Workers Builds, or by hand). From this moment, the Workers answer `www` and `www-draft`.
4. **Check**, at once:
   - `curl -sI https://www.datocms.com/pricing` two times: `cf-cache-status: MISS`, then `HIT`. No `x-robots-tag`.
   - `https://www.datocms.com/robots.txt` allows the crawlers, and the sitemap has `https://www.datocms.com/` URLs.
   - `https://www-draft.datocms.com/` gives 401 without auth, and the page with `?token=`.
   - `https://www.datocms.com/landing-pages/cookieConsent.js` starts with `/* c:<your country>,`.
   - A form (newsletter), and an item in Rollbar with the environment `production`.
   - A change of a record in DatoCMS: the page changes in a few seconds (the webhook `cache-tags invalidation - production`, id 28374, now reaches the Worker).
   - The Web Previews (frontend `Production`) and the SEO analysis plugin, which call `www-draft.datocms.com`.

## Rollback

Remove the two `/*` routes: in the dashboard (Worker → Settings → Domains & Routes), or deploy the config of before. `www` and `www-draft` then go again to Fastly and the ELB, through the proxied records. Then set the records to _DNS only_ if you want the traffic of before exactly.

Keep Fastly and the Kubernetes deployment running for at least one week after the switch, so that a rollback stays possible. They do not need the files of this branch: the deployment that runs stays. This branch has no `Dockerfile`, `cubo.json5` or deploy workflows. To deploy Kubernetes again, use a commit of `main` from before the merge.

## After the switch

When the Workers have served the site for a week with no problem:

- **DatoCMS**:
  - Delete the webhook `cache-tags invalidation - www-next on Cloudflare` (id 36364).
  - Delete the webhook `cache-tags invalidation - staging` (id 29397) when the staging site stops.
  - Remove the frontend `Next (Cloudflare)` from the Web Previews plugin.
- **Cloudflare**:
  - Remove the `-next` routes from `wrangler.jsonc`, and the `-next` hosts from the Turnstile widget.
  - Delete the secrets that no code reads: `wrangler secret delete FASTLY_KEY` and `FASTLY_SERVICE_ID`, on both Workers.
  - Optional: make the `/*` routes custom domains, so that the DNS records do not point to Fastly and the ELB any more.
- **Fastly**: deactivate the service of `www.datocms.com`.
- **AWS and cubo**: stop the cubo app (production, staging1, staging2) and the ELB.
- **GitHub**: delete the branches `production`, `staging1` and `staging2`, and the repository secrets of the cubo deploy.
- **This repository**: delete this file.

## Known issues

- During the first crawl, 4 of 1,987 uncached renders failed with the error "The Workers runtime canceled this request because it detected that your Worker's code had hung". The same pages worked at the next request. Then a test of 300 uncached renders, 24 in parallel, had no failure. The cause is not known.
- The Slack invite gives `inviter_email_not_verified`. This is a problem of the Slack account, not of the Worker.
