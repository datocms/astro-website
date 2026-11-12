/*
 * The partners pages: the index, the showcase of the projects, the page of
 * one partner and the page of one project. The partners and the projects
 * come from the CMS.
 *
 * The technology partners have their own list (`techIndex`) and page
 * (`techPartner`).
 */
import type { HeroData } from '~/data/home';

export const index = {
  seoTitle: 'Solution Partners',
  hero: {
    label: 'Solution partners',
    headline: 'Find the perfect partner to meet',
    subheadline: 'your digital needs',
    intro:
      'Our most successful customers work with a solution partner to accomplish their goals and ship their digital products faster.',
  } satisfies HeroData,
  /** The globe of the countries of the partners, and its list for screen readers. */
  globe: {
    label: 'Countries where our partners are based',
    count: (n: number) => (n === 1 ? '1 partner' : `${n} partners`),
  },
  announce: {
    strong: 'Want to become a DatoCMS partner?',
    text: 'Learn more about our partner program and its benefits.',
    button: 'Partner program',
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
    headline: 'Projects from',
    subheadline: 'our partners',
    intro: 'Check out some of the projects our agency partners have brought to life with DatoCMS.',
  } satisfies HeroData,
  filters: {
    technology: 'Filter by Technology',
    areaOfExpertise: 'Filter by Partner Expertise',
  },
  noResults: 'No projects match your current filters.',
};

export const filterPlaceholder = 'Select…';

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
  testimonials: 'In their words',
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
  viewProfile: 'View profile →',
  services: 'Services',
  technologies: 'Technologies',
};

/** The text of a count of showcase projects. */
export function projectsCountLabel(count: number) {
  if (count === 0) return undefined;
  return count === 1 ? '1 showcase project' : `${count} showcase projects`;
}

export const techIndex = {
  hero: {
    label: 'Ecosystem partners',
    headline: 'Find the right tech partner',
    subheadline: 'for your DatoCMS projects',
    intro: 'We work with the tools you already use.',
  } satisfies HeroData,
};

export const techPartner = {
  kicker: 'DatoCMS Technology Partner',
  seoSuffix: 'Ecosystem Partners',
  visitWebsite: 'Visit website',
  contact: 'Contact',
};
