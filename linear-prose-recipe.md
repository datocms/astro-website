# Linear's long-form prose: the recipe

Measured on 2026-11-04 from:

- https://linear.app/docs/agents-in-linear (docs, size `regular`)
- https://linear.app/customers/openai (customer story, size `large`)
- https://linear.app/now/introducing-loops (blog, size `large`)
- Extra pages for other elements: `/docs/editor` (inline code, kbd), `/docs/api-and-webhooks` (callouts), `/changelog` (videos, h4, many kbd and code)

All three pages use **one** prose component (`.prose`) with a size modifier (`size-small | size-regular | size-large`). Each modifier only sets custom properties. The values below come from the live stylesheet, and I checked them against `getBoundingClientRect()` gaps at 1440px and 390px. The site is dark only on these pages, so all the colours are dark-theme values.

---

## 1. Why it reads so easily (the short version)

1. **A narrow column.** The text is 624px wide (650px in docs). At 17px that is about 65–70 characters per line. Wide images fill the prose box (up to 976px), but the text never does (see §5).
2. **Body text is a grey, not white.** Body is `#d0d6e0` on `#08090a`. Headings, `strong` and links are `#f7f8f8`. The eye goes to the bright parts, and long text does not glare.
3. **Small type ratio, big spacing ratio.** A heading is only 1.41× the body (24 / 17). The structure comes from space: **56px above a heading, 12–16px below it**. The heading clearly belongs to the text after it.
4. **The gap between paragraphs is less than one line.** 20px for a 27.2px line (0.74 line). In docs, 16px for a 24px line (0.67 line). The paragraphs read as one continuous text, not as separate cards.
5. **A list stays close to its intro.** `p + ul` is 12px, not 20px. Items are 8px apart.
6. **Spacing is in fixed px and does not shrink on mobile.** Only the type sizes change at 768px. A heading still gets 56px above it on a phone.
7. **Weights from a variable font.** 400 for body, 590 for headings and bold (not 600 or 700). Bold is also brighter, so it stands out by colour, not only by weight.
8. **Inter with `cv01` and `ss03`**, `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeLegibility`.

---

## 2. Type scale

Font: `"Inter Variable"` (fallbacks `"SF Pro Display", -apple-system, …`), `font-feature-settings: "cv01", "ss03"`.
Mono: `"Berkeley Mono", ui-monospace, "SF Mono", Menlo, monospace`, with no font features.

### Text tokens

| Token          | Size             | Line height  | Tracking |
| -------------- | ---------------- | ------------ | -------- |
| `text-micro`   | 0.75rem (12px)   | 1.4          | 0        |
| `text-mini`    | 0.8125rem (13px) | 1.5          | -0.01em  |
| `text-small`   | 0.875rem (14px)  | 1.5 (21/14)  | -0.013em |
| `text-regular` | 0.9375rem (15px) | 1.6 (24px)   | -0.011em |
| `text-large`   | 1.0625rem (17px) | 1.6 (27.2px) | 0        |

### Title tokens

| Token     | Size           | Line height | Tracking |
| --------- | -------------- | ----------- | -------- |
| `title-1` | 1.0625rem (17) | 1.4         | -0.012em |
| `title-2` | 1.25rem (20)   | 1.33        | -0.012em |
| `title-3` | 1.5rem (24)    | 1.33        | -0.012em |
| `title-4` | 2rem (32)      | 1.125       | -0.022em |
| `title-5` | 2.5rem (40)    | 1.1         | -0.022em |
| `title-6` | 3rem (48)      | 1           | -0.022em |
| `title-7` | 3.5rem (56)    | 1.1         | -0.022em |
| `title-8` | 4rem (64)      | 1.06        | -0.022em |
| `title-9` | 4.5rem (72)    | 1           | -0.022em |

Patterns:

- Tracking has only three values: 0 (large body), about -0.011em (small text and titles up to 24px), -0.022em (display, 32px and up).
- Line height goes down as size goes up: 1.6 → 1.5 → 1.4 → 1.33 → 1.1 → 1.

### Weights

`normal 400`, `medium 510`, `semibold 590`, `bold 680`. Headings, `strong`, `b` and pull quotes are 590. `kbd` is 510.

### What each prose size uses

| Element                   | `size-large` (blog, customers) desktop | `size-large` ≤768px | `size-regular` (docs) desktop | `size-regular` ≤768px |
| ------------------------- | -------------------------------------- | ------------------- | ----------------------------- | --------------------- |
| body `p`, `li`            | text-large 17/27.2, 0                  | text-regular 15/24  | text-regular 15/24, -0.011em  | same                  |
| `h1` (in prose)           | title-5 40/1.1                         | title-5             | title-5                       | title-4 32/1.125      |
| `h2`                      | title-3 24/1.33                        | title-3 24          | title-3 24/1.33               | title-2 20/1.33       |
| `h3`                      | title-3 24/1.33                        | title-2 20/1.33     | 20px / 1.6, 0                 | title-1 17/1.4        |
| `h4`                      | title-1 17/1.4                         | title-1             | title-1 17/1.4                | text-regular 15/1.6   |
| page title (not in prose) | title-6 48/1, `text-wrap: balance`     | 32/36               | title-4 32/36                 | 32/36                 |

There is also `size-small`: text-small body (14/21) with 14px block spacing.

Note: in `size-large`, h2 and h3 are the **same size**. The customer and blog pages use only one heading level in the body (`h3`, 24px). In the docs, `h3` is 20px with a loose 1.6 line height, so it looks like a "bold paragraph lead" more than a title.

---

## 3. Colour

| Role                                                | Value                     |
| --------------------------------------------------- | ------------------------- |
| Page background                                     | `#08090a`                 |
| Body text (`text-secondary`)                        | `#d0d6e0`                 |
| Headings, strong, links, quotes (`text-primary`)    | `#f7f8f8`                 |
| Captions, quote author (`text-tertiary`)            | `#8a8f98`                 |
| Link underline (`text-quaternary`)                  | `#62666d`                 |
| Code / callout surface (`bg-secondary`)             | `#1c1c1f`                 |
| Inline code border (`border-secondary`)             | `#34343a`                 |
| Callout / pre / video border (`border-translucent`) | `#ffffff0d` (white at 5%) |
| `hr` (`border-primary`)                             | `#23252a`                 |

Four steps of text colour do most of the hierarchy work: primary → secondary → tertiary → quaternary.

---

## 4. Vertical rhythm (the important part)

The rule is a lobotomised owl with exceptions. All the values are margin-top on the next element. No element has a margin-bottom, so margins never collapse in a surprising way.

| Pair                                       | `size-large`                                              | `size-regular` (docs) | Measured        |
| ------------------------------------------ | --------------------------------------------------------- | --------------------- | --------------- |
| `* + *` (default, `--block-spacing`)       | **20px**                                                  | **16px**              | ✔               |
| `* + h2`                                   | **56px**                                                  | **56px**              | ✔               |
| `* + h3`                                   | 56px (32px in the base rule, overridden by the `h3` rule) | 56px                  | ✔               |
| `p + h4`                                   | 28px                                                      | 28px                  | ✔ (changelog)   |
| `h2 + h3`                                  | 24px                                                      | 24px                  |                 |
| `h2 + p`                                   | 12px                                                      | **12px**              | ✔               |
| `h3 + p`                                   | **16px**                                                  | 6px                   | ✔ (16)          |
| `h4 + p`                                   | 10px                                                      | 10px                  |                 |
| `p + ul`, `p + ol`                         | **12px**                                                  | **12px**              | ✔               |
| `li + li`, `li > ul`                       | 8px                                                       | 8px                   |                 |
| `* + figure` / `figure + *` (video, quote) | 32px                                                      | 20px                  | ✔               |
| `figure` with image                        | **48px** (32px ≤768px)                                    | 20px (16px ≤768px)    | ✔ (all widths)  |
| quote author / caption below quote         | 12px                                                      | 12px                  | ✔               |
| image caption                              | 13px                                                      | 13px                  | stylesheet only |

Ratios that make it work:

- **Space above a heading ÷ space below**: 56 / 12 = 4.7 (h2), 56 / 16 = 3.5 (h3). A heading is a "lead-in", attached to its section.
- **Paragraph gap ÷ line height**: 20 / 27.2 = 0.74; 16 / 24 = 0.67. Paragraph breaks are visible but quiet.
- **Section gap ÷ paragraph gap**: 56 / 20 = 2.8; 56 / 16 = 3.5. A new section is clear, with no rule or ornament.
- **Media gets more air than text**: 32–48px around a figure, so an image is a pause, not part of the paragraph.

The 56px before a heading **stays the same on mobile**. Only the image margins shrink (48 → 32, 20 → 16).

---

## 5. Measure and width

Measured on 2026-11-04 at 390, 800, 1024 and 1440px, and read from the prose stylesheet.

- On the blog and customer pages the prose box is as wide as the page: `calc(1024px - 48px)`, thus 976px. It is `display: block`.
- `--prose-max-width: 624px`. In `.center` prose, each child that is not `data-wide="true"` gets `max-width: 624px; margin-inline: auto`.
- **A wide image is not a negative margin.** It is the one child with no cap: `figure:has(img, picture)[data-wide="true"] { max-width: 976px; width: 100%; }`. It fills the width that the page has:

  | Viewport | Text | Wide image | Past each side of the text |
  | -------- | ---- | ---------- | -------------------------- |
  | 1440     | 624  | 976        | 176 (1.56 × the text)      |
  | 1024     | 624  | 961        | 168                        |
  | 800      | 624  | 737        | 56                         |
  | 390      | 327  | 327        | 0                          |

  The breakout gets smaller with the page. No breakpoint stops it.

- **The negative margin is only for a video**, in prose that is not `.center` and is 624px wide (the changelog): `margin-inline: calc(var(--wide-inset) / -2); width: calc(100% + var(--wide-inset))`, with `--wide-inset: calc(1024px - 48px - 624px)` (352px). At ≤1280px it goes back to `width: 100%; margin-inline: 0`.
- The caption of a wide figure stays at 624px and centred, so it lines up with the text, not with the image.
- Docs: the column is 650px (the docs grid sets it; there is no `center`). An image is the full column. There is no breakout.
- Mobile: 390px viewport − 2 × 24px gutter = 327px column.

---

## 6. Elements

### Paragraphs

- `p:empty { display: none }`, so stray empty paragraphs from the CMS do not add gaps.
- `.prose * { word-break: break-word }`.

### Bold

`strong, b { font-weight: 590; color: var(--color-text-primary) }`. Bold is brighter **and** heavier.

### Links (`a:not([class])`)

```css
color: var(--color-text-primary); /* #f7f8f8 */
text-decoration-line: underline;
text-decoration-color: var(--color-text-quaternary); /* #62666d */
text-decoration-thickness: from-font;
text-underline-offset: clamp(2px, 0.175em, 4px); /* 2.975px at 17px */
transition: color, text-decoration-color, background;
/* hover: text-decoration-color: var(--color-text-primary) */
```

The link is as bright as a heading, and its underline is dim. On hover only the underline changes.

### Heading anchors

After each heading there is a 24×24 anchor icon (`margin-left: 6px`, `vertical-align: middle`). It is hidden (`opacity: 0`) and shows on hover or focus of the heading. The icon slides 8px from the left.

### Lists

Custom markers, not `list-style`:

```css
.prose :is(ul, ol) {
  padding-left: 24px;
  list-style: none;
}
.prose :is(ul, ol) > li {
  position: relative;
}
.prose ul > li::before {
  content: counter(prose-ul, disc);
  position: absolute;
  right: calc(100% + 1.5px); /* .0625 × 24px */
  min-width: 24px;
  text-align: center;
}
.prose ol > li::before {
  content: counter(prose-ol) '. ';
  position: absolute;
  right: calc(100% + 6px); /* .25 × 24px */
  min-width: 24px;
  text-align: end;
  font-variant-numeric: tabular-nums;
}
```

- Nesting: `disc → circle → disc`; ordered `1. → a. → i.`
- `ol[start]` resets the counter from a `--start` custom property.
- The marker hangs in the 24px gutter. Numbers are right-aligned and tabular, so "9." and "10." line up on the dot.
- The marker uses the colour of the body text, not a different colour.

### Pull quote (`blockquote` or `figure > blockquote`)

```css
font: 590 1.5rem/1.33 Inter; /* title-3 */
letter-spacing: -0.012em;
color: var(--color-text-primary);
quotes: '“' '”' '‘' '’';
/* p: text-indent: -.5em; ::before open-quote; ::after close-quote */
```

- Hanging punctuation: `text-indent: -0.5em` pushes the opening quote into the margin, so the text edge stays straight.
- Author (`figcaption` or `footer`): text-small 14/21, `#8a8f98`, weight 400, `margin-top: 12px`.
- The whole figure gets 32px above and below (in `size-large`).

### Images

Measured on `/now/introducing-loops` (a wide image) and `/docs/agents-in-linear` (docs images); the caption values come from the stylesheet, because no image on these pages has a caption.

- `figure` with `img`: 48px above and below (`size-large`), 32px ≤768px. In the docs, 20px (16px ≤768px).
- The figure has `margin-block`, thus also a margin below. The prose is `display: block`, so the margins collapse: a paragraph after the figure is 48px below it, not 48 + 20. Before a heading, the 56px of the heading wins.
- `border-radius: 8px` on the image in the blog, 12px in the docs.
- Caption: text-micro 12/1.4, weight 400, `#8a8f98`, `margin-top: 13px`, `text-wrap: balance`, `text-align: left`, max 624px and centred.
- The caption of a quote is different: text-small 14/21, `margin-top: 12px`.

### Video

- Wrapper `border-radius: 8px; overflow: hidden; border: 1px solid #ffffff0d`.
- A wide video uses the negative margins of §5, not the wide image rule.
- `video { max-width: 100%; height: auto }`.
- Same figure spacing as other figures (32px in `size-large`).
- Custom controls with a fade-out when idle. That is not about typography.

### Inline code

```css
code:not(pre code) {
  font-family: var(--font-monospace);
  font-feature-settings: normal;
  font-variation-settings: normal;
  font-size: 0.875em; /* 14.875px at 17px; 13.125px at 15px */
  line-height: 1.3; /* lower than body, so the line box does not grow */
  padding: 0.1em 0.25em;
  border-radius: 0.3em;
  background: var(--color-bg-secondary); /* #1c1c1f */
  border: 1px solid var(--color-border-secondary); /* #34343a */
  box-decoration-break: clone; /* each line piece gets its own padding and corners */
}
```

All the values are in `em`, so inline code scales with the text around it.

### Code block (`pre`)

None of the pages that I checked had a code block in the prose. These values come from the global stylesheet:

```css
pre {
  font-family: var(--font-monospace);
  font-size: var(--text-small-size); /* 14px */
  line-height: 1.5;
  tab-size: 4;
  hyphens: none;
  color: var(--color-text-secondary);
  background: var(--color-bg-secondary); /* #1c1c1f */
  border: 1px solid var(--color-border-translucent); /* white 5% */
  border-radius: 8px;
  padding: 16px;
  overflow-x: auto;
}
```

With Shiki: `padding-block: 16px` on `pre`, and `padding-inline: 16px 64px` on each line (the 64px right space is for the copy button). A highlighted line takes `--color-bg-quaternary` across the full width. The copy button shows on hover of `pre`, and is always visible on touch screens.

### Keyboard keys (`kbd`)

```css
kbd {
  display: inline-block;
  min-width: 24px;
  padding: 3px 6px;
  margin: 0 1px;
  font-size: 0.8em;
  line-height: normal;
  font-weight: 510;
  text-align: center;
  border-radius: 5px;
  background: var(--color-bg-primary);
  box-shadow: 0 0 0 1px var(--color-border-tertiary); /* #3e3e44, a ring and not a border */
}
kbd::first-letter {
  text-transform: uppercase;
}
```

### Callout

```css
.callout {
  display: flex;
  background: var(--color-bg-secondary); /* #1c1c1f */
  border: 1px solid var(--color-border-translucent);
  border-radius: 8px;
  padding: 12px 16px;
}
.callout-icon {
  flex-shrink: 0;
  margin-right: 16px;
}
.callout-icon svg {
  width: 18px;
  height: 18px;
  margin-top: 1px;
  fill: var(--color-text-primary);
}
.callout-content {
  font: text-small;
  color: var(--color-text-secondary);
} /* 14 / 21, -0.013em */
```

The callout text is one step smaller than the body. It sits in normal flow (16px in docs). The label ("Note:") is a `strong`, so it is bright and 590.

### Tables

`font-size: text-small` (14/21, -0.013em), `border-collapse: separate; border-spacing: 0; width: 100%`. No table was on the pages that I checked.

### `hr`

`border-top: 1px solid #23252a; height: 0`. No other style.

---

## 7. The whole recipe as CSS

```css
/* The tokens. */
:root {
  --font-regular: 'Inter Variable', 'SF Pro Display', -apple-system, system-ui, sans-serif;
  --font-monospace: 'Berkeley Mono', ui-monospace, 'SF Mono', Menlo, monospace;

  --text-micro-size: 0.75rem;
  --text-micro-line-height: 1.4;
  --text-micro-letter-spacing: 0;
  --text-small-size: 0.875rem;
  --text-small-line-height: 1.5;
  --text-small-letter-spacing: -0.013em;
  --text-regular-size: 0.9375rem;
  --text-regular-line-height: 1.6;
  --text-regular-letter-spacing: -0.011em;
  --text-large-size: 1.0625rem;
  --text-large-line-height: 1.6;
  --text-large-letter-spacing: 0;
  --title-1-size: 1.0625rem;
  --title-1-line-height: 1.4;
  --title-1-letter-spacing: -0.012em;
  --title-2-size: 1.25rem;
  --title-2-line-height: 1.33;
  --title-2-letter-spacing: -0.012em;
  --title-3-size: 1.5rem;
  --title-3-line-height: 1.33;
  --title-3-letter-spacing: -0.012em;
  --title-4-size: 2rem;
  --title-4-line-height: 1.125;
  --title-4-letter-spacing: -0.022em;
  --title-5-size: 2.5rem;
  --title-5-line-height: 1.1;
  --title-5-letter-spacing: -0.022em;

  --font-weight-normal: 400;
  --font-weight-medium: 510;
  --font-weight-semibold: 590;

  --color-text-primary: #f7f8f8;
  --color-text-secondary: #d0d6e0;
  --color-text-tertiary: #8a8f98;
  --color-text-quaternary: #62666d;

  --prose-max-width: 624px;
}

body {
  font-family: var(--font-regular);
  font-feature-settings: 'cv01', 'ss03';
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* The size modifiers set only custom properties. */
.prose {
  --list-inset: 24px;
  --block-spacing-small: 8px;
  --block-spacing: 20px;
  --h2-bottom-margin: 12px;
  --h3-bottom-margin: 6px;
  --figure-margin: 20px;

  font-size: var(--p-size);
  line-height: var(--p-line-height);
  letter-spacing: var(--p-letter-spacing);
  color: var(--color-text-secondary);
}
.prose.size-regular {
  --block-spacing: 16px;
  --p-size: var(--text-regular-size);
  --p-line-height: var(--text-regular-line-height);
  --p-letter-spacing: var(--text-regular-letter-spacing);
  --h2-size: var(--title-3-size); /* 24px. 20px at 768px and less. */
  --h3-size: 20px; /* line height 1.6. 17px at 768px and less. */
}
.prose.size-large {
  --p-size: var(--text-large-size);
  --p-line-height: var(--text-large-line-height);
  --p-letter-spacing: var(--text-large-letter-spacing);
  --h2-size: var(--title-3-size);
  --h3-size: var(--title-3-size);
  --h3-bottom-margin: 16px;
  --h4-bottom-margin: 18px;
  --figure-margin: 32px;
  --image-figure-margin: 48px;
  --image-figure-margin-tablet: 32px;
}
@media (max-width: 768px) {
  /* The body goes down to 15px. The spacing does not change. */
  .prose.size-large {
    --p-size: var(--text-regular-size);
    --p-line-height: var(--text-regular-line-height);
    --p-letter-spacing: var(--text-regular-letter-spacing);
    --h3-size: var(--title-2-size);
  }
}

/* The flow. All the space is a margin-top on the next element. */
.prose > * + * {
  margin-top: var(--block-spacing);
}
.prose > * + h2,
.prose > h2,
.prose > h3 {
  margin-top: 56px;
}
.prose > h2 + h3 {
  margin-top: 24px;
}
.prose > p + h4 {
  margin-top: 28px;
}
.prose > h2 + p {
  margin-top: var(--h2-bottom-margin);
}
.prose > h3 + p {
  margin-top: var(--h3-bottom-margin);
}
.prose > h4 + p {
  margin-top: 10px;
}
.prose > p + :is(ul, ol) {
  margin-top: 12px;
}
.prose li + li,
.prose li > :is(ul, ol) {
  margin-top: var(--block-spacing-small);
}
.prose > figure {
  margin-block: var(--figure-margin);
}
.prose > figure:has(img, picture) {
  margin-block: var(--image-figure-margin, var(--figure-margin));
}
.prose > p:empty {
  display: none;
}

/* The measure. A wide figure does not get it. */
.prose.center > :not([data-wide='true']) {
  max-width: var(--prose-max-width);
  margin-inline: auto;
}

/* The emphasis. */
.prose :is(h1, h2, h3, h4, strong, b) {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}
```

---

## 8. What to take for our prose

These are the parts that matter most. They are in order of effect:

1. 624px measure, and a body colour one step under the headings.
2. 56px above a heading, 12–16px below it. Keep it on mobile.
3. A paragraph gap of about 0.7 of the line height (20px at 17/1.6).
4. A list 12px under its intro, items 8px apart, markers that hang in a 24px gutter.
5. Headings only 1.4× the body, with 590 weight and the primary colour.
6. Links in the primary colour with a dim underline (`from-font`, `clamp(2px, .175em, 4px)` offset).
7. Inline code all in `em` (`.875em`, `line-height: 1.3`, `.1em .25em` padding, `box-decoration-break: clone`).
8. Figures with more air than paragraphs (32–48px), and captions small, grey and balanced.
