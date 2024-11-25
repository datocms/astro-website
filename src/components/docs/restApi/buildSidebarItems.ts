import type { AstroGlobal } from 'astro';
import type { SidebarGroup } from '~/components/docs/Sidebar';
import { invariant } from '~/lib/invariant';
import { fetchSchema } from './fetchSchema';
import { addLanguageToUrl, currentLanguage } from './LanguagePicker/utils';
import type { RestApiEntity } from './types';

export async function buildSidebarItems(
  astro: AstroGlobal,
  activeEntitySlug?: string,
): Promise<SidebarGroup[]> {
  const schema = await fetchSchema(astro);
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
          url: addLanguageToUrl(astro, `/docs/content-management-api/resources/${slug}`, language),
          entries:
            activeEntitySlug === slug
              ? endpoints.map((endpoint) => ({
                  label: endpoint.title,
                  url: addLanguageToUrl(
                    astro,
                    `/docs/content-management-api/resources/${slug}/${endpoint.rel}`,
                    language,
                  ),
                }))
              : undefined,
        };
      }),
    };
  });
}
