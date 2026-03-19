import { graphql } from '~/lib/datocms/graphql';

export const GithubNpmBadgeFragment = graphql(/* GraphQL */ `
  fragment GithubNpmBadgeFragment on GithubNpmBadgeRecord {
    id
    __typename
    githubUrl
    npmUrl
  }
`);
