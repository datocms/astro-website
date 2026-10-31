import type { AstroGlobal } from 'astro';
import type { SidebarGroup } from '~/components/docs/Sidebar';
import { invariant } from '~/lib/invariant';
import { fetchDashboardSchema } from './fetchSchema';
import { addLanguageToUrl, currentLanguage } from '../restApi/LanguagePicker/utils';
import type { RestApiEntity } from '../restApi/types';

export async function buildDashboardSidebarItems(
  astro: AstroGlobal,
  activeEntitySlug?: string,
): Promise<SidebarGroup[]> {
  const schema = await fetchDashboardSchema(astro);
  const language = currentLanguage(astro)!;

  invariant(schema.properties);

  const { properties } = schema;

  return schema.groups.map((group) => {
    return {
      title: group.title,
      entries: group.resources.map((entityName) => {
        const entity = properties[entityName] as RestApiEntity;

        const slug = entityName.replace(/_/g, '-');
        const endpoints = entity.links ? entity.links.filter((l) => !l.private) : [];

        return {
          label: entity.title!,
          url: addLanguageToUrl(astro, `/docs/dashboard-api/resources/${slug}`, language),
          entries:
            activeEntitySlug === slug
              ? endpoints.map((endpoint) => ({
                  label: endpoint.title,
                  url: addLanguageToUrl(
                    astro,
                    `/docs/dashboard-api/resources/${slug}/${endpoint.rel}`,
                    language,
                  ),
                }))
              : undefined,
        };
      }),
    };
  });
}
