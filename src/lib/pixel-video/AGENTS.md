# Pixel videos

`<pixel-video>` plays `.pxv` files (`src/lib/pixel-video/format.ts`), not `.mp4` files. The files are in `public/videos/`, registered in `src/data/videos.ts`, and shown by `PageCloser` (the footer). Two tools make a `.pxv`: the page `/dev/pxv-editor` (browser, by hand) and `scripts/pixel-videos/encode.ts` (script, same `format.ts`). Both routes (`/dev/pxv-editor`, `/dev/pxv-gallery`) are only in `astro dev`. The commands are in `scripts/pixel-videos/README.md`.

## Footage on a flat background (the pattern for hands and people)

Source: green-screen footage of Green Screen Animation on YouTube. The files have green, blue or black backgrounds, and title cards between the takes. Do the steps in this order:

1. **Download** with `yt-dlp` (`uv tool install yt-dlp`), at most 1080p, into the scratchpad.
2. **List the runs**: `uv run --with numpy python -I scripts/pixel-videos/hand-signs.py src.mp4`. A run is a take with a hand or a person on a flat background. A title card is not a run. The same takes repeat on each background: choose different takes. Look at a contact sheet (`ffmpeg -vf fps=1,scale=240:-1,tile=8x4`) to name them; this ffmpeg has no `drawtext`.
3. **Cut** each run into `./tmp/<name>.mp4`: `hand-signs.py src.mp4 tmp name:run …`. The rules of the script, and do not change them without a reason:
   - Use the whole run, every frame, at the frame rate of the source (25 or 30 fps). No trim, no loop, no play in reverse (the player loops).
   - Crop to the union of the boxes of the subject over all the frames, at full resolution. Never guess a crop.
   - Green or blue: `chromakey` and `despill`, with the colour of the corner. Black: no key. The subject goes on black (the background layer).
   - Tone: the skin is pale or tanned, thus the script measures the brightness of the subject (5%, 50%, 95%) and maps them to fixed values with a curve. With the default thresholds (105 and 161) the subject has midtones and highlights. A fixed curve made the tanned hands vanish.
4. **Encode**: `npx tsx scripts/pixel-videos/encode.ts tmp/<name>.mp4 public/videos/<prefix>-<name>.pxv --height 80 --same-size`. Hands: `--height 80`. Full bodies: `--height 120`.
   - Use `--height`, not `--max-side`. The footer draws each video at the same height (494 px), thus the same height in cells gives the same size of square on screen. With `--max-side`, a tall clip gets small squares.
   - `--same-size` sets the three tone sizes to `100 / width`: one square for each cell.
   - The file gets the Tonal style. `--t-mid`, `--t-high` or `--auto` change the thresholds.
5. **Register** the name in `src/data/videos.ts` (`handSignNames`, `personNames`) and look at it in `/dev/pxv-gallery`.

Keep `./tmp/*.mp4` (Git ignores it). The user tunes the thresholds with it: encode again, do not cut again.

## Pitfalls

- A browser has approximately 16 WebGL contexts, and each `<pixel-video>` uses one. A page with many videos must mount them only when near the screen (see `<lazy-footer>` in `src/dev/pxv-gallery.astro`). The warning is "Too many active WebGL contexts".
- `/dev/pxv-editor` needs `lottie-web`. If `node_modules` does not have it, run `npm install --no-save lottie-web`, and restart the dev server (Vite caches the failed import).
- In zsh a variable with a list is one word: use an array (`jobs=(a:1 b:2)` and `$jobs`) to give the jobs to `hand-signs.py`.
- Dark subjects (a crowd, dark clothes) come out thin or sparse with this pipeline: the subject is on black, and a dark subject is near the background layer. For them, look at the silhouette style (`robotVideo`, `danceVideo` in `src/data/videos.ts`): a dark subject on a light background.
- Get a licence for the footage before you use it in production. The footage of Green Screen Animation has its own terms.
