import type { LogoItem } from '~/components/LogosLine';
import { clientLogos as c } from '~/data/clientLogos';

/** The logos below the message of a thank-you page (Slack, support, agency partner). */
export const thanksLogos = {
  label: 'We power experiences for over half a billion users',
  items: [c.telekom, c.hashicorp, c.verizon, c.polestar, c.vercel] as LogoItem[],
};
