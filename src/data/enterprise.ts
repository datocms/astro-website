// The data of /enterprise-headless-cms. The CMS does not hold it. The SEO,
// the H1 label and the three quotes come from the CMS. The marks of
// InlineText (`**bold**`, `[text](/url)`) work in the long texts.
// The pictures of the chapters tell one story: Northwind Group, a company
// with twelve brands (src/scenes/Enterprise/story.ts).

import type { ButtonData } from '~/components/Button';
import type { CategoryNavData } from '~/components/CategoryNav';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { LogoItem } from '~/components/LogosLine';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { CtaBannerData, HeroData } from '~/data/home';
import { svgLogo } from '~/data/home';
import { numbers as developerNumbers } from '~/data/developers-pillar';
import type { FaqData } from '~/data/pricing';
import telekomClient from '~/assets/home/clients/deutsche-telekom.svg?raw';
import mitClient from '~/assets/home/clients/mit.svg?raw';
import vercelClient from '~/assets/home/clients/vercel.svg?raw';
import verizonClient from '~/assets/home/clients/verizon.svg?raw';
import afspSvg from '~/svg/logos/afsp.svg?raw';
import harrysSvg from '~/svg/logos/harrys.svg?raw';
import hashicorpSvg from '~/svg/logos/hashicorp.svg?raw';
import linkedinSvg from '~/svg/logos/linkedin.svg?raw';
import nhsSvg from '~/svg/logos/nhs.svg?raw';
import oberloSvg from '~/svg/logos/oberlo.svg?raw';

/** The height of a drawn logo. LogosLine scales the drawing from it. */
const LOGO_HEIGHT = 40;

/**
 * Make a logo from the SVG file of a single-colour logo that has no
 * client drawing. The logo takes the text colour of its theme. The viewBox
 * gives the ratio of the drawn size.
 */
function logo(svg: string, alt: string): LogoItem {
  const [, , boxWidth = 1, boxHeight = 1] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? '')
    .split(/[\s,]+/)
    .map(Number);
  const width = Math.round((boxWidth / boxHeight) * LOGO_HEIGHT);
  return {
    svg: svg.replace('<svg ', `<svg fill="currentColor" width="${width}" height="${LOGO_HEIGHT}" `),
    alt,
    width,
    height: LOGO_HEIGHT,
  };
}

const docs = (label: string, href: string): ButtonData => ({
  label,
  href,
  variant: 'soft',
});

// New copy. The line of the hero.
export const hero: HeroData & { subtitle: string; logosLabel: string } = {
  headline: 'Big teams, bigger brands, one CMS.',
  subheadline: 'A piece for your peace of mind.',
  face: 'serious',
  subtitle:
    'DatoCMS is a headless CMS with the **governance, service and features your content operation needs to scale**: dedicated onboarding, premium technical support, private cloud and custom SLAs.',
  buttons: [
    { label: 'Talk To Sales', href: '#form', arrow: false },
    {
      label: 'Read Our Security Page',
      href: '/security',
      variant: 'soft',
    },
  ],
  // The accessible name of the logos. It does not show.
  logosLabel: 'We power experiences for some of the most renowned brands',
  logos: [
    svgLogo(telekomClient, 'Deutsche Telekom'),
    logo(hashicorpSvg, 'HashiCorp'),
    svgLogo(verizonClient, 'Verizon'),
    svgLogo(vercelClient, 'Vercel'),
    logo(linkedinSvg, 'LinkedIn'),
    logo(oberloSvg, 'Oberlo'),
    logo(nhsSvg, 'NHS'),
    logo(harrysSvg, "Harry's"),
    svgLogo(mitClient, 'MIT'),
    logo(afspSvg, 'AFSP'),
  ],
};

export const chapterNav: CategoryNavData = {
  items: [
    { label: 'Security', href: '#security' },
    { label: 'Governance', href: '#governance' },
    { label: 'Scale', href: '#scale' },
    { label: 'Support', href: '#support' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#form' },
  ],
};

// Chapter 1: what the security review asks for. Only the facts that the
// owner verified are on this page.
export const security: ChapterLayoutData = {
  id: 'security',
  theme: 'blue',
  chapter: {
    label: 'Security',
    // New copy.
    headline: 'Pass the security review.',
    muted: 'With all questions already answered.',
    // New copy.
    intro:
      'We’re ISO 27001 certified and offer a GDPR data processing agreement. Your data is encrypted in transit and at rest, sharded across servers in the EU (Ireland), and audit logs record who changed what, and when.',
    link: docs('Read Our Security Page', '/security'),
  },
  fragments: [
    {
      // New copy.
      title: 'Sign in with your company account.',
      text: 'Your team signs in to the CMS with the account they already use at work, through your identity provider.',
    },
    {
      // New copy.
      title: 'Connect your identity provider.',
      text: 'SSO with SAML through Okta, OneLogin, Azure AD or any SAML provider, plus SCIM provisioning to add and remove people from your directory.',
    },
    {
      // New copy. A full export of the project on a cron schedule, to the
      // S3 bucket of the customer: the scheduled exports of the old page.
      title: 'Automatic backups to your own bucket.',
      text: 'We export your full project to your own AWS S3 bucket at your chosen schedule, including models, records, assets, menus, plugins and workflows.',
    },
    {
      // New copy.
      title: 'Serve assets from your domain.',
      text: 'Keep assets in your own bucket on AWS S3, Cloudflare R2, Google Cloud Storage or Azure Blob Storage, served from your own domain. Webhooks come from static IPs.',
    },
  ],
};

// Chapter 2: who can do what, and who approves what.
export const governance: ChapterLayoutData = {
  id: 'governance',
  theme: 'purple',
  chapter: {
    label: 'Governance',
    headline: 'Multiple brands?',
    muted: 'No stepping on each other’s toes.',
    // New copy.
    intro:
      'Roles and granular permissions let you decide who can do what, down to the field and locale level. Workflows decide who gets to approve what before anything goes live.',
    link: docs('Read The Docs', '/docs/general-concepts/roles-and-permission-system'),
  },
  fragments: [
    {
      // New copy.
      title: 'A workflow for each brand.',
      text: 'Each brand sets its own steps from draft to published, with approvals wherever you need them.',
    },
    {
      // New copy.
      title: 'White-label the CMS.',
      text: 'Bring your branding to the CMS with your logo, your colors and your domain.',
    },
  ],
};

export const scale: StatementsSectionData = {
  headline: 'Running at scale to match your ambitions.',
  items: [
    {
      title: '250+',
      text: 'content creators',
      href: '/case-studies/polestar',
      description: '**Polestar** runs 35 different roles across 28+ locales.',
    },
    {
      title: '55+',
      text: 'locales from a single project',
      href: '/case-studies/le-pain-quotidien',
      description: '**Le Pain Quotidien** has locations in 20+ countries.',
    },
    {
      title: '2TB',
      text: 'traffic per month',
      href: '/case-studies/hashicorp',
      description: '**HashiCorp** handles 5M API calls a month.',
    },
    {
      title: '50%',
      text: 'faster time-to-market',
      href: '/case-studies/arduino',
      description: '**Arduino** loads 8x faster with 92.5% less code.',
    },
    ...developerNumbers.items,
  ],
};

// Chapter 3: the people.
export const support: ChapterLayoutData = {
  id: 'support',
  theme: 'green',
  chapter: {
    label: 'Support',
    headline: 'Our team on your team.',
    muted: 'Not some ticket queue.',
    // New copy.
    intro:
      'A shared Slack channel, solution architects for your build, and dedicated technical and editorial onboarding, all backed by the SLAs in your contract.',
    link: docs('Talk To Sales', '#form'),
  },
  fragments: [
    {
      // New copy.
      title: 'SLAs in your contract.',
      text: 'A performance SLA with 99.99% uptime, and a support SLA that answers priority-one issues within an hour, around the clock.',
    },
    {
      // New copy. The onboarding of the old page: technical and editorial.
      title: 'Onboarding for each team.',
      text: 'Technical onboarding for your developers and editorial onboarding for your editors, run by the DatoCMS team.',
    },
  ],
};

// New copy. The questions of the security review. Each answer holds only
// verified facts.
export const faq: FaqData = {
  headline: 'Questions your security team will ask.',
  items: [
    {
      question: 'Where is our data stored?',
      answer:
        'On servers in the EU (Ireland), in multiple shards, encrypted in transit and at rest. Database backups are kept for up to 14 days.',
    },
    {
      question: 'Do you have a GDPR data processing agreement?',
      answer: 'Yes. We offer a GDPR DPA, and we’re ISO 27001 certified.',
    },
    {
      question: 'Do you support SSO and SCIM?',
      answer:
        'Yes. SSO works with SAML through Okta, OneLogin, Azure AD or any SAML provider. SCIM adds and removes people as your directory changes.',
    },
    {
      question: 'Can we keep the files in our own storage?',
      answer:
        'Yes. Your assets can live in your own bucket on AWS S3, Cloudflare R2, Google Cloud Storage or Azure Blob Storage, served from your own domain. The CMS can sit on your domain too.',
    },
    {
      question: 'How fast do you answer when something breaks?',
      answer:
        'Priority-one issues are answered within an hour, around the clock. Your team also gets a shared Slack channel with ours.',
    },
    {
      question: 'Can we test a change before it goes live?',
      answer:
        'Yes. Fork a sandbox environment, make the change there, and promote it when it’s ready. A sandbox also works as a backup.',
    },
  ],
};

export const contact = {
  headline: 'Let’s talk',
  description:
    '**Enterprise accounts get a fast lane** for help, feature requests and fixes. **Our team is available in several ways**, whenever you need us.',
};

export const ctaClose: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  // New copy.
  headline: 'A headless CMS that is ready',
  muted: 'to scale with you',
  // CtaBanner prints the subline as plain text: it has no marks.
  subline: 'Your CMS should grow with your company, without extra effort from your team.',
  buttons: [
    { label: 'Talk To Sales', href: '#form', arrow: false },
    { label: 'Explore Pricing', href: '/pricing', variant: 'soft' },
  ],
};
