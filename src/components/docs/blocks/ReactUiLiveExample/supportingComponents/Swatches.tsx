import type { CSSProperties } from 'react';
import s from '../style.module.css';

type SwatchToken = string | [token: string, description: string];
type SwatchKind = 'color' | 'shadow' | 'font-size';

// [surfaceToken, inkToken, description?]
type PairSwatchEntry = [string, string, string?];

function commonPrefix(a: string, b: string): string {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return a.slice(0, i);
}

// The four "base" properties that form a context group when they share a prefix.
const GROUP_PROPS = ['surface', 'ink', 'border', 'outline'] as const;
type GroupProp = (typeof GROUP_PROPS)[number];

function getGroupProp(token: string): GroupProp | null {
  const lastDash = token.lastIndexOf('--');
  if (lastDash < 0) return null;
  const suffix = token.slice(lastDash + 2);
  const base = suffix.endsWith('-hover') ? suffix.slice(0, -6) : suffix;
  return (GROUP_PROPS as readonly string[]).includes(base) ? (base as GroupProp) : null;
}

function isHoverVariant(token: string): boolean {
  const lastDash = token.lastIndexOf('--');
  return lastDash >= 0 && token.slice(lastDash + 2).endsWith('-hover');
}

function getContextPrefix(token: string): string {
  return token.slice(0, token.lastIndexOf('--') + 2);
}

// For an ink token, derive the surface token to use as the "Aa" background.
// --color--primary--ink  →  --color--primary--surface
// --color--ink-subtle    →  --color--surface (standalone, no context prefix)
function inferSurfaceForInk(token: string): string {
  const parts = token.split('--').filter(Boolean);
  if (parts.length >= 3) {
    const context = parts.slice(1, -1).join('--');
    return `--color--${context}--surface`;
  }
  return '--color--surface';
}

type TokenProperty = 'surface' | 'ink' | 'border' | 'other';

function getTokenProperty(token: string): TokenProperty {
  const prop = token.split('--').filter(Boolean).at(-1) ?? '';
  if (prop.startsWith('surface')) return 'surface';
  if (prop.startsWith('ink')) return 'ink';
  if (prop.startsWith('border') || prop.startsWith('outline')) return 'border';
  return 'other';
}

type PropSlot = { base?: SwatchToken; hover?: SwatchToken };

type GroupedEntry =
  | { type: 'single'; entry: SwatchToken }
  | { type: 'group'; prefix: string; entries: Partial<Record<GroupProp, PropSlot>> };

function groupTokens(tokens: SwatchToken[]): GroupedEntry[] {
  // Build: contextPrefix → { prop → { baseIdx?, hoverIdx? } }
  const contextGroups = new Map<
    string,
    Partial<Record<GroupProp, { baseIdx?: number; hoverIdx?: number }>>
  >();
  tokens.forEach((entry, i) => {
    const token = Array.isArray(entry) ? entry[0] : entry;
    const prop = getGroupProp(token);
    if (!prop) return;
    const prefix = getContextPrefix(token);
    const group = contextGroups.get(prefix) ?? {};
    const slot = group[prop] ?? {};
    if (isHoverVariant(token)) {
      slot.hoverIdx = i;
    } else {
      slot.baseIdx = i;
    }
    group[prop] = slot;
    contextGroups.set(prefix, group);
  });

  const consumed = new Set<number>();
  const result: GroupedEntry[] = [];

  for (let i = 0; i < tokens.length; i++) {
    if (consumed.has(i)) continue;
    const entry = tokens[i]!;
    const token = Array.isArray(entry) ? entry[0] : entry;
    const prop = getGroupProp(token);

    if (prop) {
      const prefix = getContextPrefix(token);
      const group = contextGroups.get(prefix)!;
      const baseCount = GROUP_PROPS.filter((p) => group[p]?.baseIdx !== undefined).length;

      if (baseCount > 1) {
        const allIndices = GROUP_PROPS.flatMap((p) => {
          const slot = group[p];
          return [slot?.baseIdx, slot?.hoverIdx].filter((idx): idx is number => idx !== undefined);
        });
        const minIdx = Math.min(...allIndices);

        if (i === minIdx) {
          // First occurrence of this group — emit all members in canonical prop order
          const entries: Partial<Record<GroupProp, PropSlot>> = {};
          for (const p of GROUP_PROPS) {
            const slot = group[p];
            if (!slot) continue;
            const propSlot: PropSlot = {};
            if (slot.baseIdx !== undefined) {
              propSlot.base = tokens[slot.baseIdx]!;
              consumed.add(slot.baseIdx);
            }
            if (slot.hoverIdx !== undefined) {
              propSlot.hover = tokens[slot.hoverIdx]!;
              consumed.add(slot.hoverIdx);
            }
            entries[p] = propSlot;
          }
          result.push({ type: 'group', prefix, entries });
          continue;
        } else {
          // Already handled when we processed minIdx
          continue;
        }
      }
    }

    result.push({ type: 'single', entry });
  }

  return result;
}

// ─── chip components ────────────────────────────────────────────────────────

function PairChip({ surfaceToken, inkToken }: { surfaceToken: string; inkToken: string }) {
  const style = {
    '--pair-surface': `var(${surfaceToken})`,
    '--pair-ink': `var(${inkToken})`,
  } as CSSProperties;
  return (
    <div className={`${s.swatchPreview} ${s.swatchPreviewPair}`} style={style}>
      <div className={s.swatchPreviewPairFill}>
        <span className={s.swatchPreviewPairSample}>Lorem ipsum</span>
      </div>
    </div>
  );
}

function SingleChip({ token, kind }: { token: string; kind: SwatchKind }) {
  const tokenVar = { '--swatch-token': `var(${token})` } as CSSProperties;

  if (kind === 'shadow') {
    return (
      <div className={`${s.swatchPreview} ${s.swatchPreviewShadow}`}>
        <div className={s.swatchPreviewShadowChip} style={tokenVar} />
      </div>
    );
  }

  if (kind === 'font-size') {
    return (
      <div className={`${s.swatchPreview} ${s.swatchPreviewFontSize}`}>
        <span className={s.swatchPreviewFontSizeSample} style={tokenVar}>
          Aa
        </span>
      </div>
    );
  }

  const prop = getTokenProperty(token);

  if (prop === 'ink') {
    const surfaceToken = inferSurfaceForInk(token);
    const style = {
      '--swatch-token': `var(${token})`,
      '--ink-surface': `var(${surfaceToken}, var(--color--surface))`,
    } as CSSProperties;
    return (
      <div className={`${s.swatchPreview} ${s.swatchPreviewInk}`} style={style}>
        <span className={s.swatchPreviewInkSample}>Aa</span>
      </div>
    );
  }

  if (prop === 'border') {
    return (
      <div className={`${s.swatchPreview} ${s.swatchPreviewBorder}`} style={tokenVar}>
        <div className={s.swatchPreviewBorderChip} />
      </div>
    );
  }

  return (
    <div className={`${s.swatchPreview} ${s.swatchPreviewColor}`}>
      <div className={s.swatchPreviewColorFill} style={tokenVar} />
    </div>
  );
}

// ─── group chip ───────────────────────────────────────────────────────────────
// Corner-crop rounded rect: surface fill inside, border ring on the edge,
// outline as a box-shadow halo outside. Shows all group properties at once.

function GroupChip({ entries }: { entries: Partial<Record<GroupProp, PropSlot>> }) {
  const tok = (p: GroupProp, variant: 'base' | 'hover') => {
    const e = entries[p]?.[variant];
    return e ? (Array.isArray(e) ? e[0] : e) : undefined;
  };

  const v = (name: string, token: string | undefined) => (token ? { [name]: `var(${token})` } : {});

  const style = {
    ...v('--group-surface', tok('surface', 'base')),
    ...v('--group-surface-hover', tok('surface', 'hover')),
    ...v('--group-ink', tok('ink', 'base')),
    ...v('--group-ink-hover', tok('ink', 'hover')),
    ...v('--group-border', tok('border', 'base')),
    ...v('--group-border-hover', tok('border', 'hover')),
    ...v('--group-outline', tok('outline', 'base')),
    ...v('--group-outline-hover', tok('outline', 'hover')),
  } as CSSProperties;

  return (
    <div className={`${s.swatchPreview} ${s.swatchPreviewGroupChip}`} style={style}>
      <div className={s.swatchPreviewGroupRect}>{tok('ink', 'base') && 'Lorem ipsum'}</div>
    </div>
  );
}

// ─── exported components ─────────────────────────────────────────────────────

export function PairSwatches({ tokens }: { tokens: PairSwatchEntry[] }) {
  return (
    <div className={s.swatches}>
      {tokens.map(([surfaceToken, inkToken, description]) => {
        const prefix = commonPrefix(surfaceToken, inkToken);
        const surfaceSuffix = surfaceToken.slice(prefix.length);
        const inkSuffix = inkToken.slice(prefix.length);

        return (
          <div key={surfaceToken} className={s.swatch}>
            <PairChip surfaceToken={surfaceToken} inkToken={inkToken} />
            <div className={s.swatchInfo}>
              <div className={s.swatchPairTokens}>
                <code className={`${s.swatchToken} ${s.swatchPairPrefix}`}>{prefix}</code>
                <div className={s.swatchPairSuffixes}>
                  <code className={s.swatchPairSuffix}>{surfaceSuffix}</code>
                  <code className={s.swatchPairSuffix}>{inkSuffix}</code>
                </div>
              </div>
              {description && <div className={s.swatchDescription}>{description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Swatches({ tokens, kind = 'color' }: { tokens: SwatchToken[]; kind?: SwatchKind }) {
  const groups =
    kind === 'color'
      ? groupTokens(tokens)
      : tokens.map((entry) => ({ type: 'single' as const, entry }));

  return (
    <div className={s.swatches}>
      {groups.map((group, gi) => {
        if (group.type === 'group') {
          const { prefix, entries } = group;

          return (
            <div key={prefix} className={s.swatch}>
              <GroupChip entries={entries} />
              <div className={s.swatchInfo}>
                <div className={s.swatchPairTokens}>
                  <code className={`${s.swatchToken} ${s.swatchPairPrefix}`}>{prefix}</code>
                  <div className={s.swatchPairSuffixRows}>
                    {GROUP_PROPS.flatMap((p) => {
                      const slot = entries[p];
                      if (!slot?.base) return [];
                      const [, desc] = Array.isArray(slot.base)
                        ? slot.base
                        : [slot.base, undefined];
                      const rows = [
                        <div key={p} className={s.swatchPairSuffixLine}>
                          <code className={s.swatchPairSuffix}>{p}</code>
                          {desc && <span className={s.swatchDescription}>{desc}</span>}
                        </div>,
                      ];
                      if (slot.hover) {
                        const [, hoverDesc] = Array.isArray(slot.hover)
                          ? slot.hover
                          : [slot.hover, undefined];
                        rows.push(
                          <div key={`${p}-hover`} className={s.swatchPairSuffixLine}>
                            <code className={s.swatchPairSuffix}>{p}-hover</code>
                            {hoverDesc && <span className={s.swatchDescription}>{hoverDesc}</span>}
                          </div>,
                        );
                      }
                      return rows;
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        }

        const [token, description] = Array.isArray(group.entry)
          ? group.entry
          : [group.entry, undefined];
        return (
          <div key={token ?? gi} title={token} className={s.swatch}>
            <SingleChip token={token!} kind={kind} />
            <div className={s.swatchInfo}>
              <code className={s.swatchToken}>{token}</code>
              {description && <div className={s.swatchDescription}>{description}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
