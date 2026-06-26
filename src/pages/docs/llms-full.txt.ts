import type { APIRoute } from 'astro';
import { serveLlmsBundle } from '~/lib/serveLlmsBundle';
import { handleUnexpectedError } from '../api/_utils';

export const GET: APIRoute = async ({ request }) => {
  try {
    return await serveLlmsBundle('llms-full.txt');
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
