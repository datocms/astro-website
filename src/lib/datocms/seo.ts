import type { AstroGlobal } from 'astro';
import { truncate, without } from 'lodash-es';
import { isDefined } from '../isDefined';
import { ogCardUrl, type OgCardData } from '../ogCardUrl';

const pageTitleSuffix = 'DatoCMS';

/**
 * Maps route prefixes to section-specific title suffixes. Subpages under each
 * prefix will use the mapped suffix instead of the default "DatoCMS".
 * Top-level pages (e.g. `/blog` itself) are excluded so that titles like
 * "DatoCMS Blog — DatoCMS Blog" are avoided.
 */
const titleSuffixByPathPrefix: [string, string][] = [
  ['/docs', 'DatoCMS Docs'],
  ['/academy', 'DatoCMS Academy'],
  ['/user-guides', 'DatoCMS User Guides'],
  ['/product-updates', 'DatoCMS Product Updates'],
  ['/blog', 'DatoCMS Blog'],
];

/**
 * Returns the section-specific title suffix for a given URL pathname, or
 * `undefined` if the default suffix should be used. Top-level section pages
 * (e.g. `/blog`, `/docs`) are intentionally excluded to prevent redundant
 * suffixes like "DatoCMS Blog — DatoCMS Blog".
 */
export function titleSuffixForPath(pathname: string): string | undefined {
  const normalised = pathname.replace(/\/+$/, '');
  return titleSuffixByPathPrefix.find(
    ([prefix]) => normalised.startsWith(prefix) && normalised !== prefix,
  )?.[1];
}

/**
 * SEO operation that replaces the default `" — DatoCMS"` title suffix with a
 * custom one. Only modifies the `<title>` tag; other meta tags are unchanged.
 */
export function seoReplaceTitleSuffix(newSuffix: string) {
  return (tags: SeoMetaTag[]) =>
    tags.map((tag) => {
      if (tag.tag === 'title' && tag.content) {
        return {
          ...tag,
          content: tag.content.replace(new RegExp(` — ${pageTitleSuffix}$`), ` — ${newSuffix}`),
        };
      }
      return tag;
    });
}

type SeoMetaTag = {
  tag: string;
  attributes?: Record<string, string> | null;
  content?: string | null;
};

type Operation = (tags: SeoMetaTag[]) => SeoMetaTag[];

export function overrideSeo(
  tags: SeoMetaTag[],
  ...operations: Array<Operation | Operation[] | undefined | null | false>
) {
  return [baseMetas(), ...operations]
    .flat()
    .filter(isDefined)
    .reduce((acc, operation) => operation(acc), tags);
}

function baseMetas() {
  return [
    seoMeta('og:locale', 'en'),
    seoMeta('og:type', 'article'),
    seoMeta('og:site_name', 'DatoCMS'),
    seoMeta('twitter:site', '@datocms'),
  ];
}

export function seoPageTitle(...chunks: string[]) {
  return (tags: SeoMetaTag[]) => [
    ...tags.filter((tag) => tag.tag !== 'title'),
    {
      tag: 'title',
      content: [...chunks, pageTitleSuffix].join(' — '),
      attributes: {},
    },
  ];
}

/**
 * Strips punctuation, lowercases, and collapses whitespace so that strings like
 * "Next.js" and "NextJS" both become "nextjs" for comparison purposes.
 */
function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * SEO operation that prepends text chunks to the existing `<title>` tag.
 *
 * Also does normalization + deduplication to avoid titles like "Next.js: Next.js + DatoCMS Overview"
 *
 * Chunks whose normalized content already appears as a complete word or phrase
 * in the title are automatically dropped to avoid redundancy. The comparison is
 * case-insensitive and ignores punctuation, so a group named "Next.js" won't be
 * prepended to a title that already contains "NextJS". Word-boundary matching
 * (`\b`) ensures partial overlaps like "React" inside "Reactive" are not
 * treated as duplicates.
 */
export function prependToSeoPageTitle(...chunks: string[]) {
  return (tags: SeoMetaTag[]) => {
    const title = tags.find((tag) => tag.tag === 'title')!;
    const normalizedTitle = normalizeForComparison(title.content ?? '');

    const filteredChunks = chunks.filter((chunk) => {
      const normalized = normalizeForComparison(chunk);
      if (!normalized) return false;

      // Check whether the chunk already appears as a full word/phrase in the title
      return !new RegExp(`\\b${normalized}\\b`).test(normalizedTitle);
    });

    if (filteredChunks.length === 0) {
      return tags;
    }

    return [
      ...without(tags, title),
      {
        tag: 'title',
        content: [...filteredChunks, title.content].join(''),
        attributes: {},
      },
    ];
  };
}

function seoMeta(propertyOrName: string, newValue: string) {
  return (tags: SeoMetaTag[]) => [
    ...tags.filter(
      (tag) =>
        tag.attributes?.property !== propertyOrName && tag.attributes?.name !== propertyOrName,
    ),
    {
      tag: 'meta',
      attributes: {
        [propertyOrName.startsWith('og:') ? 'property' : 'name']: propertyOrName,
        content: newValue,
      },
      content: null,
    } as SeoMetaTag,
  ];
}

export function seoShareTitle(newTitle: string) {
  return [seoMeta('og:title', newTitle), seoMeta('twitter:title', newTitle)];
}

export function seoTitle(newTitle: string) {
  return [seoPageTitle(newTitle), ...seoShareTitle(newTitle)];
}

export const ogCardWidth = 1200;
export const ogCardHeight = 700;

export function seoGeneratedCard(astroOrRequest: AstroGlobal | Request, data: OgCardData) {
  const url = ogCardUrl(data, astroOrRequest);

  return [
    seoMeta('og:image', url),
    seoMeta('og:image:width', ogCardWidth.toString()),
    seoMeta('og:image:height', ogCardHeight.toString()),
    seoMeta('twitter:image', url),
    seoMeta('twitter:image:width', ogCardWidth.toString()),
    seoMeta('twitter:image:height', ogCardHeight.toString()),
    seoTwitterCard('summary_large_image'),
  ];
}

export function seoDescription(rawDescription: string) {
  const description = truncate(rawDescription, { length: 200 });

  return [
    seoMeta('description', description),
    seoMeta('twitter:description', description),
    seoMeta('og:description', description),
  ];
}

export function seoTwitterCard(type: 'summary' | 'summary_large_image') {
  return seoMeta('twitter:card', type);
}

export function extractFromSeoTags(tags: SeoMetaTag[]) {
  const findAttr = (key: string) =>
    tags.find((t) => t.attributes?.name === key || t.attributes?.property === key)?.attributes
      ?.content;

  return {
    title: tags.find((t) => t.tag === 'title')?.content,
    description: findAttr('description'),
    image: findAttr('og:image'),
  };
}
