import type { AstroGlobal } from 'astro';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { teamPhotosQuery } from './graphql';

// One query for each request, for all the avatars of the page.
const cache = new WeakMap<Request, Promise<Map<string, string>>>();

async function fetchPhotos(Astro: AstroGlobal) {
  const { members } = await executeQuery(Astro, teamPhotosQuery);
  return new Map(
    members.flatMap((member) => (member.avatar?.url ? [[member.id, member.avatar.url]] : [])),
  );
}

/** Gives the photo of a TeamMember record. Gives undefined when the record has no photo. */
export async function teamMemberPhoto(Astro: AstroGlobal, id: string) {
  let request = cache.get(Astro.request);
  if (!request) {
    request = fetchPhotos(Astro);
    cache.set(Astro.request, request);
  }
  return (await request).get(id);
}
