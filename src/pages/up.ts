import type { APIRoute } from 'astro';
import { json } from './api/_utils';

export const GET: APIRoute = async () => {
  return json({ success: true });
};
