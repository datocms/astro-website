import { graphql } from '~/lib/datocms/graphql';

export const CtaButtonFragment = graphql(/* GraphQL */ `
  fragment CtaButtonFragment on CtaButtonRecord {
    text
    url
    padding
    fontSize
    style
    alignment
  }
`);
