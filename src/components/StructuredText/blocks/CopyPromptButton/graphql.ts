import { graphql } from '~/lib/datocms/graphql';

export const CopyPromptButtonFragment = graphql(/* GraphQL */ `
  fragment CopyPromptButtonFragment on CopyPromptButtonBlockRecord {
    prompt
  }
`);
