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
