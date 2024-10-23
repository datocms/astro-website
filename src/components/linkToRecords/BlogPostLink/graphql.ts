import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { graphql } from '~/lib/datocms/graphql';

export const BlogPostLinkFragment = graphql(
  /* GraphQL */ `
    fragment BlogPostLinkFragment on BlogPostRecord {
      ... on BlogPostRecord {
        title
        ...BlogPostUrlFragment
      }
    }
  `,
  [BlogPostUrlFragment],
);
