# Blog covers

Each blog post with a cover gets one real subject (an animal, an object, a tool or a plant), cut out of a stock photo and drawn as a grid of square cells. The cover is the split of the site: the accent of the theme on the left half, the ink on the right half. The subject crosses the seam in the middle, and its colours change where it crosses.

- The CMS keeps the covers, in two fields of a blog post. `pixel_cover` is the file: a PNG of 100 × 58 px, one pixel for each cell. `theme` is the theme of the post: the colours of the cover and of the page. The site shows a cover only when the post has the two fields.
- The file has no colours of a theme. A cell is transparent (the ground) or has one of three tones: black, grey, white. The theme gives the colours when the cover is drawn, thus a change of `theme` in the CMS changes the cover at once. The file is the only copy that we keep (see "The record").
- `src/lib/pixel-cover/cover.ts` has the format of the file, the colours of the tones on each half, and the drawing. `PixelCover` and `gen.ts` use the same rules.
- `PixelCover` takes a post (`PixelCoverFragment`) and draws the cover on a canvas: each cell is a whole number of device pixels, with a gap of 0.15 of the cell, at most 1 CSS pixel. The gap is not a whole number of device pixels: on a small cover the canvas blends it into a soft line. It shows the file with a plain `<img>`, as a PNG with no loss (`fm: png, auto: compress`): without these parameters the CDN gives a browser an AVIF with loss, and the pixels change.
- `scripts/blog-covers/gen.ts` makes the files, checks them and sends them to the CMS. Start it with `scripts/blog-covers/covers.sh <command>`: `covers.sh list`, `covers.sh render <slug>`. The commands are in `scripts/blog-covers/README.md`. The script uses the login of the datocms CLI: if a command gives an authentication error, ask the owner to run `npx datocms login`.
- `/dev/cover-gallery` shows the covers at the size of a feed card and at the size of the post header.

## Where a cover shows

- **The feed card** (the featured row of /blog and of each category): 366 × 214 CSS px. **One cell is approximately 3.7 CSS px.** This size decides. On a 1× screen the cell is 4 px, and the box cuts up to 4 columns at the left and at the right and 2 rows at the top and the bottom.
- **The post header**: the right half of the header, approximately 712 CSS px wide (one cell is approximately 7 px).
- **Very small**: approximately 20 px high, in a list or in a link preview. The subject must still be a clear shape.

Judge each cover at feed size first. A cover that works only in the post header does not work.

## The rules

### 1. One clear subject

- **The subject is one real thing from a photo: an animal, an object, a tool or a plant.** The rules are the same for an animal, an object, a tool or a plant: one thing, a name that everybody knows, an outline of its own, few areas of tone.
- **An object, a tool or a plant that everybody knows**: a key, a padlock, a compass, an anchor, a watering can, a lantern, a cactus, a sunflower. Its outline names it. A box, a ball or a device with a screen has no outline of its own. The object has no text, no brand and no screen. Thin parts disappear here too: strings, wires, chains, thin stems, the teeth of a comb.
- **One subject.** A comparison can have two (one on each half), never more. No groups, no rows of copies, no stacks. (Rejected: four stag beetles in a tower for "bugs in a trenchcoat": too much for cells of 4 px.)
- **A subject that everybody knows.** A reader anywhere must name it at once: dog, pig, elephant, parrot, snail, crow. Not a species that only a birdwatcher knows. (Rejected: a kookaburra, "the laughing bird", for an April Fools' post: "what animal on earth is this?". The joke must work when the reader does not know the species.)
- **The silhouette names the subject.** Look at the silhouette in the preview (the subject in one colour). If you cannot name the subject from the outline in one second, reject it. (Rejected: a hedgehog that became a lump, "a bush or something".)
- **A large, simple outline.** Side view. Pick a subject with a shape that is its own: the beak, the ears, the tail, the wings, the legs at full length. Parts thinner than 2 cells disappear or become loose bits: antennae, whiskers, the thin legs of insects, spines, the tips of feathers. A subject that you know only by such parts is a bad pick. (Rejected: an octopus that became a round lump, and one that became a "thumbs up".)
- **Few large areas of tone.** A busy texture (spotted fur, patterned feathers, scales, spines) becomes noise. Prefer a subject with 2 or 3 large areas: a dark back and a light belly, a white face, a dark wing.
- **No props.** Only the subject: no branch, perch, grass, food, shadow or ground. Remove them with `key.crop`, or pick a different photo.
- **The holes of the subject are holes.** The space inside a ring, a handle, a shackle, the bow of a key, or between a rope and the thing that it goes around, is ground. Without `key.holes` (see "The spec") the script fills such a space, and the outline is wrong. Look at the silhouette in the preview: each opening of the subject must be open. (Rejected: an anchor with a filled ring and a filled space between its rope and its shank, a key with a filled bow that read as a lollipop, a closed padlock that read as a tombstone.)
- **A subject that reads as a different thing is rejected**, also when all the checks say `ok`. From the first review of objects: a lighthouse (a stick), a tortoise (a dome), a quill (a feather or a leaf), a side view of a drill (an hourglass), a dress form (the torso of a person: no human figures, also no dummies), a mailbox with letters (a muddle inside). A flat object of one material with no parts (a puzzle piece) reads, but looks like an icon: prefer a subject with parts and tones.
- **Rejected in the second review**: a boxing glove ("impossible to guess what it is"), a kitchen funnel (weak: a bowl or a lamp), a stapler (the mouth of a fish), a typewriter from the front (a shopping bag) and at an angle (a pistol), a mortar and pestle (a thumbs up). A closed machine from the front or at an angle is a box: only a side view with a clear profile can work. Also rejected in the third round: an armchair from the side (a subject on four legs), a penguin that leans forward (a seal), a horseshoe magnet (an arch), a grocer's dial scale (a trophy), a giraffe (narrow, and the spots are noise), a cheetah (the spots are noise), a honey bee (a bug), a starfish (an icon).
- **A new cover must be stronger than the cover that it replaces.** (Rejected: a fawn that looks back, weaker than the elephant of the post.)
- **A flat view: from the side or from the front, with no perspective.** A photo from above at an angle shows the top and the base of an object as ovals. Such a subject has no flat base: it cannot stand on the bottom edge (see rule 2).
- **The part that names the subject shows**: the tail of a fox (without it, a wolf or a jackal), the two humps of a camel, the ears of a donkey. An idea that needs the face or a small gesture (a subject that looks back) does not show in cells.
- **Not narrow.** A subject less than 32 columns wide looks small next to the others, also when it is high: a check fails. For a tall, thin subject, use the closer framing (rule 3) or a different subject. (Rejected: a dress form 22 columns wide.)
- **Matte before glossy.** The shine of polished metal, vinyl, paint or a polished nut becomes white bands and blobs, and `split` cannot remove it. Prefer a photo with soft light and a matte surface.
- **Not a white subject on the white ground.** The white parts that touch the ground go with it: the neck of a white goose becomes a line, a white scooter loses its body. Take a darker one of the same kind. A higher `key.light` helps only for small white parts.
- **No shadow and no reflection below the subject.** The shadow on the floor becomes part of the outline: it joins the feet or the wheels in one band, or it adds a bulge to the base. (Rejected: a watering can with its shadow as a bulge at the bottom left.) Remove it with `key` (a lower `light` and a higher `chroma`: `light: 190, chroma: 45`), or with a `crop` just above the floor. A reflection fills the space between the parts: take a different photo.
- **An animal that its tones name** (a giant panda, a zebra) has the outline of a different animal (a bear, a horse). It is correct only when the pattern is clear in the three tones at feed size. Say it in your report.
- **A dial with numerals** (a clock, a scale, a telephone) is not text when the numerals are too small to read in cells. A word or a brand that stays readable is text.
- **A line 1 cell wide** (a chain, a handle, a spoke, the cage of a fan) is correct for one or two parts that name the subject. A subject made mostly of such lines is rejected. (Rejected: a folding chair, a racing bicycle, a balance scale whose chains are dots.)
- **A real thing, in a real photo.** Not a toy, a figurine or a 3D render: the surface is glossy and the proportions are different. When Envato has no photo of the subject on a white ground (an orca), take a different subject.
- **A long thin tail** (a mouse, a lizard) gives width but no mass: the subject cannot be large and cross the seam correctly. Do not shorten the tail with `crop`. Take a pose with the tail near the body, or a different subject.
- **A pair does not touch.** Keep at least 4 empty cells between two subjects. If not, they read as one shape.

### 2. No cut, except at the bottom

- **The top, the left and the right cut nothing.** The head, the tail, the beak and the ears are in the frame. (Rejected: a macaw cut at the top.)
- **The bottom edge can cut the subject.** The subject can stand on the bottom edge, or go out of the frame at the bottom: the legs, the lower body, or a bust (the head and the shoulders) that comes up from the bottom edge. Then the subject can be larger. Make the cut clear: the bottom edge goes through the body or the legs with many cells, not only through the tips of the toes or of the tail (that looks like a mistake).
- **The bottom: a margin, or the ground. Not between the two.** Decide for each subject:
  - **A margin**: 3 empty rows or more below the subject. The subject is in the air, as a bird in flight or a key.
  - **The ground is only for a flat view.** A subject in perspective (a watering can seen a little from above) has an oval base: on the bottom edge it looks cut, not put down. Give it a margin. (Rejected: a watering can at an angle, locked to the bottom.)
  - **The ground**: 0 empty rows. The subject has cells in the last row: it stands on the bottom edge (a dog on its legs, a telephone, a chess piece), or the bottom edge cuts it (a bust, the handle of a hammer). `PixelCover` then puts the grid at the bottom of its box, thus the subject is locked to the bottom edge of the card and of the post header, with no band of ground below it.
  - 1 or 2 empty rows, or a subject that stops a little above the edge, look like a mistake. (Rejected: a beagle, a telephone, a chess knight and a hammer that were at the bottom of the grid but had a thin band of ground below them on the screen.)
  - An animal that walks can have one paw in the air when its other feet are on the edge.
  - A white detail at the bottom of the subject (the piping of a cuff) can go with the ground and leave 1 empty row: let the bottom edge cut the subject.
  - In a pair, each subject decides for itself: a hammer on the ground and a key with a margin are correct.
- **The safe area**: at least 5 empty columns at the left and at the right, and at least 3 empty rows at the top.
- **Never cut the subject with `crop`** at the top or at a side (a tail, an ear, a horn). No check sees this cut. `crop` removes a prop (a branch, a base, the floor) or a second subject. A `crop` line through the subject is correct only where it falls on the bottom edge of the cover.
- **In the photo too.** A photo that cuts the head or the tail at the top or at the sides gives a cut subject. A photo cut at the bottom is good when the cut goes on the bottom edge of the cover.

### 3. Large: fill the frame

- All the covers have the same scale: the subject fills the frame up to the safe area in its limiting dimension. A tall subject is 44 to 52 rows high (or it goes to the bottom edge). A long subject is 82 to 90 columns wide. (Rejected: a pigeon of 49 × 43 cells, smaller than the other animals of its row.)
- Make `h` as large as the margins allow. Then look at the row in `/dev/cover-gallery`: no subject can look smaller than the others.
- **A closer framing is a possible option**, as an alternative to the whole subject. A large head and body read well when the cover is very small. To get closer, let the subject cross the bottom edge (a bust, or the body cut at the legs). Keep the head and the parts that name the subject (the trunk, the comb, the beak, the ears, the shell) in the frame at the top and at the sides. Pick the framing that reads best.

### 4. Across the seam

- The subject crosses the seam (column 50). Between 20% and 80% of its cells are on the accent. The head is on the accent (left) when possible: the subject looks to the left (`flip` turns the photo).
- A symmetric subject (a butterfly from above) has its axis on the seam (`cx: 50`).
- A pair: one subject on each half, face to face, not touching. In a pair no subject crosses the seam: this is correct.
- When these rules disagree, the cover that reads better wins: say in your report which rule you did not follow. A thin central part (the post of a signpost, the pole of a scale) is never on the seam: move it into one half with `cx`.
- A subject that leans has its mass away from its centre: `cx` is the centre of its box, not of its mass. Move `cx` until the crossing check passes.
- An object has no head. Put its darkest part on the accent, because a dark part disappears on the ink (the black handle of a moka pot). Put the seam through the main mass of the subject, not along its edge: if not, the cover looks like two pieces (a spout on one half, a body on the other).

### 5. The idea

- Pick the subject for **what it does**, not for what it looks like. For an object or a tool, this is its use: a compass (to find the way), a padlock (records that stay locked), a sieve (a filter), a watering can (content that grows). For a plant, how it grows or lives. Say in one line what the post makes the reader do, then find the subject that does it: a hound that follows a trail (agents that read your site), a magpie that collects shiny things (shopping agents), a carrier pigeon (a remote connection), a chameleon (personalization), a butterfly (major changes: a metamorphosis), a crowing rooster (an April Fools' launch).
- A title with a joke can take the joke, but only when the rules above stay true.
- Read the post first: `curl -s https://www.datocms.com/blog/<slug>.md` for a published post, or the same path on your dev server for a draft.
- **A post about an event or a mood** (a birthday, a retreat) has no action. Then take an object of the occasion or of the culture (a moka pot for the meals of the team in Italy).
- **Italian objects of the 1950s and 1960s (a trial).** DatoCMS is an Italian company, and the objects of the Italian home and street of those years have clear, well-known outlines. Only the objects with mass and a profile work: a moka pot, a scooter, a small city car, a sewing machine from the side. The thin or narrow ones failed (a folding chair, a racing bicycle, a wine flask in straw, a desk lamp). Search Envato for a flat view before you claim the object: for many of them (a Fiat 500, an old Vespa) there is none. A modern object of the same kind and outline is correct: cells do not show the year or the country. When such an object carries the idea as well as a different subject, prefer it. The rules stay the same: a flat view, no brand and no text on the object, a name that everybody knows.
- **The parts of a series** are the work of one agent, which chooses the family. The year reviews ("A look back at…") are not a series. The parts take subjects of one family, in the order of the story (a seed, a watering can, a tree).
- **A near twin is the same subject**: the same kind of thing (scissors and pruning shears, a rabbit and a hare) or the same outline (a snail and a hermit crab).
- **Only animals, objects, tools and plants.** No hands, no people, no UI, no text, no logos.
- **Never a face of a real person**, not as pixels, not as a stencil, not posterized. The casual chats (interviews) have their own cover, `ChatCover` (`src/components/ChatCover/`): the real portrait of each guest, in black and white, in a speech bubble made of cells. Only the outline of the bubble is cells. The photo is whole.
- **Each subject once.** `covers.sh list` shows the subjects in use and marks a subject that is in use two times. Look at the list before you search.

### 6. Tones and contrast

- Three tones for each subject, from the quantiles of the luminance (`split`, default `[0.4, 0.8]`).
- On the ink half, the dark tone is near the ground. A dark subject disappears there: move `split` down (for example `[0.15, 0.65]`) and look at the right half of the preview.
- `despeckle` (on by default) removes lone cells. Do not turn it off.

## The process

A request for a cover gives the slug of a blog post. The post must be in the CMS: a draft is sufficient. Do all the steps, and stop only for step 7.

1. **Read the post** and choose the idea and the subject (rules 1 and 5). Run `covers.sh list` to see the subjects in use.
2. **Find photos** on Envato (see "The photos"). Save 6 to 12 previews and look at all of them: `montage -label '%t' $(ls tmp/blog-covers/candidates/<prefix>-<subject>-*.jpg | sort -V) -tile 4x -geometry 300x300+4+4 <out>.png` makes one sheet. Take a photo by the name on its label, not by its place on the sheet: without `sort -V`, 10 comes before 2. Some subjects have fewer than 6 photos on a white ground: then use what there is, or change the subject. Delete the variants that you rejected when you finish, but for one alternative that the owner can want to see. If a search gives fewer than 6 results, change the words. Copy the photo that you use into `tmp/blog-covers/photos/`.
3. **Write the spec**: `tmp/blog-covers/specs/<slug>.json` (see "The spec"). Choose the theme, if the post has none (see "The theme").
4. **Try it**: `covers.sh render <slug> --try --theme=<theme>` writes the preview and, when all the checks say `ok`, the cover file `tmp/blog-covers/covers/<slug>.png`. It changes nothing in the CMS. To compare a second photo and keep the first, write a variant: the spec `specs/<slug>.<name>.json`, rendered with `--variant=<name>`, has its own preview `preview/<slug>.<name>.png` and never goes to the CMS. Correct the spec until all the checks say `ok`, then look at the preview (see "The checks"). Try at least 2 photos.
5. **Write it**: `covers.sh render <slug> --theme=<theme>` sends the cover file and the theme to the CMS, only when all the checks say `ok`. A published post with no other changes is published again, and the site shows the cover at once. A draft, or a post with other changes, stays as it is: the command says so. Do not publish it: tell the owner. The owner can also put the cover in the CMS by hand: the file of step 4 goes in the field `Pixel cover` of the post, and the field `Theme` gets the theme.
6. **Look at the row** in `/dev/cover-gallery` and on the page of the post. They show only published posts. For a post that is not published, the owner sees the page with its cover in the CMS: the Web Previews plugin, in the sidebar of the post, opens the draft on the website. Say this to the owner. `covers.sh list` shows the theme of each row.
7. **The licence**: before the cover goes to production, buy the licence of the photo, download the full photo, render the cover again from it, and set `covers.sh set <slug> licensed=true`. A preview of Envato has no licence. The licence is a decision of the owner: finish the other steps, then say that the cover has no licence.

Keep `tmp/blog-covers/` (Git ignores it): the photos, the specs and the previews. They are a cache, not the record.

## The spec

`tmp/blog-covers/specs/<slug>.json`:

```json
{
  "slug": "headless-cms-personalization",
  "subject": "chameleon",
  "source": "https://app.envato.com/search/photos/<id>",
  "layers": [{ "photo": "chameleon-5.jpg", "h": 30, "cx": 49, "y": 16, "flip": true }]
}
```

- `subject`: the subject in plain words (`beagle`, `brass compass`). A pair: `red fox + hedgehog`.
- `source`: the page of the photo on Envato, as the script of "The photos" gives it: `https://app.envato.com/search/photos/<id>`. Not the URL of a search (`/search?term=…`). A pair has two pages: join them with `+`.
- A layer is one subject from one photo in `tmp/blog-covers/photos/`:
  - `h`: the height in cells of the subject that stays after `key` (not of the photo). The width comes from the photo. The result can be 1 row less. For a closer framing that the bottom edge cuts, give an `h` larger than 58 (for example 80): the rows below the frame go. Do not use `crop` for this.
  - `x` (the left column) or `cx` (the centre column), and `y` (the top row). The frame is 100 × 58. The seam is column 50. A lower `cx` moves the subject to the left, onto the accent, with or without `flip`.
  - `flip`: mirror the photo (to look to the left).
  - `key`: how the white ground goes. `light` (222) and `chroma` (30): a pixel is ground when it is lighter than `light`, has less chroma than `chroma`, and touches the edge of the photo through ground. `erode` (0): remove N px of light rim. `crop: [x0, y0, x1, y1]` (fractions of the photo): keep only this part. `holes: true`: an area of ground colour that the subject closes (the inside of a shackle, of a handle, of a ring) becomes ground. Use it for an object with an opening. Without it the opening fills, and the silhouette is a lump. Do not use it for a subject with white areas of its own. A number is the smallest area of a hole, as a fraction of the photo (`true` is 0.001).
  - `coverage` (0.5): the part of a cell that must be subject. A lower value (0.35) keeps a thin part that names the subject (the beak of a hummingbird).
  - `key` for a light or shiny subject: the default removes white plastic, bright steel and the highlights of metal when they touch the ground. Raise `light` (245 to 248) and lower `chroma` (10). For a grey corner or a vignette in the photo, which becomes a second blob: lower `light` (200) or remove the corner with `crop`.
  - `crop` uses the coordinates of the photo before `flip`.
  - `holes` and a white area on the same subject (the handle and the dial of a clock): `holes` removes a white area only when it is one piece without marks. Look at the preview. For the spokes of a wheel, use a small number (`0.0002`).
  - `split` for a black and white animal: a middle value (`[0.3, 0.75]`). A low value makes the black parts light.
  - Two subjects from one photo: two layers with the same photo and two `crop`s.
  - `split` ([0.4, 0.8]): the luminance quantiles of the three tones.

## The checks

`covers.sh render` prints the checks. All of them must say `ok`:

- no cell out of the frame at the top or at the sides; margins of 5 columns, 3 rows at the top, 3 or 0 rows at the bottom;
- the photo does not cut the subject at the top or at a side (a tail that stops at the edge of the photo);
- the size: 44 rows high or more, or 82 columns wide or more, and never less than 32 columns wide;
- the crossing: 20% to 80% on the accent;
- the noise: 30% of the cells or fewer have 0 or 1 neighbour of their tone;
- the main parts: the subject (or the two subjects) is 90% of the cells or more;
- the loose bits: 4 small loose parts or fewer.

The checks are necessary, not sufficient. A subject that passes all of them can read as a different thing (see rule 1): the look at the preview decides.

Then look at the preview (`tmp/blog-covers/preview/<slug>.png`):

- **top left**: the feed card on a 2× screen. Can you name the subject at once? Look at the bottom edge too: the subject has a clear margin, or it is on the edge with no band below it.
- **top right**: the feed card on a 1× screen (shown at 2×).
- **bottom left**: the silhouette. Can you name the subject from the outline?
- **bottom right**: the post header.
- **the strip at the bottom**: the cover at 20 px high (shown at 4×). It must be a clear shape.

## The theme

The theme of a post is the field `theme` of the post in the CMS: `yellow`, `orange`, `green`, `purple`, `blue` or `pink`. An editor can change it in the CMS, or `covers.sh set <slug> theme=<theme>` changes it. The file does not change: it has only tones.

The featured row of a feed is its three newest posts. A post is in two feeds: all the posts, and its category. The three covers of a row have three different themes. To choose the theme of a new post, run `covers.sh list`: at the end it shows the row of each feed, with the theme of each post. Take a theme that the other two posts of the two rows do not have. The new post moves the oldest post out of each row. `covers.sh list` marks a row with the same theme two times.

The site reads the colours of a theme from the tokens (`--theme-accent`, `--theme-ink`, `--theme-paper`, `--theme-pixel-highlight`). The previews of `gen.ts` cannot read the tokens: `THEME_HEX` in `gen.ts` has a copy. When the tokens change, change the copy.

## The record

The PNG keeps its record in a text chunk (`datocms-cover`): the subject, the source, the licence and the layers of the spec. The CMS keeps the file as it is, with the chunk. `covers.sh list` shows the record, `covers.sh set` changes it. The spec and the photo are not in the repository: to change a cover, write the spec again from the record and get the photo again from `source`. Do not make a cover file with a different tool: a file with a pixel that is not a tone does not show.

## The photos: Envato in the owner's Chrome

The photos come from the previews of Envato (app.envato.com), in the Chrome of the owner, who is logged in. Use the chrome-mcp-server tools (load them with ToolSearch, for example `select:mcp__chrome-mcp-server__chrome_navigate,mcp__chrome-mcp-server__chrome_javascript`). Other agents use the same browser:

- Open your own window once: `chrome_navigate` with `newWindow: true` and a search URL: `https://app.envato.com/search?itemType=photos&term=<words>&ref=<your-prefix>`. It gives a `tabId`. Give that `tabId` to each call. A hidden tab does not show the results, and a navigate with no `tabId` can use the tab of a different agent. Do not act on other tabs. Close your window at the end.
- For a new search, navigate your tab to a new search URL. `chrome_navigate` with a `tabId` answers "Activated existing tab" with the old URL, but the tab does go to the new page.
- The results come late and not all at once. Before you save, wait until the page is the new search and has cards, and scroll the inner list (the elements with `overflow-y: auto`, not the window) to load more than the first 6 or 7. In your own window the tab is active, thus a short wait loop works: `while (new URLSearchParams(location.search).get('term') !== term || cards().length < 8) await new Promise((r) => setTimeout(r, 250));` with a limit of 20 turns. The files can arrive in `~/Downloads/` a moment after the script ends.
- Do not return `location.href` or any URL with a query string: the tool then hides the whole result.
- The tool hides URLs with a query string in its output: do not try to read the URLs of the images. Save the previews from the page. The result cards match `a[href*="photos/"] img`. A background tab slows down the timers: do not use `setTimeout` for the downloads (the short wait loop above, in your active tab, is the only use). Set `img.loading = 'eager'` and fetch at once. The script returns the page of each item, for `source`:
  ```js
  const cards = [...document.querySelectorAll('a[href*="photos/"]')]
    .filter((a) => a.querySelector('img')?.width > 100)
    .slice(0, 12);
  const pages = [];
  for (const [n, card] of cards.entries()) {
    const img = card.querySelector('img');
    img.loading = 'eager';
    const blob = await (await fetch(img.currentSrc || img.src)).blob();
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `<your-prefix>-<subject>-${n}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    pages.push(`${n}: ${card.href.split('?')[0]}`);
  }
  pages.join('\n');
  ```
- The files go to `~/Downloads/`, where the owner keeps files too. Move only your files, by the full pattern `<your-prefix>-<subject>-*.jpg`, never by a short prefix: `mkdir -p tmp/blog-covers/candidates && mv ~/Downloads/<your-prefix>-<subject>-*.jpg tmp/blog-covers/candidates/`.
- Do not change the `w` parameter of an image URL: the signature breaks (403).
- Look at what you saved before you use it: the first images of a page are sometimes not related.
- Do not push a Download or License button, do not use "Generate" (the AI credits are few and belong to the owner), and do not change the settings of the account. Previews only. The licence is a decision of the owner (step 7 of the process).

Search words that work: `<subject> isolated white`, `<subject> side view isolated`, `<subject> white background`.
