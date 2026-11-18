import { graphql } from '~/lib/datocms/graphql';

/*
 * The cover of a blog post: the file and the theme. Each pixel of the file
 * is one cell, thus the file must come with no loss. Without parameters, the
 * CDN gives a browser an AVIF with loss. `fm: png` with `auto: compress`
 * gives a PNG with the same pixels.
 */
export const PixelCoverFragment = graphql(/* GraphQL */ `
  fragment PixelCoverFragment on BlogPostRecord {
    theme
    pixelCover {
      url(imgixParams: { fm: png, auto: compress })
      width
      height
    }
  }
`);
