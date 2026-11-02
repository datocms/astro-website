/*
 * Resolve the custom properties of src/styles/tokens.css to colours, as the
 * browser does. The file is the source of truth: the tests read it, they do
 * not copy its values.
 *
 * The model is a path of elements, as in the page:
 *   <html data-scheme>  >  <section data-theme>  >  <div class="surface…">
 * A rule applies to the element that its last compound selector matches,
 * when its other compounds match ancestors. A custom property inherits down
 * the path, and a `var()` in a value resolves on the element that declares
 * the value. This is how the browser computes it, thus a token that a theme
 * declares again on its element follows the theme.
 *
 * The value grammar is the one that tokens.css uses: a hex colour, `black`,
 * `white`, `transparent`, `rgb()`, `var()` with a fallback, `color-mix()` in
 * srgb, oklab or oklch, and the relative `oklch(from …)` with `min()`. An
 * unknown function throws: extend this file when tokens.css needs more.
 */
import { readFileSync } from 'node:fs';
import postcss, { type Declaration, type Rule } from 'postcss';
import valueParser, { type Node as ValueNode } from 'postcss-value-parser';
import {
  type Rgba,
  type MixSpace,
  TRANSPARENT,
  colorMix,
  oklchToRgba,
  parseHex,
  rgbaToOklch,
} from './color.ts';

export const THEMES = ['default', 'orange', 'green', 'purple', 'blue', 'pink'] as const;
export type Theme = (typeof THEMES)[number];
export const SCHEMES = ['light', 'dark'] as const;
export type Scheme = (typeof SCHEMES)[number];

/** One element of the path: the root, a themed section or a classed box. */
export interface PathElement {
  root?: boolean;
  scheme?: Scheme;
  theme?: Theme;
  classes?: string[];
}

interface Compound {
  root: boolean;
  classes: string[];
  attrs: { name: string; value?: string }[];
}

interface TokenRule {
  /** Each selector of the rule, as a list of compounds (ancestor first). */
  selectors: Compound[][];
  specificity: number[];
  order: number;
  declarations: Map<string, string>;
}

function parseCompound(text: string): Compound {
  const compound: Compound = { root: false, classes: [], attrs: [] };
  // :where() has no specificity and in tokens.css only wraps [data-theme].
  const unwrapped = text.replace(/:where\(([^)]*)\)/g, '$1');
  const re = /:root|\.([\w-]+)|\[([\w-]+)(?:=['"]?([\w-]+)['"]?)?\]/g;
  let consumed = '';
  for (const match of unwrapped.matchAll(re)) {
    consumed += match[0];
    if (match[0] === ':root') compound.root = true;
    else if (match[1]) compound.classes.push(match[1]);
    else if (match[2]) compound.attrs.push({ name: match[2], value: match[3] });
  }
  if (consumed.length !== unwrapped.length) {
    throw new Error(`Unsupported selector in tokens.css: ${text}`);
  }
  return compound;
}

function matchesCompound(compound: Compound, element: PathElement): boolean {
  if (compound.root && !element.root) return false;
  for (const cls of compound.classes) {
    if (!element.classes?.includes(cls)) return false;
  }
  for (const attr of compound.attrs) {
    if (attr.name === 'data-theme') {
      if (!element.theme) return false;
      if (attr.value !== undefined && attr.value !== element.theme) return false;
    } else if (attr.name === 'data-scheme') {
      if (element.scheme !== attr.value) return false;
    } else {
      return false;
    }
  }
  return true;
}

/** True when the selector matches the last element of the path. */
function matchesSelector(compounds: Compound[], path: PathElement[]): boolean {
  const subject = compounds.at(-1);
  const target = path.at(-1);
  if (!subject || !target || !matchesCompound(subject, target)) return false;
  // The other compounds match ancestors, in order (descendant combinator).
  let ancestorIndex = path.length - 2;
  for (let i = compounds.length - 2; i >= 0; i--) {
    const compound = compounds[i]!;
    while (ancestorIndex >= 0 && !matchesCompound(compound, path[ancestorIndex]!)) {
      ancestorIndex--;
    }
    if (ancestorIndex < 0) return false;
    ancestorIndex--;
  }
  return true;
}

function specificityOf(compounds: Compound[]): number[] {
  let b = 0;
  for (const c of compounds) {
    b += (c.root ? 1 : 0) + c.classes.length + c.attrs.length;
  }
  return [0, b, 0];
}

function compareSpecificity(a: number[], b: number[]): number {
  for (let i = 0; i < 3; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/** The parsed stylesheet: the rules with their custom properties. */
export class TokenSheet {
  private rules: TokenRule[] = [];
  /** Every custom property that the sheet declares, in order of first declaration. */
  readonly names: string[] = [];
  /** The source text of each declaration: name → selector → value. */
  readonly declarations = new Map<string, { selector: string; value: string }[]>();

  constructor(css: string) {
    const root = postcss.parse(css);
    let order = 0;
    root.walkRules((rule: Rule) => {
      // Rules inside @media hold no colour tokens.
      if (rule.parent?.type === 'atrule') return;
      const declarations = new Map<string, string>();
      rule.each((node) => {
        if (node.type === 'decl' && (node as Declaration).prop.startsWith('--')) {
          const decl = node as Declaration;
          declarations.set(decl.prop, decl.value);
          if (!this.names.includes(decl.prop)) this.names.push(decl.prop);
          const list = this.declarations.get(decl.prop) ?? [];
          list.push({ selector: rule.selector, value: decl.value });
          this.declarations.set(decl.prop, list);
        }
      });
      if (declarations.size === 0) return;
      for (const selector of rule.selectors) {
        const compounds = selector
          .trim()
          .split(/\s+/)
          .map((part) => parseCompound(part));
        this.rules.push({
          selectors: [compounds],
          specificity: specificityOf(compounds),
          order: order++,
          declarations,
        });
      }
    });
  }

  static fromFile(path: string): TokenSheet {
    return new TokenSheet(readFileSync(path, 'utf8'));
  }

  /** The declared values that apply to one element, after the cascade. */
  private declaredOn(path: PathElement[]): Map<string, string> {
    const winners = new Map<string, { rule: TokenRule; value: string }>();
    for (const rule of this.rules) {
      if (!rule.selectors.some((compounds) => matchesSelector(compounds, path))) continue;
      for (const [name, value] of rule.declarations) {
        const current = winners.get(name);
        if (
          !current ||
          compareSpecificity(rule.specificity, current.rule.specificity) > 0 ||
          (compareSpecificity(rule.specificity, current.rule.specificity) === 0 &&
            rule.order >= current.rule.order)
        ) {
          winners.set(name, { rule, value });
        }
      }
    }
    return new Map([...winners].map(([name, { value }]) => [name, value]));
  }

  /**
   * The computed custom properties at the end of the path. Each value is a
   * colour, or the source text when it is not a colour (a size, a shadow).
   */
  computed(path: PathElement[]): Map<string, Rgba | string> {
    let inherited = new Map<string, Rgba | string>();
    for (let depth = 1; depth <= path.length; depth++) {
      const declared = this.declaredOn(path.slice(0, depth));
      // `--x: initial` removes the inherited value: the property is undefined
      // again on this element (the ground classes use it to go back to the page).
      for (const [name, text] of [...declared]) {
        if (text.trim() === 'initial') {
          declared.delete(name);
          inherited.delete(name);
        }
      }
      const own = new Map<string, Rgba | string>();
      const resolving = new Set<string>();
      // A var() in a declared value reads the property on this element: the
      // value declared here, else the inherited one.
      const resolve = (name: string): Rgba | string => {
        if (own.has(name)) return own.get(name)!;
        const text = declared.get(name);
        if (text === undefined) {
          const value = inherited.get(name);
          if (value === undefined) throw new Error(`Undefined custom property ${name}`);
          return value;
        }
        if (resolving.has(name)) throw new Error(`Cycle on ${name}`);
        resolving.add(name);
        const value = evaluate(text, resolve);
        resolving.delete(name);
        own.set(name, value);
        return value;
      };
      for (const name of declared.keys()) resolve(name);
      inherited = new Map([...inherited, ...own]);
    }
    return inherited;
  }

  /** One token as a colour. Throws when the token is not a colour. */
  color(path: PathElement[], name: string): Rgba {
    const value = this.computed(path).get(name);
    if (value === undefined) throw new Error(`Undefined custom property ${name}`);
    if (typeof value === 'string') throw new Error(`${name} is not a colour: ${value}`);
    return value;
  }
}

type Lookup = (name: string) => Rgba | string;

const NAMED: Record<string, Rgba> = {
  black: { r: 0, g: 0, b: 0, a: 1 },
  white: { r: 1, g: 1, b: 1, a: 1 },
  transparent: TRANSPARENT,
};

/** Evaluate a declaration value. A value that is not a colour stays text. */
function evaluate(value: string, lookup: Lookup): Rgba | string {
  // A var() that holds text (a percentage, a number) is substituted as text,
  // as the browser does: `color-mix(in srgb, X var(--alpha), transparent)`.
  const substituted = value.replace(/var\((--[\w-]+)\)/g, (match, name: string) => {
    try {
      const found = lookup(name);
      return typeof found === 'string' ? found : match;
    } catch {
      return match;
    }
  });
  const nodes = valueParser(substituted).nodes.filter(
    (n) => n.type !== 'space' && n.type !== 'comment',
  );
  if (nodes.length !== 1) return value;
  try {
    return evaluateNode(nodes[0]!, lookup);
  } catch (error) {
    if (error instanceof NotAColor) return value;
    throw error;
  }
}

class NotAColor extends Error {}

function evaluateNode(node: ValueNode, lookup: Lookup): Rgba {
  if (node.type === 'word') {
    if (node.value.startsWith('#')) return parseHex(node.value);
    const named = NAMED[node.value.toLowerCase()];
    if (named) return named;
    throw new NotAColor(node.value);
  }
  if (node.type !== 'function') throw new NotAColor(valueParser.stringify(node));
  const args = splitArgs(node.nodes);
  switch (node.value) {
    case 'var': {
      const name = wordOf(args[0]);
      let value: Rgba | string;
      try {
        value = lookup(name);
      } catch (error) {
        if (args.length > 1 && /Undefined/.test(String(error))) {
          return evaluateNode(single(args[1]!), lookup);
        }
        throw error;
      }
      if (typeof value === 'string') throw new NotAColor(value);
      return value;
    }
    case 'color-mix':
      return evaluateColorMix(args, lookup);
    case 'oklch':
      return evaluateOklch(node.nodes, lookup);
    case 'rgb':
    case 'rgba':
      return evaluateRgb(node.nodes);
    default:
      // A colour function that this file does not evaluate is an error: the
      // test must not pass with an unknown colour. Other functions (calc,
      // max) are sizes.
      if (/^(oklab|lab|lch|hsl|hsla|hwb|color|light-dark|color-contrast)$/.test(node.value)) {
        throw new Error(`Unsupported colour function in tokens.css: ${node.value}()`);
      }
      throw new NotAColor(valueParser.stringify(node));
  }
}

function splitArgs(nodes: ValueNode[]): ValueNode[][] {
  const args: ValueNode[][] = [[]];
  for (const node of nodes) {
    if (node.type === 'div' && node.value === ',') args.push([]);
    else if (node.type !== 'space' && node.type !== 'comment') args.at(-1)!.push(node);
  }
  return args;
}

function wordOf(nodes: ValueNode[] | undefined): string {
  const node = nodes?.[0];
  if (!node || node.type !== 'word') throw new Error('Expected a word');
  return node.value;
}

function single(nodes: ValueNode[]): ValueNode {
  if (nodes.length !== 1)
    throw new Error(`Expected one value: ${nodes.map((n) => valueParser.stringify(n))}`);
  return nodes[0]!;
}

function evaluateColorMix(args: ValueNode[][], lookup: Lookup): Rgba {
  const method = args[0]?.map((n) => n.value) ?? [];
  if (method[0] !== 'in' || !method[1]) throw new Error('color-mix needs "in <space>"');
  const space = method[1] as MixSpace;
  if (!['srgb', 'oklab', 'oklch'].includes(space)) {
    throw new Error(`Unsupported color-mix space: ${space}`);
  }
  const [a, pa] = colorAndPercent(args[1]!, lookup);
  const [b, pb] = colorAndPercent(args[2]!, lookup);
  const percentA = pa ?? (pb === undefined ? 50 : 100 - pb);
  const percentB = pb ?? 100 - percentA;
  return colorMix(space, a, percentA, b, percentB);
}

function colorAndPercent(nodes: ValueNode[], lookup: Lookup): [Rgba, number | undefined] {
  let percent: number | undefined;
  let color: Rgba | undefined;
  for (const node of nodes) {
    if (node.type === 'word' && node.value.endsWith('%')) percent = parseFloat(node.value);
    else color = evaluateNode(node, lookup);
  }
  if (!color) throw new Error('color-mix needs two colours');
  return [color, percent];
}

/** `oklch(from <colour> L C H [/ A])` or `oklch(L C H [/ A])`. */
function evaluateOklch(nodes: ValueNode[], lookup: Lookup): Rgba {
  const items = nodes.filter((n) => n.type !== 'space' && n.type !== 'comment');
  let base: { l: number; c: number; h: number; alpha: number } | undefined;
  let i = 0;
  if (items[0]?.type === 'word' && items[0].value === 'from') {
    base = rgbaToOklch(evaluateNode(items[1]!, lookup));
    i = 2;
  }
  const channels: number[] = [];
  let alpha = base?.alpha ?? 1;
  let afterSlash = false;
  for (; i < items.length; i++) {
    const node = items[i]!;
    if (node.type === 'div' && node.value === '/') {
      afterSlash = true;
      continue;
    }
    const n = evaluateNumber(node, base);
    if (afterSlash) alpha = n;
    else channels.push(n);
  }
  if (channels.length !== 3) throw new Error('oklch needs three channels');
  const [l, c, h] = channels as [number, number, number];
  return oklchToRgba({ l, c, h, alpha });
}

function evaluateNumber(
  node: ValueNode,
  base: { l: number; c: number; h: number; alpha: number } | undefined,
): number {
  if (node.type === 'word') {
    if (base && (node.value === 'l' || node.value === 'c' || node.value === 'h')) {
      const v = base[node.value];
      // A missing hue counts as 0, as in the browser.
      return Number.isNaN(v) ? 0 : v;
    }
    if (node.value === 'none') return 0;
    if (node.value.endsWith('%')) return parseFloat(node.value) / 100;
    const n = parseFloat(node.value);
    if (Number.isNaN(n)) throw new Error(`Not a number: ${node.value}`);
    return n;
  }
  if (node.type === 'function' && (node.value === 'min' || node.value === 'max')) {
    const values = splitArgs(node.nodes).map((arg) => evaluateNumber(single(arg), base));
    return node.value === 'min' ? Math.min(...values) : Math.max(...values);
  }
  if (node.type === 'function' && node.value === 'calc') {
    const text = valueParser.stringify(node.nodes);
    const simple = text.replace(/\s+/g, '');
    // An operand is a number or a channel of the base colour (`l - 0.04`).
    const m = simple.match(/^([\d.]+|[lch])([-+*/])([\d.]+|[lch])$/);
    if (!m) throw new Error(`Unsupported calc in tokens.css: ${text}`);
    const [, a, op, b] = m;
    const operand = (v: string) =>
      /^[lch]$/.test(v)
        ? evaluateNumber({ type: 'word', value: v } as ValueNode, base)
        : parseFloat(v);
    const x = operand(a!);
    const y = operand(b!);
    return op === '+' ? x + y : op === '-' ? x - y : op === '*' ? x * y : x / y;
  }
  throw new Error(`Unsupported channel value: ${valueParser.stringify(node)}`);
}

/** `rgb(r g b / a)` or `rgb(r, g, b, a)`, with channels 0 to 255. */
function evaluateRgb(nodes: ValueNode[]): Rgba {
  const numbers: number[] = [];
  let alpha = 1;
  let afterSlash = false;
  for (const node of nodes) {
    if (node.type === 'div' && node.value === '/') afterSlash = true;
    else if (node.type === 'word') {
      const n = node.value.endsWith('%') ? parseFloat(node.value) / 100 : parseFloat(node.value);
      if (afterSlash) alpha = n;
      else numbers.push(n);
    }
  }
  if (numbers.length === 4) alpha = numbers.pop()!;
  const [r, g, b] = numbers as [number, number, number];
  return { r: r / 255, g: g / 255, b: b / 255, a: alpha };
}

/**
 * The path of the page for a theme and a scheme, with optional nested boxes.
 * A box is a list of classes, or a full element (a box with its own theme).
 */
export function pagePath(
  theme: Theme,
  scheme: Scheme,
  ...boxes: (string[] | PathElement)[]
): PathElement[] {
  return [
    { root: true, scheme },
    { theme },
    ...boxes.map((box) => (Array.isArray(box) ? { classes: box } : box)),
  ];
}
