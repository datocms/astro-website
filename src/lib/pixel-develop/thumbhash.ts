// The first step of the pixel development from the thumbhash of an image
// (a field of DatoCMS: a small code of the colours of the image). The
// server decodes it, thus the HTML has the large cells of the image before
// the image loads, and before the script runs. The canvas of the browser
// continues from the second step (see `./index.ts`).

import { thumbHashToRGBA } from 'thumbhash';
import { cellsOf, groundOf, STEPS, type Cell } from './cells';

export interface FirstStep {
  /** The size of the decoded thumbhash: the viewBox of the cells. */
  width: number;
  height: number;
  cells: Cell[];
  /** True when the image is dark: a mark on it must be light. */
  dark: boolean;
}

/** The cells of the first step of the `photo` mode, from a base64 thumbhash. */
export function firstStepFromThumbhash(thumbhash: string): FirstStep {
  const { w, h, rgba } = thumbHashToRGBA(Buffer.from(thumbhash, 'base64'));
  // The thumbhash can have alpha. The canvas draws the image on white, thus
  // the pixels go on white here too.
  const pixels = new Uint8ClampedArray(rgba.length);
  let luminance = 0;
  for (let i = 0; i < rgba.length; i += 4) {
    const alpha = rgba[i + 3]! / 255;
    for (let c = 0; c < 3; c++) {
      pixels[i + c] = Math.round(rgba[i + c]! * alpha + 255 * (1 - alpha));
    }
    pixels[i + 3] = 255;
    luminance += 0.2126 * pixels[i]! + 0.7152 * pixels[i + 1]! + 0.0722 * pixels[i + 2]!;
  }
  const image = { pixels, width: w, height: h, ground: groundOf(pixels, 'photo') };
  return {
    width: w,
    height: h,
    // A thumbhash is 32 pixels or less on its long side: a cell of 1 pixel is the smallest.
    cells: cellsOf(image, STEPS[0]!, 'photo', 1),
    dark: luminance / (w * h) < 128,
  };
}
