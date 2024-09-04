import { graphql } from '~/lib/datocms/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';

/*
 * This file lists a series of graphql not related to any specific Vue
 * component, but necessary in various parts of the code.
 */

export const TagFragment = graphql(/* GraphQL */ `
  fragment TagFragment on Tag @_unmask {
    tag
    attributes
    content
  }
`);

export const PartnerTestimonialFieldsFragment = graphql(
  /* GraphQL */ `
    fragment PartnerTestimonialFieldsFragment on PartnerTestimonialRecord {
      quote {
        value
      }
      role
      name
      image {
        responsiveImage(imgixParams: { w: 300, h: 300, fit: crop, crop: faces, auto: format }) {
          ...ResponsiveImageFragment
        }
      }
      partner {
        name
        slug
      }
    }
  `,
  [ResponsiveImageFragment],
);

export const ReviewFieldsFragment = graphql(
  /* GraphQL */ `
    fragment ReviewFieldsFragment on ReviewRecord {
      id
      name
      role
      quote {
        value
      }
      image {
        responsiveImage(imgixParams: { auto: format, w: 300, h: 300, fit: crop, crop: faces }) {
          ...ResponsiveImageFragment
        }
      }
    }
  `,
  [ResponsiveImageFragment],
);
