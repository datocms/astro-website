import { execFile } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { slugify } from '../../../src/lib/slugify.ts';

export const SITE = 'https://www.datocms.com';
export const REPO_ROOT = fileURLToPath(new URL('../../../', import.meta.url));
export const TITLE_PREFIX = '[Link checker]';

/** Sitemap sections the checker tracks, besides top-level pages like `/pricing`. */
const TRACKED_PREFIXES = ['/docs/', '/blog/', '/user-guides/', '/academy/', '/features/'];

/** Paths safe to write into `astro.config.ts`: no quotes, and no `[`, which Astro reads as a route parameter. */
export const SAFE_PATH = /^\/[a-z0-9._/-]*$/;
export const SAFE_TARGET = /^\/[a-z0-9._/-]*(#[a-z0-9-]+)?$/;

/**
 * A stretch of a page between two headings (`anchor: null`, `level: 0` for the
 * text before the first heading), with the hashes of its 4-word sequences.
 */
export type Section = { anchor: string | null; level: number; hashes: number[] };

/** One live docs page: its title, heading anchors, and text fingerprints by section. */
export type PageEntry = { title: string; anchors: string[]; sections: Section[] };

/** Every live docs URL built from the CMS, keyed by path (e.g. `/docs/overview/foo`). */
export type Snapshot = { generatedAt: string; pages: Record<string, PageEntry> };

/** A URL that vanished and hasn't been resolved yet. Docs URLs keep their last page data. */
export type BrokenUrl = Partial<PageEntry> & { url: string; firstSeenAt: string };

/**
 * What the check carries from one run to the next: the docs pages from the CMS,
 * every tracked URL (sitemap sections plus CMS docs), the sitemap's size, and
 * URLs that vanished but don't redirect yet.
 */
export type State = {
  snapshot: Snapshot;
  tracked: string[];
  sitemapCount: number;
  unresolved: BrokenUrl[];
};

type DastNode = {
  type: string;
  level?: number;
  value?: string;
  code?: string;
  children?: DastNode[];
};

type GroupPageLink = { page: { id: string; slug: string } | null };
type DocGroup = {
  slug: string;
  pages: Array<
    | ({ __typename: 'DocGroupPageRecord' } & GroupPageLink)
    | { __typename: 'DocGroupSectionRecord'; pages: GroupPageLink[] }
  >;
};
type DocPage = { id: string; title: string; content: { value: { document: DastNode } } | null };

const GROUPS_QUERY = `
  query Groups($skip: IntType) {
    items: allDocGroups(first: 100, skip: $skip) {
      slug
      pages {
        __typename
        ... on DocGroupPageRecord { page { id slug } }
        ... on DocGroupSectionRecord { pages { page { id slug } } }
      }
    }
  }
`;

const PAGES_QUERY = `
  query Pages($skip: IntType) {
    items: allDocPages(first: 100, skip: $skip) {
      id
      title
      content { value }
    }
  }
`;

const run = promisify(execFile);

/** Runs a command in the repo root and returns its stdout. */
export const sh = async (command: string, args: string[]): Promise<string> =>
  (await run(command, args, { cwd: REPO_ROOT, maxBuffer: 10 * 1024 * 1024 })).stdout;

/**
 * Fetches every published record of a paginated CDA collection query.
 * The query must alias its collection as `items` and accept `$skip`.
 */
const fetchAll = async <T>(query: string, token: string): Promise<T[]> => {
  const all: T[] = [];
  for (let skip = 0; ; skip += 100) {
    const response = await fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, variables: { skip } }),
    });
    const body = (await response.json()) as { data?: { items: T[] }; errors?: unknown };
    if (!response.ok || body.errors || !body.data) {
      throw new Error(`CDA query failed (${response.status}): ${JSON.stringify(body.errors)}`);
    }
    all.push(...body.data.items);
    if (body.data.items.length < 100) return all;
  }
};

/** Concatenates the text of a DAST node, as `datocms-structured-text-to-plain-text` does for spans. */
const plainText = (node: DastNode): string =>
  node.value ?? (node.children ?? []).map(plainText).join('');

const INLINE_PARENTS = new Set(['paragraph', 'heading', 'link', 'itemLink']);

/** Text of a block for fingerprinting: like `plainText`, plus code, with spaces between blocks. */
const blockText = (node: DastNode): string =>
  node.value ??
  node.code ??
  (node.children ?? []).map(blockText).join(INLINE_PARENTS.has(node.type) ? '' : ' ');

/** 32-bit FNV-1a hash. */
const fnv1a = (text: string): number => {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index++) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 0x01000193);
  }
  return hash >>> 0;
};

/** Hashes of every run of 4 consecutive words; dotted names like `www.datocms-assets.com` stay whole. */
const shingleHashes = (text: string): number[] => {
  const words = text.toLowerCase().match(/[a-z0-9]+(?:\.[a-z0-9]+)*/g) ?? [];
  const hashes = new Set<number>();
  for (let index = 0; index + 4 <= words.length; index++) {
    hashes.add(fnv1a(words.slice(index, index + 4).join(' ')));
  }
  return [...hashes];
};

/** Splits a page at its headings (h6 stays in its parent, as it gets no anchor) and fingerprints each part. */
export const buildSections = (document: DastNode): Section[] => {
  const parts: Array<{ anchor: string | null; level: number; texts: string[] }> = [
    { anchor: null, level: 0, texts: [] },
  ];
  for (const node of document.children ?? []) {
    if (node.type === 'heading' && node.level !== 6) {
      parts.push({ anchor: slugify(plainText(node)), level: node.level!, texts: [] });
    } else {
      parts.at(-1)!.texts.push(blockText(node));
    }
  }
  return parts.map(({ anchor, level, texts }) => ({
    anchor,
    level,
    hashes: shingleHashes(texts.join(' ')),
  }));
};

/**
 * Anchors of a page's headings, built the way the site builds them
 * (`buildGroupsFromHeadings`: every heading except h6, slugified).
 */
const headingAnchors = (node: DastNode): string[] => [
  ...(node.type === 'heading' && node.level !== 6 ? [slugify(plainText(node))] : []),
  ...(node.children ?? []).flatMap(headingAnchors),
];

/**
 * Builds the list of live docs URLs from the CMS, mirroring `findGroupAndPage`:
 * `/docs/<group>/<page>`, and `/docs/<group>` for a page whose slug is `index`.
 * Unlike the sitemap, it lists a page under every group that links it.
 */
export const buildSnapshot = async (token: string): Promise<Snapshot> => {
  const [groups, pages] = await Promise.all([
    fetchAll<DocGroup>(GROUPS_QUERY, token),
    fetchAll<DocPage>(PAGES_QUERY, token),
  ]);
  const pagesById = new Map(pages.map((page) => [page.id, page]));

  const entries = groups.flatMap((group) =>
    group.pages
      .flatMap((item) => (item.__typename === 'DocGroupPageRecord' ? [item] : item.pages))
      // A link to an unpublished page comes back as null.
      .flatMap(({ page }) => (page ? [page] : []))
      .flatMap(({ id, slug }) => {
        const page = pagesById.get(id);
        if (!page) return [];
        const url = slug === 'index' ? `/docs/${group.slug}` : `/docs/${group.slug}/${slug}`;
        const document = page.content?.value.document;
        const anchors = document ? [...new Set(headingAnchors(document))] : [];
        const sections = document ? buildSections(document) : [];
        return [[url, { title: page.title, anchors, sections }] as const];
      }),
  );

  return { generatedAt: new Date().toISOString(), pages: Object.fromEntries(entries) };
};

/** The section a URL belongs to: `/docs`, `/blog`, … or `/` for top-level pages. */
export const sectionOf = (url: string): string => {
  const [, first, second] = url.split('/');
  return second === undefined ? '/' : `/${first}`;
};

/** Whether the checker watches a sitemap URL: tracked sections and top-level pages, minus pagination. */
const isTrackedPath = (url: string): boolean =>
  !/\/p\/\d+$/.test(url) &&
  (sectionOf(url) === '/' || TRACKED_PREFIXES.some((prefix) => url.startsWith(prefix)));

/**
 * Fetches the production sitemap, bypassing the CDN cache, and returns every
 * path in it plus the tracked ones. Throws instead of returning a suspicious
 * list: a failed or truncated sitemap would look like mass removals.
 */
export const fetchSitemap = async (
  cacheBust: string,
  previousCount: number | undefined,
): Promise<{ count: number; tracked: string[] }> => {
  const response = await fetch(`${SITE}/sitemap.xml?lc=${cacheBust}`);
  const contentType = response.headers.get('content-type') ?? '';
  if (response.status !== 200 || !contentType.includes('xml')) {
    throw new Error(`Sitemap request failed: ${response.status} ${contentType}`);
  }
  const locs = [...(await response.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(([, loc]) => loc!);
  const paths = new Set(
    locs.map((loc) => {
      const url = new URL(loc);
      if (url.origin !== SITE) throw new Error(`Unexpected sitemap URL: ${loc}`);
      return url.pathname === '/' ? '/' : url.pathname.replace(/\/+$/, '');
    }),
  );
  if (previousCount && paths.size < previousCount * 0.8) {
    throw new Error(`The sitemap shrank from ${previousCount} to ${paths.size} URLs at once`);
  }
  return { count: paths.size, tracked: [...paths].filter(isTrackedPath) };
};

export type ProbeStatus = 'broken' | 'redirected' | 'served' | 'unknown';

/** Asks production what an old URL does now, bypassing the CDN cache and without following redirects. */
export const probe = async (url: string, cacheBust: string): Promise<ProbeStatus> => {
  try {
    const { status } = await fetch(`${SITE}${url}?lc=${cacheBust}`, { redirect: 'manual' });
    if (status === 404 || status === 410) return 'broken';
    if (status >= 300 && status < 400) return 'redirected';
    if (status < 300) return 'served';
    return 'unknown';
  } catch {
    return 'unknown';
  }
};

/** Maps over items with at most `limit` calls in flight. */
export const mapLimit = async <T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> => {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
};

/** Every valid redirect target: each tracked URL, and each docs URL with one of its anchors. */
export const liveTargets = (state: Pick<State, 'snapshot' | 'tracked'>): Set<string> =>
  new Set([
    ...state.tracked,
    ...Object.entries(state.snapshot.pages).flatMap(([url, page]) =>
      page.anchors.map((anchor) => `${url}#${anchor}`),
    ),
  ]);

/** Whether `astro.config.ts` already redirects this URL (as a key, not as a destination). */
export const hasRedirectFrom = (config: string, url: string): boolean =>
  config.includes(`'${url}':`);

/** Bodies of open PRs and issues opened by the checker, which list the URLs they handle. */
export const openCheckerItems = async (): Promise<string> => {
  const search = `"${TITLE_PREFIX}" in:title`;
  // GitHub search ignores the brackets, so it also finds any title containing "link checker".
  const jq = `.[] | select(.title | startswith(${JSON.stringify(TITLE_PREFIX)})) | .body`;
  const fields = ['--state', 'open', '--search', search, '--json', 'title,body', '--jq', jq];
  return [
    await sh('gh', ['pr', 'list', ...fields]),
    await sh('gh', ['issue', 'list', ...fields]),
  ].join('\n');
};

/** Reads a JSON file, or returns `undefined` when it doesn't exist. */
export const readJson = async <T>(path: string): Promise<T | undefined> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return undefined;
    throw error;
  }
};

export const writeJson = (path: string, value: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(value, null, 2)}\n`);

/** Reads `--name value` pairs and bare `--flag`s from argv. */
export const parseArgs = (argv: string[]): Map<string, string | true> => {
  const args = new Map<string, string | true>();
  argv.forEach((arg, index) => {
    if (!arg.startsWith('--')) return;
    const next = argv[index + 1];
    args.set(arg.slice(2), next && !next.startsWith('--') ? next : true);
  });
  return args;
};

/** Returns a required `--name value` argument. */
export const requireArg = (args: Map<string, string | true>, name: string): string => {
  const value = args.get(name);
  if (typeof value !== 'string') throw new Error(`Missing --${name} <value>`);
  return value;
};

/** Appends Markdown to the GitHub Actions job summary, or prints it locally. */
export const summarize = async (markdown: string): Promise<void> => {
  const file = process.env.GITHUB_STEP_SUMMARY;
  if (file) await writeFile(file, `${markdown}\n`, { flag: 'a' });
  else console.log(markdown);
};

/** Sets a step output in GitHub Actions; no-op locally. */
export const setOutput = async (name: string, value: string): Promise<void> => {
  const file = process.env.GITHUB_OUTPUT;
  if (file) await writeFile(file, `${name}=${value}\n`, { flag: 'a' });
};

/**
 * Matcher for `ignored-urls.txt`: one path per line, `*` matches any run of
 * characters (e.g. `/blog/*`), `#` starts a comment.
 */
export const readIgnoreMatcher = async (): Promise<(url: string) => boolean> => {
  const text = await readFile(new URL('./ignored-urls.txt', import.meta.url), 'utf8');
  const patterns = text
    .split('\n')
    .map((line) => line.replace(/#.*/, '').trim())
    .filter(Boolean)
    .map(
      (line) => new RegExp(`^${line.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`),
    );
  return (url) => patterns.some((pattern) => pattern.test(url));
};
