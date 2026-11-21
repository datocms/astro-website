/*
 * The CSS of the scene kit for one page: only the rules of the classes that
 * the scenes of the page render.
 *
 * The kit ships one stylesheet (about 300 KB minified) for all its parts. The
 * scenes are static: their markup is the same at each request, thus the
 * classes that a page shows are known before the build.
 * `src/scenes/kit-classes.json` lists them for each page;
 * `src/scenes/kitClasses.test.ts` writes the list and fails when it is old.
 * The Vite plugin `sceneKitCss` (astro.config.ts) gives each page the rules
 * of its classes.
 *
 * A rule stays when one of its selectors can match: each class of the
 * selector is in the list. A class inside `:not()`, `:is()`, `:where()` or
 * `:has()` does not count: the selector can match without it. The rules
 * without a class (the tokens on `.ProductScenesScreen`, the reset of the
 * elements), the keyframes and the at-rules stay. Pruning keeps the order of
 * the rules, thus the cascade does not change.
 */
import postcss, { type Rule } from 'postcss';
import selectorParser from 'postcss-selector-parser';

const SCOPING_PSEUDOS = new Set([':not', ':is', ':where', ':has']);

function isInsideScopingPseudo(node: selectorParser.Node): boolean {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'pseudo' && SCOPING_PSEUDOS.has(parent.value)) return true;
  }
  return false;
}

/** The classes that a selector needs: each must be in the markup */
function requiredClasses(selector: string): string[] {
  const classes: string[] = [];
  selectorParser((root) => {
    root.walkClasses((node) => {
      if (!isInsideScopingPseudo(node)) classes.push(node.value);
    });
  }).processSync(selector);
  return classes;
}

function isKeyframe(rule: Rule): boolean {
  return rule.parent?.type === 'atrule' && /keyframes$/i.test(rule.parent.name);
}

/** Each class that a selector of the stylesheet names */
export function kitClasses(css: string): Set<string> {
  const classes = new Set<string>();
  postcss.parse(css).walkRules((rule) => {
    if (isKeyframe(rule)) return;
    for (const selector of rule.selectors) {
      selectorParser((root) =>
        root.walkClasses((node) => void classes.add(node.value)),
      ).processSync(selector);
    }
  });
  return classes;
}

/** The stylesheet without the rules that need a class not in `classes` */
export function pruneKitCss(css: string, classes: ReadonlySet<string>): string {
  const root = postcss.parse(css);
  root.walkRules((rule) => {
    if (isKeyframe(rule)) return;
    const kept = rule.selectors.filter((selector) =>
      requiredClasses(selector).every((name) => classes.has(name)),
    );
    if (kept.length === 0) rule.remove();
    else if (kept.length < rule.selectors.length) rule.selectors = kept;
  });
  // A media query or a layer can be empty now: remove it, and then its parent
  // if that is empty too.
  let removed = true;
  while (removed) {
    removed = false;
    root.walkAtRules((atRule) => {
      if (atRule.nodes && atRule.nodes.length === 0) {
        atRule.remove();
        removed = true;
      }
    });
  }
  return root.toString();
}
