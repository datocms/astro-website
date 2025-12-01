import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { handleUnexpectedError, invalidRequestResponse } from '../_utils';

function isRelativeUrl(path: string): boolean {
  try {
    // Try to create a URL object — if it succeeds without a base, it's absolute
    new URL(path);
    return false;
  } catch {
    try {
      // Verify it can be parsed as a relative URL by providing a base
      new URL(path, 'http://example.com');
      return true;
    } catch {
      // If both attempts fail, it's not a valid URL at all
      return false;
    }
  }
}

export const GET: APIRoute = async ({ url, request, redirect }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const redirectUrl = url.searchParams.get('redirect') || '/';

    if (!isRelativeUrl(redirectUrl)) {
      return invalidRequestResponse('URL must be relative!', 422);
    }

    const fullUrl = new URL(redirectUrl, 'http://example.com');
    fullUrl.searchParams.set('token', SECRET_API_TOKEN);

    return redirect(fullUrl.pathname + fullUrl.search, 307);
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
