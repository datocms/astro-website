export const GITHUB_LOGO =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZXNtb2tlIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+R2l0SHViPC90aXRsZT48cGF0aCBkPSJNMTIgLjI5N2MtNi42MyAwLTEyIDUuMzczLTEyIDEyIDAgNS4zMDMgMy40MzggOS44IDguMjA1IDExLjM4NS42LjExMy44Mi0uMjU4LjgyLS41NzcgMC0uMjg1LS4wMS0xLjA0LS4wMTUtMi4wNC0zLjMzOC43MjQtNC4wNDItMS42MS00LjA0Mi0xLjYxQzQuNDIyIDE4LjA3IDMuNjMzIDE3LjcgMy42MzMgMTcuN2MtMS4wODctLjc0NC4wODQtLjcyOS4wODQtLjcyOSAxLjIwNS4wODQgMS44MzggMS4yMzYgMS44MzggMS4yMzYgMS4wNyAxLjgzNSAyLjgwOSAxLjMwNSAzLjQ5NS45OTguMTA4LS43NzYuNDE3LTEuMzA1Ljc2LTEuNjA1LTIuNjY1LS4zLTUuNDY2LTEuMzMyLTUuNDY2LTUuOTMgMC0xLjMxLjQ2NS0yLjM4IDEuMjM1LTMuMjItLjEzNS0uMzAzLS41NC0xLjUyMy4xMDUtMy4xNzYgMCAwIDEuMDA1LS4zMjIgMy4zIDEuMjMuOTYtLjI2NyAxLjk4LS4zOTkgMy0uNDA1IDEuMDIuMDA2IDIuMDQuMTM4IDMgLjQwNSAyLjI4LTEuNTUyIDMuMjg1LTEuMjMgMy4yODUtMS4yMy42NDUgMS42NTMuMjQgMi44NzMuMTIgMy4xNzYuNzY1Ljg0IDEuMjMgMS45MSAxLjIzIDMuMjIgMCA0LjYxLTIuODA1IDUuNjI1LTUuNDc1IDUuOTIuNDIuMzYuODEgMS4wOTYuODEgMi4yMiAwIDEuNjA2LS4wMTUgMi44OTYtLjAxNSAzLjI4NiAwIC4zMTUuMjEuNjkuODI1LjU3QzIwLjU2NSAyMi4wOTIgMjQgMTcuNTkyIDI0IDEyLjI5N2MwLTYuNjI3LTUuMzczLTEyLTEyLTEyIi8+PC9zdmc+';

export const NPM_LOGO =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSJ3aGl0ZXNtb2tlIiByb2xlPSJpbWciIHZpZXdCb3g9IjAgMCAyNCAyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48dGl0bGU+bnBtPC90aXRsZT48cGF0aCBkPSJNMS43NjMgMEMuNzg2IDAgMCAuNzg2IDAgMS43NjN2MjAuNDc0QzAgMjMuMjE0Ljc4NiAyNCAxLjc2MyAyNGgyMC40NzRjLjk3NyAwIDEuNzYzLS43ODYgMS43NjMtMS43NjNWMS43NjNDMjQgLjc4NiAyMy4yMTQgMCAyMi4yMzcgMHpNNS4xMyA1LjMyM2wxMy44MzcuMDE5LS4wMDkgMTMuODM2aC0zLjQ2NGwuMDEtMTAuMzgyaC0zLjQ1NkwxMi4wNCAxOS4xN0g1LjExM3oiLz48L3N2Zz4=';

// Verdana 11px character widths in tenths of pixels (from shields.io badge-maker)
const charWidths: Record<string, number> = {
  ' ': 33,
  '!': 39,
  '"': 49,
  '#': 73,
  $: 58,
  '%': 83,
  '&': 71,
  "'": 27,
  '(': 39,
  ')': 39,
  '*': 47,
  '+': 73,
  ',': 33,
  '-': 38,
  '.': 33,
  '/': 43,
  '0': 58,
  '1': 58,
  '2': 58,
  '3': 58,
  '4': 58,
  '5': 58,
  '6': 58,
  '7': 58,
  '8': 58,
  '9': 58,
  ':': 38,
  ';': 38,
  '<': 73,
  '=': 73,
  '>': 73,
  '?': 53,
  '@': 88,
  A: 67,
  B: 67,
  C: 67,
  D: 73,
  E: 61,
  F: 56,
  G: 73,
  H: 72,
  I: 39,
  J: 47,
  K: 67,
  L: 56,
  M: 83,
  N: 72,
  O: 73,
  P: 61,
  Q: 73,
  R: 67,
  S: 61,
  T: 61,
  U: 72,
  V: 67,
  W: 94,
  X: 61,
  Y: 61,
  Z: 61,
  '[': 39,
  '\\': 43,
  ']': 39,
  '^': 73,
  _: 55,
  '`': 55,
  a: 56,
  b: 58,
  c: 50,
  d: 58,
  e: 56,
  f: 33,
  g: 58,
  h: 58,
  i: 24,
  j: 30,
  k: 56,
  l: 24,
  m: 88,
  n: 58,
  o: 58,
  p: 58,
  q: 58,
  r: 38,
  s: 47,
  t: 38,
  u: 58,
  v: 53,
  w: 78,
  x: 53,
  y: 53,
  z: 47,
  '{': 39,
  '|': 39,
  '}': 39,
  '~': 73,
};

function measureText(text: string): number {
  let width = 0;
  for (const char of text) {
    width += charWidths[char] ?? 58;
  }
  return Math.round(width * 1.2);
}

// Logo occupies 19px (5px left padding + 14px icon) = 190 SVG units
const LOGO_SPACE = 190;
const LABEL_PAD_RIGHT = 80; // padding after label text (8px)
const VALUE_PAD = 100; // padding around value text (5px per side)

export function makeBadge(label: string, value: string, color: string, logo: string) {
  const labelTextWidth = measureText(label);
  const valueTextWidth = measureText(value);

  const labelRectWidth = Math.round((LOGO_SPACE + labelTextWidth + LABEL_PAD_RIGHT) / 10);
  const valueRectWidth = Math.round((valueTextWidth + VALUE_PAD) / 10);
  const totalWidth = labelRectWidth + valueRectWidth;

  // Label text centered between logo right edge and label rect right edge
  const labelX = LOGO_SPACE / 2 + labelRectWidth * 5;
  // Value text centered in value section
  const valueX = labelRectWidth * 10 + valueRectWidth * 5 - 10;

  return {
    totalWidth,
    labelRectWidth,
    valueRectWidth,
    labelTextWidth,
    valueTextWidth,
    labelX,
    valueX,
    color,
    label,
    value,
    logo,
  };
}

export type BadgeData = ReturnType<typeof makeBadge> & { url: string };

let badgeCounter = 0;

export function renderBadgeHtml(badge: BadgeData): string {
  const id = `badge-${badgeCounter++}`;
  const gradientId = `s-${id}`;
  const clipId = `r-${id}`;
  const ariaLabel = `${badge.label}: ${badge.value}`;

  return `<a href="${badge.url}" target="_blank" rel="noreferrer">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="${badge.totalWidth}"
      height="20"
      role="img"
      aria-label="${ariaLabel}"
    >
      <title>${ariaLabel}</title>
      <linearGradient id="${gradientId}" x2="0" y2="100%">
        <stop offset="0" stop-color="#bbb" stop-opacity=".1" />
        <stop offset="1" stop-opacity=".1" />
      </linearGradient>
      <clipPath id="${clipId}">
        <rect width="${badge.totalWidth}" height="20" rx="3" fill="#fff" />
      </clipPath>
      <g clip-path="url(#${clipId})">
        <rect width="${badge.labelRectWidth}" height="20" fill="#555" />
        <rect
          x="${badge.labelRectWidth}"
          width="${badge.valueRectWidth}"
          height="20"
          fill="${badge.color}"
        />
        <rect
          width="${badge.totalWidth}"
          height="20"
          fill="url(#${gradientId})"
        />
      </g>
      <g
        fill="#fff"
        text-anchor="middle"
        font-family="Verdana,Geneva,DejaVu Sans,sans-serif"
        text-rendering="geometricPrecision"
        font-size="110"
      >
        <image x="5" y="3" width="14" height="14" href="${badge.logo}" />
        <text
          aria-hidden="true"
          x="${badge.labelX}"
          y="150"
          fill="#010101"
          fill-opacity=".3"
          transform="scale(.1)"
          textLength="${badge.labelTextWidth}"
        >
          ${badge.label}
        </text>
        <text
          x="${badge.labelX}"
          y="140"
          transform="scale(.1)"
          fill="#fff"
          textLength="${badge.labelTextWidth}"
        >
          ${badge.label}
        </text>
        <text
          aria-hidden="true"
          x="${badge.valueX}"
          y="150"
          fill="#010101"
          fill-opacity=".3"
          transform="scale(.1)"
          textLength="${badge.valueTextWidth}"
        >
          ${badge.value}
        </text>
        <text
          x="${badge.valueX}"
          y="140"
          transform="scale(.1)"
          fill="#fff"
          textLength="${badge.valueTextWidth}"
        >
          ${badge.value}
        </text>
      </g>
    </svg>
  </a>`;
}
