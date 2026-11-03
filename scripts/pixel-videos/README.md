# Pixel videos

Tools for the `.pxv` files of `<pixel-video>` (`src/lib/pixel-video/`). The
`.pxv` file is the only copy that we keep: no recipe makes it again. Its
header gives its look (palette, focus, edges) and `source`, the
URL of the footage, to find the footage again. The process and the rules are
in `src/lib/pixel-video/AGENTS.md`.

The tools need `ffmpeg` and `ffprobe` on the `PATH`. `key.py` also needs
`yt-dlp` and `uv`.

## Make a .pxv from green screen footage

```bash
# 1. The takes of a video (it downloads the video to tmp/source/ once).
uv run --with numpy python -I scripts/pixel-videos/key.py runs 'https://www.youtube.com/watch?v=Qf7oZ5Zut3c'

# 2. Key one take: tmp/hand-ok-sign.mov (transparent) and tmp/hand-ok-sign.png
#    (8 frames on a checkerboard). The last line gives the URL of the take.
uv run --with numpy python -I scripts/pixel-videos/key.py 'https://www.youtube.com/watch?v=Qf7oZ5Zut3c' --run 1 --name hand-ok-sign

# 3. Encode it, with the URL of the take.
npx tsx scripts/pixel-videos/encode.ts tmp/hand-ok-sign.mov public/videos/hand-ok-sign.pxv \
  --height 80 --tones otsu --source 'https://www.youtube.com/watch?v=Qf7oZ5Zut3c&t=4s' \
  --preview tmp/hand-ok-sign.pxv.png --palettes tmp/hand-ok-sign.palettes.png
```

`key.py` options: `--only green` (use only the takes on green), `--trim
<first> <last>` (the frames of the take), `--lo`, `--hi`, `--despill` (the
key), `--from <s> --seconds <n>` (key this part of the video in place of
`--run`, for footage where `runs` finds no take), `--crop <w>:<h>:<x>:<y>`
(key only this box of the source frame: it removes text on the screen and
black bars).

`encode.ts` options:

```
[--height 80 | --max-side 160] [--fps n] [--tones otsu|thirds | --auto]
[--t-mid n] [--t-high n] [--matte '#rrggbb'] [--palette tonal] [--edges auto|none|left,right]
[--focus 0-1] [--source url] [--preview cells.png] [--palettes colours.png]
```

## Make a .pxv from a Lottie animation

`lottie.py` renders a Lottie JSON (a local file, a URL, or `noto:<codepoint>`
for an animated Noto emoji) into `tmp/<name>.mov` with a transparent
background, and `tmp/<name>.png` (8 frames on a checkerboard). Then encode it
as keyed footage. The Noto emoji are CC BY 4.0; their list and codepoints are
at https://googlefonts.github.io/noto-emoji-animation/.

```bash
uv run --with rlottie-python --with pillow python -I scripts/pixel-videos/lottie.py noto:1f44b --name waving --fps 30
npx tsx scripts/pixel-videos/encode.ts tmp/waving.mov public/videos/waving.pxv \
  --height 80 --tones otsu --source 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f44b/lottie.json'
```

`lottie.py` options: `--size <px>` (the render, default 1024), `--fps n`
(default: the rate of the animation), `--loops n` (default 1), `--pad <%>`
(the margin around the drawing, default 3: without it, `encode.ts` finds edges
that cut the subject).

## Change a .pxv

`meta.ts` shows the edges, the source and the settings of files, and sets
them. The cells do not change.

```bash
npx tsx scripts/pixel-videos/meta.ts public/videos/*.pxv                       # show
npx tsx scripts/pixel-videos/meta.ts public/videos/italian-pinch.pxv --set edges=right --set focus=0.35
npx tsx scripts/pixel-videos/meta.ts public/videos/hand-ok.pxv --set palette=onAccent
npx tsx scripts/pixel-videos/meta.ts public/videos/hand-ok.pxv --set 'source=https://www.youtube.com/watch?v=TJfYrg8qwhI&t=15s'
```

To make the pixels of a file larger, `resize.ts` makes it smaller (fewer
cells). It keeps the aspect ratio, the edges, the source and the settings.
Each cell is one square, thus the squares become larger:

```bash
npx tsx scripts/pixel-videos/resize.ts public/videos/hand-ok.pxv public/videos/hand-ok.pxv --height 40
npx tsx scripts/pixel-videos/resize.ts in.pxv out.pxv --scale 0.5
```

The page `/dev/pxv-gallery` (only in `npm run dev`) shows all the files of
`public/videos/` in the footer of the site.
