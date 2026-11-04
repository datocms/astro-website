import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const port = Number(process.env.PICTURES_PORT ?? 4790);
const origin = `http://localhost:${port}`;
const outDir = path.join(root, 'public/pictures');
const manifestPath = path.join(root, 'src/data/pictures.json');
const previous = JSON.parse(readFileSync(manifestPath, 'utf8'));

const pages = [
  '/',
  '/developers',
  '/editor-experience',
  '/media',
  '/ai',
  '/enterprise-headless-cms',
  '/cms/astro-cms',
  '/cms/nextjs-cms',
  '/cms/nuxtjs-cms',
  '/cms/svelte-cms',
];

function portIsFree(p) {
  return new Promise((resolve) => {
    const server = createServer()
      .once('error', () => resolve(false))
      .once('listening', () => server.close(() => resolve(true)))
      .listen(p, '127.0.0.1');
  });
}

async function waitForServer() {
  for (let i = 0; i < 120; i++) {
    try {
      const res = await fetch(`${origin}/_astro/status`);
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
  throw new Error(`The dev server did not start on ${origin}`);
}

function startServer() {
  const child = spawn(
    'npx',
    [
      'dotenv',
      '-e',
      '.env.development',
      '--',
      'npx',
      'astro',
      'dev',
      '--ignore-lock',
      '--port',
      String(port),
    ],
    { cwd: root, detached: true, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  child.stdout.on('data', (chunk) => {
    if (/is in use, trying another one/.test(String(chunk))) {
      process.stderr.write(`Port ${port} is busy. Set PICTURES_PORT.\n`);
      stopServer(child);
      process.exit(1);
    }
  });
  return child;
}

function stopServer(child) {
  try {
    process.kill(-child.pid, 'SIGTERM');
  } catch {}
}

function defaultFile(pathname, section) {
  const page = pathname === '/' ? 'home' : pathname.slice(1).replaceAll('/', '-');
  return `datocms-${page}-${section}.png`;
}

if (!(await portIsFree(port))) {
  console.error(`Port ${port} is busy. Set PICTURES_PORT.`);
  process.exit(1);
}

const server = startServer();
const manifest = {};

try {
  await waitForServer();
  const browser = await chromium.launch({ channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    deviceScaleFactor: 1,
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  mkdirSync(outDir, { recursive: true });
  const written = new Set();

  for (const pathname of pages) {
    await page.goto(origin + pathname, { waitUntil: 'load', timeout: 120000 });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(1500);

    const chapters = await page.evaluate(() => {
      const found = [];
      let current = null;
      for (const el of document.querySelectorAll('section[id], [data-scene-frame]')) {
        if (el.matches('section[id]')) {
          current = el;
          continue;
        }
        if (!current || found.some((c) => c.section === current.id)) continue;
        el.dataset.picture = current.id;
        const scene = [...el.querySelectorAll('figcaption, [aria-label]')].find(
          (node) => node.matches('figcaption') || node.tagName.startsWith('SCENE-'),
        );
        found.push({
          section: current.id,
          title: (current.querySelector('h1, h2')?.textContent ?? '').replace(/\s+/g, ' ').trim(),
          alt: (scene?.matches('figcaption')
            ? scene.textContent
            : scene?.getAttribute('aria-label')
          )
            ?.replace(/\s+/g, ' ')
            .trim(),
        });
      }
      return found;
    });

    const entries = [];
    for (const { section, title, alt } of chapters) {
      const known = previous[pathname]?.find((entry) => entry.section === section);
      const file = known?.file ?? defaultFile(pathname, section);
      if (written.has(file)) {
        const shared = [...Object.values(manifest).flat(), ...entries].find(
          (entry) => entry.file === file,
        );
        entries.push({ ...shared, section, ...(known && { title: known.title, alt: known.alt }) });
        continue;
      }
      const frame = page.locator(`[data-picture="${section}"]`);
      await frame.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      const clip = await frame.evaluate((el) => {
        const box = el.getBoundingClientRect();
        const screens = [...el.querySelectorAll('.ProductScenesScreen')].map((s) =>
          s.getBoundingClientRect(),
        );
        const rects = screens.length > 0 ? screens : [box];
        const left = Math.max(box.left, Math.min(...rects.map((r) => r.left)));
        const top = Math.max(box.top, Math.min(...rects.map((r) => r.top)));
        const right = Math.min(
          box.right,
          window.innerWidth,
          Math.max(...rects.map((r) => r.right)),
        );
        const bottom = Math.min(
          box.bottom,
          window.innerHeight,
          Math.max(...rects.map((r) => r.bottom)),
        );
        return { x: left, y: top, width: right - left, height: bottom - top };
      });
      const shot = await page.screenshot({ clip, animations: 'disabled' });
      const png = await sharp(shot)
        .png({ compressionLevel: 9, palette: true, quality: 90 })
        .toBuffer();
      const { width, height } = await sharp(png).metadata();
      writeFileSync(path.join(outDir, file), png);
      written.add(file);
      entries.push({
        section,
        file,
        title: known?.title ?? title,
        alt: known?.alt ?? alt ?? title,
        width,
        height,
      });
      console.log(`${file} ${width}x${height} ${Math.round(png.length / 1024)} kB`);
    }
    if (entries.length > 0) manifest[pathname] = entries;
  }

  await browser.close();

  for (const name of readdirSync(outDir)) {
    if (!written.has(name)) rmSync(path.join(outDir, name));
  }
  writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${written.size} files to ${outDir} and ${manifestPath}`);
} finally {
  stopServer(server);
}
