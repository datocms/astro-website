/// <reference types="vitest" />
import { getViteConfig } from 'astro/config';

// getViteConfig returns a function of the Vite env: Vitest calls it. Thus the
// tests get the config of Astro, with the "~" alias.
export default getViteConfig({
  mode: 'test',
});
