import { PartnerTestimonialQuoteFragment } from '~/components/quote/graphql';
import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { TagFragment } from '~/lib/datocms/commonFragments';
import { executeQueryOutsideAstro } from '~/lib/datocms/executeQuery';
import { CustomerStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/customerStory';
import { ShowcaseProjectUrlFragment } from '~/lib/datocms/gqlUrlBuilder/showcaseProject';
import { SuccessStoryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/successStory';
import {
  buildUrlForUseCasePage,
  UseCasePageUrlFragment,
} from '~/lib/datocms/gqlUrlBuilder/useCasePage';
import { graphql } from '~/lib/datocms/graphql';
import type { ParamsToRecordIdFn } from '~/pages/api/normalize-structured-text/_utils/pathnameToRecordId';
import type { BuildSitemapUrlsFn } from '~/pages/sitemap.xml';

export const query = graphql(
  /* GraphQL */ `
    query UseCase($slug: String!) {
      page: useCasePage(filter: { slug: { eq: $slug } }) {
        _seoMetaTags {
          ...TagFragment
        }
        title {
          value
        }
        subtitle {
          value
        }
        heroImage {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        heroCustomer {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        heroProduct {
          responsiveImage(imgixParams: { auto: format, w: 800, h: 500 }) {
            ...ResponsiveImageFragment
          }
        }
        quotesHeader {
          value
        }
        quotes {
          __typename
          ...PartnerTestimonialQuoteFragment
        }
        starterTitle {
          value
        }
        starterDescription {
          value
        }
        starterLink: link
        starterImage {
          responsiveImage(imgixParams: { auto: format, w: 960, h: 540, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
        featuresHeader
        featuresDescription: description {
          value
        }
        callout {
          title
          description {
            value
          }
          image {
            responsiveImage(imgixParams: { auto: format, w: 960, h: 540, fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
          features {
            id
            title
            icon {
              url
            }
            description {
              value
            }
          }
        }
        successStoryHeader {
          value
        }
        successStorySummary: summary {
          value
        }
        caseStudy {
          ... on RecordInterface {
            __typename
          }
          ...SuccessStoryUrlFragment
          ...ShowcaseProjectUrlFragment
          ...CustomerStoryUrlFragment
        }
        successStoryImage: image {
          responsiveImage(imgixParams: { auto: format, w: 960, h: 540, fit: crop }) {
            ...ResponsiveImageFragment
          }
        }
      }
    }
  `,
  [
    TagFragment,
    ResponsiveImageFragment,
    PartnerTestimonialQuoteFragment,
    SuccessStoryUrlFragment,
    ShowcaseProjectUrlFragment,
    CustomerStoryUrlFragment,
  ],
);

export const buildSitemapUrls: BuildSitemapUrlsFn = async (executeQueryOptions) => {
  const { entries } = await executeQueryOutsideAstro(
    graphql(
      /* GraphQL */ `
        query BuildSitemapUrls {
          entries: allUseCasePages(first: 500) {
            ...UseCasePageUrlFragment
          }
        }
      `,
      [UseCasePageUrlFragment],
    ),
    executeQueryOptions,
  );

  return entries.map(buildUrlForUseCasePage);
};

export const paramsToRecordId: ParamsToRecordIdFn<{ slug: string }> = async ({
  executeQueryOptions,
  params: { slug },
}) => {
  const { entity } = await executeQueryOutsideAstro(
    graphql(/* GraphQL */ `
      query ParamsToRecordId($slug: String!) {
        entity: useCasePage(filter: { slug: { eq: $slug } }) {
          id
        }
      }
    `),
    { ...executeQueryOptions, variables: { slug } },
  );

  return entity?.id;
};
