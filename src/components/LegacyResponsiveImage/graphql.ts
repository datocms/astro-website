import { graphql } from '~/lib/datocms/graphql';

export const ResponsiveImageFragment = graphql(/* GraphQL */ `
  fragment ResponsiveImageFragment on ResponsiveImage {
    # always required
    src
    srcSet
    width
    height

    # not required, but strongly suggested!
    alt
    title

    # LQIP (base64-encoded)
    base64

    # you can omit 'sizes' if you explicitly pass the 'sizes' prop to the image component
    sizes
  }
`);
