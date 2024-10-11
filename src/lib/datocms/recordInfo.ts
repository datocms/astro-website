import type { Client, SchemaTypes } from '@datocms/cma-client';

/*
 * Both the "Web Previews" and "SEO/Readability Analysis" plugins from DatoCMS
 * need to know the URL of the site that corresponds to each DatoCMS record to
 * work properly. These two functions are responsible for returning this
 * information, and are utilized by the API routes associated with the two
 * plugins:
 *
 * - server/api/seo-analysis/index.ts
 * - server/api/preview-links/index.ts
 */

type RecordToWebsiteRouteOptions = {
  item: SchemaTypes.Item;
  itemTypeApiKey: string;
  client: Client;
};

export async function recordToWebsiteRoute({
  item,
  itemTypeApiKey,
  client,
}: RecordToWebsiteRouteOptions): Promise<string | null> {
  switch (itemTypeApiKey) {
    case 'page': {
      return '/';
    }
    case 'article': {
      return `/blog/${await recordToSlug(item, itemTypeApiKey)}`;
    }
    case 'user_guides_chapter': {
      return '/user-guides';
    }
    case 'user_guides_home': {
      return '/user-guides';
    }
    case 'user_guides_video': {
      const chapters = await client.items.list({
        version: 'current',
        filter: { type: 'user_guides_chapter', fields: { videos: { all_in: [item.id] } } },
      });
      return `/user-guides/${chapters[0]!.slug}/${await recordToSlug(item, itemTypeApiKey)}`;
    }
    case 'changelog_entry': {
      return `/product-updates/${await recordToSlug(item, itemTypeApiKey)}`;
    }
    case 'changelog': {
      return `/product-updates`;
    }
    case 'feature': {
      return `/features/${await recordToSlug(item, itemTypeApiKey)}`;
    }
    default:
      return null;
  }
}

export async function recordToSlug(
  item: SchemaTypes.Item,
  itemTypeApiKey: string,
): Promise<string | null> {
  switch (itemTypeApiKey) {
    default:
      return item.attributes.slug as string;
  }
}
