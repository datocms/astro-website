/*
 * The classes of the scene kit that each page shows (`kit-classes.json`).
 * The Vite plugin `sceneKitCss` (astro.config.ts) gives each page only the
 * rules of its classes (`src/lib/sceneKitCss.ts`).
 *
 * The test renders the scenes of each page and compares their classes with
 * the file. After a change to a scene, to its props or to the kit, run
 * `npm run scene-classes`: it writes the file again. A class that is not in
 * the file has no style on the page.
 *
 * The scenes of a page are the modules of src/scenes/ that the page imports
 * (or a component of the page imports) and that render `Scene`. A scene
 * module that is Astro and has no props renders as it is. Each other scene
 * module has a render in RENDERS, with the props that the pages give it.
 */
import { getContainerRenderer } from '@astrojs/react/container-renderer';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { loadRenderers } from 'astro:container';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { parse } from 'node-html-parser';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, test } from 'vitest';
import { page as cmsAstro } from '~/data/cms-astro';
import { page as cmsNextjs } from '~/data/cms-nextjs';
import { page as cmsNuxt } from '~/data/cms-nuxt';
import { page as cmsSveltekit } from '~/data/cms-sveltekit';
import { userExperience } from '~/data/home';
import { kitClasses } from '~/lib/sceneKitCss';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const PAGES = path.join(SRC, 'pages');
const SCENES = path.join(SRC, 'scenes');
const SCENE = path.join(SCENES, 'Scene.tsx');
const KIT_CSS = '@datocms/product-scenes/product-scenes.css';

type Container = Awaited<ReturnType<typeof AstroContainer.create>>;
type Render = (container: Container) => Promise<string>;

const FRAMEWORK_PAGES = [cmsAstro, cmsNextjs, cmsNuxt, cmsSveltekit];

function react<P extends object>(component: ComponentType<P>, props: P): string {
  return renderToStaticMarkup(createElement(component, props));
}

/*
 * The scene modules that need props, by path from src/. Each render gives
 * the props of each page that imports the module: keep them the same as in
 * the page.
 */
const RENDERS: Record<string, Render> = {
  // The home page, with its UserExperience section
  'scenes/UserExperience/UserExperience.tsx': async (container) => {
    const { default: UserExperience } = await import('~/components/UserExperience/Component.astro');
    return container.renderToString(UserExperience, { props: { ...userExperience } });
  },
  // src/pages/cms/[slug]/index.astro
  'scenes/DynamicLayouts/DynamicLayouts.tsx': async () => {
    const { DynamicLayoutsScene } = await import('~/scenes/DynamicLayouts/DynamicLayouts');
    return FRAMEWORK_PAGES.map((fw) =>
      react(DynamicLayoutsScene, { appearance: { theme: fw.blocks.theme }, fields: 'sections' }),
    ).join('');
  },
  // src/pages/cms/[slug]/index.astro
  'scenes/VisualEditing/VisualEditing.tsx': async () => {
    const { VisualEditingScene } = await import('~/scenes/VisualEditing/VisualEditing');
    return FRAMEWORK_PAGES.map((fw) =>
      react(VisualEditingScene, {
        appearance: { theme: fw.drafts.theme },
        chrome: 'app',
        height: 1300,
      }),
    ).join('');
  },
};

// The modules of src/ that a file imports. A type import does not count: it
// is not in the bundle.
const IMPORT =
  /\bimport\s+(?!type\s)[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]|\bimport\s*['"]([^'"]+)['"]|\bimport\(\s*['"]([^'"]+)['"]\s*\)|\bexport\s+(?!type\s)[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g;
const CODE = /\.(astro|tsx?|m?js)$/;
const EXTENSIONS = ['', '.ts', '.tsx', '.astro', '.js', '.mjs', '/index.ts', '/index.tsx'];

function specifiers(file: string): string[] {
  return [...readFileSync(file, 'utf8').matchAll(IMPORT)]
    .map((match) => match.slice(1).find(Boolean))
    .filter((specifier): specifier is string => Boolean(specifier));
}

function resolve(specifier: string, from: string): string | null {
  const bare = specifier.split('?')[0]!;
  let base: string;
  if (bare.startsWith('~/')) base = path.join(SRC, bare.slice(2));
  else if (bare.startsWith('~~/')) base = path.join(ROOT, bare.slice(3));
  else if (bare.startsWith('.')) base = path.resolve(path.dirname(from), bare);
  else return null;
  for (const extension of EXTENSIONS) {
    const file = base + extension;
    if (CODE.test(file) && existsSync(file) && statSync(file).isFile()) return file;
  }
  return null;
}

const importsCache = new Map<string, string[]>();
function imports(file: string): string[] {
  let files = importsCache.get(file);
  if (!files) {
    files = specifiers(file)
      .map((specifier) => resolve(specifier, file))
      .filter((resolved): resolved is string => resolved !== null);
    importsCache.set(file, files);
  }
  return files;
}

const reachCache = new Map<string, boolean>();
function rendersScene(file: string, seen = new Set<string>()): boolean {
  if (file === SCENE) return true;
  const cached = reachCache.get(file);
  if (cached !== undefined) return cached;
  if (seen.has(file)) return false;
  seen.add(file);
  const result = imports(file).some((imported) => rendersScene(imported, seen));
  reachCache.set(file, result);
  return result;
}

/** The scene modules of a page: the first modules of src/scenes/ on each import path that render Scene */
function scenesOf(page: string): string[] {
  const scenes = new Set<string>();
  const seen = new Set<string>();
  const visit = (file: string) => {
    if (seen.has(file)) return;
    seen.add(file);
    for (const imported of imports(file)) {
      if (!rendersScene(imported)) continue;
      if (imported.startsWith(SCENES + path.sep)) scenes.add(imported);
      else visit(imported);
    }
  };
  visit(page);
  return [...scenes].sort();
}

function filesIn(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: 'utf8' })
    .map((name) => path.join(dir, name))
    .filter((file) => CODE.test(file) && statSync(file).isFile());
}

const pages = filesIn(PAGES)
  .filter((file) => file.endsWith('.astro'))
  .sort();
const scenePages = pages
  .map((page) => ({ page, scenes: scenesOf(page) }))
  .filter(({ scenes }) => scenes.length > 0);
const importsKitCss = (file: string) => specifiers(file).includes(KIT_CSS);
const fromSrc = (file: string) => path.relative(SRC, file);

describe('the CSS of the scene kit', () => {
  test('each page with a scene imports it, and only those pages', () => {
    const wrong = [
      ...scenePages
        .filter(({ page }) => !importsKitCss(page))
        .map(({ page }) => `${fromSrc(page)} shows a scene: import '${KIT_CSS}' in it`),
      ...pages
        .filter((page) => importsKitCss(page) && !scenePages.some((s) => s.page === page))
        .map((page) => `${fromSrc(page)} shows no scene: remove the import of '${KIT_CSS}'`),
      // Outside a page, the import gives the whole file (src/dev/ only).
      ...filesIn(SRC)
        .filter((file) => !file.startsWith(PAGES) && !file.startsWith(path.join(SRC, 'dev')))
        .filter(importsKitCss)
        .map((file) => `${fromSrc(file)}: only a page imports '${KIT_CSS}'`),
    ];
    expect(wrong).toEqual([]);
  });

  test('kit-classes.json has the classes of the scenes of each page', async () => {
    const renderers = await loadRenderers([getContainerRenderer()]);
    const container = await AstroContainer.create({ renderers });
    const kitCss = readFileSync(
      createRequire(path.join(ROOT, 'package.json')).resolve(KIT_CSS),
      'utf8',
    );
    const known = kitClasses(kitCss);

    const markup = new Map<string, Promise<string>>();
    const render = (scene: string) => {
      let html = markup.get(scene);
      if (!html) {
        const custom = RENDERS[fromSrc(scene)];
        if (custom) html = custom(container);
        else if (scene.endsWith('.astro'))
          html = import(/* @vite-ignore */ scene).then((module) =>
            container.renderToString(module.default),
          );
        else
          throw new Error(
            `${fromSrc(scene)} is a scene of a page: add its render, with the props of the page, to RENDERS`,
          );
        markup.set(scene, html);
      }
      return html;
    };

    const manifest: Record<string, string[]> = {};
    for (const { page, scenes } of scenePages) {
      const classes = new Set<string>();
      for (const scene of scenes) {
        // Only the classes in the stages: the page can use a class name of
        // the kit outside a scene.
        for (const stage of parse(await render(scene)).querySelectorAll('.ProductScenesStage')) {
          for (const element of [stage, ...stage.querySelectorAll('[class]')])
            for (const name of element.classList.values()) if (known.has(name)) classes.add(name);
        }
      }
      manifest[path.relative(PAGES, page)] = [...classes].sort();
    }

    await expect(`${JSON.stringify(manifest, null, 2)}\n`).toMatchFileSnapshot(
      './kit-classes.json',
    );
  }, 120_000);
});
