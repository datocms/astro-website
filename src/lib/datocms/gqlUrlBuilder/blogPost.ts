import { graphql, readFragment, type FragmentOf } from '../graphql';

export const BlogPostUrlFragment = graphql(/* GraphQL */ `
  fragment BlogPostUrlFragment on BlogPostRecord {
    slug
  }
`);

export function buildUrlForBlogPost(blogPost: FragmentOf<typeof BlogPostUrlFragment>) {
  const data = readFragment(BlogPostUrlFragment, blogPost);
  return `/blog/${data.slug}`;
}
