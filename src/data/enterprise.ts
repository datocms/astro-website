// The data of /enterprise-headless-cms. The CMS does not hold it. The SEO,
// the H1 label and the three quotes come from the CMS. The marks of
// InlineText (`**bold**`, `[text](/url)`) work in the long texts.

import type { LogoItem } from '~/components/LogosLine';
import type { SplitPointsData } from '~/components/SplitPoints';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { QuoteData } from '~/data/case-studies';
import type { Theme } from '~/lib/theme';
import afspSvg from '~/svg/logos/afsp.svg?raw';
import telekomSvg from '~/svg/logos/deutsche-telekom.svg?raw';
import harrysSvg from '~/svg/logos/harrys.svg?raw';
import hashicorpSvg from '~/svg/logos/hashicorp.svg?raw';
import linkedinSvg from '~/svg/logos/linkedin.svg?raw';
import mitSvg from '~/svg/logos/mit.svg?raw';
import nhsSvg from '~/svg/logos/nhs.svg?raw';
import oberloSvg from '~/svg/logos/oberlo.svg?raw';
import vercelSvg from '~/svg/logos/vercel.svg?raw';
import verizonSvg from '~/svg/logos/verizon.svg?raw';

/** The height of a drawn logo. LogosLine scales the drawing from it. */
const LOGO_HEIGHT = 40;

/**
 * Make a logo from the SVG file of a single-colour logo. The logo takes the
 * text colour of its theme. The viewBox gives the ratio of the drawn size.
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

export const hero = {
  headline: 'Enterprise grade content infrastructure,',
  subheadline: 'security and scalability',
  subtitle:
    'A complete headless CMS with the **governance, service and features to ensure you take your content machine to scale**. Dedicated onboarding service, premium technical support, private cloud and custom SLAs',
};

export const logos = {
  title: 'We power experiences for some of the most renowned brands',
  items: [
    logo(telekomSvg, 'Deutsche Telekom'),
    logo(hashicorpSvg, 'HashiCorp'),
    logo(verizonSvg, 'Verizon'),
    logo(vercelSvg, 'Vercel'),
    logo(linkedinSvg, 'LinkedIn'),
    logo(oberloSvg, 'Oberlo'),
    logo(nhsSvg, 'NHS'),
    logo(harrysSvg, "Harry's"),
    logo(mitSvg, 'MIT'),
    logo(afspSvg, 'AFSP'),
  ],
};

export interface EnterpriseStrip extends SplitPointsData {
  theme: Theme;
  background: 'default' | 'accent-faint';
}

export const security: EnterpriseStrip = {
  theme: 'blue',
  background: 'default',
  kicker: 'Safest enterprise headless CMS',
  title: 'Robust data security, privacy and compliance',
  description:
    '**Security** and data integrity informs all our decisions. Enterprise headless CMS customers can rely on us to ensure their **data is safe and remains secure**',
  points: [
    {
      title: 'Single Sign-On',
      text: 'Manage access to DatoCMS through your preferred identity provider.',
    },
    {
      title: 'Decoupled Data Storage',
      text: 'Data is stored in multiple shards to guarantee performance, integrity and safety.',
    },
    {
      title: 'ISO 27001 and GDPR Compliance',
      text: 'We have a GDPR DPA and have been officially certified as ISO 27001 compliant.',
    },
  ],
};

export const performance: EnterpriseStrip = {
  theme: 'green',
  background: 'default',
  kicker: 'Performance and scalability guaranteed',
  title: 'We are here to ensure your content has no limits',
  description:
    'Customers of our enterprise headless CMS benefit from performance and service SLAs to ensure they can **scale without lag**.',
  points: [
    {
      title: 'Performance SLA',
      text: 'Full support with dedicated priority 24/7 guaranteed.',
    },
    {
      title: 'Support SLA',
      text: 'We tailor solutions to any specific use-case with real-time scaling.',
    },
    {
      title: 'Solution Architects',
      text: 'We assist companies in their journey to scale, from bottom to top.',
    },
  ],
};

export const support: EnterpriseStrip = {
  theme: 'pink',
  background: 'default',
  kicker: 'Support with a smile',
  title: 'Extend your team with support that works with you',
  description:
    'DatoCMS enterprise customers can rely on a **friendly team that helps all the way**.',
  points: [
    {
      title: 'Shared Slack channel',
      text: 'Involve the whole team with a dedicated Slack channel.',
    },
    {
      title: 'Dedicated Technical & Editorial Onboarding',
      text: 'Add a DatoCMS integration expert to your project to help you jumpstart your architecture and get running faster.',
    },
    {
      title: 'Multiple sandbox environments for testing and backups',
      text: 'DatoCMS has the best solution on the market for managing backups and progress.',
    },
  ],
};

export const governance: EnterpriseStrip = {
  theme: 'purple',
  background: 'default',
  kicker: 'Best CMS for enterprise',
  title: 'Give your team full accountability and governance control',
  description:
    'DatoCMS enterprise customers can enjoy features and structures that **empower their content business.**',
  points: [
    {
      title: 'Bespoke workflows',
      text: 'Set up a precise state machine to bring a draft content up to the final publication through a series of intermediate, fully customizable approval steps.',
    },
    {
      title: 'Enhanced per locale permissions & granular roles',
      text: 'Assign the appropriate roles and permissions, even per locale, to your team members, precisely determining what actions they can perform.',
    },
    {
      title: 'Scheduled Exports',
      text: 'Periodically export all your models, records, and assets into your AWS S3 bucket.',
    },
  ],
};

/**
 * The quotes are reviews of the CMS (by name). The name and the role of
 * the fallback show only when the review has none.
 */
export const quotes: Record<'security' | 'performance' | 'support', QuoteData> = {
  security: { quote: '', name: 'Jeff Escalante', role: '' },
  performance: { quote: '', name: 'Dan Barak', role: '' },
  support: { quote: '', name: 'Filippo Conforti', role: '' },
};

export const contact = {
  headline: 'Talk with us',
  description:
    '**Quick and efficient support** is essential for an enterprise headless CMS. Enterprise accounts are put on a fast lane when it comes to providing help, feature requests and fixes of any kind. **Our experts are available in a number of ways**, any time that you need us.',
};

export const results: StatementsSectionData & { label: string } = {
  label: 'A CMS that empowers all team',
  headline: 'A technology investment that doubles performance and productivity',
  theme: 'orange',
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
  ],
};

export const closer = {
  label: 'Enterprise headless CMS',
  title: 'A headless CMS that is ready to scale with you',
  text: 'The best CMS for enterprise is one that can **scale with your company with minimal effort**. DatoCMS offers the services and support that lets your website reach different market segments and grow with your needs.',
};
