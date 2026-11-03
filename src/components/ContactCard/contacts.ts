import type { AstroGlobal } from 'astro';
import { executeQuery } from '~/lib/datocms/executeQuery';
import { contactPeopleQuery } from './graphql';
import type { ContactPoint } from './types';

/**
 * The people who answer each contact point: IDs of TeamMember records.
 * The order is the order of the faces in the card.
 */
const CONTACTS: Record<ContactPoint, { team: string; ids: string[] }> = {
  sales: { team: 'Sales', ids: ['39830738'] },
  partners: { team: 'Partner Program', ids: ['142812727'] },
  support: { team: 'Support', ids: ['79766956', 'V_7KMMRtTCGmue1QqTZZ_Q'] },
};

const ALL_IDS = Object.values(CONTACTS).flatMap((c) => c.ids);

export interface ContactPerson {
  name: string;
  role: string;
  portrait: string;
}

export interface Contact {
  /** The text of the first line: one full name, or the first names. */
  names: string;
  /** The text of the second line: the role of one person, or the team. */
  role: string;
  people: ContactPerson[];
}

type People = Awaited<ReturnType<typeof fetchPeople>>;

// One query for each request, for all the buttons of the page.
const cache = new WeakMap<Request, Promise<People>>();

async function fetchPeople(Astro: AstroGlobal) {
  const { people } = await executeQuery(Astro, contactPeopleQuery, {
    variables: { ids: ALL_IDS },
  });
  return people;
}

/** Gives the people of a contact point. Gives null when no record has a portrait. */
export async function fetchContact(
  Astro: AstroGlobal,
  contact: ContactPoint,
): Promise<Contact | null> {
  let request = cache.get(Astro.request);
  if (!request) {
    request = fetchPeople(Astro);
    cache.set(Astro.request, request);
  }
  const records = await request;

  const { team, ids } = CONTACTS[contact];
  const people = ids.flatMap((id) => {
    const record = records.find((r) => r.id === id);
    if (!record?.avatar?.url) return [];
    return [{ name: record.name, role: record.role ?? '', portrait: record.avatar.url }];
  });
  if (people.length === 0) return null;

  const [first] = people;
  if (people.length === 1 && first) {
    return { names: first.name, role: first.role || team, people };
  }
  const firstNames = people.map((p) => p.name.split(' ')[0]);
  return { names: firstNames.join(' & '), role: team, people };
}
