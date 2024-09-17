import $RefParser, { type JSONSchema } from '@apidevtools/json-schema-ref-parser';
import ky from 'ky';
import type { Group } from '~/components/docs/Sidebar';
import { invariant } from '~/lib/invariant';
import { temporarilyCache } from '~/lib/temporarlyCache';

export async function buildSidebarItems(activeResourceName?: string): Promise<Group[]> {
  const schema = await fetchSchema();

  invariant(schema.properties);

  const { properties } = schema;

  return schema.groups.map((group) => {
    return {
      title: group.title,
      entries: group.resources.map((resourceName) => {
        const resource = properties[resourceName] as Resource;

        const slug = resourceName.replace(/_/g, '-');
        const endpoints = resource.links ? resource.links.filter((l) => !l.private) : [];

        return {
          label: resource.title!,
          url: `/docs/content-management-api/resources/${slug}`,
          entries:
            activeResourceName === resourceName
              ? endpoints.map((endpoint) => ({
                  label: endpoint.title,
                  url: `/docs/content-management-api/resources/${slug}/${endpoint.rel}`,
                }))
              : undefined,
        };
      }),
    };
  });
}

export async function findResource(resourceName: string) {
  const schema = await fetchSchema();

  invariant(schema.properties);

  return schema.properties[resourceName] as Resource | undefined;
}

// const url = 'http://localhost:3001/docs/site-api-hyperschema.json';
const url = 'https://site-api.datocms.com/docs/site-api-hyperschema.json';

type Link = {
  private?: boolean;
  rel: string;
  title: string;
};

type Resource = JSONSchema & {
  links?: Link[];
};

type Schema = JSONSchema & {
  groups: Array<{
    title: string;
    resources: string[];
  }>;
};

const fetchSchema = temporarilyCache(60, async () => {
  const unreferencedSchema = await ky(url).json();
  const schema = await $RefParser.dereference(unreferencedSchema);
  isJsonSchema(schema);
  return schema as Schema;
});

function isJsonSchema(thing: unknown): asserts thing is JSONSchema {
  invariant(thing && typeof thing !== 'boolean');
}
