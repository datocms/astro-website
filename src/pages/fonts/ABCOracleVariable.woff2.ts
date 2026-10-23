import type { APIRoute } from 'astro';
import { serveUiFont } from '~/lib/serveUiFont';
import { handleUnexpectedError } from '../api/_utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    return await serveUiFont(request, 'ABCOracleVariable.woff2');
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
