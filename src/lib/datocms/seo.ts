import type { TitleMetaLinkTag } from '@datocms/astro';
import type { AstroGlobal } from 'astro';
import { truncate, without } from 'lodash-es';
import { isDefined } from '../isDefined';
import { ogCardUrl, ogCoverUrl, type OgCardData, type OgCoverData } from '../ogCardUrl';

const pageTitleSuffix = 'DatoCMS';

/**
 * SEO operation that replaces the default `" — DatoCMS"` title suffix with a
 * custom one. Only modifies the `<title>` tag; other meta tags are unchanged.
 */
export function replaceSeoPageTitleSuffix(newSuffix: string) {
  return (tags: TitleMetaLinkTag[]) =>
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

type Operation = (tags: TitleMetaLinkTag[]) => TitleMetaLinkTag[];

/**
 * Pipes tags through a chain of operations. Unlike {@link overrideSeo}, does
 * NOT prepend base metas — use when the caller already has a full tag set
 * and only wants to layer on non-defaulting transforms.
 */
export function pipeSeo(
  tags: TitleMetaLinkTag[],
  ...operations: Array<Operation | Operation[] | undefined | null | false>
) {
  return operations
    .flat()
    .filter(isDefined)
    .reduce((acc, operation) => operation(acc), tags);
}

export function overrideSeo(
  tags: TitleMetaLinkTag[],
  ...operations: Array<Operation | Operation[] | undefined | null | false>
) {
  return pipeSeo(tags, baseMetas(), ...operations);
}

function baseMetas() {
  return [
    seoMeta('og:locale', 'en'),
    // ronak: default only; a page opting into og:type=article must survive re-application in BaseLayout
    seoMeta('og:type', 'website'),
    seoMeta('og:site_name', 'DatoCMS'),
    seoMeta('twitter:site', '@datocms'),
  ];
}

export function seoPageTitle(...chunks: string[]) {
  return (tags: TitleMetaLinkTag[]) => [
    ...tags.filter((tag) => tag.tag !== 'title'),
    {
      tag: 'title',
      content: [...chunks, pageTitleSuffix].join(' — '),
      attributes: {},
    },
  ];
}

/**
 * Prepends chunks to the existing `<title>`, dropping any chunk that already
 * appears in the title (case-insensitive, punctuation-insensitive, word-bounded).
 *
 * - original title: "Setup — DatoCMS"
 *   prepend:        "Guide: "
 *   result:         "Guide: Setup — DatoCMS"
 *
 * - original title: "NextJS Overview — DatoCMS"
 *   prepend:        "Next.js: "
 *   result:         "NextJS Overview — DatoCMS"   (chunk dropped: "Next.js" ≈ "NextJS")
 *
 * - original title: "Reactive Patterns — DatoCMS"
 *   prepend:        "React: "
 *   result:         "React: Reactive Patterns — DatoCMS"   (chunk kept: word boundary)
 */
export function prependToSeoPageTitleIfMissing(...chunks: string[]) {
  const normalizeForComparison = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ');

  return (tags: TitleMetaLinkTag[]) => {
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
  return (tags: TitleMetaLinkTag[]) => [
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
    } as TitleMetaLinkTag,
  ];
}

export function seoShareTitle(newTitle: string) {
  return [seoMeta('og:title', newTitle), seoMeta('twitter:title', newTitle)];
}

export function seoTitle(newTitle: string) {
  return [seoPageTitle(newTitle), ...seoShareTitle(newTitle)];
}

/**
 * The size of the generated card: 1.91:1, the ratio of the feeds of
 * LinkedIn, Facebook and Slack. X crops it to 2:1: the card keeps its text
 * inside that crop.
 */
export const ogCardWidth = 1200;
export const ogCardHeight = 630;

/**
 * The size of the OG image of an article: the cover grid of 100 × 58 cells,
 * with cells of 12 px. A whole number of pixels for each cell keeps the
 * edges of the cells sharp.
 */
export const ogCoverWidth = 1200;
export const ogCoverHeight = 696;

function seoImage(url: string, width: number, height: number) {
  return [
    seoMeta('og:image', url),
    seoMeta('og:image:width', width.toString()),
    seoMeta('og:image:height', height.toString()),
    seoMeta('twitter:image', url),
    seoMeta('twitter:image:width', width.toString()),
    seoMeta('twitter:image:height', height.toString()),
    seoTwitterCard('summary_large_image'),
  ];
}

export function seoGeneratedCard(astroOrRequest: AstroGlobal | Request, data: OgCardData) {
  return seoImage(ogCardUrl(data, astroOrRequest), ogCardWidth, ogCardHeight);
}

/** The OG image of an article is its cover. It replaces the image of the CMS. */
export function seoCoverCard(astroOrRequest: AstroGlobal | Request, data: OgCoverData) {
  return seoImage(ogCoverUrl(data, astroOrRequest), ogCoverWidth, ogCoverHeight);
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

export function seoOgType(type: 'website' | 'article') {
  return seoMeta('og:type', type);
}

export function seoCanonical(href: string) {
  return (tags: TitleMetaLinkTag[]) => [
    ...tags.filter((tag) => !(tag.tag === 'link' && tag.attributes?.rel === 'canonical')),
    {
      tag: 'link',
      attributes: { rel: 'canonical', href },
      content: null,
    } as TitleMetaLinkTag,
  ];
}

/**
 * Like {@link seoCanonical}, but only adds a self-referencing canonical when no
 * canonical is already present (e.g. syndicated posts bring their own).
 */
export function seoCanonicalIfMissing(href: string) {
  return (tags: TitleMetaLinkTag[]) => {
    if (tags.some((tag) => tag.tag === 'link' && tag.attributes?.rel === 'canonical')) {
      return tags;
    }
    return [
      ...tags,
      {
        tag: 'link',
        attributes: { rel: 'canonical', href },
        content: null,
      } as TitleMetaLinkTag,
    ];
  };
}

export function extractFromSeoTags(tags: TitleMetaLinkTag[]) {
  const findAttr = (key: string) =>
    tags.find((t) => t.attributes?.name === key || t.attributes?.property === key)?.attributes
      ?.content;

  return {
    title: tags.find((t) => t.tag === 'title')?.content,
    description: findAttr('description'),
    image: findAttr('og:image'),
  };
}
