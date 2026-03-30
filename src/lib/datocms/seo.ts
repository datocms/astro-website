import type { TitleMetaLinkTag } from '@datocms/astro';
import type { AstroGlobal } from 'astro';
import { truncate, without } from 'lodash-es';
import { isDefined } from '../isDefined';
import { ogCardUrl, type OgCardData } from '../ogCardUrl';

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

export function overrideSeo(
  tags: TitleMetaLinkTag[],
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
