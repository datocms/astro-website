import { graphql } from '~/lib/datocms/graphql';

/* The callers set the imgix parameters at query time. */
export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    src
    srcSet
    width
    height
    alt
    title
    base64
    sizes
  }
`);
