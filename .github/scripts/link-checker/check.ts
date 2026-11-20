/**
 * Deterministic check, no AI. Tracks the site's URLs (tracked sitemap sections
 * plus every docs URL from the CMS), compares them with the previous run, and
 * asks production about each one that vanished. A vanished URL stays tracked
 * until it redirects, comes back, or is listed in `ignored-urls.txt`; those
 * answering 404 are reported, unless a redirect or an open checker PR/issue
 * already covers them.
 *
 * Usage: node check.ts --state <state.json> --broken <broken.json>
 * Env: DATOCMS_API_TOKEN (read-only CDA token), GH_TOKEN in CI,
 *      ALLOW_MASS_REMOVAL=true to accept a large removal once
 */
import { readFile } from 'node:fs/promises';
import {
  REPO_ROOT,
  buildSnapshot,
  fetchSitemap,
  hasRedirectFrom,
  mapLimit,
  openCheckerItems,
  parseArgs,
  probe,
  readIgnoreMatcher,
  readJson,
  requireArg,
  sectionOf,
  setOutput,
  summarize,
  writeJson,
  type BrokenUrl,
  type State,
} from './lib.ts';

/** Per section, more vanished URLs than this at once looks like an outage, not edits. */
const MAX_VANISHED = 20;
const MAX_VANISHED_SHARE = 0.3;
const MIN_VANISHED_FOR_SHARE = 5;

const args = parseArgs(process.argv.slice(2));
const statePath = requireArg(args, 'state');
const brokenPath = requireArg(args, 'broken');
const token = process.env.DATOCMS_API_TOKEN;
if (!token) throw new Error('DATOCMS_API_TOKEN is not set');
const cacheBust = process.env.GITHUB_RUN_ID ?? String(Date.now());
const shouldAllowMassRemoval = process.env.ALLOW_MASS_REMOVAL === 'true';

const previous = await readJson<State>(statePath);
const [snapshot, sitemap, isIgnored] = await Promise.all([
  buildSnapshot(token),
  fetchSitemap(cacheBust, previous?.sitemapCount),
  readIgnoreMatcher(),
]);
const docsUrls = Object.keys(snapshot.pages);
const trackedNow = new Set([...sitemap.tracked, ...docsUrls]);
const tracked = [...trackedNow].sort();
const list = (urls: string[]) => urls.map((url) => `- \`${url}\``).join('\n');

// Docs URLs the sitemap lacks: pages linked from several groups are listed only once there.
const sitemapSet = new Set(sitemap.tracked);
const notInSitemap = docsUrls.filter((url) => !sitemapSet.has(url));

if (!previous) {
  await writeJson(statePath, {
    snapshot,
    tracked,
    sitemapCount: sitemap.count,
    unresolved: [],
  } satisfies State);
  await writeJson(brokenPath, []);
  await setOutput('has_broken', 'false');
  if (process.env.GITHUB_ACTIONS) {
    console.log(
      '::warning::No previous state: saved a baseline. If this is not the first run, the cache was ' +
        'evicted and URLs still waiting for a redirect were forgotten.',
    );
  }
  await summarize(`Link checker: no previous state, saved ${tracked.length} URLs as the baseline.`);
  process.exit(0);
}

const vanished = previous.tracked.filter((url) => !trackedNow.has(url) && !isIgnored(url));

const countBySection = (urls: string[]) =>
  urls.reduce(
    (counts, url) => counts.set(sectionOf(url), (counts.get(sectionOf(url)) ?? 0) + 1),
    new Map<string, number>(),
  );
const previousBySection = countBySection(previous.tracked);
const massRemovals = [...countBySection(vanished)].filter(
  ([section, lost]) =>
    lost > MAX_VANISHED ||
    (lost > MIN_VANISHED_FOR_SHARE && lost > previousBySection.get(section)! * MAX_VANISHED_SHARE),
);
if (massRemovals.length > 0 && !shouldAllowMassRemoval) {
  const detail = massRemovals.map(([section, lost]) => `${section}: ${lost}`).join(', ');
  throw new Error(
    `Too many URLs vanished at once (${detail}). Not updating the state: check the CMS and the ` +
      'sitemap. If the removal is intended, rerun with allow_mass_removal.',
  );
}

const now = new Date().toISOString();
const candidates = new Map<string, BrokenUrl>([
  ...previous.unresolved.map((entry) => [entry.url, entry] as const),
  ...vanished.map(
    (url) => [url, { url, ...previous.snapshot.pages[url], firstSeenAt: now }] as const,
  ),
]);
const toProbe = [...candidates.values()].filter(
  ({ url }) => !trackedNow.has(url) && !isIgnored(url),
);
const results = await mapLimit(toProbe, 5, async (entry) => ({
  entry,
  status: await probe(entry.url, cacheBust),
}));
const byStatus = (wanted: string) =>
  results.filter(({ status }) => status === wanted).map(({ entry }) => entry);
const broken = byStatus('broken');
// Still answering 200 (e.g. the CDA hasn't caught up yet): keep watching until it 404s or redirects.
const served = byStatus('served');
const unknown = byStatus('unknown');

const config = await readFile(`${REPO_ROOT}astro.config.ts`, 'utf8');
const handledItems = broken.length > 0 ? await openCheckerItems() : '';
const isHandled = ({ url }: BrokenUrl) =>
  hasRedirectFrom(config, url) || handledItems.includes(`\`${url}\``);
const toFix = broken.filter((entry) => !isHandled(entry));
// An existing redirect pointing at a URL that now 404s needs a new target too.
const redirectedInto = toFix.filter(({ url }) => config.includes(`'${url}'`));

// Anchors that vanished from docs pages that are still live: worth a look, not a failure.
const lostAnchors = Object.entries(previous.snapshot.pages).flatMap(([url, page]) => {
  const current = snapshot.pages[url];
  return current
    ? page.anchors.filter((anchor) => !current.anchors.includes(anchor)).map((a) => `${url}#${a}`)
    : [];
});

await writeJson(statePath, {
  snapshot,
  tracked,
  sitemapCount: sitemap.count,
  unresolved: [...broken, ...served, ...unknown],
} satisfies State);
await writeJson(brokenPath, toFix);
await setOutput('has_broken', String(toFix.length > 0));

await summarize(
  [
    `Link checker: ${tracked.length} tracked URLs (${sitemap.tracked.length} from the sitemap, ` +
      `${docsUrls.length} docs URLs from the CMS), ${vanished.length} vanished since the last run.`,
    toFix.length && `\n**Broken (404, no redirect yet):**\n${list(toFix.map(({ url }) => url))}`,
    redirectedInto.length &&
      `\n**Existing redirects point at these 404s:**\n${list(redirectedInto.map(({ url }) => url))}`,
    broken.length > toFix.length &&
      `\nAlready covered by a redirect or an open checker PR/issue: ${broken.length - toFix.length}.`,
    served.length &&
      `\n**Vanished but still served, watching:**\n${list(served.map(({ url }) => url))}`,
    unknown.length && `\n**Couldn't check, will retry:**\n${list(unknown.map(({ url }) => url))}`,
    lostAnchors.length && `\n**Anchors that disappeared (warning only):**\n${list(lostAnchors)}`,
    notInSitemap.length &&
      `\n${notInSitemap.length} docs URLs from the CMS aren't in the sitemap (it skips ` +
        '`/docs/dashboard-api` and lists a page in several groups only once), e.g. ' +
        `${notInSitemap
          .slice(0, 3)
          .map((url) => `\`${url}\``)
          .join(', ')}.`,
  ]
    .filter(Boolean)
    .join('\n'),
);
