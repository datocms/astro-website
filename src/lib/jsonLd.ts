import type { AstroGlobal } from 'astro';
import type { Organization, Thing, WebPage, WebSite } from 'schema-dts';
import { baseUrl } from '~/lib/draftMode';
import { pictureUrl, type Picture } from '~/lib/pictures';

export function organizationId(base: string | URL) {
  return new URL('/#organization', base).href;
}

export function websiteId(base: string | URL) {
  return new URL('/#website', base).href;
}

export function softwareId(base: string | URL) {
  return new URL('/#software', base).href;
}

export function courseId(base: string | URL, slug: string) {
  return new URL(`/academy/${slug}#course`, base).href;
}

export function webPageId(url: string) {
  return `${url}#webpage`;
}

export function breadcrumbId(url: string) {
  return `${url}#breadcrumb`;
}

export function mainEntityId(url: string) {
  return `${url}#main`;
}

export function canonicalUrl(astro: AstroGlobal) {
  return new URL(astro.url.pathname, baseUrl(astro)).href;
}

export function mainEntityRefs(url: string) {
  return { '@id': mainEntityId(url), mainEntityOfPage: webPageRef(url) };
}

export function webPageRef(url: string) {
  return { '@id': webPageId(url) };
}

export function publisherRef(base: string | URL): Organization {
  return { '@type': 'Organization', '@id': organizationId(base) };
}

export function organizationNode(base: string | URL): Organization {
  return {
    '@type': 'Organization',
    '@id': organizationId(base),
    name: 'DatoCMS',
    url: new URL('/', base).href,
    logo: {
      '@type': 'ImageObject',
      url: new URL('/brand/main-lockup.svg', base).href,
    },
    sameAs: [
      'https://twitter.com/datocms',
      'https://www.linkedin.com/company/datocms/',
      'https://github.com/datocms',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@datocms.com',
    },
  };
}

export function websiteNode(base: string | URL): WebSite {
  return {
    '@type': 'WebSite',
    '@id': websiteId(base),
    name: 'DatoCMS',
    url: new URL('/', base).href,
    inLanguage: 'en',
    publisher: { '@id': organizationId(base) },
  };
}

export function webPageNode(
  base: string | URL,
  url: string,
  page: { title?: string | null; description?: string; image?: string },
  pictures: Picture[] = [],
): WebPage {
  return {
    '@type': 'WebPage',
    '@id': webPageId(url),
    url,
    name: page.title ?? undefined,
    description: page.description,
    inLanguage: 'en',
    isPartOf: { '@id': websiteId(base) },
    ...(page.image ? { primaryImageOfPage: { '@type': 'ImageObject', url: page.image } } : {}),
    ...(pictures.length > 0
      ? {
          image: pictures.map((picture) => ({
            '@type': 'ImageObject' as const,
            '@id': `${url}#picture-${picture.section}`,
            contentUrl: pictureUrl(base, picture),
            url: pictureUrl(base, picture),
            name: picture.title,
            description: picture.alt,
            width: { '@type': 'QuantitativeValue' as const, value: picture.width, unitCode: 'E37' },
            height: {
              '@type': 'QuantitativeValue' as const,
              value: picture.height,
              unitCode: 'E37',
            },
            caption: picture.alt,
            creator: { '@id': organizationId(base) },
            creditText: 'DatoCMS',
            representativeOfPage: false,
          })),
        }
      : {}),
  };
}

export function serializeJsonLd(data: Thing | object) {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
