import { PUBLIC_HOSTNAME } from 'astro:env/client';

function maybeCookieDomain() {
  if (!PUBLIC_HOSTNAME) {
    return '';
  }

  return 'domain=.' + PUBLIC_HOSTNAME.split('.').slice(-2).join('.') + ';';
}

export const getCookie = (name: string) => {
  if (typeof document === 'undefined') {
    return;
  }

  const match = document.cookie.match(new RegExp(`${name}=([^;]+)`));
  if (match) return match[1];
};

export const setCookie = (name: string, value: string, days?: number) => {
  if (typeof document === 'undefined') {
    return;
  }

  let expires = '';

  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }

  document.cookie = `${name}=${value}${expires}; path=/; ${maybeCookieDomain()} samesite=none; secure`;
};
