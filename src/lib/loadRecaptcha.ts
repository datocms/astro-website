import { RECAPTCHA_KEY } from 'astro:env/client';

interface Grecaptcha {
  ready: (callback: () => void) => void;
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
}

export function loadRecaptcha(): Promise<Grecaptcha> {
  return new Promise((resolve, reject) => {
    if (!('grecaptcha' in window)) {
      // Define a global configuration if it doesn't exist
      const globalConfig = '___grecaptcha_cfg';

      (window as any)[globalConfig] = (window as any)[globalConfig] || {};

      const fns = ((window as any)[globalConfig]['fns'] =
        (window as any)[globalConfig]['fns'] || []);

      // Enqueue the callback
      fns.push(() => {
        resolve((window as any).grecaptcha);
      });

      // Dynamically load the reCAPTCHA script
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_KEY}`;
      script.async = true;
      script.onerror = () => reject(new Error('Failed to load the reCAPTCHA script.'));

      // Append the script to the document
      document.head.appendChild(script);
      return;
    }

    const grecaptcha = window.grecaptcha as Grecaptcha;

    // Check if grecaptcha is already defined
    grecaptcha.ready(() => resolve(grecaptcha));
  });
}
