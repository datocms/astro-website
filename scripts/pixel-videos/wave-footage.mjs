// Convert stock footage of a waving hand into the source for the questions
// CTA (960 × 360).
// Usage: node scripts/pixel-videos/wave-footage.mjs
//
// Source: Vecteezy, "Hand gesture waving goodbye" (a watermarked preview).
// Get a licence before you use it in production.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const SOURCE =
  'https://static.vecteezy.com/system/resources/previews/073/148/581/watermarked/hand-gesture-waving-goodbye-bye-sign-with-open-hand-on-studio-background-video.mp4';
const WIDTH = 960;
const HEIGHT = 360;
const FPS = 30;
// The background is grey and the skin is orange. A pixel is skin when its
// red value is more than its blue value by this quantity.
const SKIN = 28;
// The skin that is brighter than this (the lit palm) is the highlight layer.
// The remaining skin (the forearm, the folds, the sides of the fingers) is the
// midtone layer, so the hand has two tones on the background.
const LIT = 178;
// The component puts each pixel in a layer by its brightness: background
// below 105, midtone below 161, highlight above.
const LEVELS = [0, 133, 255];
// Remove the top rows of the 1024 × 576 source, so that the hand is larger
// and goes past the top edge.
const TOP = 60;
// The hand is at 48% of the source width. The CSS keeps the point at 42% of
// the video in the centre on narrow screens, so move the hand there.
const SCALE = HEIGHT / (576 - TOP);
const LEFT = Math.round(0.42 * WIDTH - 0.48 * 1024 * SCALE);

const out = new URL('../../public/videos/wave.mp4', import.meta.url).pathname;
const work = mkdtempSync(join(tmpdir(), 'wave-'));

try {
  const res = await fetch(SOURCE);
  if (!res.ok) throw new Error(`download failed (${res.status})`);
  const src = join(work, 'src.mp4');
  writeFileSync(src, Buffer.from(await res.arrayBuffer()));

  const luma = '0.299*r(X\\,Y)+0.587*g(X\\,Y)+0.114*b(X\\,Y)';
  const tone = `if(gt(r(X\\,Y)-b(X\\,Y)\\,${SKIN})\\,if(gt(${luma}\\,${LIT})\\,${LEVELS[2]}\\,${LEVELS[1]})\\,${LEVELS[0]})`;
  execFileSync('ffmpeg', [
    '-v',
    'error',
    '-y',
    '-i',
    src,
    '-filter_complex',
    [
      // A small blur removes the fine folds, which make the pixels flicker.
      `[0:v]fps=${FPS},boxblur=2,format=rgb24,geq=r='${tone}':g='${tone}':b='${tone}',format=gray,` +
        `crop=iw:ih-${TOP}:0:${TOP},scale=-2:${HEIGHT},pad=${WIDTH}:${HEIGHT}:${LEFT}:0:black,split[a][b]`,
      // Play the clip forward and then in reverse, so that the loop has no seam.
      '[b]reverse,trim=start_frame=1[r]',
      '[a][r]concat=n=2:v=1',
    ].join(';'),
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-crf',
    '28',
    '-preset',
    'veryslow',
    '-tune',
    'animation',
    '-movflags',
    '+faststart',
    '-an',
    out,
  ]);
  console.log('public/videos/wave.mp4');
} finally {
  rmSync(work, { recursive: true, force: true });
}
