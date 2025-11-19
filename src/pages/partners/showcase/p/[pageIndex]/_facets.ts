import type { ResultOf } from 'gql.tada';
import type { query } from './_graphql';

type Project = ResultOf<typeof query>['projects'][number];

export type FilterKey = 'technology' | 'areaOfExpertise';

export type ActiveFilters = {
  technology: string | null;
  areaOfExpertise: string | null;
};

export type Counters = {
  technologies: Record<string, number>;
  areasOfExpertise: Record<string, number>;
};

/**
 * Return projects matching only the filters included in `applyFilters`.
 * `applyFilters` is a Set of FilterKey telling the function which active filters to enforce.
 *
 * Example: applyFilters = new Set(['technology']) -> enforce only technology filter
 */
export function projectsMatching(
  projects: Project[],
  activeFilters: ActiveFilters,
  applyFilters: Set<FilterKey>,
) {
  return projects.filter((project) => {
    if (applyFilters.has('technology') && activeFilters.technology) {
      if (!project.technologies?.some((t) => t?.name === activeFilters.technology)) return false;
    }
    if (applyFilters.has('areaOfExpertise') && activeFilters.areaOfExpertise) {
      if (
        !project.partner?.areasOfExpertise?.some((a) => a?.name === activeFilters.areaOfExpertise)
      )
        return false;
    }
    return true;
  });
}

/**
 * Calculate counters for each filter dimension from a set of projects.
 */
export function calculateCounters(projects: Project[]): Counters {
  const technologies: Record<string, number> = {};
  const areasOfExpertise: Record<string, number> = {};

  for (const project of projects) {
    for (const tech of project.technologies || []) {
      if (!tech) continue;
      technologies[tech.name] = (technologies[tech.name] || 0) + 1;
    }

    if (project.partner) {
      for (const area of project.partner.areasOfExpertise || []) {
        if (!area) continue;
        areasOfExpertise[area.name] = (areasOfExpertise[area.name] || 0) + 1;
      }
    }
  }

  return {
    technologies,
    areasOfExpertise,
  };
}

/**
 * Compute counters for a dropdown named `forDropdown`.
 *
 * Rules:
 *  - To compute options for dropdown D we apply all active filters EXCEPT D.
 *
 * Returns the result of calculateCounters(projectsSubset)
 */
export function countersForDropdown(
  allProjects: Project[],
  activeFilters: ActiveFilters,
  forDropdown: FilterKey,
): Counters {
  // Build set of filters that will be enforced: all active filters except `forDropdown`
  const filtersToApply = new Set<FilterKey>(
    (Object.keys(activeFilters) as FilterKey[]).filter((k) => k !== forDropdown),
  );

  const projectsSubset = projectsMatching(allProjects, activeFilters, filtersToApply);

  return calculateCounters(projectsSubset);
}
