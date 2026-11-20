#!/usr/bin/env node
// Make the product windows of the OG card (src/pages/og-card/_resources/scenes/):
// one file for each scene and theme, `<scene>-<theme>.jpg`. The script takes a
// screenshot of the page /dev/og-scenes with agent-browser, then makes the
// file 760px wide with ImageMagick.
//
// Start `astro dev` first, then give its URL:
//
//   npx dotenv -e .env.development -- node scripts/og-scenes.mjs http://localhost:4701
//
// The dev server asks for basic auth: the script logs in with SECRET_API_TOKEN.
//
// Run the script again after a change to a scene or to the scene kit.

import { execFileSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const base = process.argv[2];
if (!base)
  throw new Error('Give the URL of astro dev: node scripts/og-scenes.mjs http://localhost:4701');

const SCENES = ['editor', 'schema', 'media'];
const THEMES = ['yellow', 'orange', 'green', 'purple', 'blue', 'pink', 'docs'];
const OUT = new URL('../src/pages/og-card/_resources/scenes/', import.meta.url).pathname;
const session = ['--session', 'og-scenes'];
const browser = (...args) =>
  execFileSync('agent-browser', [...session, ...args], { stdio: 'pipe' });
const raw = join(mkdtempSync(join(tmpdir(), 'og-scenes-')), 'raw.png');

// Hide the cookie banner and the other fixed elements of the layout: only the window stays.
const clean = `[...document.querySelectorAll('body *')]
  .filter((e) => !e.closest('#og-scene') && getComputedStyle(e).position === 'fixed')
  .forEach((e) => { e.style.display = 'none'; }); 1`;

if (process.env.SECRET_API_TOKEN)
  browser('set', 'credentials', 'dato', process.env.SECRET_API_TOKEN);
browser('set', 'viewport', '1100', '900');
browser('set', 'media', 'light', 'reduced-motion');
for (const scene of SCENES) {
  for (const theme of THEMES) {
    browser('open', `${base}/dev/og-scenes?scene=${scene}&theme=${theme}`);
    browser('wait', '1500');
    browser('eval', clean);
    browser('screenshot', raw);
    const file = join(OUT, `${scene}-${theme}.jpg`);
    execFileSync('magick', [raw, '-resize', '760x', '-quality', '82', file]);
    console.log(file);
  }
}
browser('close');
