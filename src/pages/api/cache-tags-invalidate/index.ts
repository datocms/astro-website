import type { APIRoute } from 'astro';
import { FASTLY_SERVICE_ID, SECRET_API_TOKEN } from 'astro:env/server';
import { invalidateFastlySurrogateKeys } from '~/lib/fastly';
import { handleUnexpectedError, invalidRequestResponse, json } from '../_utils';

type CdaCacheTagsInvalidateWebhook = {
  entity_type: 'cda_cache_tags';
  event_type: 'invalidate';
  entity: {
    id: 'cda_cache_tags';
    type: 'cda_cache_tags';
    attributes: {
      // The array of DatoCMS Cache Tags that need to be invalidated
      tags: string[];
    };
  };
};

export const POST: APIRoute = async ({ url, request }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const data = (await request.json()) as CdaCacheTagsInvalidateWebhook;
    const cacheTags = data.entity.attributes.tags;

    const response = await invalidateFastlySurrogateKeys(cacheTags);

    return json({ cacheTags, response, fastlyServiceId: FASTLY_SERVICE_ID });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
