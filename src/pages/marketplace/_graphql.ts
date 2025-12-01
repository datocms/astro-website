import { ResponsiveImageFragment } from '~/components/ResponsiveImage/graphql';
import { EnterpriseAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/enterpriseApp';
import { HostingAppUrlFragment } from '~/lib/datocms/gqlUrlBuilder/hostingApp';
import { TemplateDemoUrlFragment } from '~/lib/datocms/gqlUrlBuilder/templateDemo';
import { graphql } from '~/lib/datocms/graphql';
import { PluginCardFragment } from './_sub/PluginCard/_graphql';
import { RecipeCardFragment } from './_sub/RecipeCard/_graphql';

export const query = graphql(
  /* GraphQL */ `
    query Marketplace {
      pluginsMeta: _allPluginsMeta(filter: { manuallyDeprecated: { eq: false } }) {
        count
      }
      hostingAppsMeta: _allHostingAppsMeta {
        count
      }
      enterpriseAppsMeta: _allEnterpriseAppsMeta {
        count
      }
      recipesMeta: _allRecipesMeta {
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
              alt
            }
            squareLogo {
              url
              alt
            }
          }
          screenshot {
            responsiveImage(imgixParams: { auto: format, w: 600, h: 400, fit: crop }) {
              ...ResponsiveImageFragment
            }
          }
        }
        plugins {
          ...PluginCardFragment
        }
        hostingBuilding {
          ...HostingAppUrlFragment
          title
          description: shortDescription
          logo {
            url
            alt
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
            alt
            width
            height
          }
        }
      }
      recipes: allRecipes(orderBy: position_ASC, first: 6) {
        ...RecipeCardFragment
      }
    }
  `,
  [
    ResponsiveImageFragment,
    TemplateDemoUrlFragment,
    PluginCardFragment,
    HostingAppUrlFragment,
    EnterpriseAppUrlFragment,
    RecipeCardFragment,
  ],
);
