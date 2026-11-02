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
  appearance: 'deep-on-white',
  variant: 'soft',
});

// New copy. The line of the hero.
export const hero: HeroData & { subtitle: string; logosLabel: string } = {
  headline: 'Big teams, many brands, one CMS.',
  subheadline: 'With the security reviews, the contracts and the people to back it',
  subtitle:
    'A complete headless CMS with the **governance, service and features to ensure you take your content machine to scale**. Dedicated onboarding service, premium technical support, private cloud and custom SLAs',
  buttons: [
    { label: 'Talk To Sales', href: '#form', appearance: 'deep-on-white', arrow: false },
    {
      label: 'Read Our Security Page',
      href: '/security',
      appearance: 'deep-on-white',
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
    muted: 'With the answers ready.',
    // New copy.
    intro:
      'ISO 27001 certified, with a GDPR data processing agreement. Data is encrypted in transit and at rest, in multiple shards on servers in the EU (Ireland). An audit log records who made each change, and when.',
    link: docs('Read Our Security Page', '/security'),
  },
  // New copy.
  scene:
    'The audit log of Northwind Group: ten events of one morning, each with its time, its author, the action, the path, the environment and the role of the author: stage moves, a role change, publishes, an environment promoted, a model change, the single sign-on settings, a workflow, an API token and the white-label settings. (Built.)',
  fragments: [
    {
      // New copy.
      title: 'Your login, your rules.',
      text: 'Your team signs in to the CMS with the company account, through your identity provider.',
      picture:
        'The sign-in page of the CMS of Northwind Group, with its logo: the email and the password, then the button "Log in with single sign-on". (Built.)',
    },
    {
      // New copy.
      title: 'Connect your identity provider.',
      text: 'SSO with SAML through Okta, OneLogin, Azure AD or any SAML provider, and SCIM provisioning to add and remove people from your directory.',
      picture:
        'The single sign-on settings of Northwind Group: the SAML values of DatoCMS, the metadata URL of the Okta app, the SCIM base URL with its new API token, and Editor as the default role. (Built.)',
    },
    {
      // New copy. A full export of the project on a cron schedule, to the
      // S3 bucket of the customer: the scheduled exports of the old page.
      title: 'Backups you don’t think about.',
      text: 'A full export of your project on the schedule you choose, to your own AWS S3 bucket: models, records, assets, menus, plugins and workflows.',
      picture:
        'A diagram: the schedule (every night at 02:00) starts the export, each part of the project of Northwind Group (models, records, assets, menus, plugins, workflows) is exported and gets a check, then the archive goes along a track to the bucket s3://northwind-backups. (Built.)',
    },
    {
      // New copy.
      title: 'Your domain, your storage.',
      text: 'Assets in your own bucket on AWS S3, Cloudflare R2, Google Cloud Storage or Azure Blob Storage, on your own domain. Static IPs for webhooks.',
      picture:
        'A diagram: the assets of Northwind Group go along a track to the bucket northwind-media, and the file is served from assets.northwind.com. (Built.)',
    },
  ],
};

// Chapter 2: who can do what, and who approves what.
export const governance: ChapterLayoutData = {
  id: 'governance',
  theme: 'purple',
  chapter: {
    label: 'Governance',
    headline: 'Twelve brands.',
    muted: 'Nobody steps on anyone.',
    // New copy.
    intro:
      'Roles decide who can do what, down to the field and the locale. Workflows decide who approves it before it goes live.',
    link: docs('Read The Docs', '/docs/general-concepts/roles-and-permission-system'),
  },
  // The frame is two custom roles, each with its record permissions
  // (built: src/scenes/Enterprise/Roles.astro).
  scene:
    'Two custom roles side by side: Agency Berlin (edits in German, sends to Legal, cannot publish) and Legal team (moves records from Legal to Brand, cannot edit content). (Built.)',
  fragments: [
    {
      // New copy.
      title: 'A workflow for each brand.',
      text: 'Each brand sets its own steps, from draft to published, with an approval at each step that needs one.',
      picture:
        'The stages of the workflow of one brand: Draft, Legal, Brand and Approved. (Built.)',
    },
    {
      // New copy.
      title: 'Your brand on the CMS.',
      text: 'White-label the CMS with your logo, your colors, and your domain.',
      picture:
        'A browser window at cms.northwind.com: the record editor of the CMS with the logo of Northwind in the navigation bar and the interface in the green of the brand. (Built.)',
    },
  ],
};

// The proof, in numbers. The three results are from the old page, with their
// descriptions and links.
export const scale: StatementsSectionData = {
  // New copy.
  headline: 'Already running at your size.',
  items: [
    {
      title: '38k',
      text: 'migrated assets',
      href: '/case-studies/oberlo',
      description:
        '**Oberlo** was able to switch to DatoCMS painlessly, offering blinding speed and an intuitive editing process.',
    },
    {
      title: '2TB',
      text: 'traffic per month',
      href: '/case-studies/hashicorp',
      description:
        '**HashiCorp** needed a flexible and secure enterprise headless CMS to manage its ever-expanding multi-site structure.',
    },
    {
      title: '35k',
      text: 'users',
      description:
        '**Vercel** hosted its [Next.js international conference](/blog/how-datocms-supports-next-js-conf) on DatoCMS.',
    },
    // New copy.
    { title: '99.99%', text: 'uptime, in the SLA' },
  ],
};

// Chapter 3: the people.
export const support: ChapterLayoutData = {
  id: 'support',
  theme: 'green',
  chapter: {
    label: 'Support',
    headline: 'A team on your team.',
    muted: 'Not a ticket number.',
    // New copy.
    intro:
      'A shared Slack channel, solution architects for your build, and dedicated technical and editorial onboarding. With the SLAs in your contract.',
    link: docs('Talk To Sales', '#form'),
  },
  // New copy.
  scene:
    'A shared Slack channel between Northwind Group and DatoCMS: a developer of Northwind asks about the model of a landing page, and Marcelo Finamor of the DatoCMS support answers in the thread. (Built.)',
  fragments: [
    {
      // New copy.
      title: 'SLAs, in writing.',
      text: 'A performance SLA with 99.99% uptime, and a support SLA that answers priority-one issues in one hour, around the clock.',
      picture:
        'The SLA table of a contract: uptime 99.99%, priority one answered in one hour, around the clock. (Built.)',
    },
    {
      title: 'Sandboxes for testing and backups.',
      text: 'Fork a sandbox to test changes or keep a backup, then promote it when it is ready.',
      picture:
        'The graph of the environments of the chapter Environments of /developers: the primary and a sandbox that forks from it and is promoted. (Built, reused.)',
    },
  ],
};

// New copy. The questions of the security review. Each answer holds only
// verified facts.
export const faq: FaqData = {
  headline: 'The questions your security team will ask.',
  items: [
    {
      question: 'Where is our data stored?',
      answer:
        'On servers in the EU (Ireland), in multiple shards, encrypted in transit and at rest. Database backups are kept up to 14 days.',
    },
    {
      question: 'Do you have a GDPR data processing agreement?',
      answer: 'Yes. We have a GDPR DPA, and we are certified ISO 27001.',
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
        'Priority-one issues are answered in one hour, around the clock. Your team also gets a shared Slack channel with ours.',
    },
    {
      question: 'Can we test a change before it goes live?',
      answer:
        'Yes. Fork a sandbox environment, make the change there, and promote it when it is ready. A sandbox also works as a backup.',
    },
  ],
};

export const contact = {
  headline: 'Talk with us',
  description:
    '**Quick and efficient support** is essential for an enterprise headless CMS. Enterprise accounts are put on a fast lane when it comes to providing help, feature requests and fixes of any kind. **Our experts are available in a number of ways**, any time that you need us.',
};

export const ctaClose: CtaBannerData = {
  variant: 'light',
  theme: 'orange',
  // New copy.
  headline: 'A headless CMS that is ready',
  muted: 'to scale with you',
  // CtaBanner prints the subline as plain text: it has no marks.
  subline: 'An enterprise CMS has to scale with your company without extra effort.',
  buttons: [
    { label: 'Talk To Sales', href: '#form', appearance: 'deep-on-light', arrow: false },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};
