/*
 * The partners pages: the index, the showcase of the projects, the page of
 * one partner and the page of one project. The partners and the projects
 * come from the CMS.
 */

export const index = {
  seoTitle: 'Solution Partners',
  hero: {
    label: 'Solution Partners',
    headline: 'Find the perfect Partner to meet',
    subheadline: 'your digital needs',
    intro:
      'Our most successful customers work with a Solution Partner to accomplish their goals and ship their digital products faster.',
  },
  mapLabel: 'Map of the countries where our partners are based',
  announce: {
    strong: 'Want to become a DatoCMS Partner?',
    text: 'Learn more about our Partner Program and its benefits!',
    href: '/partner-program',
  },
  filters: {
    continent: 'Filter by Continent',
    country: 'Filter by Country',
    technology: 'Filter by Technology',
    areaOfExpertise: 'Filter by Area of Expertise',
  },
  noResults: 'No partners match your current filters.',
};

export const showcase = {
  seoTitle: 'Partner Projects Showcase',
  hero: {
    label: 'Showcase',
    headline: 'Projects from Our',
    subheadline: 'Partners',
    intro:
      'Check out some of the projects our incredible agency partners have brought to life with DatoCMS.',
  },
  filters: {
    technology: 'Filter by Technology',
    areaOfExpertise: 'Filter by Partner Expertise',
  },
  noResults: 'No projects match your current filters.',
};

export const filterPlaceholder = 'Select...';

export const partner = {
  kicker: 'DatoCMS Agency Partner',
  kickerHref: '/partner-program',
  description: 'Description',
  visitWebsite: 'Visit website',
  contact: 'Contact',
  location: 'Location',
  locations: 'Locations',
  services: 'Services offered',
  technologies: 'Covered technologies',
  chats: 'Behind the Scenes',
  chatsIntro: 'Join us to get familiar with our partners',
  projects: 'Projects showcase',
  plugins: 'Plugins released',
};

export const project = {
  kicker: 'Projects showcase',
  madeBy: 'Made by',
  visitProject: 'Visit project',
  projectShots: 'Project shots',
  backendShots: 'Backend shots',
  about: 'About the project',
  viewProfile: 'View profile »',
  tags: 'Tags',
};

/** The text of a count of showcase projects. */
export function projectsCountLabel(count: number) {
  if (count === 0) return undefined;
  return count === 1 ? '1 showcase project' : `${count} showcase projects`;
}
