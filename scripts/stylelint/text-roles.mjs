/*
 * Stylelint rule datocms/text-roles: the colour rules of src/styles/tokens.css
 * (rules 3 to 5), for the CSS of src/. The contract is in
 * src/lib/tokens/contract.ts; the audit of the values is in
 * src/styles/tokens.test.ts.
 *
 * - `color` is a text role, a code colour, a keyword, or a local custom
 *   property whose values in the file are all of these. A surface as text
 *   is a pill: the same rule sets the fill (PILL_TEXT).
 * - No `--text-*` or `--border-*` declaration outside tokens.css, except a
 *   contextual role set to a canonical role of the same kind (a ground that
 *   changes with the viewport).
 * - `opacity` between 0 and 1 is not allowed in components, pages and
 *   layouts: it dims the text below AA. A disable comment with a reason
 *   marks an element without text.
 * - A rule with `background: var(--surface-accent | --surface-inverse)`
 *   sets `color` to a role of that ground in the same rule.
 * - A `*headline-muted` role only in HEADLINE_MUTED_FILES.
 *
 * Option { scenes: true } (src/scenes): no opacity check, a `--text-*`
 * declaration may take any text token, and a `--border-*` declaration is
 * free (a diagram on a light surface remaps the roles of the inverse).
 */
import path from 'node:path';
import stylelint from 'stylelint';
import {
  GROUND_PAINT,
  HEADLINE_MUTED_FILES,
  PILL_TEXT,
  TEXT_COLOR_KEYWORDS,
  TEXT_COLOR_TOKEN,
  canonicalFor,
} from '../../src/lib/tokens/contract.ts';

const ruleName = 'datocms/text-roles';

const messages = stylelint.utils.ruleMessages(ruleName, {
  textColor: (value) =>
    `"color: ${value}" is not a text role. Use var(--text-*), a code colour, or a keyword (src/styles/tokens.css, rule 3).`,
  localProp: (prop, value) =>
    `"${prop}: ${value}" is used as a text colour but is not a text role (src/styles/tokens.css, rule 5).`,
  pill: (value, fills) =>
    `"color: ${value}" is a surface as text: the same rule must set the fill to ${fills.join(' or ')} (a pill).`,
  textProp: (prop) =>
    `Do not declare "${prop}" outside src/styles/tokens.css. Use a role, or set a contextual role to a canonical role of the same kind (rule 5).`,
  opacity: (value) =>
    `"opacity: ${value}" dims the text below AA. Use a text role. For an element without text, disable this rule on the line with the reason (rule 5).`,
  groundPaint: (surface, roles) =>
    `A rule with "background: var(${surface})" must set "color" to ${roles} in the same rule (rule 4).`,
  headlineMuted: (value) =>
    `"${value}" is for the quiet run of a two-tone headline or display lockup only (3:1, large text). Use it in the files of HEADLINE_MUTED_FILES (src/lib/tokens/contract.ts).`,
});

const meta = { url: 'src/styles/tokens.css' };

const TOKEN_PREFIXES = ['--text-', '--border-', '--surface-', '--code-', '--color-', '--theme-'];
const SURFACE_AS_TEXT = /^var\((--surface-[\w-]+)\)$/;
const SINGLE_VAR = /^var\((--[\w-]+)\)$/;
const VAR_WITH_FALLBACK = /^var\((--[\w-]+)\s*,\s*(.+)\)$/;
const PAINT_PROPS = new Set(['background', 'background-color']);
const GROUND_PAINT_ROLES = {
  '--surface-accent': 'var(--text-on-accent*)',
  '--surface-inverse': 'var(--text-on-inverse*)',
  '--code-background': 'var(--code-*)',
};

/** @param {string} value */
const normalize = (value) => value.replace(/\s+/g, ' ').trim();

/** @param {import('postcss').Rule} rule @param {string[]} fills */
function ruleHasFill(rule, fills) {
  return rule.nodes.some(
    (node) =>
      node.type === 'decl' && fills.some((fill) => normalize(node.value).includes(`var(${fill})`)),
  );
}

/** @param {import('postcss').Declaration} decl */
function inKeyframes(decl) {
  let node = decl.parent;
  while (node) {
    if (node.type === 'atrule' && /keyframes$/i.test(node.name)) return true;
    node = node.parent;
  }
  return false;
}

const rule = (primary, secondary) => (root, result) => {
  const valid = stylelint.utils.validateOptions(
    result,
    ruleName,
    { actual: primary },
    { actual: secondary, possible: { scenes: [true, false] }, optional: true },
  );
  if (!valid) return;
  const scenes = Boolean(secondary?.scenes);
  const file = root.source?.input.file;
  const relative = file ? path.relative(process.cwd(), file).replaceAll('\\', '/') : '';
  const headlineMutedAllowed = HEADLINE_MUTED_FILES.includes(relative);

  /** The declarations of each local custom property in the file. */
  const locals = new Map();
  root.walkDecls(/^--/, (decl) => {
    if (TOKEN_PREFIXES.some((prefix) => decl.prop.startsWith(prefix))) return;
    if (!locals.has(decl.prop)) locals.set(decl.prop, []);
    locals.get(decl.prop).push(decl);
  });

  /**
   * Tell whether a value is an allowed text colour. Returns null, or the
   * reason as a message.
   * @param {string} value
   * @param {import('postcss').Rule} rule The rule of the declaration, for the pill check.
   * @param {number} depth
   * @returns {string | null}
   */
  function check(value, rule, depth) {
    const v = normalize(value);
    if (TEXT_COLOR_KEYWORDS.includes(v.toLowerCase())) return null;
    if (TEXT_COLOR_TOKEN.test(v)) {
      if (/headline-muted\)$/.test(v) && !headlineMutedAllowed) return messages.headlineMuted(v);
      return null;
    }
    const surface = v.match(SURFACE_AS_TEXT)?.[1];
    if (surface) {
      const fills = PILL_TEXT[surface];
      if (fills && ruleHasFill(rule, fills)) return null;
      return messages.pill(v, fills ?? ['nothing: this surface is never a text colour']);
    }
    const fallback = v.match(VAR_WITH_FALLBACK);
    if (fallback) {
      return check(`var(${fallback[1]})`, rule, depth) ?? check(fallback[2], rule, depth);
    }
    const local = v.match(SINGLE_VAR)?.[1];
    if (local && locals.has(local)) {
      if (depth > 3) return messages.textColor(v);
      for (const decl of locals.get(local)) {
        const parent = /** @type {import('postcss').Rule} */ (decl.parent);
        const reason = check(decl.value, parent, depth + 1);
        if (reason) return messages.localProp(decl.prop, normalize(decl.value));
      }
      return null;
    }
    return messages.textColor(v);
  }

  /** @param {import('postcss').Declaration} decl @param {string} message */
  const report = (decl, message) =>
    stylelint.utils.report({ ruleName, result, node: decl, message, word: decl.prop });

  root.walkDecls((decl) => {
    const prop = decl.prop.toLowerCase();
    const value = normalize(decl.value);
    const parent = /** @type {import('postcss').Rule} */ (decl.parent);

    if (prop === 'color') {
      const reason = check(value, parent, 0);
      if (reason) report(decl, reason);
      return;
    }

    if (prop.startsWith('--text-') || prop.startsWith('--border-')) {
      // A diagram on a light surface remaps the borders of the inverse surface.
      if (scenes && prop.startsWith('--border-')) return;
      const single = value.match(SINGLE_VAR)?.[1];
      const allowed = single
        ? canonicalFor(prop).includes(single) || (scenes && TEXT_COLOR_TOKEN.test(value))
        : false;
      if (!allowed) {
        report(decl, messages.textProp(prop));
        return;
      }
      if (/headline-muted$/.test(prop) && !headlineMutedAllowed) {
        report(decl, messages.headlineMuted(prop));
      }
      return;
    }

    if (prop === 'opacity' && !scenes && !inKeyframes(decl)) {
      const n = Number.parseFloat(value);
      if (Number.isFinite(n) && n > 0 && n < 1) report(decl, messages.opacity(value));
      return;
    }

    if (PAINT_PROPS.has(prop)) {
      const surface = value.match(SINGLE_VAR)?.[1];
      if (!surface || !GROUND_PAINT[surface]) return;
      const color = parent.nodes.find((node) => node.type === 'decl' && node.prop === 'color');
      if (!color || !GROUND_PAINT[surface].test(normalize(color.value))) {
        report(decl, messages.groundPaint(surface, GROUND_PAINT_ROLES[surface]));
      }
    }
  });
};

rule.ruleName = ruleName;
rule.messages = messages;
rule.meta = meta;

export default stylelint.createPlugin(ruleName, rule);
