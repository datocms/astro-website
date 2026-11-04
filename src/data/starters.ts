/*
 * The starters pages: the index and the page of one starter. The starters
 * come from the CMS.
 */
import type { HeroData } from '~/data/home';

export const seo = {
  title: 'Project starters - Free demo projects',
};

export const hero: HeroData = {
  headline: 'Starters',
  intro: 'Start with a fully configured DatoCMS project, a best-practice frontend and free hosting',
};

export const fullyFledged = {
  headline: 'Fully fledged demos',
  /** HTML: the text has a strong run. */
  body: "Use our pre-built demo projects to see all of DatoCMS's features in a <strong>realistic production-ready setup</strong>. Includes many example content types, and advanced features.",
};

export const techStarters = {
  headline: 'Tech starter kits',
  /** HTML: the text has a strong run. */
  body: 'Kickstart your next project with our <strong>official scaffolds</strong>. They offer all the best practices to integrate DatoCMS with your frontend framework, with minimal content and styling.',
};

export const detail = {
  /** The button clones the project into the account of the visitor and deploys it. */
  start: 'Clone this project for free',
  tocTitle: 'In the README',
  /** The byline of the README sheet: we write the README of each starter. */
  readmeByline: 'Written by DatoCMS',
  facts: {
    technology: 'Technology',
  },
  note: {
    lead: 'Make your own project templates',
    body: 'Start each new site from a setup you already trust. Turn a project into a template, then share a button that clones it and deploys its frontend in one click.',
    /** One line: a label does not wrap. */
    link: 'Read the docs',
    href: '/docs/general-concepts/project-starters-and-templates#generate-a-project-starter-button',
  },
};
