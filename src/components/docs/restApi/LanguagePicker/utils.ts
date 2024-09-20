import type { AstroGlobal } from 'astro';

export type Language = 'http' | 'javascript';

export function currentLanguage(Astro: AstroGlobal): Language | undefined {
  if (!Astro.url.searchParams.has('language')) {
    return 'javascript';
  }

  const param = Astro.url.searchParams.get('language');

  return param === 'http' ? 'http' : undefined;
}

export function isValidLanguage(language: string | undefined): language is Language {
  if (!language) {
    return false;
  }

  return ['http', 'javascript'].includes(language);
}

export function addLanguageToUrl(Astro: AstroGlobal, url: URL | string, language: Language) {
  const completeUrl = new URL(url, Astro.url);

  if (language === 'javascript') {
    completeUrl.searchParams.delete('language');
  } else {
    completeUrl.searchParams.set('language', 'http');
  }

  return completeUrl.toString();
}
