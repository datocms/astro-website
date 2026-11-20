/// <reference path="../.astro/types.d.ts" />
/// <reference path="../.astro/env.d.ts" />
/// <reference types="astro/client" />
/// <reference types="astro-global/client" />

// The headers of the .pxv files of public/videos, by URL (see `pxvHeaders`
// in astro.config.ts).
declare module 'virtual:pxv-headers' {
  const headers: Record<string, Omit<import('~/lib/pixel-video/format').PixelFrames, 'cells'>>;
  export default headers;
}

/*
 * The part of the Workers runtime that the site uses. The types that
 * `wrangler types` generates declare the globals of the Workers runtime, and
 * they do not agree with the DOM types of the client scripts.
 */
declare module 'cloudflare:workers' {
  export const cache: {
    purge(options: { tags?: string[]; purgeEverything?: boolean }): Promise<unknown>;
  };
  export function waitUntil(promise: Promise<unknown>): void;
  export const env: {
    UI_FONTS?: { fetch(input: string): Promise<Response> };
    CF_VERSION_METADATA?: { id: string };
    DATA_SOURCES?: {
      get<T>(key: string, type: 'json'): Promise<T | null>;
      put(key: string, value: string): Promise<void>;
    };
  };
}
