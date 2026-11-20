import { stripStega } from '@datocms/astro';
import type { AstroGlobal } from 'astro';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { joinWithAnd, shortNames } from '~/lib/shortNames';
import { contactPeopleQuery } from './graphql';
import type { ContactPoint } from './types';

export interface ContactPerson {
  name: string;
  role: string;
  portrait: string;
  /** The photo of the OG card: 400 px, a JPEG. */
  photo: string;
}

export interface Contact {
  /** The text of the first line: one full name, or the short names. */
  names: string;
  /** The text of the second line: the role of one person, or the team. */
  role: string;
  /** The name of the team of the contact point. */
  team: string;
  people: ContactPerson[];
}

type People = Awaited<ReturnType<typeof fetchPeople>>;

// One query for each request, for all the buttons of the page.
const cache = new WeakMap<Request, Promise<People>>();

async function fetchPeople(Astro: AstroGlobal) {
  const { people } = await executeQuery(Astro, contactPeopleQuery);
  return people;
}

/**
 * Gives the people of one or more departments (their slugs). A person in two
 * of the departments shows once. Gives null when no person has a portrait.
 */
export async function fetchDepartments(
  Astro: AstroGlobal,
  slugs: string[],
): Promise<Contact | null> {
  let request = cache.get(Astro.request);
  if (!request) {
    request = fetchPeople(Astro);
    cache.set(Astro.request, request);
  }
  const records = await request;

  const teams: string[] = [];
  for (const slug of slugs) {
    const name = records
      .flatMap((r) => r.departments)
      .find((department) => department.slug === slug)?.name;
    if (name && !teams.includes(name)) teams.push(name);
  }
  const team = joinWithAnd(teams);

  // The order of the faces is the order of the names.
  const people = records
    .filter((r) => r.departments.some((department) => slugs.includes(department.slug ?? '')))
    .flatMap((r) =>
      r.avatar?.url
        ? [
            {
              name: r.name ?? '',
              role: r.role ?? '',
              portrait: r.avatar.url,
              photo: r.ogPhoto?.url ?? r.avatar.url,
            },
          ]
        : [],
    )
    .sort((a, b) => stripStega(a.name).localeCompare(stripStega(b.name)));
  if (people.length === 0) return null;

  const [first] = people;
  if (people.length === 1 && first) {
    return { names: first.name, role: first.role || team, team, people };
  }
  return { names: joinWithAnd(shortNames(people.map((p) => p.name))), role: team, team, people };
}

/** Gives the people of a contact point. Gives null when no person has a portrait. */
export function fetchContact(Astro: AstroGlobal, contact: ContactPoint): Promise<Contact | null> {
  return fetchDepartments(Astro, [contact]);
}
