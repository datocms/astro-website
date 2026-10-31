import polestarClient from '~/assets/home/clients/polestar.svg?raw';
import telekomClient from '~/assets/home/clients/deutsche-telekom.svg?raw';
import vercelClient from '~/assets/home/clients/vercel.svg?raw';
import verizonClient from '~/assets/home/clients/verizon.svg?raw';
import hashicorpClient from '~/assets/support/hashicorp.svg?raw';
import type { LogoItem } from '~/components/LogosLine';
import { svgLogo } from '~/data/home';

/** The logos below the message of a thank-you page (Slack, support, agency partner). */
export const thanksLogos = {
  label: 'We power experiences for over half a billion users',
  items: [
    svgLogo(telekomClient, 'Deutsche Telekom'),
    svgLogo(hashicorpClient, 'HashiCorp'),
    svgLogo(verizonClient, 'Verizon'),
    svgLogo(polestarClient, 'Polestar'),
    svgLogo(vercelClient, 'Vercel'),
  ] as LogoItem[],
};
