import type { AstroGlobal } from 'astro';
import { baseUrl } from './draftMode';

export type OrganizationSchema = {
  '@context': 'https://schema.org';
  '@type': 'Organization';
  name: string;
  url: string;
  logo: string;
  sameAs?: string[];
  description?: string;
};

export function organizationSchema(astroOrRequest: AstroGlobal | Request): OrganizationSchema {
  const siteUrl = baseUrl(astroOrRequest);

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'DatoCMS',
    url: siteUrl,
    logo: `${siteUrl}/images/datocms-logo.png`,
    description:
      'DatoCMS is the headless CMS for the modern web. More than 25,000 businesses use DatoCMS to create online content at scale from a central hub and distribute it via API.',
    sameAs: [
      'https://twitter.com/datocms',
      'https://github.com/datocms',
      'https://www.linkedin.com/company/datocms',
      'https://www.youtube.com/@datocms',
    ],
  };
}

export type WebSiteSchema = {
  '@context': 'https://schema.org';
  '@type': 'WebSite';
  name: string;
  url: string;
  potentialAction?: {
    '@type': 'SearchAction';
    target: {
      '@type': 'EntryPoint';
      urlTemplate: string;
    };
    'query-input': string;
  };
};

export function webSiteSchema(astroOrRequest: AstroGlobal | Request): WebSiteSchema {
  const siteUrl = baseUrl(astroOrRequest);

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'DatoCMS',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/docs?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export type ArticleSchemaInput = {
  title: string;
  description?: string;
  slug: string;
  datePublished?: string | null;
  dateModified?: string | null;
  authors: Array<{
    name: string;
    avatar?: { url: string } | null;
  }>;
  coverImage?: {
    url: string;
    width?: number;
    height?: number;
  } | null;
};

export type ArticleSchema = {
  '@context': 'https://schema.org';
  '@type': 'BlogPosting';
  headline: string;
  description?: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
  author: Array<{
    '@type': 'Person';
    name: string;
    image?: string;
  }>;
  publisher: {
    '@type': 'Organization';
    name: string;
    logo: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  image?: {
    '@type': 'ImageObject';
    url: string;
    width?: number;
    height?: number;
  };
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
};

export function articleSchema(
  astroOrRequest: AstroGlobal | Request,
  input: ArticleSchemaInput,
): ArticleSchema {
  const siteUrl = baseUrl(astroOrRequest);
  const articleUrl = `${siteUrl}/blog/${input.slug}`;

  const schema: ArticleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: input.title,
    url: articleUrl,
    author: input.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
      ...(author.avatar?.url && { image: author.avatar.url }),
    })),
    publisher: {
      '@type': 'Organization',
      name: 'DatoCMS',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/images/datocms-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };

  if (input.description) {
    schema.description = input.description;
  }

  if (input.datePublished) {
    schema.datePublished = new Date(input.datePublished).toISOString();
  }

  if (input.dateModified) {
    schema.dateModified = new Date(input.dateModified).toISOString();
  } else if (input.datePublished) {
    schema.dateModified = new Date(input.datePublished).toISOString();
  }

  if (input.coverImage?.url) {
    schema.image = {
      '@type': 'ImageObject',
      url: input.coverImage.url,
      ...(input.coverImage.width && { width: input.coverImage.width }),
      ...(input.coverImage.height && { height: input.coverImage.height }),
    };
  }

  return schema;
}

export type BreadcrumbItem = {
  name: string;
  url: string;
};

export type BreadcrumbSchema = {
  '@context': 'https://schema.org';
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }>;
};

export function breadcrumbSchema(
  astroOrRequest: AstroGlobal | Request,
  items: BreadcrumbItem[],
): BreadcrumbSchema {
  const siteUrl = baseUrl(astroOrRequest);

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

export type FAQItem = {
  question: string;
  answer: string;
};

export type FAQPageSchema = {
  '@context': 'https://schema.org';
  '@type': 'FAQPage';
  mainEntity: Array<{
    '@type': 'Question';
    name: string;
    acceptedAnswer: {
      '@type': 'Answer';
      text: string;
    };
  }>;
};

export function faqPageSchema(items: FAQItem[]): FAQPageSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
