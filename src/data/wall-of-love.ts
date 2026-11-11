import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { BuddyData } from '~/data/features';
import type { CtaBannerData, HeroData } from '~/data/home';

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'Wall of love',
  description:
    'Hear from the developers, agencies and marketing teams who build with DatoCMS: what changed for the better since they switched.',
};

export const hero: HeroData = {
  label: 'Wall of love',
  headline: 'Don’t take our word for it.',
  subheadline: 'Take theirs.',
  face: 'skeptical',
};

// What the face at the right edge of the wall says, at each quarter of the
// quotes. The mood follows the wall: a doubt to start, surprise, a blush, a
// smug look near the end, and a kiss at the end.
export const buddy: BuddyData = {
  lines: [
    { at: 0, face: 'thinking', text: 'Let’s see what they say.' },
    { at: 0.25, face: 'surprised', text: 'Wait, they said that?' },
    { at: 0.5, face: 'grateful', text: 'Okay, I’m blushing.' },
    { at: 0.75, face: 'proud', text: 'Not that I’m counting.' },
    { at: 1, face: 'kiss', text: 'Thank you. All of you.' },
  ],
};

// The banner of the closer, above its video.
export const ctaStart: CtaBannerData = {
  variant: 'light',
  theme: 'purple',
  headline: 'Your turn.',
  muted: 'Start a free project and see what they’re talking about.',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    { label: 'Explore pricing', href: '/pricing', variant: 'soft' },
  ],
};
