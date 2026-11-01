# Pixel videos

Source videos for the `PixelVideo` component (`src/lib/pixel-video/`),
drawn in code and encoded with ffmpeg. The component plays `.pxv` files, not
`.mp4` files. Make the `.pxv` file of each video in `/dev/pixel-encoder`
(`src/dev/pixel-encoder.astro`). That page is only in `npm run dev`, not
in the build.

```bash
npm run pixel-videos                # render all videos
npm run pixel-videos -- globe       # render one video
```

`pixel-videos` writes `public/videos/<name>.mp4`. Open it in
`/dev/pixel-encoder`, tune the thresholds, and save the `.pxv` file in
`public/videos/`. The `.mp4` is an intermediate: `.gitignore` ignores it,
and only the `.pxv` file goes in the repository. You need `ffmpeg` on your `PATH`.

## Add a video

Create `videos/<name>.mjs`:

```js
import { BG, MID, HIGH } from '../tones.mjs';

export default {
  width: 480, // in px
  height: 480,
  fps: 30,
  seconds: 4,
  draw(ctx, progress) {
    // progress goes from 0 to just below 1. Make the state at 1 equal
    // to the state at 0, so that the loop has no seam.
  },
};
```

`ctx` is a 2D canvas context from `@napi-rs/canvas`.

## Rules

- Draw with the three tones in `tones.mjs` only. The component puts each
  pixel in a layer (background, midtone or highlight) by its brightness, so
  flat tones give clean edges. Gradients give noise at the layer edges.
- Keep shapes large. The component shows only a few dozen squares across, so
  small details disappear.
- Make the video loop. Use `progress` for all motion.

## Footage

`wave-footage.mjs` converts a stock clip of a waving hand (a watermarked
Vecteezy preview) into `public/videos/wave.mp4`, the source of
`hand-waving.pxv` (`waveVideo` in `src/data/videos.ts`). The skin (orange
on a grey background) becomes the hand: the lit palm in the highlight
layer, the shaded skin in the midtone layer. Encode the `.mp4` in
`/dev/pixel-encoder` as above. Get a licence for the clip before you use it
in production.

```bash
node scripts/pixel-videos/wave-footage.mjs
```
