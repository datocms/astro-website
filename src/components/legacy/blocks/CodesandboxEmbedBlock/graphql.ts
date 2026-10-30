import { ResponsiveImageFragment } from '~/components/legacy/LegacyResponsiveImage/graphql';
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
