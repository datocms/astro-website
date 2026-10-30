/*
 * The story of the image lab of /media: the photo of a red Fiat 500 in front of
 * a grey house (fiat-500.jpg, from Unsplash), 3000 × 2000, a 4.1 MB JPEG.
 * The weights are a model, not measurements.
 */

export const DESCRIPTION =
  'The Images API: the original photo of a red Fiat 500, the URL with its parameters, and the photo that the URL makes, with its weight. A switch for each parameter.';

// `look`: the parameter changes how the photo looks. dpr changes only the
// file (the pixels, the weight).
export const PARAMS = [
  { key: 'w', code: 'w=600', hint: 'resize', look: true },
  { key: 'crop', code: 'ar=1:1&fit=crop', hint: 'on the focal point', look: true },
  { key: 'dpr', code: 'dpr=2', hint: '2× pixels', look: false },
  { key: 'sat', code: 'sat=-100', hint: 'greyscale', look: true },
  { key: 'blur', code: 'blur=40', hint: 'placeholder', look: true },
  { key: 'rot', code: 'rot=8', hint: 'rotate', look: true },
] as const;

export const FORMATS = [
  { key: 'jpg', label: 'JPEG', hint: undefined },
  { key: 'webp', label: 'WebP', hint: undefined },
  { key: 'avif', label: 'AVIF', hint: undefined },
  { key: 'auto', label: 'auto', hint: 'the best for the browser' },
] as const;

export const ORIGINAL = { spec: '3000 × 2000, JPEG', weight: '4.1 MB' };

export interface LabState {
  params: string[];
  format: string;
}

export type Change = { param: string; on: boolean } | { format: string };

export const STILL: LabState = { params: ['w', 'crop'], format: 'auto' };

// The demo: one change for each step, from the still back to the still.
// Each change sets a value (it does not toggle it), thus a step that
// plays again gives the same state. The first change is one that the
// photo shows; then the formats, with the weight that goes down to the one
// of `auto`; then the other parameters.
export const DEMO: Change[] = [
  { param: 'sat', on: true },
  { param: 'sat', on: false },
  { format: 'jpg' },
  { format: 'webp' },
  { format: 'auto' },
  { param: 'blur', on: true },
  { param: 'blur', on: false },
  { param: 'crop', on: false },
  { param: 'crop', on: true },
  { param: 'rot', on: true },
  { param: 'rot', on: false },
  { param: 'dpr', on: true },
  { param: 'dpr', on: false },
];

export function next(state: LabState, change: Change): LabState {
  if ('format' in change) return { ...state, format: change.format };
  const params = state.params.filter((p) => p !== change.param);
  return { ...state, params: change.on ? [...params, change.param] : params };
}

/**
 * What a change from `a` to `b` touches: the picture (a parameter with
 * `look`), and the file (its weight or its size and format). A change
 * that the picture does not show (a format, dpr) always goes to the file:
 * it is the thing that the URL changed.
 */
export function touches(a: LabState, b: LabState): { picture: boolean; file: boolean } {
  const looks = (s: LabState) =>
    PARAMS.filter((p) => p.look && s.params.includes(p.key))
      .map((p) => p.key)
      .join(' ');
  const picture = looks(a) !== looks(b);
  const [da, db] = [describe(a), describe(b)];
  const file = !picture || da.weight !== db.weight || da.spec !== db.spec;
  return { picture, file };
}

const ORIGINAL_KB = 4100;
// KB for one pixel, at the default quality.
const PER_PIXEL = { jpg: 0.00018, webp: 0.00012, avif: 0.00009 };

const kb = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1)} MB` : `${Math.max(1, Math.round(n))} KB`;

export function describe({ params, format }: LabState) {
  const on = (key: string) => params.includes(key);
  const dpr = on('dpr') ? 2 : 1;
  const w = (on('w') ? 600 : 3000) * dpr;
  const h = Math.round(on('crop') ? w : (w * 2) / 3);
  const fm = format === 'auto' ? 'avif' : format;
  let weight = w * h * PER_PIXEL[fm as keyof typeof PER_PIXEL];
  if (on('blur')) weight *= 0.3;
  if (on('sat')) weight *= 0.85;
  // One part for each parameter, with its `?` or `&`: the pill breaks a long query only between two parts
  const parts = [
    format === 'auto' ? 'auto=format' : `fm=${format}`,
    ...PARAMS.filter((p) => on(p.key)).map((p) => p.code),
  ].map((part, i) => `${i === 0 ? '?' : '&'}${part}`);
  const label = FORMATS.find((f) => f.key === fm)!.label;
  return {
    query: parts.join(''),
    parts,
    spec: `${w} × ${h}, ${label}`,
    weight: kb(Math.min(weight, ORIGINAL_KB)),
  };
}
