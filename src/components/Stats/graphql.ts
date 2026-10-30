import { graphql } from '~/lib/datocms/graphql';

/** A stat of a success story: a number and its label. */
export const StatsNumberFragment = graphql(/* GraphQL */ `
  fragment StatsNumberFragment on SuccessStoryNumberRecord {
    id
    number
    label
  }
`);
