import { graphql, readFragment, type FragmentOf } from '../graphql';

export const TemplateDemoUrlFragment = graphql(/* GraphQL */ `
  fragment TemplateDemoUrlFragment on TemplateDemoRecord {
    code
  }
`);

export function buildUrlForTemplateDemo(templateDemo: FragmentOf<typeof TemplateDemoUrlFragment>) {
  const data = readFragment(TemplateDemoUrlFragment, templateDemo);
  return `/marketplace/starters/${data.code}`;
}
