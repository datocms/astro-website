# AGENTS.md: the pictures of the product

The pictures of the DatoCMS interface, and the other pictures of the feature chapters. The general conventions are in the root `AGENTS.md`; the copy and the shape of a chapter are in `src/data/AGENTS.md`. Read the `README.md` of `@datocms/product-scenes` before you add or change a scene: it has the CSS import, the font properties and the rules of a scene.

## The classes of a picture

| Class       | What it is                                                                                                            | How it is made                                                                              |
| ----------- | --------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Scene       | A screen of the cms, or one part of it (a field, a panel, a dialog)                                                   | The parts of the kit, composed in `src/scenes/<Chapter>/<Name>.tsx`, rendered on the server |
| Code        | A query and its result, a component, a terminal line                                                                  | `CodeSnippetPreview`, from the `code` of the data file                                      |
| Diagram     | A picture of what DatoCMS does, not a screen (the stream of Real-time, the wall of Delivery, the pipeline of MediaAi) | HTML and CSS in the folder of the scene, with the shared grammar below                      |
| Other       | A neutral chat, a terminal, a browser with a fake site, the image lab                                                 | HTML and CSS in the folder of the scene, one language for each kind (below)                 |
| Pixel video | The drawn videos of `scripts/pixel-videos/`                                                                           | `PixelVideo`, in the PageCloser only                                                        |

Scenes, diagrams and the other pictures cost nothing in the browser: no `client:` directive, the still is the markup, a script only adds the motion.

## Rules of a picture

- **The real product, never a screenshot.** No PNG of the cms anywhere. A screenshot is out of date at the next release and cannot take the theme; a scene is rebuilt at every build from the real components. The kit never copies cms markup or CSS: each piece the cms shows is a static component of the kit, which the cms uses too.
- **Every picture shows exactly the claim of its sentence, and nothing else.** A picture that only decorates the sentence is wrong, and so is a picture with more in it than the sentence says. Each fragment adds a nuance or a point of view to the frame (a moment, a zoom, another place); if you cannot say how its picture differs from the frame, the fragment goes.
- **At rest, with one thing happening.** A filled form, a published record, calm, in the theme of the section. A menu or a tooltip is in the picture only when it is the claim; then it is rendered open and still. No dark cinematic crop, no flourish.
- **A form is not dramatic. A detail is.** A full editor cut at the edge is a calm picture, right for the frame. The interest is in the fragments: a field with its validation message, a locale tab, a stack of blocks. Two techniques, alone or together: zoom in, until the detail is the picture; cut the interface around the focus, so that the reader infers what comes before and after. Zoom and cut are props of the frame or the fragment, not new scenes.
- **A feature that is not the cms** (the images and video APIs, cache tags, real-time delivery) gets code, a diagram or a before/after of the output, never a fake UI.
- **One fake project for each page**, with named records and values that its pictures share, in the `story.ts` of each chapter. Invented brands and people. An assistant chat or a terminal is neutral, never a real product's interface. A real third-party service appears at most as a name in a menu item, never as a drawn interface. The texts of the cms (labels, messages, menus) are the real ones: check the docs or the cms code, do not invent a label.
- **Every scene has a `description`.** The screen is hidden from assistive technology; the description is what a screen reader hears. It says what the picture shows, in the voice.
- **Nothing needs motion to be understood.** The still is the last step of a sequence: it shows without JS and with reduced motion.

## The stories

Each page has one project; the Editing chapters have one each. The names, the records and the values are in the `story.ts` of the chapter: do not change a text there without a change to the copy in `src/data/`.

- `/developers`: **Northlight**, a maker of lamps with a shop and a journal (`northlight.shop`); the product "Arc floor lamp" runs through the chapters, modelled, queried, cached, forked, scripted. The Plugins chapter has its own: **Alpine Trails**, a site of hikes with its private plugin Trail tools.
- `/media`: **Saltmarsh Museum**, a museum of textile and craft (`saltmarshmuseum.org`), its exhibition "Light and Thread", the photo "Tide Line (detail)", the curator Amara Osei, the video "Restoring Tide Line". Asset fields has **Far Track** (the trip "Wadi Rum on foot"); the components chapter shows "Keepers of the Light" on `harwickmaritime.org`.
- `/ai`: **Marram**, a maker of bike bags that sells in four markets (en, it, de, fr): the product "Rolltop pannier 20 L", pages without an SEO description, photos of loaded bikes, how-to videos. The assistant is "the assistant", the agent "the agent".
- `/editor-experience`: Terra Guides (Structured content), Field Notes, a travel magazine (Visual editing), Plover (Dynamic layouts), Lume Kitchen (Localization), Kestrel Newsroom (Workflows), a recipe edited by two people (Collaboration), Harbourfest (SEO).

## Scenes

- A scene renders `Scene` (`src/scenes/Scene.tsx`), not the `Stage` of the kit. Its `appearance` (`theme`, `surface`, `tint`) follows the section around the scene: the theme gives the hue of the cms (`SCENE_HUE` in `src/scenes/theme.ts`, the only place for hues), the inverse surface gives the dark scheme with tint 2. On the other surfaces the scene follows the scheme of the page (`scheme="page"` of the kit: the layout sets `data-product-scenes-scheme` on `<html>`), thus it is dark in the dark scheme of the site. An image in a scene that has a dark version is one SVG with a `prefers-color-scheme` query (`DynamicLayouts/feature-grid.svg`): an image follows the scheme of its element. Each scene defaults to the theme of its chapter.
- A record editor scene renders `EditorScene` (`src/scenes/editor.tsx`) with its story (project, user, menu of the models, record info) and its form as children. `chrome="editor"` (the default) has no navigation bar and the menu of the models closed; `chrome="app"` has both. `panels` replaces the panels of the aside under the record info.
- Style a screen only with the CSS properties of the kit (`--product-scenes-zoom`, `-radius`, `-shadow`, `-border`), never with the class names of the kit.
- Give a scene that must keep a layout a `minWidth` on its stage: on a narrower box the kit makes the zoom smaller.
- The kit is not on npm for the website: `vendor/` holds the tarball and `package.json` points to it. `npm run vendor-scenes` builds it from `../private/web/packages/product-scenes` (or `KIT_DIR`); the version of the tarball has the short sha of the kit commit, and `.dirty` when the kit has uncommitted changes. Commit the new tarball, `package.json` and `package-lock.json` together, and restart `astro dev`.

## Chapters

- A chapter is `src/scenes/<Chapter>/Chapter.astro`: the `ChapterHeader` (`background="split"`) and one `SceneFrame` in a `ChapterSplit` (the background of VersusSplit: accent at the left, inverse at the right, from 1152px; a `whole` frame stays on the inverse surface), then the `FeatureFragments` with a `SceneFragment` for each picture. `ChapterLayout` does the same from data alone, with a box for each picture that has no scene yet. The sizes of the screens are inline props in that file, each with a comment that tells what the box shows. The page is the list of the chapters; the copy stays in `src/data/`.
- A new chapter: `story.ts`, `<Name>.tsx` (the forms, on `EditorScene`), `Chapter.astro`, one line in the page, and its copy.
- Photos of a scene are imported in the scene (`import cover from './cover.jpg'`, then `cover.src`).

## Frames and fragments

- `SceneFrame` frames the main scene of a chapter. `preset`: `window`, `detailEnd`, `fill`, `whole`; and `height`, `phoneHeightVw`, `tabletHeightVw`, `zoom`, `flushBottom`, and `cutEnd` for `window` only. A screen of all the app that shows all its width is `fill`: no margin around it. `window` and `fill` have no margin. No frame has a surface, and only `window` and `detailEnd` have a line, on the side that cuts the screen (none at the bottom). A picture that is not a screen (a diagram, the wall of pages) is `whole`: nothing drawn, nothing cut, its own height; `whole` takes none of the other props. Why: a picture with edges of its own looks broken when a frame cuts or fades it. The drawing of each preset is in `style.module.css` of the component.
- `SceneFragment` frames a picture in the box of a fragment. `fit`: `scale`, `crop`, `fill`; `zoom`, `phoneZoom`, `align`, `border` for `scale` only (the props are a union of modes). Each picture starts at the top left corner of the box; the box cuts it only at the right and the bottom. `scale` scales the picture with the box: `zoom` is the zoom in a box of 500px (the box from 1280px), and a box of another width scales it by its width, thus each box shows the same part of it and the text follows the width of the box. `phoneZoom` replaces `zoom` below 650px and is scaled too (1.3 in a box of 350px is 0.9). The picture is in a window with a border and round corners, from its top left corner (from its top right corner with `align="end"`); `border={false}` for a picture that draws its own edges (the stack of the SEO previews, the consent card of MCP). `crop` keeps the picture at its size and the box cuts it (a `CodeSnippetPreview` with `fill`). `fill` fills the box and cuts nothing (a diagram, on its own surface).
- In development, a frame or a fragment shows a tag at its top right corner when the pointer is on it; the pointer on the tag shows the props (`src/components/DevConfig/`). The tag is not in production.

## Sequences and loops

- A scene with a `sequence` (the steps of an interaction, from the kit) plays it in a loop with `initSceneSequences` (`src/lib/motion/sceneSequence.ts`), in view only; without JS and with reduced motion it is the still picture. The same function pauses the animations of each screen out of view. No pointer is drawn.
- A picture that is HTML puts its steps in `data-scene-steps` on its root, with the steps in CSS on `data-step`. A loop with no steps (the wall) has its own script, in view only and not with reduced motion, and its still is the markup.
- A loop holds its still at least 1.5s. Separate things come one after the other, each with a transition: nothing appears or goes in one frame.

## Diagrams

A diagram is a `whole` frame that is a picture of what DatoCMS does, not a screen (`RealTime/Stream`, `Delivery/Wall`, `MediaAi/Pipeline`). A diagram can also fill a fragment (`SchemaBuilder/Integrity`, in a `SceneFragment fit="fill"`). All the diagrams use one grammar, thus the eye learns the code one time: a pill does the work, a pulse is data that moves, a ring is what changed. The parts are the classes of `src/scenes/diagram/style.module.css`, imported as `diagram`; the loop is `src/lib/motion/diagramLoop.ts` (`startDiagramLoop`, `DIAGRAM_MS`, `replay`, `arrive`). The stylesheet of a diagram keeps only its layout; the states are data attributes that the script sets; the still is the markup. Why: the first three were built one at a time, each with its own nodes, lines, colours and timings, and side by side they read as three styles. The sites that draw this kind of diagram well all draw a quiet track plus one bright moving part, labelled pills, one accent and greys.

- A **pill** for the actor: the mark of DatoCMS and a mono label in literal case. An event pill shows one event and its time; the next event takes its place; a history shows only in the panel.
- A **track** for a line: quiet and solid, with a pulse of the accent for data that moves. No arrows, no dashes.
- A **panel** with a label in capitals for a container.
- The **ring** and the tint of the accent for a change. Never red: red is for a failure, and a purge is the product at work.
- A **photo** or a video thumb has the class `photo`: a soft shadow, no ring (a ring made each photo look like a box). The same class serves a photo in a frame that is not a diagram (the image lab of `Images/`).
- Two curves (a strong ease-out for enter, exit and ping; a strong ease-in-out for travel and draw) and six durations, from the tokens of the grammar. The script waits for the pill to settle before the lines come, for the lines before the pulse, for the pulse before the ring.
- 960px at most, and top-down on phones.

## The other visual languages

Each is decided once and used by every picture of its kind.

- **The neutral chat** (`Mcp/Chat.astro`): a transcript, a question in one tone, an answer in another, tool rows as small mono labels, a confirmation row with two buttons. No avatar, no logo, no product's bubbles. The answer streams in line by line.
- **The neutral terminal** (`AgentSkills/Terminal.astro`): the mono font, a prompt glyph, output lines, a block cursor; the agent's lines marked with one glyph. The output lines are the real ones of the CLI.
- **`AppWindow`** (`src/components/AppWindow/`): a code editor with its file tab, or a browser with its address, the chrome of "Infrastructure with human skill" on the home page. It frames the code and the live blog of Real-time and the page of MediaComponents. A fake site page has its own CSS, system fonts, no site framework.
- **The photo with its URL** (`Images/Lab.astro`): a photo with the parameters of its URL as switches, the weight and the edge cache.
- **The neutral video player** (`Video/`): the chrome of a player with no brand. Mux's player is a web component we embed, not ours: keep the drawing generic.
- **Pixel pictures** (`PixelImage`, `PixelVideo`): a dotted drawing in the three tones. A map in this style needs verified node lists first.

## Photos

- The photos in the scenes are real photos from Unsplash: JPGs in the folder of the scene. Only `npm run unsplash-photos` writes them. Its list `PHOTOS` (`scripts/unsplash-photos.mjs`) gives each photo its name, the size of its box in the scene, the query and the `pick` (the index of the result, 0 to 9). An avatar has `facepad`: the crop is on the face. The key is in `UNSPLASH_ACCESS_KEY`. The script writes the photographer of each photo in `src/scenes/photos.json`. Do not add, crop or edit a photo by hand. Why: the blurred SVGs that came before looked like a sketch; a real photo makes the screen look like a real project.
- To choose a photo, run `npm run unsplash-photos -- --preview <name> ["<query>"]` (it needs ImageMagick): a contact sheet of the 10 results with their index. Set `query` and `pick` in `PHOTOS`, then run `npm run unsplash-photos -- <name>`. Look at the photo in its scene, on the page, after each change.
- A photo looks good on the theme of the section of its scene. Its colours do not have to be the hue of the section: a vivid photo with colours that go well with the hue (a red Fiat 500 on `green`) is good, and better than a dull photo in the hue. A colour that fights the hue (a blue knot of thread on yellow) is not. A photo that shows in more than one section looks good on each. Where the scene shows a focal point or a crop, the photo has one clear subject.
- The copy follows the photo: the title, the alt in each locale, the caption, the smart tags, the description and the focal point in `story.ts` and in `src/data/`. Change them with the photo. The chapters need no common story across their photos.
- Three exceptions, all listed with `edited` in `PHOTOS` and in `photos.json`, and never downloaded again: a good photo with a defect can be repaired with an image tool (`Images/fiat-500`: a dent, and the sides outpainted to 16:9 for the crops of the lab); a later frame of a video made from the frame of its thumbnail, thus the player and the thumbnail show two frames of the same film (`Video/restoring-tide-line-later`); a short clip made with a video tool from that frame (`Video/restoring-tide-line-clip.mp4`; the script makes its GIF and the still of the GIF, `gif`, and `npm run unsplash-photos -- --copies` makes them again with the renditions).
- Logos, favicons and pictures that are not photos stay SVG or CSS.

## Decisions that hold

Each was tried the other way first. Do not go back without a reason.

- **The Delivery frame shows the claim, not the mechanism**: a wall of cached pages, and a loop of events, each of which touches a few pages, which leave; the others close the gap and new pages come in at the end. A diagram of the mechanism (visitor, edge cache with its tags, DatoCMS, webhook) was built first and nobody could follow it; the three code fragments explain the header, the webhook and the CDN side.
- **The Real-time frame is a stream, not the editor**: the pill of the event, the code of the `useQuerySubscription` hook in a code editor, the live blog of a cup final in a browser, one stream line between them that is always drawn; each event sends a pulse down the line, the hook gets the ring, the post comes in at the top of the blog. The editor beside the page asked the eye to read a form and find the paragraph; a match is the page that changes each minute, and everyone knows it. The chapter has no fragments: one picture tells the event, the code that gets it and the page that changes.
- **The page closer** is one block: the closing call to action, the pixel video and the "Questions? Ask away" band on one surface, one theme, never a grid.
- **A pillar hero has no picture**: the first chapter brings it. The home hero has no product scene either (a request of the team).

## Tools

- `npm run scene-shots -- <dir>` takes a screenshot of the frame and the fragments of each chapter of `/editor-experience` at 1440, 820 and 390 px (`WIDTHS` changes them), with the dev server running. `npm run scene-shots:compare -- <before> <after>` tells which images changed and writes diff images. Take shots before a change to the scenes, the frames or the kit, and compare after it. `BROWSER=firefox` takes the shots in Firefox: Firefox and Chrome do not zoom some CSS in the same way (container units in a zoomed element), thus check a change to the zoom in both, and compare Firefox shots only with Firefox shots. The scripts need Playwright with Chromium (and Firefox); it is not a dependency of the website.
