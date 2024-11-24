import { buildClient } from '@datocms/cma-client';
import type { APIRoute } from 'astro';
import {
  DATOCMS_API_TOKEN,
  DRAFT_MODE_HOSTNAME,
  PUBLIC_HOSTNAME,
  SECRET_API_TOKEN,
} from 'astro:env/server';
import { recordToWebsiteRoute } from '~/lib/datocms/recordInfo';
import { handleUnexpectedError, invalidRequestResponse, json, withCORS } from '../_utils';

export const OPTIONS: APIRoute = () => {
  return new Response('OK', withCORS());
};

type PreviewLink = {
  label: string;
  url: string;
  reloadPreviewOnRecordUpdate?: boolean | { delayInMs: number };
};

type WebPreviewsResponse = {
  previewLinks: PreviewLink[];
};

/**
 * This route handler implements the Previews webhook required for the "Web
 * Previews" plugin:
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews#the-previews-webhook
 */

export const POST: APIRoute = async ({ url, request }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    /**
     * The plugin sends the record and model for which the user wants a preview,
     * along with information about which locale they are currently viewing in
     * the interface
     */
    const { item, itemType, environmentId } = await request.json();

    const client = buildClient({
      apiToken: DATOCMS_API_TOKEN,
      environment: environmentId,
    });

    // We can use this info to generate the frontend URL associated
    const recordUrl = await recordToWebsiteRoute({
      item,
      itemTypeApiKey: itemType.attributes.api_key,
      client,
    });

    const response: WebPreviewsResponse = { previewLinks: [] };

    if (recordUrl) {
      /**
       * If status is not published, it means that it has a current version that's
       * different from the published one, so it has a draft version!
       */
      if (item.meta.status !== 'published') {
        response.previewLinks.push({
          label: 'Draft version',
          url: new URL(recordUrl, `https://${DRAFT_MODE_HOSTNAME}/`).toString(),
        });
      }

      /** If status is not draft, it means that it has a published version! */
      if (item.meta.status !== 'draft') {
        response.previewLinks.push({
          label: 'Published version',
          url: new URL(recordUrl, `https://${PUBLIC_HOSTNAME}/`).toString(),
        });
      }
    }

    // Respond in the format expected by the plugin
    return json(response, withCORS());
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
