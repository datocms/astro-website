import { PartnerTestimonialQuoteFragment, ReviewQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { VideoPlayerFragment } from '~/components/VideoPlayer/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import {
  LandingPageUrlFragment,
  buildUrlForLandingPage,
} from '~/lib/datocms/gqlUrlBuilder/landingPage';
import { graphql } from '~/lib/datocms/graphql';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query Cms($slug: String!) {
      page: landingPage(filter: { slug: { eq: $slug } }) {
        seo: _seoMetaTags {
          ...TagFragment
        }
        slug
        name
        title {
          value
        }
        subtitle
        integration {
          id
          squareLogo {
            url
          }
          logo {
            url
          }
          websites: _allReferencingWebsites {
            __typename
            id
            _createdAt
            title
            url
            image {
              responsiveImage(imgixParams: { auto: format, w: 400, h: 300, fit: crop, crop: top }) {
                ...ResponsiveImageFragment
              }
            }
          }
          showcaseProjects: _allReferencingShowcaseProjects(
            filter: { projectUrl: { isBlank: false } }
          ) {
            __typename
            id
            _createdAt
            title: name
            url: projectUrl
            image: mainImage {
              responsiveImage(imgixParams: { auto: format, w: 400, h: 300, fit: crop, crop: top }) {
                ...ResponsiveImageFragment
              }
            }
          }
        }
        docsUrl
        demo {
          code
          githubRepo
          screenshot {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop, crop: top }) {
              ...ResponsiveImageFragment
            }
          }
        }
        content {
          ... on RecordInterface {
            id
            __typename
          }
          ... on LandingCdnMapBlockRecord {
            title {
              value
            }
            description {
              value
            }
          }
          ... on LandingProgressiveImagesBlockRecord {
            title {
              value
            }
            content {
              value
            }
            githubRepoTitle
            githubPackageName
          }
          ... on CodeExcerptBlockRecord {
            title {
              value
            }
            content {
              value
            }
            code
            language
            githubRepoTitle
            githubPackageName
          }
          ... on ModularBlocksBlockRecord {
            title {
              value
            }
            content {
              value
            }
          }
          ... on QuoteLinkRecord {
            quote {
              __typename
              ... on ReviewRecord {
                ...ReviewQuoteFragment
              }
              ... on PartnerTestimonialRecord {
                ...PartnerTestimonialQuoteFragment
              }
            }
          }
          ... on LandingVideoBlockRecord {
            title {
              value
            }
            content {
              value
            }
            video {
              ...VideoPlayerFragment
            }
          }
          ... on ImageTransformationsBlockRecord {
            title {
              value
            }
            content {
              value
            }
          }
          ... on TryDemoBlockRecord {
            title {
              value
            }
            content {
              value
            }
          }
        }
        seoH1
        yoastAnalysis
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    PartnerTestimonialQuoteFragment,
    ReviewQuoteFragment,
    VideoPlayerFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allLandingPages(first: 100) {
            ...LandingPageUrlFragment
          }
        }
      `,
      [LandingPageUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForLandingPage);
};
