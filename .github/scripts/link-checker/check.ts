/**
 * Deterministic check, no AI. Compares the live docs URLs in the CMS with the
 * previous run's list, and reports every URL that disappeared and now answers
 * 404 in production. URLs stay reported on later runs until they redirect,
 * come back, or are listed in `ignored-urls.txt`.
 *
 * Usage: node check.ts --state <state.json> --broken <broken.json>
 * Env: DATOCMS_API_TOKEN (read-only CDA token)
 */
import {
  SITE,
  buildSnapshot,
  parseArgs,
  readIgnoredUrls,
  readJson,
  requireArg,
  setOutput,
  summarize,
  writeJson,
  type BrokenUrl,
  type State,
} from './lib.ts';

/** Refuses to compare when this share of pages vanished at once: more likely an outage than edits. */
const MAX_VANISHED_SHARE = 0.2;

type Status = 'broken' | 'fine' | 'unknown';

/** Asks production what an old URL does now, without following redirects. */
const probe = async (url: string): Promise<Status> => {
  const { status } = await fetch(`${SITE}${url}`, { redirect: 'manual' });
  if (status === 404 || status === 410) return 'broken';
  // 3xx means a redirect covers it; 200 means another route still serves it.
  if (status < 400) return 'fine';
  return 'unknown';
};

const args = parseArgs(process.argv.slice(2));
const statePath = requireArg(args, 'state');
const brokenPath = requireArg(args, 'broken');
const token = process.env.DATOCMS_API_TOKEN;
if (!token) throw new Error('DATOCMS_API_TOKEN is not set');

const previous = await readJson<State>(statePath);
const snapshot = await buildSnapshot(token);
const liveCount = Object.keys(snapshot.pages).length;

if (!previous) {
  await writeJson(statePath, { snapshot, unresolved: [] } satisfies State);
  await writeJson(brokenPath, []);
  await setOutput('has_broken', 'false');
  await summarize(`Link checker: first run, saved ${liveCount} live URLs as the baseline.`);
  process.exit(0);
}

const vanishedUrls = Object.keys(previous.snapshot.pages).filter((url) => !snapshot.pages[url]);
if (vanishedUrls.length > Object.keys(previous.snapshot.pages).length * MAX_VANISHED_SHARE) {
  throw new Error(
    `${vanishedUrls.length} of ${Object.keys(previous.snapshot.pages).length} docs URLs vanished at once. ` +
      'Not updating the state: check the CMS and the CDA token, then rerun.',
  );
}

const now = new Date().toISOString();
const ignored = await readIgnoredUrls();
const candidates = new Map<string, BrokenUrl>([
  ...previous.unresolved.map((entry) => [entry.url, entry] as const),
  ...vanishedUrls.map(
    (url) => [url, { url, ...previous.snapshot.pages[url]!, firstSeenAt: now }] as const,
  ),
]);

const results = await Promise.all(
  [...candidates.values()]
    .filter(({ url }) => !snapshot.pages[url] && !ignored.has(url))
    .map(async (entry) => ({ entry, status: await probe(entry.url) })),
);
const broken = results.filter(({ status }) => status === 'broken').map(({ entry }) => entry);
const unknown = results.filter(({ status }) => status === 'unknown').map(({ entry }) => entry);

// Anchors that vanished from pages that are still live: worth a look, not a failure.
const lostAnchors = Object.entries(previous.snapshot.pages).flatMap(([url, page]) => {
  const current = snapshot.pages[url];
  return current
    ? page.anchors.filter((anchor) => !current.anchors.includes(anchor)).map((a) => `${url}#${a}`)
    : [];
});

await writeJson(statePath, { snapshot, unresolved: [...broken, ...unknown] } satisfies State);
await writeJson(brokenPath, broken);
await setOutput('has_broken', String(broken.length > 0));

const list = (urls: string[]) => urls.map((url) => `- \`${url}\``).join('\n');
await summarize(
  [
    `Link checker: ${liveCount} live URLs, ${vanishedUrls.length} vanished since the last run.`,
    broken.length && `\n**Broken (404, no redirect):**\n${list(broken.map(({ url }) => url))}`,
    unknown.length && `\n**Couldn't check, will retry:**\n${list(unknown.map(({ url }) => url))}`,
    lostAnchors.length && `\n**Anchors that disappeared (warning only):**\n${list(lostAnchors)}`,
  ]
    .filter(Boolean)
    .join('\n'),
);
