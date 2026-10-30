import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { QuoteData, StatementData } from '~/data/case-studies';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { CategoryNavData } from '~/data/features';

/*
 * Route /editor-experience: the Editing pillar page (src/data/AGENTS.md, "The pillars").
 * It holds seven chapters: Structured content, Visual editing, Dynamic
 * layouts, Localization, Workflows, Collaboration and versions, SEO.
 *
 * The copy of each chapter lives in its own file (structured-content.ts,
 * visual-editing-chapter.ts, dynamic-layouts.ts, localization.ts,
 * workflows.ts, collaboration.ts, seo.ts). This file holds the hero, the
 * opinion between the chapters and the closer.
 *
 * Facts come from the old feature pages, the feature list
 * (src/data/features.ts) and the docs pages that the chapters link.
 */

// New copy. The hero is about the pillar, not about one chapter.
export const hero: HeroData = {
  label: 'Editor experience',
  headline: 'Comfortable to write in. Predictable to build on.',
  subheadline: 'Editors get a calm place to write, developers get structured content',
  face: '[**]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    { label: 'Talk To Sales', href: '/contact', appearance: 'deep-on-white', variant: 'soft' },
  ],
};

// The chapter nav under the hero: one item for each chapter, in page order.
// The href is the id of the chapter.
export const chapterNav: CategoryNavData = {
  items: [
    { label: 'Visual editing', href: '#visual-editing' },
    { label: 'Dynamic layouts', href: '#dynamic-layouts' },
    { label: 'Localization', href: '#localization' },
    { label: 'Structured Text', href: '#structured-content' },
    { label: 'Workflows', href: '#workflows' },
    { label: 'Collaboration and versions', href: '#collaboration' },
    { label: 'SEO', href: '#seo' },
  ],
};

// New copy. The one opinion of the page, between chapter 3 (Localization)
// and chapter 4 (Structured Text).
// The label is the muted lead-in of the statement.
export const opinion: StatementData = {
  label: 'Same content, two kinds of happy.',
  text: 'Editors want to write without thinking about structure. Developers want structure without reading prose. We keep both promises in the same field.',
};

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'Editor experience',
  description:
    'Editors get a calm place to write, developers get structured content. Visual editing, dynamic layouts, localization, workflows, collaboration and SEO in one editor.',
};

// The closer: the fallback of the quote of the CMS review (see
// src/pages/editor-experience/_graphql.ts). The page uses the CMS text.
export const closing: QuoteData = {
  quote:
    '“This is precisely what I want: a CMS that’s been built by an agency because they know what my clients need.”',
  name: 'Marc Ammann',
  role: 'CEO, Matter Supply Co.',
};

export const ctaDemo: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'The editor explains itself better than we can.',
  muted: 'Start a free project, or try the demo first.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    {
      label: 'Try The Demo',
      href: 'https://try.datocms.com',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};
