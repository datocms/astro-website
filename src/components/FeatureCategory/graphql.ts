import { BlogPostUrlFragment } from '~/lib/datocms/gqlUrlBuilder/blogPost';
import { ChangelogEntryUrlFragment } from '~/lib/datocms/gqlUrlBuilder/changelogEntry';
import { DocPageUrlFragment } from '~/lib/datocms/gqlUrlBuilder/docPage';
import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { FeatureUrlFragment } from '~/lib/datocms/gqlUrlBuilder/feature';
import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { UserGuidesEpisodeUrlFragment } from '~/lib/datocms/gqlUrlBuilder/userGuidesEpisode';
import { graphql } from '~/lib/datocms/graphql';

/** One feature of a group. */
export const FeatureCategoryEntryFragment = graphql(
  /* GraphQL */ `
    fragment FeatureCategoryEntryFragment on FeatureRegularCardRecord {
      id
      title
      emoji
      description {
        value
      }
      image {
        lightboxImageUrl: url(imgixParams: { auto: format, w: 2000, fit: max })
      }
      badge
      links {
        linkTitle
        content {
          __typename
          ...BlogPostUrlFragment
          ...ChangelogEntryUrlFragment
          ...DocPageUrlFragment
          ...FeatureUrlFragment
          ...PluginUrlFragment
          ...TemplateDemoUrlFragment
          ...UserGuidesEpisodeUrlFragment
          ...HostingAppUrlFragment
          ...EnterpriseAppUrlFragment
        }
      }
    }
  `,
  [
    BlogPostUrlFragment,
    ChangelogEntryUrlFragment,
    DocPageUrlFragment,
    FeatureUrlFragment,
    PluginUrlFragment,
    TemplateDemoUrlFragment,
    UserGuidesEpisodeUrlFragment,
    HostingAppUrlFragment,
    EnterpriseAppUrlFragment,
  ],
);
