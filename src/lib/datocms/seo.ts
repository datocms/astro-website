import type { AstroGlobal } from 'astro';
import { truncate } from 'lodash-es';
import { isDefined } from '../isDefined';
import { ogCardUrl, type OgCardData } from '../ogCardUrl';

const pageTitleSuffix = 'DatoCMS';

type SeoMetaTag = {
  tag: string;
  attributes: Record<string, string> | null;
  content: string | null;
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
    seoMeta('twitter:card', 'summary_large_image'),
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
