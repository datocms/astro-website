/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';
import astroConfig from './astro.config';

// The tests need no secret and no network, but `astro:env` checks each
// variable of the schema when a module imports it. Thus the tests get the
// public values of the build, and a placeholder for each other variable
// that the schema requires. A value of the shell wins.
process.loadEnvFile('cloudflare.build.env');
for (const [name, field] of Object.entries(astroConfig.env?.schema ?? {})) {
  const required = !field.optional && field.default === undefined;
  if (required && field.type === 'string') process.env[name] ??= 'test';
}

// getViteConfig returns a function of the Vite env: Vitest calls it. Thus the
// tests get the config of Astro, with the "~" alias.
export default getViteConfig({
  mode: 'test',
});
