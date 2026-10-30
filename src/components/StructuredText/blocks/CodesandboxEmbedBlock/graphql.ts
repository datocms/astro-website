import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

export const CodesandboxEmbedBlockFragment = graphql(
  /* GraphQL */ `
    fragment CodesandboxEmbedBlockFragment on CodesandboxEmbedBlockRecord {
      slug
      preview {
        responsiveImage(imgixParams: { h: 500 }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
