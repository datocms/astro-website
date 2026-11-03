---
name: DatoCMS
description: Warm Logic. Flat fields of colour, two-tone headlines and the product drawn in code.
colors:
  espresso: '#351615'
  pollen: '#e7d864'
  cream-paper: '#fdfff5'
  ember-deep: '#42180f'
  ember: '#f09063'
  ember-paper: '#fffbf5'
  fern-deep: '#1a4731'
  fern: '#93c95b'
  fern-paper: '#f5fff5'
  slate-deep: '#1d2229'
  iris: '#aaa0ef'
  iris-paper: '#f6f5ff'
  harbour-deep: '#1a3a47'
  glacier: '#58c6e7'
  glacier-paper: '#edfeff'
  plum-deep: '#3c0a35'
  bubblegum: '#ef89cf'
  bubblegum-paper: '#fff5fc'
  white: '#ffffff'
  signal-green: '#3f9a4a'
  signal-red: '#f25f5a'
  code-espresso: '#2b1615'
typography:
  display:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '60px'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '-0.05em'
  headline:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '45px'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '-0.04em'
  title:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '30px'
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: '-0.02em'
  section:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '36px'
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: '-0.03em'
  body:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '20px'
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: '-0.01em'
  body-long:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '20px'
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: '-0.01em'
  label:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1
    letterSpacing: '-0.01em'
  label-medium:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '16px'
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '-0.01em'
  caption:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: 1.35
    letterSpacing: '-0.01em'
  code:
    fontFamily: 'Geist Mono, ui-monospace, Menlo, monospace'
    fontSize: '16px'
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: '0em'
  code-inline:
    fontFamily: 'Geist Mono, ui-monospace, Menlo, monospace'
    fontSize: '0.9em'
    fontWeight: 400
    lineHeight: inherit
    letterSpacing: '0em'
  mono-caps:
    fontFamily: 'Geist Mono, ui-monospace, Menlo, monospace'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: '0.06em'
  picture-label:
    fontFamily: 'Geist Mono, ui-monospace, Menlo, monospace'
    fontSize: '12px'
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: '0em'
rounded:
  sm: '4px'
  md: '8px'
  lg: '12px'
  full: '9999px'
spacing:
  5xs: '2px'
  4xs: '4px'
  3xs: '8px'
  2xs: '10px'
  xs: '12px'
  sm: '16px'
  md: '20px'
  lg: '30px'
  xl: '40px'
  2xl: '60px'
  3xl: '80px'
  4xl: '160px'
components:
  button-light-on-white:
    backgroundColor: '{colors.pollen}'
    textColor: '{colors.espresso}'
    typography: '{typography.label-medium}'
    rounded: '{rounded.full}'
    height: '40px'
    padding: '0 10px'
  button-light-on-white-hover:
    backgroundColor: '{colors.espresso}'
    textColor: '{colors.pollen}'
  button-deep-on-white:
    backgroundColor: '{colors.espresso}'
    textColor: '{colors.cream-paper}'
    typography: '{typography.label-medium}'
    rounded: '{rounded.full}'
    height: '40px'
    padding: '0 10px'
  button-deep-on-white-hover:
    backgroundColor: '{colors.pollen}'
    textColor: '{colors.espresso}'
  tab-pill:
    textColor: '{colors.espresso}'
    typography: '{typography.label-medium}'
    rounded: '{rounded.full}'
    padding: '12px 16px'
  code-card:
    backgroundColor: '{colors.code-espresso}'
    rounded: '{rounded.lg}'
    padding: '20px'
    width: '500px'
  tooltip:
    backgroundColor: '{colors.espresso}'
    textColor: '{colors.pollen}'
    typography: '{typography.caption}'
    rounded: '{rounded.sm}'
    padding: '8px 10px'
---

# Design System: DatoCMS

<!-- Authority: the user. Reference pages (liked, not final): /, /editor-experience, /developers, /media, /ai, /compare, /case-studies/*, /philosophy, /pricing, /contact. Other pages can contain patterns that are not part of this system. Code rules live in src/REDESIGN.md; tokens live in src/styles/tokens.css. -->

## Overview

**Creative North Star: "Warm Logic"**

Technical sharpness with warmth: the site must feel capable and approachable at the same time. The logic is in the structure. A strict type scale, one content column, flat fields of colour that turn the page into chapters, and the product drawn as exact UI, not as a mood picture. The warmth is in the materials. Each neutral is tinted with the hue of its theme (never grey). The accents are soft and slightly dusty, not neon. The headlines speak in two tones, as a person who says the claim and then adds the honest aside. Small text faces (`[••]`, `[•ᴥ•]`, `[•*•]`) wink at the end of a line.

Density is generous on marketing surfaces: big type, much air, one idea for each field of colour. The page is a vertical flow of full-bleed bands. Each band commits to one surface (the pale page, the bright accent or the deep inverse). Splits of two halves (accent | inverse) carry a claim on one side and its proof on the other. Depth does not exist: the change from one surface to the next is the only layering.

This system came from overnice's work ("Warm Logic" is their name for the route), merged with the needs of the old site. It is still in progress. The reference pages above are the evidence. The other pages are not.

**Key Characteristics:**

- Six themes (default, orange, green, purple, blue, pink). Each is a set of three surfaces: a near-white paper, a bright accent and a deep inverse, all of one hue.
- Full-bleed bands of flat colour; a theme changes from section to section, never inside a component.
- Two-tone headlines: the claim in the text colour, then the aside in a muted tone of the same hue.
- One sans (ABC Oracle) at two weights, tight negative tracking; Geist Mono for code and product chrome: 500 in code blocks, and on the page 400 on light grounds and 500 on dark grounds.
- Pill buttons with an arrow; instant hover that swaps the two colours.
- The product as code-rendered scenes, cut off by the edge of the band, with a top-left corner radius only.
- Pixel art as the playful signature: pixel videos of hands and people in the page closer, a pixel hover on photos.
- Diagrams with one grammar (pill, track, pulse, ring) for what the product does when it is not a screen.
- Totally flat: no shadows.

## Colors

Six monochrome families. In each family a deep tone, a bright accent and a paper white share one hue, so that a page is always in harmony with itself. The frontmatter holds the anchors; `src/styles/tokens.css` holds the alpha steps (`-1` to `-4`) and the semantic tokens that components use.

### Primary

- **Pollen** (pollen): the accent of the default theme. A full band, the accent half of a split, the light button, the enterprise plan. It is light, so text on it is always dark (Espresso).
- **Espresso** (espresso): the deep of the default theme. The text, the inverse band, the footer of the default page, the deep button.
- **Cream Paper** (cream-paper): the page of the default theme. A white that leans to yellow.

### Secondary

The five other themes have the same three roles. A section picks its theme with `data-theme`; the children inherit.

- **Ember** (ember) on **Ember Deep** (ember-deep) and **Ember Paper** (ember-paper). Orange: the home page, Help, the Developers pillar.
- **Fern** (fern) on **Fern Deep** (fern-deep) and **Fern Paper** (fern-paper). Green: News, the Editing pillar.
- **Iris** (iris) on **Slate Deep** (slate-deep) and **Iris Paper** (iris-paper). Purple: Ecosystem. The deep is a blue-black slate, not a purple.
- **Glacier** (glacier) on **Harbour Deep** (harbour-deep) and **Glacier Paper** (glacier-paper). Blue: Company and support, the pages for buyers (pricing, enterprise, compare), the AI pillar.
- **Bubblegum** (bubblegum) on **Plum Deep** (plum-deep) and **Bubblegum Paper** (bubblegum-paper). Pink, toward magenta, so that its hue is far from Ember: Partners, the Media pillar.

The theme of each page is in "Page themes" (Layout).

The six accents follow one rule in OKLCH: lightness 0.745 to 0.775, and chroma 72% to 80% of the most chroma that sRGB gives at that lightness and hue. The percentage is what aligns them, not the raw chroma: a colour near the edge of sRGB looks neon next to the others, also when its chroma number is the same. Pollen is the one exception (lightness 0.87), because a darker yellow is a mustard. Ember and Bubblegum are tuned away from overnice's values (#ff6d00 at the edge of sRGB, #f1a5a7 too pale). Keep the rule when you add or change a hue.

### Tertiary

- **Signal Green** (signal-green) and **Signal Red** (signal-red): a change applied, something deleted or refused. Only in diagrams, status and form feedback. They do not change with the theme.
- **Code Espresso** (code-espresso) and the other `--color-code-*` deeps: the background of a code card. It is a calmer, deeper shade of the theme hue than the inverse surface. The syntax colours come from one OKLCH rule (see the comment in `tokens.css`): keywords take the accent hue, strings, constants and functions take three other hues of the family.

### Neutral

There is no grey. The neutrals are the deep tone of the theme at alpha: text-soft at 80% on the page and 92% on the accent, text-muted at 70 to 90% (each theme sets the alpha that gives 4.5:1 on its ground: yellow holds 70%, orange and green need about 90% on the accent), and the hairline border at about 11% (in the dark scheme, the accent at 25%: a light line on a dark page needs more alpha). The one lighter role is the quiet run of a two-tone headline or display lockup (3:1, large text only). **White** (white) is only for a card that sits on a surface that stays light.

### Dark scheme

Only the page flips. The page becomes a near-black of the theme hue (the code deep mixed with black), the text becomes the paper white at the same alpha steps. The bright accent and the inverse surface do not change: the accent keeps its dark ink, the inverse keeps its light text. The ground classes (below) carry that: an element with the accent as background takes `surfaceAccent`, so the text on it stays dark.

### Colour: grounds and text roles

The rules below are the whole system. `src/styles/tokens.css` states them, `src/styles/tokens.test.ts` computes every pairing (all roles, all surfaces, six themes, two schemes) and fails under AA, and `npm run lint:css` refuses a text colour outside the roles.

1. **Three grounds.** Every element sits on one ground: the **page** (`--surface-default` and its tints: `--surface-accent-faint|subtle|muted`, `--surface-inverse-faint`, `--surface-field`, `--surface-nav-active`, `--surface-status-*`), the **accent** (`--surface-accent`, bright in both schemes, dark text) or the **inverse** (`--surface-inverse`, deep in both schemes, light text). The code card (`--code-background`, `--code-*`) is a fourth, small ground.
2. **Canonical text roles**, one set for each ground: page `--text-on-page`, `-soft`, `-muted`, `-headline-muted`; accent `--text-on-accent`, `-soft`, `-muted`, `-headline-muted`; inverse `--text-on-inverse-strong`, `--text-on-inverse`, `-soft`, `-muted`, `-headline-muted`. Each role has 4.5:1 or more on every surface of its ground, in the six themes and the two schemes. The one exception is `*-headline-muted`: 3:1 or more, for the quiet run of a two-tone headline or display lockup only (large text, 24px or more: a `.display` or `.headline` heading, the quiet words of the Single Source lockup; a `.title` is 20px on phones and takes `--text-muted`). Borders: `--border-on-page|accent|inverse` and `-strong`.
3. **Contextual roles follow the ground, not the theme.** A component that does not paint a ground uses `--text-primary`, `--text-soft`, `--text-muted`, `--text-headline-muted`, `--border-default`, `--border-strong`, `--text-accent`, `--text-positive`, `--text-negative`. They resolve to the canonical roles of the ground that the element sits on. A theme switch (`data-theme`) inside a ground keeps the light or dark text of the ground.
4. **Ground classes.** The element that paints a ground gets the global class of the ground: `surfacePage` (a window of the page inside another ground: a chat, the mega menu), `surfaceAccent` or `surfaceInverse`. The class sets the contextual roles and `color`. A small shape (a button, a pill, a hovered row) that paints the accent or the inverse sets `color` to a canonical role of that ground in the same rule. A ground that comes with the viewport or a state (the split header, a hovered row that turns to the accent) cannot take a class: the rule sets a contextual role to the canonical role of the same kind (`--text-muted: var(--text-on-accent-muted)`), and nothing else.
5. **No alpha on text outside `tokens.css`.** A text colour is a token. No `opacity`, no `color-mix()` and no new `--text-*` property on a text colour in a component: every tint of text is a role. `opacity` under 1 is only for an element without text (a picture, a placeholder card), an inactive control or a pressed state, and says so in a disable comment.

A surface as text is a pill: `--surface-default` on a fill of `--text-primary` (the deep button), `--surface-inverse` on `--text-on-inverse-strong` (the actor of a diagram). The lint accepts them only with the fill in the same rule.

### Named Rules

**The One Hue Rule.** A section uses the three tones of one family. Two accents of different themes never touch inside a section; they meet only at the edge between two bands.

**The Role Not Colour Rule.** Components use only semantic tokens (`--surface-*`, `--text-*`, `--border-*`), named for their role. A hex in a component is a bug.

**The Dark Text On Accent Rule.** All six accents are light. Text on an accent is the deep tone, in both schemes.

## Typography

**Display and Body Font:** ABC Oracle, with three metric fallback faces (Helvetica Neue, Arial, Roboto). `src/styles/fonts.css` defines them with `size-adjust` and ascent and descent overrides, so that the swap to ABC Oracle does not move the text.
**Mono Font:** Geist Mono (with ui-monospace, Menlo). Code blocks are always 500: the code ground is deep in both schemes. Mono text on the other grounds is 400 on light and 500 on dark (`--type-mono-weight`). The product scenes use it.

**Character:** One grotesque at two weights (400, 500) with tight negative tracking. It reads as engineered and calm, and the two-tone headlines give it a voice. The mono is for code and for the chrome of the product.

### The ladder

One size ladder, in t-shirt steps, in rem (the zoom of the browser enlarges the text). The `--type-*` tokens in `src/styles/tokens.css` hold it. The 1320 values hold at 1920. The fluid steps are two linear segments through the three Figma frames (393, 768, 1320).

| Step  | 393      | 768 | 1320 | Dense    | Roles                                       |
| ----- | -------- | --- | ---- | -------- | ------------------------------------------- |
| `2xs` | 11       | 12  | 12   |          | picture label (only inside a drawn picture) |
| `xs`  | 13       | 14  | 14   |          | caption, mono caps, small code              |
| `s`   | 14       | 15  | 16   | 14/15/15 | label, code                                 |
| `m`   | 16       | 17  | 20   | 16/17/17 | body, long body                             |
| `l`   | fluid 20 | 25  | 30   | 20/22/22 | title                                       |
| `xl`  | fluid 24 | 30  | 36   | 24/28/28 | section (the docs h2)                       |
| `2xl` | fluid 30 | 40  | 45   |          | headline                                    |
| `3xl` | fluid 37 | 50  | 60   |          | display                                     |

Dense: the docs layout sets `data-density="dense"` on `<body>`, and the `s`, `m`, `l` and `xl` steps take the dense values.

### Hierarchy

The sizes in the frontmatter are the 1320px values. Each role has a class in `src/styles/typography.css`.

- **Display** (500, 1.0, -0.05em): stats, the biggest statements. The `.display` class.
- **Headline** (500, 1.0, -0.04em): heroes, chapter headers, statements, quotes. The `.headline` class.
- **Title** (500, 1.1, -0.02em; 1.2 in dense): sub-headlines, FAQ questions, footer titles. The `.title` class.
- **Section** (500, 1.2, -0.03em): the docs h2. The `.section` class.
- **Body** (400, 1.3, -0.01em): running text. The `.body` and `.bodyMedium` (500) classes. `.bodyLong` (line height 1.5) is for intros and for any text over two lines, max 560px.
- **Label** (400, 1.0, -0.01em): buttons, nav. The `.label` and `.labelMedium` (500) classes. A label is one line: a text that wraps takes Body.
- **Caption** (500, 1.35, -0.01em): tooltips, notes, dates, metadata. The `.caption` class.
- **Code** (Geist Mono, 1.55, 0): code cards, product chrome. The `.code` and `.codeSmall` classes.
- **Inline code** (Geist Mono, 0.9em of the running text): the mono has a larger x-height and wider letters than ABC Oracle, so 0.9em gives the two the same visual size. The `.codeInline` class.
- **Mono caps** (Geist Mono 500, 1.3, +0.06em, uppercase): diagram panel titles, docs sidebar group names. The one tracked uppercase role. The `.monoCaps` class.
- **Picture label** (Geist Mono 500, 1.4): text inside drawn pictures only. The `.pictureLabel` class.
- **Tabular**: a treatment, not a role. `.tabular` goes on a role: prices, counts, dates, stats.

**Dark grounds.** On `.surfaceInverse` and in the dark scheme, body, long body and caption get +0.05 line height and +0.01em tracking, and mono text on the page is 500 (`--type-leading-dark`, `--type-tracking-dark` and `--type-mono-weight` in `tokens.css`).

**Floors.** Outside a picture, no text is under 13px on phones and 14px on desktop. Inside a picture, 11px and 12px.

**Headings** have `overflow-wrap: break-word` and `text-wrap: balance`. Paragraphs have `text-wrap: pretty`. `strong` and `b` render at 500. Headings have no default size. A section picks a typography class.

### Named Rules

**The Two-Tone Rule.** A headline says the claim in the text colour, then continues in the quiet run: `--text-headline-muted`, the headline-muted role of the ground (the muted text on the page, a lighter step on the accent and the inverse, at 3:1 or more because the headline is large text). "Modular how you like it. _And steady how you need it._" The muted half never gets its own size or weight. This is the main voice of the site.

**The Two Weights Rule.** ABC Oracle at 400 and 500 only. `strong` is 500. No bold, no italic as decoration, no uppercase tracking except the mono caps role. The product scenes kit renders at the weight 340 of the cms, inside the pictures only.

**The Text Face Rule.** A hero headline can end with a text face (`[••]`, `[•ᴥ•]`, `[•*•]`), joined to the last word so that it never wraps alone. The typewriter can type it and make it wink. One face for each headline, at most. The face is our voice, and it follows an aside: the headline is a full sentence (it ends with `.`, `?` or `!`), and the muted run adds to it ("Got issues? We're here to help! [••]"). A title in two tones ("Projects from Our / Partners") has no face. The copy names the face (`face` in `src/data`). The hero adds no face by default. Text from the CMS (a plugin, a starter, a partner), a title alone and a legal page have no face. Each page closer with a call to action ends its headline with a face: the page selects it (`<PageCloser face="…">`, a name from `src/lib/motion/faces.ts`) to fit its subject, and the face plays when it comes into view. The closer face is not the face of the hero of the same page. Each face plays its animation, always: in a typewriter script (`faceStep`), or with the `Face` component (`<Face name="…">`), which plays it when it comes into view, on load, or each time a form error shows. A hero without the typewriter, a section headline, a form message: all use `Face`. No component writes the glyphs of a face, and no copy has them. The library has more than 30 faces, thus the faces do not repeat: each face is on 2 heroes or closers at most, on different pages, and each one fits its copy (its `description` in `faces.ts` tells where). The pages of one template (the `/cms` pages) count as one. The 404 has `confused`. `/dev/face-gallery` shows them all.

**The Hero Length Rule.** The h1 of a hero (the headline, the muted run and the face) has 120 characters at most: 3 lines on a desktop, 6 on a phone. A longer description goes in the `intro`, as body text below the h1, not in the muted run. `src/lib/hero.test.ts` checks the copy of `src/data` and the Hero calls of `src/pages` (the length, the face after a sentence, each face on 2 places at most, no face glyphs outside `faces.ts`, the glyphs read only by the components that play them, the typewriter on the marketing pages only); the dev server warns when text from the CMS goes over.

## Layout

One content column of 1160px (`--content-max`), centred, with side padding of 30 / 60 / 80px (`--section-padding-x`). Centred statements cap at 900px (`--headline-max`); a text column at 560px (`--reading-max`). Backgrounds always go to the full width; above 1320px only the colour grows, not the content.

Vertical rhythm comes from the band: `--section-padding-y` is 50 / 60 / 90 / 100px. Inside a band, use only the `--space-*` scale (2px to 160px).

Recurring structures:

- **The band**: one section, one surface, full bleed.
- **The split**: two halves of 50%, accent on the left and inverse on the right (chapter headers, versus splits, the compare table). The text of each half starts at the edge of the centred column (`--content-inset-half`). The split stacks below 1152px.
- **The grid of cells**: cells of two columns with alternating tints, as on /philosophy and /pricing, each cell padded with the band padding.
- **The pillar chapter**: a header split, then a scene, then two or three feature fragments on the paper surface. A sticky category nav of pills leads through the chapters.

Breakpoints (min-width): 768, 1152, 1320. The scenes switch from the phone drawing to the desktop drawing at 650. Hover effects only inside `@media (hover: hover)`.

### Page themes

Each page has one theme: the theme of the layout (a necessary prop). The header, the hero, the page closer and the footer take it, thus a page starts and ends in the same hue. The chapters between them can take other themes (The One Hue Rule applies to each band).

**A reference page takes the hue of its area.** The colour tells the visitor where they are.

| Area                | Theme  | Pages                                                                                                        |
| ------------------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| Help                | orange | `/docs`, `/user-guides`, `/academy`, `/glossary`                                                             |
| News                | green  | `/product-updates`, `/blog`                                                                                  |
| Ecosystem           | purple | `/plugins`, `/starters`                                                                                      |
| Partners            | pink   | `/partners`, `/tech-partners`                                                                                |
| Company and support | blue   | `/support`, `/slack`, `/security`, `/legal`, `/contact`, `/company`, `/partner-program`, `/research-program` |

**A marketing page takes the hue of its first chapter**, or of its hero when it has no chapters. The page reads the theme from the data of the first chapter, not from a literal, thus the page and its row in the product list of the home page change together (`src/data/home.ts`).

| Page                                    | Theme   | From               |
| --------------------------------------- | ------- | ------------------ |
| `/`                                     | orange  | the home hero      |
| `/editor-experience`                    | green   | Visual editing     |
| `/developers`                           | orange  | Schema             |
| `/media`                                | pink    | Media library      |
| `/ai`                                   | blue    | MCP                |
| `/cms/[slug]`                           | green   | Fetch              |
| `/features`                             | blue    | the first category |
| `/enterprise-headless-cms`              | blue    | Security           |
| `/compare/[slug]`                       | blue    | the versus split   |
| `/pricing`                              | blue    | the hero           |
| `/case-studies`, `/case-studies/[slug]` | orange  | the hero           |
| `/philosophy`                           | green   | the hero           |
| `/wall`                                 | pink    | the hero           |
| `/404`                                  | default | the hero           |

The same six hues serve the areas and the pillars. On a reference page the hue is the area; on a marketing page it is the pillar. They meet only through links, never on one page.

**The ground of the hero.** A marketing page has its hero on the page ground: the scene or the typewriter carries it. A reference page has its hero on the accent: the band of colour marks the area. An article (a post, an entry of the changelog) has the header on the accent, above the header of the article on the page ground. No hero is on the inverse: the footer holds the inverse at the end of the page. The header always takes the ground and the theme of the hero.

**The ground of the closer.** The page closer is on the inverse (the `tonal` palette). The footer, with the "Questions? Ask away [••]" band, is on `--surface-inverse-deep`: the inverse of the same hue, 0.06 darker in OKLCH lightness. Thus the closer and the footer are two deep blocks in one hue, and the end of the closer stays visible. Only the footer and that band use `--surface-inverse-deep` (the lint enforces it). An accent palette (`silhouette`, `onAccent`) is only for a page whose last band above the closer is on the inverse, thus three deep blocks never stack.

### Named Rules

**The Same Hue At Both Ends Rule.** The header, the hero, the page closer and the footer have the theme of the page. Two inverse surfaces of different hues never touch.

**The Full Bleed Rule.** A coloured surface reaches the edges of the viewport. A coloured box that floats in the column with page margins around it is not part of this system.

## Elevation & Depth

Completely flat. There are no shadows, at rest or on hover. Depth comes only from the change of surface: paper, accent, inverse. A popover, a dropdown, the search panel or a product window separates from what is under it with a surface change and a 1px hairline, not a shadow. Hairlines are `--border-default` (the deep at about 11%) or an inset `box-shadow: inset 0 -1px` used as a rule, never as a blur.

### Named Rules

**The Flat, No Exceptions Rule.** No `box-shadow` with blur, no `drop-shadow`, no glow. The tokens `--shadow-popover` and `--shadow-card` exist for the docs today, and the `.photo` class of the diagrams gives a photo a soft shadow; they are drift, not part of this system. Do not use them on new work.

## Shapes

Two families of form. Controls are pills: buttons, tabs, category nav items and switches use a full radius. Surfaces are square: bands, cells, halves and plan cards have no radius at all. The product scenes are the one exception: a frame of the product has only its top-left corner rounded (12px; 4px on phones), because the band cuts it on the right and the bottom. A thin hairline in a mix of the accent and the deep follows the cut edges.

Small radii: 4px for tooltips and the windows inside a scene, 8px for inner screens and form notes, 12px for code cards.

Signs are typographic, not icons: `→` at the end of a button or a link, `+` and `–` for a disclosure, `•` for a list bullet.

## Components

### Buttons

Friendly and direct: a pill that says where it goes.

- **Shape:** full pill (9999px), 40px tall, 10px side padding, `.labelMedium` (500). An arrow `→` follows the label by default.
- **Light on white** (the default): the accent as fill, the deep text. The main call to action on a paper band.
- **Deep on white:** the deep as fill, paper text. A strong secondary, or the main action on a light accent band.
- **Deep on light / light on deep:** the same pair, for inverse and accent bands.
- **Soft:** a faint tint of the deep (or of the accent) as fill, deep text. The secondary in a group.
- **Hover / Focus:** the two colours swap instantly, without a transition. A hover to the page surface takes `--text-on-page`, the canonical role: the contextual `--text-primary` is light on an inverse band. Active adds 80% opacity. Focus is a 2px outline in the current colour, 2px offset. Disabled is 40% opacity.
- **Leading items:** a 20px round avatar or a row of overlapping logos can lead the label ("Lets Talk!", "Explore Integrations").

### Chips (category nav, tabs)

- **Style:** pill, `.labelMedium` (500), muted text. The current item gets a faint tint of the deep and the full text colour. A tint pill slides to the current item (300ms, cubic-bezier(0.3, 0, 0, 1)).
- **State:** the nav sticks to the top. A hairline appears under it only when it is stuck.

### Cards / Containers

There are few cards. Content sits in bands, cells and halves.

- **Corner Style:** square.
- **Background:** the surface of the band, or a tint of the accent (`-subtle`, `-faint`) to alternate cells.
- **Shadow Strategy:** none (see Elevation & Depth).
- **Border:** none. Rows use a 1px hairline.
- **Internal Padding:** the band padding (`--section-padding-y` and `--section-padding-x`).
- **Hover:** a case-study card fills with the faint accent, instantly.

### Inputs / Fields

- **Style:** no border at rest, Label above the control, padding 30px, square by default.
- **Focus:** a 2px ring in the deep (`--border-strong`) drawn inside the field. Hover fills with the faint accent.
- **Error / Disabled:** error text in `--text-negative`.

### Navigation

- **Header:** 82px, not sticky, on the surface of the page or of the hero band, with no line at the bottom: it runs into the hero. The logo is at the left, the links start 40px after it, the actions are at the right. The links (`.labelMedium`) are 40px pills like the chips. One tint pill (`--surface-inverse-faint`) slides between the items (300ms, `cubic-bezier(0.3, 0, 0, 1)`): to the item under the cursor or with the focus, else it rests on the open item or on the group of the page that the visitor reads. "Get Started" is a pill button.
- **Dropdown cards:** a card hangs from the bottom of the header under its item, with a width that comes from its columns (one for Customers, two for Product and Resources). The card is a field of the deep of the page theme (light text), as the footer, with no border: it stands apart from a page hero and from an accent hero. The tint pill of the open item stays the faint tint. The air is one step: 40px around the card and between its sections, 16px under a heading, 12px between the links. Muted headings, `.title` links, muted descriptions. One shell holds every card: from closed it grows down from the header (260ms) and the rows arrive 20ms apart; from another card it glides to the new place and size (300ms, the same curve) while the two contents cross-fade. With reduced motion, the swaps are instant. The groups with cards are Product, Resources and Customers; Partners, Philosophy and Pricing are plain links.
- **Footer:** on `--surface-inverse-deep` of the page theme: a little darker than the page closer above it. It has a `.headline` closing line with a text face, five columns of links in the on-inverse colours (seven to nine links each; below 1152 the groups flow in balanced text columns), a status line with a dot, and a last bar with the logo, the legal links and the company line. On touch, each link is a row of 44px.

### Code card (signature)

A deep window in the theme hue (`--code-background`), 12px radius, max 500px wide, Geist Mono. Tabs are pills, and the current tab takes the accent. Line numbers are faint. Notes can point at a token with a 1px leader line that draws itself.

### Product scene (signature)

The product UI drawn in code (`@datocms/product-scenes`) inside a frame cut by the band. Real field names, real data, Italian demo content. The scene can play a short sequence in view. It never shows what the product cannot do.

### Pixel videos (signature)

The human, playful moment of each page: a hand that waves, a thumbs-up, a dancer, drawn as big flat squares in the colours of the theme. Real footage (or an animated emoji), keyed and reduced to three tones of cells. It is never a photo or an `.mp4`.

- **Where:** only in the page closer: the closing call to action, then the video band (494px tall at most, `min(494px, 75vw)`), then the "Questions? Ask away [••]" band. The band is part of the footer and has its deeper surface. One theme, never a grid. The theme is the theme of the page, the same as the footer; the ground is in "Page themes".
- **Cells:** every video has the same square size on screen. Hands are 80 cells tall, full bodies 120. Each cell is one square with a thin stroke; no blur, no anti-aliasing, no tone curve on the footage.
- **Colour:** a palette gives the full look, always from the theme tokens, never a colour of its own. Three layers (dark, midtone, highlight) take the inverse, the accent and the paper tones. The usual palettes are `tonal` (on the inverse), `onAccent` (dark squares on the accent) and `silhouette` (a dark figure on the accent, for dark subjects). A video that needs a different look gets a new palette, not a setting.
- **Edges:** the ground of the palette fills the band beyond the video. A subject that the frame cuts (an arm from the right) stays on that edge of the band.
- **Interaction:** a lens under the pointer that magnifies and reshapes the squares (the same lens, in cells, for every video).

### Pixel images

The same language on photos: the image of a card (a post card, a media card) shows its pixel version on hover. 160 cells wide, five tones (deep, shadow, accent, highlight, white), and it "breathes" in 125ms steps (a period of 4s), so it moves like pixel art, not like a video. Portraits and avatars take the theme hue with `mix-blend-mode: luminosity` or `multiply`.

### OG card

The page of the site at the scale of a social feed: a PNG of 1200×700 (`src/pages/og-card/`, drawn with satori and sharp), on the paper of the theme of the page (the hue of its area). The top row holds the wordmark and the kicker of the page, as the header holds the logo and the path. The headline is in two tones: the title in the ink, then the excerpt in the quiet run; when the two go over the length of a hero headline, the excerpt is the intro below the title. The chips of the page are at the bottom, with a `+N` chip for the rest. The card is a split: the text on the paper at the left, the picture as a band of the accent on the full height at the right. The band shows the DatoCMS symbol as a pixel video (16px cells with the grid), or the logo of a partner as a pixel image (8px cells, no grid, three tones). The sizes are the sizes of the site at 1320px, times two. The colours come from `tokens.css` through `_resources/palette.ts`, which a test keeps equal to the tokens. No face: the text is from the CMS.

### Diagrams (signature)

A picture of what DatoCMS does when the subject is not a screen of the cms: the real-time stream, the wall of cached pages, the media pipeline, the integrity of the schema. All diagrams speak one grammar, so the eye learns it once: **a pill does the work, a pulse is data that moves, a ring is what changed.**

- **Surface:** the inverse sheet of the band, inside a `whole` frame (no frame drawn, nothing cut), 960px at most, top-down on phones. A diagram in a fragment sits on the surface of the page, in the scheme of the page (`data-diagram-surface="page"`, and the ground `surfacePage` on the `fill` fragment): light in the light scheme, dark in the dark scheme.
- **Pill:** the actor or the event. 28px tall, full radius, Geist Mono at `.codeSmall` size, the DatoCMS mark at 14px. Light on the inverse (`--text-on-inverse-strong`). An event pill shows one event and its time; the next one replaces it.
- **Track:** a line, 1.5px, quiet (`--border-on-inverse-strong`) and always drawn. No arrows, no dashes.
- **Pulse:** a short 2px dash of the accent that runs along the track once: data on the move.
- **Panel:** a container, 8px radius, a surface darker than the inverse (the inverse mixed with 35% black), a 1px ring and a title in the `.monoCaps` role.
- **Change:** the ring and the tint of the accent. One accent only (`--text-on-inverse`). Never red: a purge or a deletion is the product at work, not a failure.
- **Motion:** two curves, a strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for enter, exit and ping, and a strong ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` for travel and draw. Durations from 0.32s (fade) to 1s (travel, settle). Each step waits for the one before: the pill, then the lines, then the pulse, then the ring. Nothing appears in one frame. The still (the last step) is the markup.
- **Show the claim, not the mechanism.** A wall of pages that change beats a boxes-and-arrows chart of the CDN.

### Other pictures

Each kind has one language, used by every picture of that kind: the neutral chat (a transcript with no avatar and no product's bubbles), the neutral terminal (mono, a prompt glyph, a block cursor, real CLI output), and a browser with an invented site. A feature that is not the cms (images, video, cache tags, real-time) gets code, a diagram or a before/after, never a fake UI. Rules for all pictures: `src/scenes/AGENTS.md`.

### Two-tone headline with typewriter (signature)

Only a marketing hero types, and each marketing hero types (a reference page, an article or a legal page never types). The 120 characters of the Hero Length Rule keep the typing under approximately 2.5 s, thus the buttons come soon. Hero headlines type themselves in at a human rhythm. The cursor is a bar that becomes the text face. The final text is in the DOM, and reduced motion shows it at once. The buttons fade in (150ms) after the typing.

## Do's and Don'ts

### Do:

- **Do** give each section one theme and one surface, full bleed, and change the theme only between bands.
- **Do** give each page the theme of its area (a reference page) or of its first chapter (a marketing page), and let the header, the hero, the closer and the footer take it.
- **Do** write headlines in two tones: the claim, then the muted aside.
- **Do** use the split (accent half | inverse half) to put a claim next to its proof.
- **Do** show the product as a code-rendered scene, cut by the edge of the band, with only its top-left corner rounded.
- **Do** use only the semantic tokens and the `--space-*` and `--type-*` scales, and check every change in both schemes.
- **Do** give the element that paints a band its ground class (`surfaceAccent`, `surfaceInverse`, `surfacePage`), and set `color` to a role of that ground in the same rule as the background.
- **Do** keep motion short and in view only: 150 to 400ms, ease-out or cubic-bezier(0.3, 0, 0, 1), and the final state without JS. Diagrams use their own two curves and step one thing at a time.
- **Do** draw a new diagram with the shared grammar (`src/scenes/diagram/`): pill, track, pulse, panel, ring, one accent.
- **Do** put a pixel video only in the page closer, with a palette from `src/lib/pixel-video/styles.ts`.

### Don't:

- **Don't** use a shadow of any kind, also on popovers and product windows.
- **Don't** use grey. Every neutral is the deep of the theme at an alpha.
- **Don't** dim text with `opacity` or `color-mix()`. The quiet text is `--text-muted`; the quiet run of a headline is `--text-headline-muted`.
- **Don't** round a band, a cell or a half, or float a coloured box with margins inside the column.
- **Don't** put light text on an accent: all six accents take the deep text.
- **Don't** add a third font weight, a bold, a tracked uppercase text outside the mono caps role or a second typeface for display.
- **Don't** use screenshots, stock photos or AI imagery where a scene, pixel art or a real customer photo can go.
- **Don't** mix two accents of different themes inside one section.
- **Don't** give the header, the closer or the footer a theme that is not the theme of the page, and don't put a hero on the inverse.
- **Don't** use arrows, dashed lines, red or a second accent in a diagram.
- **Don't** give a pixel video colours of its own, a blur or a tone curve: a new look is a new palette.
- **Don't** take a pattern from a page that is not in the reference list (see the comment at the top) without asking.
