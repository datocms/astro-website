import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { StatementData } from '~/components/Statement';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { CategoryNavData } from '~/components/CategoryNav';

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

// The hero is about the pillar, not about one chapter.
export const hero: HeroData = {
  label: 'Editor experience',
  headline: 'Familiar to write in. Predictable to build on.',
  subheadline: 'Editors get a calm place to write. Developers get structure',
  face: 'relaxed',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    { label: 'Talk to sales', href: '/contact', variant: 'soft', contact: 'sales' },
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

// The one opinion of the page, after chapter 4 (Structured Text):
// "one field" is the Structured Text field. It has the theme of that chapter.
// The label is the muted lead-in of the statement.
export const opinion: StatementData = {
  label: 'Same content, two kinds of happy.',
  text: 'Editors want to write without thinking about structure. Developers want structure without reading prose. One field keeps both of them happy.',
};

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'Editor experience',
  description:
    'Editors get a calm place to write, developers get structured content. Visual editing, dynamic layouts, localization, workflows, collaboration, and SEO in one editor.',
};

export const ctaDemo: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  headline: 'The editor explains itself better than we can.',
  muted: 'Start a free project, or try the demo first.',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    {
      label: 'Try the demo',
      href: 'https://try.datocms.com',
      variant: 'soft',
    },
  ],
};
