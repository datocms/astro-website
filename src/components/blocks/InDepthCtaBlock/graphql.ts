import { graphql } from '~/lib/datocms/graphql';

export const InDepthCtaBlockFragment = graphql(/* GraphQL */ `
  fragment InDepthCtaBlockFragment on InDepthCtaBlockRecord {
    id
    _modelApiKey
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
