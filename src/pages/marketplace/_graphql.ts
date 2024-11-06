import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { PluginUrlFragment } from '~/lib/datocms/gqlUrlBuilder/plugin';
import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';

export const query = graphql(
  /* GraphQL */ `
    query Marketplace {
      demos: _allTemplateDemosMeta {
        count
      }
      plugins: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
      hostingApps: _allHostingAppsMeta {
        count
      }
      enterpriseApps: _allEnterpriseAppsMeta {
        count
      }
      page: integrationsPage {
        demos {
          ...TemplateDemoUrlFragment
          id
          code
          name
          cmsDescription
          starterType
          badge {
            name
            emoji
          }
          label
          githubRepo
          technology {
            name
            logo {
              url
            }
            squareLogo {
              url
            }
          }
          screenshot {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
        }
        plugins {
          ...PluginUrlFragment
          coverImage {
            responsiveImage(imgixParams: { auto: format, w: 360, h: 240, fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
          title
          description
        }
        hostingBuilding {
          ...HostingAppUrlFragment
          title
          description: shortDescription
          logo {
            url
            width
            height
          }
        }
        enterpriseApps {
          ...EnterpriseAppUrlFragment
          title
          description: shortDescription
          logo {
            url
            width
            height
          }
        }
      }
    }
  `,
  [
    ResponsiveImageFragment,
    TemplateDemoUrlFragment,
    PluginUrlFragment,
    HostingAppUrlFragment,
    EnterpriseAppUrlFragment,
  ],
);
