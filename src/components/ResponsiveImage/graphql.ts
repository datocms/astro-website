import { graphql } from '~/lib/datocms/graphql';

/*
 * The callers set the imgix parameters at query time. The fragment does
 * not ask for `sizes`: without it, the Image of @datocms/astro gives a lazy
 * image `sizes="auto, 100vw"`, and the browser takes the source for the
 * width of the image on the screen. A `sizes` from the query would win
 * over `auto`.
 */
export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    src
    srcSet
    width
    height
    alt
    title
    base64
  }
`);
