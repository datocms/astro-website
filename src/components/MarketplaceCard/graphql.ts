import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '../ResponsiveImage/graphql';

export const MarketplaceCardImageFragment = graphql(
  /* GraphQL */ `
    fragment MarketplaceCardImageFragment on ImageFileField {
      responsiveImage {
        ...ResponsiveImageFragment
      }
    }
  `,
  [ResponsiveImageFragment],
);
