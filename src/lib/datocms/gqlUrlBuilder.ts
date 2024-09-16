import { graphql, readFragment, type FragmentOf } from './graphql';

export const DocGroupUrlFragment = graphql(/* GraphQL */ `
  fragment DocGroupUrlFragment on DocGroupRecord {
    slug
    pagesOrSections: pages {
      __typename
      ... on DocGroupPageRecord {
        page {
          slug
        }
      }
      ... on DocGroupSectionRecord {
        pages {
          page {
            slug
          }
        }
      }
    }
  }
`);

export function buildUrlForDocGroup(docGroup: FragmentOf<typeof DocGroupUrlFragment>) {
  const data = readFragment(DocGroupUrlFragment, docGroup);
  const firstPageOrSection = data.pagesOrSections[0]!;

  if (firstPageOrSection.__typename === 'DocGroupPageRecord') {
    return `/docs/${data.slug}${firstPageOrSection.page.slug === 'index' ? '' : `/${firstPageOrSection.page.slug}`}`;
  } else {
    const firstPage = firstPageOrSection.pages[0]!;
    return `/docs/${data.slug}${firstPage.page.slug === 'index' ? '' : `/${firstPage.page.slug}`}`;
  }
}

export const DocPageUrlFragment = graphql(/* GraphQL */ `
  fragment DocPageUrlFragment on DocPageRecord {
    slug
    parent: _allReferencingDocGroups {
      slug
    }
  }
`);

export function buildUrlForDocPage(docPage: FragmentOf<typeof DocPageUrlFragment>) {
  const data = readFragment(DocPageUrlFragment, docPage);
  return `/docs/${data.parent[0]!.slug}${data.slug === 'index' ? '' : `/${data.slug}`}`;
}

export const FeatureUrlFragment = graphql(/* GraphQL */ `
  fragment FeatureUrlFragment on FeatureRecord {
    slug
  }
`);

export function buildUrlForFeature(feature: FragmentOf<typeof FeatureUrlFragment>) {
  const data = readFragment(FeatureUrlFragment, feature);
  return `/features/${data.slug}`;
}

export const UserGuideEpisodeUrlFragment = graphql(/* GraphQL */ `
  fragment UserGuideEpisodeUrlFragment on UserGuidesVideoRecord {
    slug
    chapters: _allReferencingUserGuidesChapters {
      slug
    }
  }
`);

export function buildUrlForUserGuideEpisode(
  userGuideEpisode: FragmentOf<typeof UserGuideEpisodeUrlFragment>,
) {
  const data = readFragment(UserGuideEpisodeUrlFragment, userGuideEpisode);
  return `/user-guides/${data.chapters[0]!.slug}/${data.slug}`;
}

export const TemplateDemoUrlFragment = graphql(/* GraphQL */ `
  fragment TemplateDemoUrlFragment on TemplateDemoRecord {
    code
  }
`);

export function buildUrlForTemplateDemo(templateDemo: FragmentOf<typeof TemplateDemoUrlFragment>) {
  const data = readFragment(TemplateDemoUrlFragment, templateDemo);
  return `/marketplace/starters/${data.code}`;
}

export function buildUrlFromGql(
  thing:
    | (FragmentOf<typeof DocPageUrlFragment> & {
        __typename: 'DocPageRecord';
      })
    | (FragmentOf<typeof FeatureUrlFragment> & {
        __typename: 'FeatureRecord';
      })
    | (FragmentOf<typeof DocGroupUrlFragment> & {
        __typename: 'DocGroupRecord';
      })
    | (FragmentOf<typeof UserGuideEpisodeUrlFragment> & {
        __typename: 'UserGuidesVideoRecord';
      })
    | (FragmentOf<typeof TemplateDemoUrlFragment> & {
        __typename: 'TemplateDemoRecord';
      }),
) {
  switch (thing.__typename) {
    case 'DocPageRecord':
      return buildUrlForDocPage(thing);
    case 'FeatureRecord':
      return buildUrlForFeature(thing);
    case 'DocGroupRecord':
      return buildUrlForDocGroup(thing);
    case 'UserGuidesVideoRecord':
      return buildUrlForUserGuideEpisode(thing);
    case 'TemplateDemoRecord':
      return buildUrlForTemplateDemo(thing);
  }
}
