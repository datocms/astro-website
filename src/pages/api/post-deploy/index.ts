import { type Client, buildClient } from '@datocms/cma-client';
import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { handleUnexpectedError, successfulResponse, withCORS } from '../utils';

/*
 * This endpoint is called only once, immediately after the initial deployment of
 * this project, to set up some DatoCMS settings. Feel free to remove it!
 */

export const OPTIONS: APIRoute = ({ request }) => {
  return new Response('OK', withCORS());
};

/**
 * Install and configure the "Web Previews" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
async function installWebPreviewsPlugin(client: Client, baseUrl: string) {
  const webPreviewsPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-web-previews',
  });

  await client.plugins.update(webPreviewsPlugin, {
    parameters: {
      frontends: [
        {
          name: 'Production',
          previewWebhook: new URL(
            `/api/preview-links?token=${SECRET_API_TOKEN}`,
            baseUrl,
          ).toString(),
        },
      ],
      startOpen: true,
    },
  });
}

/**
 * Install and configure the "SEO/Readability Analysis" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis
 */
async function installSEOAnalysisPlugin(client: Client, baseUrl: string) {
  const seoPlugin = await client.plugins.create({
    package_name: 'datocms-plugin-seo-readability-analysis',
  });

  await client.plugins.update(seoPlugin.id, {
    parameters: {
      htmlGeneratorUrl: new URL(`/api/seo-analysis?token=${SECRET_API_TOKEN}`, baseUrl).toString(),
      autoApplyToFieldsWithApiKey: 'seo_analysis',
      setSeoReadabilityAnalysisFieldExtensionId: true,
    },
  });
}

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    await Promise.all([
      installWebPreviewsPlugin(client, baseUrl),
      installSEOAnalysisPlugin(client, baseUrl),
    ]);

    return successfulResponse();
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
