import type { Organization } from 'schema-dts';

// Stable global @id nodes so entities reconcile across pages.
export function organizationId(base: string | URL) {
  return new URL('/#organization', base).href;
}

export function websiteId(base: string | URL) {
  return new URL('/#website', base).href;
}

export function organizationLogoUrl(base: string | URL) {
  return new URL('/brand/main-lockup.svg', base).href;
}

// Full Organization node — defined once on the homepage @graph.
export function organizationNode(base: string | URL, description?: string): Organization {
  return {
    '@type': 'Organization',
    '@id': organizationId(base),
    name: 'DatoCMS',
    url: new URL('/', base).href,
    logo: organizationLogoUrl(base),
    description,
    sameAs: ['https://twitter.com/datocms', 'https://www.linkedin.com/company/datocms/'],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      email: 'support@datocms.com',
    },
  };
}

// Lightweight reference to the Organization node above, for publisher fields.
export function publisherRef(base: string | URL): Organization {
  return { '@type': 'Organization', '@id': organizationId(base) };
}
