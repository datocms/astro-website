import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { PlaceholderData } from '~/components/Placeholder';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { CategoryNavData } from '~/data/features';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { FaqData } from '~/data/pricing';

/*
 * Route /enterprise. Added by Ronak (2026-10-26), for review: the whole page
 * is new. Old page: /enterprise-headless-cms. It also holds the trust story
 * that the pillars do not tell (src/data/AGENTS.md, "The pillars"): roles, SSO, SCIM, audit logs,
 * encryption, backups.
 *
 * The rhythm is the one of the pillars: a hero, a chapter nav, chapters as
 * drafts (a header, a box for the frame, the fragments), then the proof and
 * the closer. Facts come from the live enterprise page, /security and the
 * pricing page. (check) marks what nobody has verified yet.
 */

const docs = (label: string, href: string) => ({
  label,
  href,
  appearance: 'deep-on-white' as const,
  variant: 'soft' as const,
});

export const hero: HeroData = {
  label: 'Enterprise',
  headline: 'Big teams, many brands, one CMS.',
  subheadline: 'With the security reviews, the contracts and the people to back it',
  buttons: [
    { label: 'Talk To Sales', href: '/contact', appearance: 'deep-on-white', arrow: false },
    {
      label: 'Read Our Security Page',
      href: '/security',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  ],
};

export const chapterNav: CategoryNavData = {
  items: [
    { label: 'Security', href: '#security' },
    { label: 'Governance', href: '#governance' },
    { label: 'Scale', href: '#scale' },
    { label: 'Support', href: '#support' },
    { label: 'FAQ', href: '#faq' },
  ],
};

export const security: ChapterLayoutData = {
  id: 'security',
  theme: 'blue',
  chapter: {
    label: 'Security',
    headline: 'Pass the security review.',
    muted: 'On the first try.',
    // (check) ISO 27001: the certificate and its scope.
    intro:
      'ISO 27001, a GDPR data processing agreement, encryption at rest and in transit, and the answers to your questionnaire before you send it.',
    link: docs('Read Our Security Page', '/security'),
  },
  scene:
    'The Organization settings of Northwind Group: Single sign-on on with Okta, SCIM provisioning on, 2FA required for every member, and the last audit export.',
  fragments: [
    {
      title: 'Your login, your rules.',
      text: 'SSO with Okta, Azure AD or any SAML provider, and SCIM to add and remove people from your directory.',
      picture:
        'The SSO settings: SAML with Okta, the default role for new people, and the switch Provision with SCIM turned on.',
    },
    {
      title: 'Who did what, and when.',
      text: 'The audit log records every change to content, schema and settings. Export it to your SIEM.',
      picture:
        'The audit log: five rows, a schema change, a role change, two publishes and an API token created, each with a person and a time.',
    },
    {
      // (check) the backup policy and the shards.
      title: 'Backups you don’t think about.',
      text: 'Daily offline backups, data spread over several shards, and monitoring around the clock.',
      picture:
        'A timeline of the last seven days with a backup marker on each, and the status All systems normal.',
    },
    {
      title: 'Your domain, your storage.',
      text: 'The CMS and your assets on your own domains, your files in your own S3 bucket, and static IPs for your webhooks.',
      picture:
        'The project settings: cms.northwind.com, assets.northwind.com, the S3 bucket northwind-media, and the two static IPs of the webhooks.',
    },
  ],
};

export const governance: ChapterLayoutData = {
  id: 'governance',
  theme: 'purple',
  chapter: {
    label: 'Governance',
    headline: 'Twelve brands.',
    muted: 'Nobody steps on anyone.',
    intro:
      'Organizations hold your projects, roles decide who can do what in each one, down to a model, a locale or an environment.',
    link: docs('Read The Docs', '/docs/general-concepts/roles-and-permission-system'),
  },
  scene:
    'The Organization of Northwind Group: twelve brand projects in a grid, each with its team, its plan and its environments.',
  fragments: [
    {
      title: 'Roles down to the field.',
      text: 'The German team edits German, the legal team approves the terms, the agency touches only its landing pages.',
      picture:
        'A custom role, Agency Berlin: Landing pages only, German only, the sandbox only, publish not allowed.',
    },
    {
      title: 'A workflow for each brand.',
      text: 'Each project gets its own steps and its own approvers, and nobody can publish around them.',
      picture:
        'The workflows of two brands side by side: one with Draft and Approved, the other with Draft, Legal, Brand and Approved.',
    },
    {
      title: 'Your content, on your schedule.',
      text: 'Scheduled exports of every project to your own S3, for your archive, your lawyers and your data team.',
      picture:
        'The export schedule: every night at 02:00, to s3://northwind-archive, the last one 6 hours ago, 4.2 GB.',
    },
    {
      title: 'Your brand on the CMS.',
      text: 'White-label the CMS with your logo, your colours and your domain, for your teams or your clients.',
      picture: 'The login page of the CMS in Northwind’s colours and logo, at cms.northwind.com.',
    },
  ],
};

// The proof, in numbers. (check) each one: the live enterprise page.
export const scale: StatementsSectionData = {
  headline: 'Already running at your size.',
  items: [
    { title: '2 TB', text: 'A month at HashiCorp' },
    { title: '38K', text: 'Assets at Oberlo' },
    { title: '35K', text: 'Users at Vercel' },
    { title: '99.99%', text: 'Uptime, in the SLA' },
  ],
};

export const support: ChapterLayoutData = {
  id: 'support',
  theme: 'green',
  chapter: {
    label: 'Support',
    headline: 'A team on your team.',
    muted: 'Not a ticket number.',
    intro:
      'A shared Slack channel, a solution architect for the build, and onboarding for your developers and your editors. With SLAs in the contract.',
    link: docs('Talk To Sales', '/contact'),
  },
  scene:
    'A shared Slack channel between Northwind and DatoCMS: a question about a migration, and the answer from a solution architect eight minutes later.',
  fragments: [
    {
      title: 'Help with the build.',
      text: 'A solution architect reviews your models, your migration plan and your delivery setup before you go live.',
      picture:
        'A schema review: the models of Northwind with three comments of the solution architect pinned on them.',
    },
    {
      title: 'Training for both sides.',
      text: 'Technical onboarding for the developers, editorial onboarding for the people who write in it every day.',
      picture:
        'Two calendar invites: Technical onboarding, 2 hours, and Editorial onboarding, 1 hour, with the names of both teams.',
    },
    {
      // (check) the hours and the response times of each SLA.
      title: 'SLAs, in writing.',
      text: 'Uptime and response times in your contract, with 24/7 priority support when it matters.',
      picture:
        'The SLA table of a contract: uptime 99.99%, priority one answered in one hour, around the clock.',
    },
    {
      title: 'Your last migration.',
      text: 'We help you move from your old CMS: the content, the assets, the redirects, and a plan your team can follow.',
      picture:
        'A migration plan in three columns: from WordPress, to DatoCMS, with the content types mapped to models.',
    },
  ],
};

// No quote is copied here until it is found in the case studies.
export const quotes: PlaceholderData = {
  name: 'Closing quotes',
  intent: 'Two enterprise customers say it in their own words, each linked to their case study.',
  fields: [
    {
      label: 'Quotes',
      value: [
        [
          { label: 'Quote', value: 'To find: HashiCorp, the live enterprise page.' },
          { label: 'Case study', value: '/case-studies/hashicorp' },
        ],
        [
          {
            label: 'Quote',
            value: 'To find: Commerce Layer or Stackbit, the live enterprise page.',
          },
          { label: 'Case study', value: '/case-studies' },
        ],
      ],
    },
  ],
};

export const faq: FaqData = {
  headline: 'The questions your security team will ask.',
  items: [
    {
      question: 'Where is our data stored?',
      // (check) the regions and the subprocessors.
      answer:
        'In the EU by default, encrypted at rest and in transit. Our security page lists every subprocessor.',
    },
    {
      question: 'Can we sign our own DPA?',
      answer:
        'Yes. We have a GDPR data processing agreement ready, and our legal team reads yours.',
    },
    {
      question: 'Do you support SSO and SCIM?',
      answer:
        'Yes, with any SAML provider. SCIM adds and removes people as your directory changes.',
    },
    {
      question: 'Can we keep the files in our own storage?',
      answer: 'Yes. Your assets can live in your own S3 bucket, on your own domain.',
    },
    {
      question: 'How do we try it before we sign?',
      answer:
        'Start a project on the free plan today, or ask us for a trial of the enterprise features with your own SSO.',
    },
  ],
};

export const ctaTalk: CtaBannerData = {
  variant: 'light',
  theme: 'blue',
  headline: 'Tell us about your setup.',
  muted: 'We’ll tell you what moves, and how.',
  buttons: [
    { label: 'Talk To Sales', href: '/contact', appearance: 'deep-on-light', arrow: false },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-light', variant: 'soft' },
  ],
};
