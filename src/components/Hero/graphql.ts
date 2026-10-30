import { ResponsiveImageFragment } from '~/components/ResponsiveImage';
import { graphql } from '~/lib/datocms/graphql';

/** A portrait of the team row. */
export const HeroTeamMemberFragment = graphql(
  /* GraphQL */ `
    fragment HeroTeamMemberFragment on TeamMemberRecord {
      name
      avatar {
        responsiveImage(imgixParams: { w: 162, h: 162, fit: crop, crop: faces }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
