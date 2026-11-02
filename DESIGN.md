---
name: DatoCMS
description: Warm Logic. Flat fields of colour, two-tone headlines and the product drawn in code.
colors:
  espresso: '#351615'
  pollen: '#e7d864'
  cream-paper: '#fdfff5'
  ember-deep: '#42180f'
  ember: '#f98751'
  ember-paper: '#fffbf5'
  fern-deep: '#1a4731'
  fern: '#9ad162'
  fern-paper: '#f5fff5'
  slate-deep: '#1d2229'
  iris: '#9e8ef5'
  iris-paper: '#f6f5ff'
  harbour-deep: '#1a3a47'
  glacier: '#7fc4db'
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
    fontWeight: 500
    lineHeight: 1
    letterSpacing: '-0.01em'
  caption:
    fontFamily: 'ABC Oracle, Helvetica Neue, Helvetica, Arial, sans-serif'
    fontSize: '14px'
    fontWeight: 500
    lineHeight: '12px'
    letterSpacing: '-0.05em'
  code:
    fontFamily: 'Geist Mono, ui-monospace, Menlo, monospace'
    fontSize: '16px'
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
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    height: '40px'
    padding: '0 10px'
  button-light-on-white-hover:
    backgroundColor: '{colors.espresso}'
    textColor: '{colors.pollen}'
  button-deep-on-white:
    backgroundColor: '{colors.espresso}'
    textColor: '{colors.cream-paper}'
    typography: '{typography.label}'
    rounded: '{rounded.full}'
    height: '40px'
    padding: '0 10px'
  button-deep-on-white-hover:
    backgroundColor: '{colors.pollen}'
    textColor: '{colors.espresso}'
  tab-pill:
    textColor: '{colors.espresso}'
    typography: '{typography.label}'
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
- One sans (ABC Oracle) at two weights, tight negative tracking; Geist Mono for code and product chrome.
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

- **Ember** (ember) on **Ember Deep** (ember-deep) and **Ember Paper** (ember-paper). Orange: the home hero, Editing.
- **Fern** (fern) on **Fern Deep** (fern-deep) and **Fern Paper** (fern-paper). Green.
- **Iris** (iris) on **Slate Deep** (slate-deep) and **Iris Paper** (iris-paper). Purple: the deep is a blue-black slate, not a purple.
- **Glacier** (glacier) on **Harbour Deep** (harbour-deep) and **Glacier Paper** (glacier-paper). Blue.
- **Bubblegum** (bubblegum) on **Plum Deep** (plum-deep) and **Bubblegum Paper** (bubblegum-paper). Pink, toward magenta, so that its hue is far from Ember.

Ember and Bubblegum are tuned away from overnice's values (#ff6d00 too vivid, #f1a5a7 too pale) so that all six accents have similar chroma: OKLCH C 0.08 to 0.155 (Glacier is the softest; Fern, Iris, Ember and Bubblegum are the strongest, at about 0.15). An accent above that range looks neon next to the others. Keep that balance when you add or change a hue.

### Tertiary

- **Signal Green** (signal-green) and **Signal Red** (signal-red): a change applied, something deleted or refused. Only in diagrams, status and form feedback. They do not change with the theme.
- **Code Espresso** (code-espresso) and the other `--color-code-*` deeps: the background of a code card. It is a calmer, deeper shade of the theme hue than the inverse surface. The syntax colours come from one OKLCH rule (see the comment in `tokens.css`): keywords take the accent hue, strings, constants and functions take three other hues of the family.

### Neutral

There is no grey. The neutrals are the deep tone of the theme at alpha: text-soft at 80% on the page and 92% on the accent, text-muted at 70 to 90% (each theme sets the alpha that gives 4.5:1 on its ground: yellow holds 70%, orange and green need about 90% on the accent), and the hairline border at about 11%. The one lighter role is the quiet run of a two-tone headline or display lockup (3:1, large text only). **White** (white) is only for a card that sits on a surface that stays light.

### Dark scheme

Only the page flips. The page becomes a near-black of the theme hue (the code deep mixed with black), the text becomes the paper white at the same alpha steps. The bright accent and the inverse surface do not change: the accent keeps its dark ink, the inverse keeps its light text. The ground classes (below) carry that: an element with the accent as background takes `surfaceAccent`, so the text on it stays dark.

### Colour: grounds and text roles

The rules below are the whole system. `src/styles/tokens.css` states them, `src/styles/tokens.test.ts` computes every pairing (all roles, all surfaces, six themes, two schemes) and fails under AA, and `npm run lint:css` refuses a text colour outside the roles.

1. **Three grounds.** Every element sits on one ground: the **page** (`--surface-default` and its tints: `--surface-accent-faint|subtle|muted`, `--surface-inverse-faint`, `--surface-field`, `--surface-nav-active`, `--surface-status-*`), the **accent** (`--surface-accent`, bright in both schemes, dark text) or the **inverse** (`--surface-inverse`, deep in both schemes, light text). The code card (`--code-background`, `--code-*`) is a fourth, small ground.
2. **Canonical text roles**, one set for each ground: page `--text-on-page`, `-soft`, `-muted`, `-headline-muted`; accent `--text-on-accent`, `-soft`, `-muted`, `-headline-muted`; inverse `--text-on-inverse-strong`, `--text-on-inverse`, `-soft`, `-muted`, `-headline-muted`. Each role has 4.5:1 or more on every surface of its ground, in the six themes and the two schemes. The one exception is `*-headline-muted`: 3:1 or more, for the quiet run of a two-tone headline or display lockup only (large text, 24px or more: a `display` or `h1` headline, the quiet words of the Single Source lockup; an `h2` is 17px on phones and takes `--text-muted`). Borders: `--border-on-page|accent|inverse` and `-strong`.
3. **Contextual roles follow the ground, not the theme.** A component that does not paint a ground uses `--text-primary`, `--text-soft`, `--text-muted`, `--text-headline-muted`, `--border-default`, `--border-strong`, `--text-accent`, `--text-positive`, `--text-negative`. They resolve to the canonical roles of the ground that the element sits on. A theme switch (`data-theme`) inside a ground keeps the light or dark text of the ground.
4. **Ground classes.** The element that paints a ground gets the global class of the ground: `surfacePage` (a window of the page inside another ground: a chat, the mega menu), `surfaceAccent` or `surfaceInverse`. The class sets the contextual roles and `color`. A small shape (a button, a pill, a hovered row) that paints the accent or the inverse sets `color` to a canonical role of that ground in the same rule. A ground that comes with the viewport or a state (the split header, a hovered row that turns to the accent) cannot take a class: the rule sets a contextual role to the canonical role of the same kind (`--text-muted: var(--text-on-accent-muted)`), and nothing else.
5. **No alpha on text outside `tokens.css`.** A text colour is a token. No `opacity`, no `color-mix()` and no new `--text-*` property on a text colour in a component: every tint of text is a role. `opacity` under 1 is only for an element without text (a picture, a placeholder card), an inactive control or a pressed state, and says so in a disable comment.

A surface as text is a pill: `--surface-default` on a fill of `--text-primary` (the deep button), `--surface-inverse` on `--text-on-inverse-strong` (the actor of a diagram). The lint accepts them only with the fill in the same rule.

### Named Rules

**The One Hue Rule.** A section uses the three tones of one family. Two accents of different themes never touch inside a section; they meet only at the edge between two bands.

**The Role Not Colour Rule.** Components use only semantic tokens (`--surface-*`, `--text-*`, `--border-*`), named for their role. A hex in a component is a bug.

**The Dark Text On Accent Rule.** All six accents are light. Text on an accent is the deep tone, in both schemes.

## Typography

**Display Font:** ABC Oracle (with Helvetica Neue, Helvetica, Arial)
**Body Font:** ABC Oracle
**Label/Mono Font:** Geist Mono 500 (with ui-monospace, Menlo)

**Character:** One grotesque at two weights (400, 500) with tight negative tracking. It reads as engineered and calm, and the two-tone headlines give it a voice. The mono is for code and for the chrome of the product.

### Hierarchy

The sizes in the frontmatter are the 1320px values. Each role has three steps (393 / 768 / 1320) through the `--type-*` tokens.

- **Display** (500, 37 / 50 / 60px, 1.0, -0.05em): stats, the biggest statements.
- **Headline** (500, 30 / 40 / 45px, 1.0, -0.04em): heroes, chapter headers, statements, quotes. The `.h1` class.
- **Title** (500, 17 / 25 / 30px, 1.1, -0.02em): sub-headlines, FAQ questions, footer titles. The `.h2` class.
- **Body** (400 or 500, 14 / 17 / 20px, 1.3, -0.01em): running text. `.bodyLong` (line height 1.5) for intros, max 560px.
- **Label** (400 or 500, 14 / 16px, 1.0, -0.01em): buttons, nav, small labels. The `.subtitle` and `.subtitleMedium` classes.
- **Caption** (500, 9 / 14px, 12px line, -0.05em): tooltips, notes.
- **Code** (Geist Mono 500, 13 to 16px, 1.4): code cards, product chrome.

Headings have no default size. A section picks a typography class.

### Named Rules

**The Two-Tone Rule.** A headline says the claim in the text colour, then continues in the quiet run: `--text-headline-muted`, the headline-muted role of the ground (the muted text on the page, a lighter step on the accent and the inverse, at 3:1 or more because the headline is large text). "Modular how you like it. _And steady how you need it._" The muted half never gets its own size or weight. This is the main voice of the site.

**The Two Weights Rule.** ABC Oracle at 400 and 500 only. No bold, no italic as decoration, no uppercase tracking labels.

**The Text Face Rule.** A hero headline can end with a text face (`[••]`, `[•ᴥ•]`, `[•*•]`), joined to the last word so that it never wraps alone. The typewriter can type it and make it wink. One face for each headline, at most.

## Layout

One content column of 1160px (`--content-max`), centred, with side padding of 30 / 60 / 80px (`--section-padding-x`). Centred statements cap at 900px (`--headline-max`); a text column at 560px (`--reading-max`). Backgrounds always go to the full width; above 1320px only the colour grows, not the content.

Vertical rhythm comes from the band: `--section-padding-y` is 50 / 60 / 90 / 100px. Inside a band, use only the `--space-*` scale (2px to 160px).

Recurring structures:

- **The band**: one section, one surface, full bleed.
- **The split**: two halves of 50%, accent on the left and inverse on the right (chapter headers, versus splits, the compare table). The text of each half starts at the edge of the centred column (`--content-inset-half`). The split stacks below 1152px.
- **The grid of cells**: cells of two columns with alternating tints, as on /philosophy and /pricing, each cell padded with the band padding.
- **The pillar chapter**: a header split, then a scene, then two or three feature fragments on the paper surface. A sticky category nav of pills leads through the chapters.

Breakpoints (min-width): 768, 1152, 1320. The scenes switch from the phone drawing to the desktop drawing at 650. Hover effects only inside `@media (hover: hover)`.

### Named Rules

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

- **Shape:** full pill (9999px), 40px tall, 10px side padding, Label weight 500. An arrow `→` follows the label by default.
- **Light on white** (the default): the accent as fill, the deep text. The main call to action on a paper band.
- **Deep on white:** the deep as fill, paper text. A strong secondary, or the main action on a light accent band.
- **Deep on light / light on deep:** the same pair, for inverse and accent bands.
- **Soft:** a faint tint of the deep (or of the accent) as fill, deep text. The secondary in a group.
- **Hover / Focus:** the two colours swap instantly, without a transition. A hover to the page surface takes `--text-on-page`, the canonical role: the contextual `--text-primary` is light on an inverse band. Active adds 80% opacity. Focus is a 2px outline in the current colour, 2px offset. Disabled is 40% opacity.
- **Leading items:** a 20px round avatar or a row of overlapping logos can lead the label ("Lets Talk!", "Explore Integrations").

### Chips (category nav, tabs)

- **Style:** pill, Label weight 500, muted text. The current item gets a faint tint of the deep and the full text colour. A tint pill slides to the current item (300ms, cubic-bezier(0.3, 0, 0, 1)).
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

- **Header:** 82px, not sticky, on the surface of the page or of the hero band. The links (Label weight 500) are centred and get an underline on hover. "Get Started" is a pill button.
- **Mega menu:** on the paper surface, three columns of 300px, muted descriptions, with a hairline on top. It opens without animation.
- **Footer:** on the inverse of the page theme. It has a Headline-size closing line with a text face, columns of links in the on-inverse colours, and a status line with a dot.

### Code card (signature)

A deep window in the theme hue (`--code-background`), 12px radius, max 500px wide, Geist Mono. Tabs are pills, and the current tab takes the accent. Line numbers are faint. Notes can point at a token with a 1px leader line that draws itself.

### Product scene (signature)

The product UI drawn in code (`@datocms/product-scenes`) inside a frame cut by the band. Real field names, real data, Italian demo content. The scene can play a short sequence in view. It never shows what the product cannot do.

### Pixel videos (signature)

The human, playful moment of each page: a hand that waves, a thumbs-up, a dancer, drawn as big flat squares in the colours of the theme. Real footage (or an animated emoji), keyed and reduced to three tones of cells. It is never a photo or an `.mp4`.

- **Where:** only in the page closer: the closing call to action, then the video band (494px tall at most, `min(494px, 75vw)`), then the "Questions? Ask away [••]" band. One surface, one theme, one block, never a grid.
- **Cells:** every video has the same square size on screen. Hands are 80 cells tall, full bodies 120. Each cell is one square with a thin stroke; no blur, no anti-aliasing, no tone curve on the footage.
- **Colour:** a palette gives the full look, always from the theme tokens, never a colour of its own. Three layers (dark, midtone, highlight) take the inverse, the accent and the paper tones. The usual palettes are `tonal` (on the inverse), `onAccent` (dark squares on the accent) and `silhouette` (a dark figure on the accent, for dark subjects). A video that needs a different look gets a new palette, not a setting.
- **Edges:** the ground of the palette fills the band beyond the video. A subject that the frame cuts (an arm from the right) stays on that edge of the band.
- **Interaction:** a lens under the pointer that magnifies and reshapes the squares (the same lens, in cells, for every video).

### Pixel images

The same language on photos: the image of a card (a post card, a media card) shows its pixel version on hover. 160 cells wide, five tones (deep, shadow, accent, highlight, white), and it "breathes" in 125ms steps (a period of 4s), so it moves like pixel art, not like a video. Portraits and avatars take the theme hue with `mix-blend-mode: luminosity` or `multiply`.

### Diagrams (signature)

A picture of what DatoCMS does when the subject is not a screen of the cms: the real-time stream, the wall of cached pages, the media pipeline, the integrity of the schema. All diagrams speak one grammar, so the eye learns it once: **a pill does the work, a pulse is data that moves, a ring is what changed.**

- **Surface:** the inverse sheet of the band, inside a `whole` frame (no frame drawn, nothing cut), 960px at most, top-down on phones. A diagram in a fragment can sit on a light surface (`data-diagram-surface="light"`).
- **Pill:** the actor or the event. 28px tall, full radius, Geist Mono at code-small size, the DatoCMS mark at 14px. Light on the inverse (`--text-on-inverse-strong`). An event pill shows one event and its time; the next one replaces it.
- **Track:** a line, 1.5px, quiet (`--border-on-inverse-strong`) and always drawn. No arrows, no dashes.
- **Pulse:** a short 2px dash of the accent that runs along the track once: data on the move.
- **Panel:** a container, 8px radius, a surface darker than the inverse (the inverse mixed with 35% black), a 1px ring and a label in capitals in the mono font.
- **Change:** the ring and the tint of the accent. One accent only (`--text-on-inverse`). Never red: a purge or a deletion is the product at work, not a failure.
- **Motion:** two curves, a strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)` for enter, exit and ping, and a strong ease-in-out `cubic-bezier(0.77, 0, 0.175, 1)` for travel and draw. Durations from 0.32s (fade) to 1s (travel, settle). Each step waits for the one before: the pill, then the lines, then the pulse, then the ring. Nothing appears in one frame. The still (the last step) is the markup.
- **Show the claim, not the mechanism.** A wall of pages that change beats a boxes-and-arrows chart of the CDN.

### Other pictures

Each kind has one language, used by every picture of that kind: the neutral chat (a transcript with no avatar and no product's bubbles), the neutral terminal (mono, a prompt glyph, a block cursor, real CLI output), and a browser with an invented site. A feature that is not the cms (images, video, cache tags, real-time) gets code, a diagram or a before/after, never a fake UI. Rules for all pictures: `src/scenes/AGENTS.md`.

### Two-tone headline with typewriter (signature)

Hero headlines can type themselves in at a human rhythm. The cursor is a bar that becomes the text face. The final text is in the DOM, and reduced motion shows it at once. The buttons fade in (150ms) after the typing.

## Do's and Don'ts

### Do:

- **Do** give each section one theme and one surface, full bleed, and change the theme only between bands.
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
- **Don't** add a third font weight, a bold, a tracked uppercase label or a second typeface for display.
- **Don't** use screenshots, stock photos or AI imagery where a scene, pixel art or a real customer photo can go.
- **Don't** mix two accents of different themes inside one section.
- **Don't** use arrows, dashed lines, red or a second accent in a diagram.
- **Don't** give a pixel video colours of its own, a blur or a tone curve: a new look is a new palette.
- **Don't** take a pattern from a page that is not in the reference list (see the comment at the top) without asking.
