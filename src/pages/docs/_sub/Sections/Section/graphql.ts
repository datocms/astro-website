import { graphql } from '~/lib/datocms/graphql';
import { DocCardFragment } from '../DocCard/graphql';
import { ExternalCardFragment } from '../ExternalCard/graphql';

export const SectionFragment = graphql(
  /* GraphQL */ `
    fragment SectionFragment on DocsHomeSectionBlockRecord {
      id
      title
      kicker
      width
      columns
      cards {
        __typename
        ...DocCardFragment
        ...ExternalCardFragment
      }
    }
  `,
  [DocCardFragment, ExternalCardFragment],
);
