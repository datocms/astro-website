import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { PartnerUrlFragment } from '~/lib/datocms/gqlUrlBuilder/partner';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query ShowcaseQuery($projectSlug: String!) {
      page: showcaseProject(filter: { slug: { eq: $projectSlug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        partner {
          ...PartnerUrlFragment
          name
          slug
          logo {
            url
          }
          shortDescription {
            value
          }
        }
        name
        slug
        projectUrl
        headline {
          value
        }
        inDepthExplanation {
          value
        }
        technologies {
          name
          logo {
            url
          }
        }
        areasOfExpertise {
          name
        }
        mainImage {
          responsiveImage(imgixParams: { auto: format, w: 1200 }) {
            ...ResponsiveImageFragment
          }
        }
        video {
          title
          width
          height
          blurUpThumb
          video {
            playbackId: muxPlaybackId
          }
        }
        projectScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { auto: format, w: 900 }) {
            ...ResponsiveImageFragment
          }
          zoomableResponsiveImage: responsiveImage(
            imgixParams: { auto: format, w: 1500, fit: max }
          ) {
            ...ResponsiveImageFragment
          }
        }
        datocmsScreenshots {
          id
          title
          width
          responsiveImage(imgixParams: { auto: format, w: 900 }) {
            ...ResponsiveImageFragment
          }
          zoomableResponsiveImage: responsiveImage(
            imgixParams: { auto: format, w: 1500, fit: max }
          ) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [TagFragment, ResponsiveImageFragment, PartnerUrlFragment],
);
