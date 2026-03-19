import { graphql } from '~/lib/datocms/graphql';

export const GithubNpmBadgeFragment = graphql(/* GraphQL */ `
  fragment GithubNpmBadgeFragment on GithubNpmBadgeRecord @_unmask {
    id
    __typename
    githubUrl
    npmUrl
  }
`);
