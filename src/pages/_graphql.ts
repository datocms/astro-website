import { TagFragment } from '~/lib/datocms/commonFragments';
import { graphql } from '~/lib/datocms/graphql';
import { UseCaseExcerptsFragment } from './_sub/UseCaseExcerpts/_graphql';

export const query = graphql(
  /* GraphQL */ `
    query HomePage {
      page: homePage {
        seo: _seoMetaTags {
          ...TagFragment
        }
        yoastAnalysis
      }
      successStories: allSuccessStories(first: 4, orderBy: _firstPublishedAt_DESC) {
        ...UseCaseExcerptsFragment
      }
    }
  `,
  [TagFragment, UseCaseExcerptsFragment],
);
