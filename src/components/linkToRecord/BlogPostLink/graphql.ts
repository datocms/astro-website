import { graphql } from '~/lib/datocms/graphql';

export const BlogPostLinkFragment = graphql(/* GraphQL */ `
  fragment BlogPostLinkFragment on BlogPostRecord {
    ... on BlogPostRecord {
      title
      slug
    }
  }
`);
