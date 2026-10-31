import type { CtaBannerData } from '~/data/home';

/*
 * The research program page. The steps and the questions come from the
 * CMS (researchProgramPage). The button labels and the link come from the
 * CMS too.
 */

export const hero = {
  label: 'Research Program',
  headline: 'Contribute to the evolution of DatoCMS',
  subheadline:
    'Become a part of the DatoCMS Research Program and be the first to know what we are working on, try out innovative concepts, offer your feedback and help optimize DatoCMS for your needs.',
};

export const steps = {
  title: 'How does it work?',
  muted: 'Register to our Research Program, participate to our studies, get rewarded!',
};

export const faqTitle = 'Frequently Asked Questions';

/** The button of the closing banner is added by the page: its label and link come from the CMS. */
export const closing: Omit<CtaBannerData, 'buttons'> = {
  variant: 'subtle',
  headline: 'Have a say',
  muted: 'in what we build next!',
  subline:
    'Every study shapes our roadmap. Sign up once, join only when it fits your schedule, and get rewarded each time you take part.',
};
