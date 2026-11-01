// Render one or more videos from ./videos into public/videos/<name>.mp4.
// Usage: npm run pixel-videos -- globe [other names]
// With no name, the script renders all the videos.
//
// Each video module exports { width, height, fps, seconds, draw(ctx, progress) }.
// progress goes from 0 to 1 and never gets to 1, so that the last frame
// comes immediately before the first frame and the loop has no seam.
import { spawn } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { createCanvas } from '@napi-rs/canvas';

const videosDir = new URL('./videos/', import.meta.url);
const outDir = new URL('../../public/videos/', import.meta.url);

const names = process.argv.slice(2);
const all = readdirSync(videosDir)
  .filter((f) => f.endsWith('.mjs'))
  .map((f) => f.slice(0, -4));

for (const name of names.length ? names : all) {
  if (!all.includes(name)) throw new Error(`Unknown video "${name}". Known: ${all.join(', ')}`);

  const { default: video } = await import(new URL(`${name}.mjs`, videosDir));
  const out = new URL(`${name}.mp4`, outDir).pathname;
  const frames = Math.round(video.fps * video.seconds);

  // Flat tones compress well. CRF 32 keeps the file small and the edges clean.
  const ffmpeg = spawn(
    'ffmpeg',
    [
      '-v',
      'error',
      '-y',
      '-f',
      'image2pipe',
      '-framerate',
      String(video.fps),
      '-i',
      '-',
      '-c:v',
      'libx264',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      '32',
      '-preset',
      'veryslow',
      '-tune',
      'animation',
      '-movflags',
      '+faststart',
      '-an',
      out,
    ],
    { stdio: ['pipe', 'inherit', 'inherit'] },
  );
  const done = new Promise((resolve, reject) =>
    ffmpeg.on('close', (code) =>
      code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`)),
    ),
  );

  const canvas = createCanvas(video.width, video.height);
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < frames; i++) {
    video.draw(ctx, i / frames);
    if (!ffmpeg.stdin.write(canvas.toBuffer('image/png'))) {
      await new Promise((resolve) => ffmpeg.stdin.once('drain', resolve));
    }
  }
  ffmpeg.stdin.end();
  await done;

  console.log(`${name}: ${frames} frames -> public/videos/${name}.mp4`);
}
