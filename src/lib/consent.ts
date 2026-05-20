import type { AstroCookies } from 'astro';

const gdprCountries = [
  'AT',
  'BE',
  'BG',
  'CY',
  'CH',
  'CZ',
  'DE',
  'DK',
  'EE',
  'ES',
  'FI',
  'FR',
  'GB',
  'GR',
  'HR',
  'HU',
  'IE',
  'IS',
  'IT',
  'LI',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'NO',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
];

export const CONSENT_COOKIE_NAME = 'cookies-accepted';

// Mirrors the client-side cookie banner logic in cookieConsent.js.ts:
// non-GDPR visitors are auto-accepted (no banner shown); GDPR visitors must
// have explicitly accepted via the banner.
export function hasMarketingConsent(request: Request, cookies: AstroCookies): boolean {
  const country = request.headers.get('client-geo-country');

  // No country or non-GDPR → no banner shown, so the visitor is auto-accepted.
  if (!country || !gdprCountries.includes(country)) return true;

  return Boolean(cookies.get(CONSENT_COOKIE_NAME));
}
