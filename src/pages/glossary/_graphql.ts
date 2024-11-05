import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(/* GraphQL */ `
  query Glossary {
    page: glossaryPage {
      seo: _seoMetaTags {
        tag
        attributes
        content
      }
    }
    entries: allGlossaryEntries(orderBy: title_ASC, first: 500) {
      id
      title
      description {
        value
      }
      url
    }
  }
`);
