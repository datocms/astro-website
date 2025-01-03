import type { APIRoute } from 'astro';
import { getSvgFile } from '~/components/Svg/utils';

export const GET: APIRoute = async ({ params }) => {
  const html = getSvgFile(`icons/${params.rest}`);
  return new Response(html, { headers: { 'content-type': 'image/svg+xml' } });
};
