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

// This function has the same logic as the cookie banner in cookieConsent.js.ts.
// A visitor out of the GDPR countries does not see the banner and has consent.
// A visitor in a GDPR country has consent only after a click on Accept. The
// value of the cookie is 'true' after Accept and 'false' after Reject.
export function hasMarketingConsent(request: Request, cookies: AstroCookies): boolean {
  const country = request.headers.get('client-geo-country');

  // No country or non-GDPR → no banner shown, so the visitor is auto-accepted.
  if (!country || !gdprCountries.includes(country)) return true;

  return cookies.get(CONSENT_COOKIE_NAME)?.value === 'true';
}
