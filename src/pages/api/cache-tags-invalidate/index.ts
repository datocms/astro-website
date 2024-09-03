import type { APIRoute } from 'astro';
import { FASTLY_KEY, FASTLY_SERVICE_ID, SECRET_API_TOKEN } from 'astro:env/server';
import { handleUnexpectedError, invalidRequestResponse, json } from '../utils';

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

async function invalidateFastlySurrogateKeys(serviceId: string, fastlyKey: string, keys: string[]) {
  return fetch(`https://api.fastly.com/service/${serviceId}/purge`, {
    method: "POST",
    headers: {
      "fastly-key": fastlyKey,
      "content-type": "application/json",
    },
    body: JSON.stringify({ surrogate_keys: keys }),
  });
}

export const POST: APIRoute = async ({ url, request }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const data = await request.json() as CdaCacheTagsInvalidateWebhook;
    const cacheTags = data.entity.attributes.tags;

    const response = await invalidateFastlySurrogateKeys(
      FASTLY_SERVICE_ID,
      FASTLY_KEY,
      cacheTags
    );

    return json(response);
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
