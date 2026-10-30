import type { HeroData } from '~/data/home';
import type { Theme } from '~/lib/theme';

export interface Principle {
  title: string;
  text: string;
  theme: Theme;
  /** Makes the title a link. Not in the prototype. */
  href?: string;
}

export interface PrinciplesData {
  principles: Principle[];
}

export const hero: HeroData = {
  label: 'Philosophy',
  headline: 'Built on our terms. Used on yours.',
  subheadline:
    'We have strong opinions about what makes a CMS brilliant and reliable for the people using it. Every day, we try to live up to them',
  face: '[•✓•]',
};

// The body of 07 is a copy of the body of 05, and 08 is marked
// "Needs copy input". Both are placeholders.
export const principles: PrinciplesData = {
  principles: [
    {
      title: 'DatoCMS operates purely on our customers’ subscriptions.',
      text: 'No debt, no investor pressure. Maybe just the pressure to give our customers a CMS that enables them to build thoughtful, capable infrastructure.',
      theme: 'green',
    },
    {
      title:
        '“Infrastructure” is the underlying foundation or basic framework of a system or organization.',
      text: 'Building foundational infrastructure means thinking about the long-term. That is why we’re there at the start and plan to stay to the very end. We build strong relationships with our clients and stay close as their projects evolve.',
      theme: 'green',
    },
    {
      title: 'We don’t try to tame AI here.',
      text: 'We let it shine. Instead of locking you into integrations that cost us a fortune and drive up your subscription, we let you bring your own AI and keep the freedom to change your mind. As the AI race heats up, we know that’s bound to happen.',
      theme: 'default',
    },
    {
      title: 'Linear and transparent pricing is more than an approach to us.',
      text: 'It’s a conviction about how to operate in a field that consistently punishes you for growth. No scary jumps, just predictable pricing that lets you keep growing without giving up control.',
      theme: 'default',
    },
    {
      title: 'With roots in agency, we had to work with CMSes of all shapes and sizes.',
      text: 'We knew where things got stuck, where they didn’t quite work for the people actually using them and built DatoCMS deliberately to handle the complexity real work demands.',
      theme: 'default',
    },
    {
      title:
        'We enjoy real conversations with real people, so our customer support is handled by the team actually building the CMS.',
      text: 'Sometimes customers come to us to think through development. Other times, they just need an answer. We care about both just as much.',
      theme: 'default',
    },
    {
      title: 'Deeply invested in human and machine, we believe in profit sharing.',
      text: 'We knew where things got stuck, where they didn’t quite work for the people actually using them and built DatoCMS deliberately to handle the complexity real work demands.',
      theme: 'blue',
      href: '/company/profit-sharing',
    },
    {
      title: 'European.',
      text: 'Everybody will have different things that come to mind or that they associate with Europe. For us it’s mainly the vibes.',
      theme: 'blue',
    },
  ],
};
