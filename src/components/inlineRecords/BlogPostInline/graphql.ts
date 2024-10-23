import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { graphql } from '~/lib/datocms/graphql';

export const BlogPostInlineFragment = graphql(
  /* GraphQL */ `
    fragment BlogPostInlineFragment on BlogPostRecord {
      ... on BlogPostRecord {
        title
        ...BlogPostUrlFragment
      }
    }
  `,
  [BlogPostUrlFragment],
);
