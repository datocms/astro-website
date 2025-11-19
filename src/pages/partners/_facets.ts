import type { FragmentOf } from 'gql.tada';
import type { PartnerFragment } from './_graphql';

type Partner = FragmentOf<typeof PartnerFragment>;

export type FilterKey = 'technology' | 'areaOfExpertise' | 'country' | 'continent';

export type ActiveFilters = {
  technology: string | null;
  areaOfExpertise: string | null;
  country: string | null;
  continent: string | null;
};

export type Counters = {
  technologies: Record<string, number>;
  areasOfExpertise: Record<string, number>;
  countries: Record<string, number>;
  continents: Record<string, number>;
};

/**
 * Return partners matching only the filters included in `applyFilters`.
 * `applyFilters` is a Set of FilterKey telling the function which active filters to enforce.
 *
 * Example: applyFilters = new Set(['technology','country']) -> enforce only those two filters
 */
export function partnersMatching(
  partners: Partner[],
  activeFilters: ActiveFilters,
  applyFilters: Set<FilterKey>,
) {
  return partners.filter((partner) => {
    if (applyFilters.has('technology') && activeFilters.technology) {
      if (!partner.technologies.some((t) => t.name === activeFilters.technology)) return false;
    }
    if (applyFilters.has('areaOfExpertise') && activeFilters.areaOfExpertise) {
      if (!partner.areasOfExpertise.some((t) => t.name === activeFilters.areaOfExpertise))
        return false;
    }
    if (applyFilters.has('country') && activeFilters.country) {
      if (!partner.locations.some((t) => `${t.emoji} ${t.name}` === activeFilters.country))
        return false;
    }
    if (applyFilters.has('continent') && activeFilters.continent) {
      if (!partner.locations.some((t) => t.continent.name === activeFilters.continent))
        return false;
    }
    return true;
  });
}

/**
 * Calculate counters for each filter dimension from a set of partners.
 * @param filterByContinent - If provided, only count countries within this continent
 */
export function calculateCounters(partners: Partner[], filterByContinent: string | null): Counters {
  const technologies: Record<string, number> = {};
  const areasOfExpertise: Record<string, number> = {};
  const countries: Record<string, number> = {};
  const continents: Record<string, number> = {};

  for (const partner of partners) {
    for (const t of partner.technologies) {
      technologies[t.name] = (technologies[t.name] || 0) + 1;
    }
    for (const t of partner.areasOfExpertise) {
      areasOfExpertise[t.name] = (areasOfExpertise[t.name] || 0) + 1;
    }
    for (const t of partner.locations) {
      if (!filterByContinent || t.continent.name === filterByContinent)
        countries[`${t.emoji} ${t.name}`] = (countries[`${t.emoji} ${t.name}`] || 0) + 1;
    }
    const uniqueContinents = Array.from(new Set(partner.locations.map((t) => t.continent.name)));
    for (const continentName of uniqueContinents) {
      continents[continentName] = (continents[continentName] || 0) + 1;
    }
  }

  return {
    technologies,
    areasOfExpertise,
    countries,
    continents,
  };
}

/**
 * Compute counters for a dropdown named `forDropdown`.
 *
 * Rules:
 *  - To compute options for dropdown D we SHOULD apply all active filters EXCEPT D.
 *  - Special-case: continent and country are hierarchical. When computing continent options
 *    we also ignore the country filter (so continents are computed only based on the other filters).
 *
 * Returns the result of calculateCounters(partnersSubset, countryScopingForCounts)
 */
export function countersForDropdown(
  allPartners: Partner[],
  activeFilters: ActiveFilters,
  forDropdown: FilterKey,
): Counters {
  // Build set of filters that will be enforced: all active filters except `forDropdown`
  const filtersToApply = new Set<FilterKey>(
    (Object.keys(activeFilters) as FilterKey[]).filter((k) => k !== forDropdown),
  );

  // Special hierarchy: computing continent options should ignore country scoping too.
  // That means when forDropdown === 'continent' we do not apply 'country' either.
  if (forDropdown === 'continent') {
    filtersToApply.delete('country');
  }

  const partnersSubset = partnersMatching(allPartners, activeFilters, filtersToApply);

  // If we're computing continent options we must calculate country counts without scoping by continent (pass null)
  const continentScope = forDropdown === 'continent' ? null : activeFilters.continent;

  return calculateCounters(partnersSubset, continentScope);
}

// --- Formatting utilities ---

const sortByCount = (entryA: [string, number], entryB: [string, number]) => {
  if (entryA[1] !== entryB[1]) return entryB[1] - entryA[1];
  return entryA[0].localeCompare(entryB[0]);
};

const toOptionWithCount = (entry: [string, number]) => ({
  value: entry[0],
  label: `${entry[0]} (${entry[1]})`,
});

/**
 * Convert counters to sorted dropdown options with counts
 */
export function countersToOptions(counters: Record<string, number>) {
  return Object.entries(counters).sort(sortByCount).map(toOptionWithCount);
}
