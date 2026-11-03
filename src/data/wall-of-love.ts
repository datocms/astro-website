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
  headline: 'Don’t take our word for it.',
  subheadline: 'Take theirs.',
  face: 'skeptical',
};

// The banner of the closer, above its video.
export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'purple',
  headline: 'Your turn.',
  muted: 'Start a free project and see what they’re talking about.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    { label: 'Explore Pricing', href: '/pricing', variant: 'soft' },
  ],
};
