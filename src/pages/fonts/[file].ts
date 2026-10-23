import type { APIRoute } from 'astro';
import { serveUiFont } from '~/lib/serveUiFont';
import { handleUnexpectedError } from '../api/_utils';

// The Worker has the list of the files that it serves (`FILES` in
// `workers/ui-fonts/src/index.js`). It sends 404 for a different name.
export const GET: APIRoute = async ({ request, params }) => {
  try {
    return await serveUiFont(request, params.file ?? '');
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
