import { graphql } from '~/lib/datocms/graphql';

export const InDepthCtaBlockFragment = graphql(/* GraphQL */ `
  fragment InDepthCtaBlockFragment on InDepthCtaBlockRecord {
    cta {
      title
      description {
        value
      }
      ctaLabel
      ctaUrl
    }
  }
`);
