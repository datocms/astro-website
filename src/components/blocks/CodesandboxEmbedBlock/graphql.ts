import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { graphql } from '~/lib/datocms/graphql';

export const CodesandboxEmbedBlockFragment = graphql(
  /* GraphQL */ `
    fragment CodesandboxEmbedBlockFragment on CodesandboxEmbedBlockRecord {
      slug
      preview {
        responsiveImage(imgixParams: { auto: format, h: 500 }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
