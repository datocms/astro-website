import { buildClient } from '@datocms/cma-client';
import type { APIRoute } from 'astro';
import { DATOCMS_CMA_TOKEN, SECRET_API_TOKEN } from 'astro:env/server';
import { JSDOM } from 'jsdom';
import { recordToSlug, recordToWebsiteRoute } from '~/lib/datocms/recordInfo';
import { draftModeHeaders } from '~/lib/draftMode';
import { handleUnexpectedError, invalidRequestResponse, json, withCORS } from '../utils';

export const OPTIONS: APIRoute = ({ request }) => {
  return new Response('OK', withCORS());
};

type SeoAnalysis = {
  locale: string;
  slug: string | 'unknown';
  permalink: string;
  title: string | null;
  description: string | null;
  content: string;
};

/**
 * This route handler implements the Frontend metadata endpoint required for the
 * "SEO/Readability Analysis" plugin:
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis#the-frontend-metadata-endpoint
 */

export const GET: APIRoute = async ({ url }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    /**
     * The plugin sends the record and model for which the user wants to perform
     * a SEO/Readability analysis, along with information about which locale
     * they are currently viewing in the interface
     */
    const itemId = url.searchParams.get('itemId');
    const itemTypeId = url.searchParams.get('itemTypeId');
    const itemTypeApiKey = url.searchParams.get('itemTypeApiKey');
    const locale = url.searchParams.get('locale');
    const sandboxEnvironmentId = url.searchParams.get('sandboxEnvironmentId');

    if (!itemId || !itemTypeApiKey || !itemTypeId || !locale || !sandboxEnvironmentId) {
      return invalidRequestResponse('Missing required parameters');
    }

    const client = buildClient({
      apiToken: DATOCMS_CMA_TOKEN,
      environment: sandboxEnvironmentId,
    });

    const { data: item } = await client.items.rawFind(itemId);

    // We can use this info to generate the frontend URL, and the page slug
    const websitePath = await recordToWebsiteRoute(item, itemTypeApiKey, locale);

    const slug = await recordToSlug(item, itemTypeApiKey, locale);

    if (!websitePath) {
      return invalidRequestResponse(
        `Don\'t know which route corresponds to record #${itemId} (model: ${itemTypeApiKey})!`,
      );
    }

    /*
     * We need to retrieve the page from the frontend, in its draft version. To
     * do this, we set the cookies that are obtained by temporarily enabling
     * Draft Mode.
     */
    const pageRequest = await fetch(new URL(websitePath, url).toString(), {
      headers: draftModeHeaders(),
    });

    if (!pageRequest.ok) {
      return invalidRequestResponse(`Invalid status for ${websitePath}: ${pageRequest.status}`);
    }

    // Parse the HTML response into a DOM tree
    const { document } = new JSDOM(await pageRequest.text()).window;

    /*
     * To get only the page content without the header/footer, use a specific
     * selector on the page instead of taking everything from the body.
     */
    const contentEl = document.querySelector('body');

    if (!contentEl) {
      return invalidRequestResponse('No content found');
    }

    // Build the response in the format expected by the plugin
    const response: SeoAnalysis = {
      locale: document.querySelector('html')?.getAttribute('lang') || 'en',
      slug: slug ?? 'unknown',
      permalink: websitePath,
      title: document.querySelector('title')?.textContent ?? null,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
      content: contentEl.innerHTML,
    };

    return json(response, withCORS());
  } catch (error) {
    return handleUnexpectedError(error);
  }
};
