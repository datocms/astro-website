import { graphql } from '~/lib/datocms/graphql';

export const VideoFragment = graphql(/* GraphQL */ `
  fragment VideoFragment on VideoRecord {
    video {
      url
      title
      provider
      width
      height
      providerUid
    }
  }
`);
