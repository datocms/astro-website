import { readFile, writeFile } from 'node:fs/promises';
import { slugify } from '../../../src/lib/slugify.ts';

export const SITE = 'https://www.datocms.com';

/** One live docs page: its title and the anchors of its headings. */
export type PageEntry = { title: string; anchors: string[] };

/** Every live docs URL built from the CMS, keyed by path (e.g. `/docs/overview/foo`). */
export type Snapshot = { generatedAt: string; pages: Record<string, PageEntry> };

/** A URL that vanished from the CMS and answers 404 in production. */
export type BrokenUrl = PageEntry & { url: string; firstSeenAt: string };

/** What the check carries from one run to the next. */
export type State = { snapshot: Snapshot; unresolved: BrokenUrl[] };

type DastNode = { type: string; level?: number; value?: string; children?: DastNode[] };

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
        const anchors = page.content
          ? [...new Set(headingAnchors(page.content.value.document))]
          : [];
        return [[url, { title: page.title, anchors }] as const];
      }),
  );

  return { generatedAt: new Date().toISOString(), pages: Object.fromEntries(entries) };
};

/** Every valid redirect target: each live URL, and each URL with one of its anchors. */
export const liveTargets = (snapshot: Snapshot): Set<string> =>
  new Set(
    Object.entries(snapshot.pages).flatMap(([url, page]) => [
      url,
      ...page.anchors.map((anchor) => `${url}#${anchor}`),
    ]),
  );

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

/** URLs listed in `ignored-urls.txt`, one per line; `#` starts a comment. */
export const readIgnoredUrls = async (): Promise<Set<string>> => {
  const text = await readFile(new URL('./ignored-urls.txt', import.meta.url), 'utf8');
  return new Set(
    text
      .split('\n')
      .map((line) => line.replace(/#.*/, '').trim())
      .filter(Boolean),
  );
};
