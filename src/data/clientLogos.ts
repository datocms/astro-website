// The logos of our clients, for the logo lines (LogosLine).

import type { LogoItem } from '~/components/LogosLine';
import afspSvg from '~/svg/logos/afsp.svg?raw';
import arduinoSvg from '~/svg/logos/arduino.svg?raw';
import freitagSvg from '~/svg/logos/freitag.svg?raw';
import harrysSvg from '~/svg/logos/harrys.svg?raw';
import hashicorpSvg from '~/svg/logos/hashicorp.svg?raw';
import linkedinSvg from '~/svg/logos/linkedin.svg?raw';
import lofficielSvg from '~/svg/logos/lofficiel.svg?raw';
import mitSvg from '~/svg/logos/mit.svg?raw';
import netflixSvg from '~/svg/logos/netflix.svg?raw';
import nhsSvg from '~/svg/logos/nhs.svg?raw';
import oberloSvg from '~/svg/logos/oberlo.svg?raw';
import payfitSvg from '~/svg/logos/payfit.svg?raw';
import polestarSvg from '~/svg/logos/polestar.svg?raw';
import ricolaSvg from '~/svg/logos/ricola.svg?raw';
import satispaySvg from '~/svg/logos/satispay.svg?raw';
import telekomSvg from '~/svg/logos/deutsche-telekom.svg?raw';
import vercelSvg from '~/svg/logos/vercel.svg?raw';
import verizonSvg from '~/svg/logos/verizon.svg?raw';
import wildSvg from '~/svg/logos/wild.svg?raw';

/**
 * Make a logo from the SVG file of a single-colour logo. The logo takes
 * the text colour of its theme. `height` is the drawn height in a 40px
 * line: LogosLine scales the drawing from it. Each logo has its own
 * height, thus all the logos look equally large. The viewBox gives the
 * width.
 */
function logo(svg: string, alt: string, height: number): LogoItem {
  const [, , boxWidth = 1, boxHeight = 1] = (svg.match(/viewBox="([^"]+)"/)?.[1] ?? '')
    .split(/[\s,]+/)
    .map(Number);
  const width = Math.round((boxWidth / boxHeight) * height);
  // Many files use the same ids (`_clip1`, `a`). In one HTML page, the
  // first id wins, and the other logos then use the wrong clip path. Thus
  // put the name of the logo before each id.
  const prefix = `logo-${alt.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-`;
  const root = svg
    // Remove the XML declaration and the doctype: the markup goes into HTML.
    .replace(/<\?xml[^>]*>\s*/, '')
    .replace(/<!DOCTYPE[^>]*>\s*/, '')
    .trim()
    .replace(/\bid="([^"]+)"/g, `id="${prefix}$1"`)
    .replace(/url\(#([^)]+)\)/g, `url(#${prefix}$1)`)
    // Remove the size and the fill of the file. The size comes from
    // `height`. The fill is the text colour.
    .replace(/<svg\b[^>]*>/, (tag) => tag.replace(/\s(width|height|fill)="[^"]*"/g, ''));
  return {
    svg: root.replace('<svg ', `<svg fill="currentColor" width="${width}" height="${height}" `),
    alt,
    width,
    height,
  };
}

export const clientLogos = {
  afsp: logo(afspSvg, 'AFSP', 40),
  arduino: logo(arduinoSvg, 'Arduino', 24),
  freitag: logo(freitagSvg, 'Freitag', 38),
  harrys: logo(harrysSvg, 'Harry’s', 20),
  hashicorp: logo(hashicorpSvg, 'HashiCorp', 34),
  linkedin: logo(linkedinSvg, 'LinkedIn', 34),
  lofficiel: logo(lofficielSvg, 'L’Officiel', 36),
  mit: logo(mitSvg, 'MIT', 31),
  netflix: logo(netflixSvg, 'Netflix', 30),
  nhs: logo(nhsSvg, 'NHS', 32),
  oberlo: logo(oberloSvg, 'Oberlo', 26),
  payfit: logo(payfitSvg, 'PayFit', 34),
  polestar: logo(polestarSvg, 'Polestar', 28),
  ricola: logo(ricolaSvg, 'Ricola', 38),
  satispay: logo(satispaySvg, 'Satispay', 29),
  telekom: logo(telekomSvg, 'Deutsche Telekom', 38),
  vercel: logo(vercelSvg, 'Vercel', 31),
  verizon: logo(verizonSvg, 'Verizon', 24),
  wild: logo(wildSvg, 'Wild', 35),
} satisfies Record<string, LogoItem>;
