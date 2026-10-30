import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { CtaBannerData, HeroData } from '~/data/home';

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'Wall of love',
  description:
    'Hear from the developers, agencies and marketing teams who build with DatoCMS: what changed for the better since they switched.',
};

export const hero: HeroData = {
  label: 'Wall Of Love',
  headline: "If you've got something nice to say...",
  subheadline: 'Fortunately, many of our customers did',
  face: '[~ᴗ~]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
  ],
};

// 5 placeholder pictures serve all the people.
export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'purple',
  headline: 'Start building.',
  muted: 'Explore DatoCMS and never look back.',
  buttons: [
    {
      label: 'Get Started For Free',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
  ],
};
