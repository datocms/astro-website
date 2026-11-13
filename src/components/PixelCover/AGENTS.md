# Blog covers

Each blog post with a cover gets one real animal, cut out of a stock photo and drawn as a grid of square cells. The cover is the split of the site: the accent of the theme on the left half, the ink on the right half. The animal crosses the seam in the middle, and its colours change where it crosses.

- The files: `src/assets/blog-covers/<slug>.png`, 100 × 58 px, one pixel for each cell. The file is the only copy that we keep (see "The record").
- The theme of each post: `src/data/blogCoverThemes.ts`. `src/data/blogCovers.ts` gives a page the cover and the theme of a post.
- `PixelCover` draws the cover on a canvas: each cell is a whole number of device pixels, with a gap of 1 device pixel when a cell is 6 device pixels or more.
- `scripts/blog-covers/gen.ts` makes the files and checks them. The commands are in `scripts/blog-covers/README.md`.
- `/dev/cover-gallery` shows all the covers at the size of a feed card and at the size of the post header.

## Where a cover shows

- **The feed card** (the featured row of /blog and of each category): 366 × 214 CSS px. **One cell is approximately 3.7 CSS px.** This size decides. On a 1× screen the cell is 4 px, and the box cuts up to 4 columns at the left and at the right and 2 rows at the top and the bottom.
- **The post header**: the right half of the header, approximately 712 CSS px wide (one cell is approximately 7 px).
- **Very small**: approximately 20 px high, in a list or in a link preview. The animal must still be a clear shape.

Judge each cover at feed size first. A cover that works only in the post header does not work.

## The rules

### 1. One clear animal

- **One animal.** A comparison can have two (one on each half), never more. No groups, no rows of copies, no stacks. (Rejected: four stag beetles in a tower for "bugs in a trenchcoat": too much for cells of 4 px.)
- **An animal that everybody knows.** A reader anywhere must name it at once: dog, pig, elephant, parrot, snail, crow. Not a species that only a birdwatcher knows. (Rejected: a kookaburra, "the laughing bird", for an April Fools' post: "what animal on earth is this?". The joke must work when the reader does not know the species.)
- **The silhouette names the animal.** Look at the silhouette in the preview (the subject in one colour). If you cannot name the animal from the outline in one second, reject it. (Rejected: a hedgehog that became a lump, "a bush or something".)
- **A large, simple outline.** Side view. Pick an animal with a shape that is its own: the beak, the ears, the tail, the wings, the legs at full length. Parts thinner than 2 cells disappear or become loose bits: antennae, whiskers, the thin legs of insects, spines, the tips of feathers. An animal that you know only by such parts is a bad pick. (Rejected: an octopus that became a round lump, and one that became a "thumbs up".)
- **Few large areas of tone.** A busy texture (spotted fur, patterned feathers, scales, spines) becomes noise. Prefer an animal with 2 or 3 large areas: a dark back and a light belly, a white face, a dark wing.
- **No props.** Only the animal: no branch, perch, grass, food, shadow or ground. Remove them with `key.crop`, or pick a different photo.
- **A pair does not touch.** Keep at least 4 empty cells between two animals. If not, they read as one shape.

### 2. No cut, except at the bottom

- **The top, the left and the right cut nothing.** The head, the tail, the beak and the ears are in the frame. (Rejected: a macaw cut at the top.)
- **The bottom edge can cut the animal.** The animal can stand on the bottom edge, or go out of the frame at the bottom: the legs, the lower body, or a bust (the head and the shoulders) that comes up from the bottom edge. Then the animal can be larger. Make the cut clear: the bottom edge goes through the body or the legs with many cells, not only through the tips of the toes or of the tail (that looks like a mistake).
- **The safe area**: at least 5 empty columns at the left and at the right, and at least 3 empty rows at the top. At the bottom: 3 empty rows or more, or 0 (the animal touches or crosses the bottom edge). 1 or 2 empty rows look like a mistake.
- **In the photo too.** A photo that cuts the head or the tail at the top or at the sides gives a cut animal. A photo cut at the bottom is good when the cut goes on the bottom edge of the cover.

### 3. Large: fill the frame

- All the covers have the same scale: the animal fills the frame up to the safe area in its limiting dimension. A tall animal is 44 to 52 rows high (or it goes to the bottom edge). A long animal is 82 to 90 columns wide. (Rejected: a pigeon of 49 × 43 cells, smaller than the other animals of its row.)
- Make `h` as large as the margins allow. Then look at the row in `/dev/cover-gallery`: no animal can look smaller than the others.
- **A closer framing is a possible option**, as an alternative to the whole animal. A large head and body read well when the cover is very small. To get closer, let the animal cross the bottom edge (a bust, or the body cut at the legs). Keep the head and the parts that name the animal (the trunk, the comb, the beak, the ears, the shell) in the frame at the top and at the sides. Pick the framing that reads best.

### 4. Across the seam

- The animal crosses the seam (column 50). Between 20% and 80% of its cells are on the accent. The head is on the accent (left) when possible: the animal looks to the left (`flip` turns the photo).
- A symmetric animal (a butterfly from above) has its axis on the seam (`cx: 50`).
- A pair: one animal on each half, face to face, not touching.

### 5. The idea

- Pick the animal for **what it does**, not for what it looks like. Say in one line what the post makes the reader do, then find the animal that does it: a hound that follows a trail (agents that read your site), a magpie that collects shiny things (shopping agents), a carrier pigeon (a remote connection), a chameleon (personalization), a butterfly (major changes: a metamorphosis), a crowing rooster (an April Fools' launch).
- A title with a joke can take the joke, but only when the rules above stay true.
- Read the post first: `curl -s http://localhost:<port>/blog/<slug>.md`.
- **Animals only.** No hands, no people, no UI, no text, no logos.
- **Never a face of a real person**, not as pixels, not as a stencil, not posterized. The casual chats (interviews) have no cover yet: their direction is open.
- **Each animal once.** `gen.ts list` shows the animals in use and marks an animal that is in use two times. Look at the list before you search.

### 6. Tones and contrast

- Three tones for each animal, from the quantiles of the luminance (`split`, default `[0.4, 0.8]`).
- On the ink half, the dark tone is near the ground. A dark animal disappears there: move `split` down (for example `[0.15, 0.65]`) and look at the right half of the preview.
- `despeckle` (on by default) removes lone cells. Do not turn it off.

## The process

1. **Read the post** and choose the idea and the animal (rules 1 and 5). Run `gen.ts list` to see the animals in use.
2. **Find photos** on Envato (see "The photos"). Save 6 to 12 previews and look at all of them. Copy the photo that you use into `tmp/blog-covers/photos/`.
3. **Write the spec**: `tmp/blog-covers/specs/<slug>.json` (see "The spec"). Add the slug and its theme to `src/data/blogCoverThemes.ts` (see "The theme").
4. **Try it**: `gen.ts render <slug> --try` writes only the preview. Correct the spec until all the checks say `ok`, then look at the preview (see "The checks"). Try at least 2 photos.
5. **Write it**: `gen.ts render <slug>` writes the cover file, only when all the checks say `ok`.
6. **Look at the row** in `/dev/cover-gallery` and on the page of the post.
7. **The licence**: before the cover goes to production, buy the licence of the photo, download the full photo, render the cover again from it, and set `gen.ts set <slug> licensed=true`. A preview of Envato has no licence.

Keep `tmp/blog-covers/` (Git ignores it): the photos, the specs and the previews. They are a cache, not the record.

## The spec

`tmp/blog-covers/specs/<slug>.json`:

```json
{
  "slug": "headless-cms-personalization",
  "animal": "chameleon",
  "source": "https://elements.envato.com/...",
  "layers": [{ "photo": "chameleon-5.jpg", "h": 30, "cx": 49, "y": 16, "flip": true }]
}
```

- `animal`: the animal in plain words. A pair: `red fox + hedgehog`.
- `source`: the page of the photo on Envato (the item, not the search).
- A layer is one animal from one photo in `tmp/blog-covers/photos/`:
  - `h`: the height of the animal in cells. The width comes from the photo.
  - `x` (the left column) or `cx` (the centre column), and `y` (the top row). The frame is 100 × 58. The seam is column 50.
  - `flip`: mirror the photo (to look to the left).
  - `key`: how the white ground goes. `light` (222) and `chroma` (30): a pixel is ground when it is lighter than `light`, has less chroma than `chroma`, and touches the edge of the photo through ground. `erode` (0): remove N px of light rim. `crop: [x0, y0, x1, y1]` (fractions of the photo): keep only this part.
  - `coverage` (0.5): the part of a cell that must be animal.
  - `split` ([0.4, 0.8]): the luminance quantiles of the three tones.

## The checks

`gen.ts render` prints the checks. All of them must say `ok`:

- no cell out of the frame at the top or at the sides; margins of 5 columns, 3 rows at the top, 3 or 0 rows at the bottom;
- the size: 44 rows high or more, or 82 columns wide or more;
- the crossing: 20% to 80% on the accent;
- the noise: 30% of the cells or fewer have 0 or 1 neighbour of their tone;
- the main parts: the animal (or the two animals) is 90% of the cells or more;
- the loose bits: 4 small loose parts or fewer.

Then look at the preview (`tmp/blog-covers/preview/<slug>.png`):

- **top left**: the feed card on a 2× screen. Can you name the animal at once?
- **top right**: the feed card on a 1× screen (shown at 2×).
- **bottom left**: the silhouette. Can you name the animal from the outline?
- **bottom right**: the post header.
- **the strip at the bottom**: the cover at 20 px high (shown at 4×). It must be a clear shape.

## The theme

The theme of a post is in `src/data/blogCoverThemes.ts`. The three covers of a featured row of the blog have three different themes. The file gives the colours, thus a change of the theme needs new colours: `gen.ts recolor <slug>` changes the colours of the file from its record, with no photo. `gen.ts list` marks a file with the colours of a different theme.

The colours of each theme are in `THEMES` in `gen.ts`, from `src/styles/tokens.css`. When the tokens change, change `THEMES` and run `gen.ts recolor`.

## The record

The PNG keeps its record in a text chunk (`datocms-cover`): the animal, the source, the licence, the theme of the colours and the layers of the spec. `gen.ts list` shows it, `gen.ts set` changes it. The spec and the photo are not in the repository: to change a cover, write the spec again from the record and get the photo again from `source`.

## The photos: Envato in the owner's Chrome

The photos come from the previews of Envato (app.envato.com), in the Chrome of the owner, who is logged in. Use the chrome-mcp-server tools (load them with ToolSearch, for example `select:mcp__chrome-mcp-server__chrome_navigate,mcp__chrome-mcp-server__chrome_javascript`). Other agents use the same browser:

- Open your own window once: `chrome_navigate` with `newWindow: true` and a search URL: `https://app.envato.com/search?itemType=photos&term=<words>&ref=<your-prefix>`. It gives a `tabId`. Give that `tabId` to each call. A hidden tab does not show the results, and a navigate with no `tabId` can use the tab of a different agent. Do not act on other tabs. Close your window at the end.
- For a new search, navigate your tab to a new search URL.
- The tool hides URLs with a query string in its output: do not try to read the URLs of the images. Save the previews from the page. The result cards match `a[href*="photos/"] img`. A background tab slows down the timers: do not use `setTimeout`. Set `img.loading = 'eager'` and fetch at once. The script returns the page of each item, for `source`:
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
    a.download = `<your-prefix>-<animal>-${n}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    pages.push(`${n}: ${card.href.split('?')[0]}`);
  }
  pages.join('\n');
  ```
- The files go to `~/Downloads/`, where the owner keeps files too. Move only your files, by the full pattern `<your-prefix>-<animal>-*.jpg`, never by a short prefix: `mkdir -p tmp/blog-covers/candidates && mv ~/Downloads/<your-prefix>-<animal>-*.jpg tmp/blog-covers/candidates/`.
- Do not change the `w` parameter of an image URL: the signature breaks (403).
- Look at what you saved before you use it: the first images of a page are sometimes not related.
- Do not push a Download or License button, do not use "Generate" (the AI credits are few and belong to the owner), and do not change the settings of the account. Previews only. The licence is a decision of the owner (step 7 of the process).

Search words that work: `<animal> isolated white`, `<animal> side view isolated`, `<animal> white background`.
