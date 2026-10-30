import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ButtonData, CaseStudiesData, CtaBannerData, HeroData } from '~/data/home';

export interface QuoteData {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
}

export const hero: HeroData = {
  label: 'Case Studies',
  headline: 'Cream of the crop.',
  subheadline: 'See how teams have used DatoCMS to build successful digital experiences',
  face: '[•ᴗ•]',
  buttons: [
    {
      label: 'Let’s Talk!',
      href: '/contact',
      appearance: 'deep-on-light',
      arrow: false,
      leading: 'userpic',
      leadingImages: [{ src: '/images/home/userpic-talk.png' }],
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};

/* The button of the highlight story. The page gives the link. */
export const featuredButton: Omit<ButtonData, 'href'> = {
  label: 'Learn More',
  appearance: 'deep-on-white',
  variant: 'soft',
};

/* The quote when the CMS does not give the testimonial. */
export const quote: QuoteData = {
  quote:
    '“DatoCMS is fast, flexible and a pleasure to use – for both our clients and our developers. It’s become an essential tool for us.”',
  name: 'Tim Chesney',
  role: 'Director at Make',
  avatar: '/images/case-studies/tim-chesney.png',
};

export const ctaBuild: CtaBannerData = {
  variant: 'dark',
  theme: 'orange',
  headline: 'Want to build faster?',
  muted: 'Every feature is built around real customer insights and needs [•ᴗ•]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'light-on-deep',
      arrow: false,
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'light-on-deep', variant: 'soft' },
  ],
};

export interface CaseStudyFact {
  label: string;
  values: string[];
}

export interface CaseStudyBodyData {
  title: string;
  paragraphs: string[];
  facts: CaseStudyFact[];
}

export interface StatementData {
  label: string;
  text: string;
}

export interface ChallengeSolutionData {
  challenge: StatementData;
  solution: StatementData;
}

export interface VideoCardData {
  image: { src: string; alt: string; width: number; height: number };
  href?: string;
}

export interface VideoSectionData {
  eyebrow: string;
  headline: string;
  image: { src: string; alt: string; width: number; height: number };
  video: { src: string };
}

// The overview of the visual-editing and editor-experience-figma pages.
// The design uses the Polestar copy for the body text.
export const arduino: { body: CaseStudyBodyData } = {
  body: {
    title: 'Why DatoCMS?',
    paragraphs: [
      'Creating the perfect tech stack for the perfect car — that was the brief. Polestar, leveraging the expertise of Swedish agencies Stendalhs and Humblebee, set their eyes on DatoCMS, with the prospect that the CMS could grow alongside them over time. As the Swedish manufacturer started to showcase and sell their high performance electrical cars across an expanding number of markets, they needed the possibility to scale their team and content operations across the various markets in which a Polestar is available to buy. Demand for Polestar and the team managing their digital presence sky-rocketed. DatoCMS was there to grow together with the Polestar team every step of the way, ensuring a seamless scaling of locales, users, and workflows, as well as a number of custom developments tailored to their needs.',
      'Plugins, one of DatoCMS’s unsung hero features, has been central to Polestar’s stunning website and its continued evolution. The digital team created over 40 custom made plugins to manage products and assets across different markets and languages, ensuring nothing gets published by mistake and every market receives a locally relevant experience.',
    ],
    facts: [
      { label: 'Project', values: ['arduino.cc'] },
      { label: 'Industry', values: ['Technology'] },
      { label: 'Use case', values: ['Knowledge Management'] },
      { label: 'Solved', values: ['Technology', 'Legacy CMS', 'Slow launches', 'Code bloat'] },
      {
        label: 'Key Features',
        values: ['Headless CMS', 'GraphQL', 'Modular Blocks', 'Workflow CMS'],
      },
      { label: 'Partner', values: ['Cantiere Creativo'] },
    ],
  },
};

export const moreCaseStudies: CaseStudiesData = {
  headline: 'Cool work, alongside cool people.',
  subheadline: 'Explore more case studies to see how different teams work with DatoCMS at scale.',
};

export const ctaBuildShort: CtaBannerData = { ...ctaBuild, muted: undefined };
