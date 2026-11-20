import { Resvg } from '@cf-wasm/resvg';
import { deflateSync } from 'node:zlib';

/*
 * The pictures of the OG routes, without a native library. The site runs
 * in Cloudflare Workers, where `sharp` does not load. resvg (WebAssembly)
 * draws an SVG, and an SVG can hold a PNG or a JPEG: thus resvg also reads
 * the pixels of a picture and changes its size.
 */

/** Pixels in RGBA, 4 bytes for each pixel, with straight alpha. */
export interface Pixels {
  data: Uint8Array;
  width: number;
  height: number;
}

/** A box in the pixels of a picture. */
export interface Box {
  left: number;
  top: number;
  width: number;
  height: number;
}

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

/** The size of a PNG, from its header. Another format gives an error. */
export function pngSize(png: Uint8Array): { width: number; height: number } {
  if (png.length < 24 || PNG_SIGNATURE.some((byte, index) => png[index] !== byte)) {
    throw new Error('The picture is not a PNG');
  }
  const view = new DataView(png.buffer, png.byteOffset, png.byteLength);
  return { width: view.getUint32(16), height: view.getUint32(20) };
}

/** The data URI of a picture. The type comes from the first bytes of the file. */
export function dataUri(file: Uint8Array, svg = false): string {
  let type = 'image/png';
  if (svg) type = 'image/svg+xml';
  else if (file[0] === 0xff && file[1] === 0xd8) type = 'image/jpeg';
  else if (file[0] === 0x47 && file[1] === 0x49) type = 'image/gif';
  else if (file[0] === 0x52 && file[8] === 0x57) type = 'image/webp';
  return `data:${type};base64,${Buffer.from(file).toString('base64')}`;
}

/** Draw an SVG as a PNG, at the size of the SVG. */
export async function svgToPng(svg: string): Promise<Uint8Array> {
  const resvg = await Resvg.async(svg);
  const rendered = resvg.render();
  const png = rendered.asPng();
  rendered.free();
  resvg.free();
  return png;
}

/**
 * Draw an SVG and give its pixels. resvg gives the colours multiplied by
 * the alpha: divide them, as the callers read straight colours.
 */
export async function svgToPixels(svg: string): Promise<Pixels> {
  const resvg = await Resvg.async(svg);
  const rendered = resvg.render();
  const data = new Uint8Array(rendered.pixels);
  const { width, height } = rendered;
  rendered.free();
  resvg.free();

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3]!;
    if (alpha === 0 || alpha === 255) continue;
    data[i] = Math.min(255, Math.round((data[i]! * 255) / alpha));
    data[i + 1] = Math.min(255, Math.round((data[i + 1]! * 255) / alpha));
    data[i + 2] = Math.min(255, Math.round((data[i + 2]! * 255) / alpha));
  }
  return { data, width, height };
}

/** The pixels of a PNG, at the size of the file. */
export function pngToPixels(png: Uint8Array): Promise<Pixels> {
  const { width, height } = pngSize(png);
  return svgToPixels(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><image href="${dataUri(png)}" width="${width}" height="${height}" image-rendering="optimizeSpeed"/></svg>`,
  );
}

/**
 * The box of a picture without its border: the pixels that differ from the
 * top left pixel by more than the threshold, in a colour channel or in the
 * alpha. This is `trim()` of sharp. A picture of one colour keeps its box.
 */
export function trimBox({ data, width, height }: Pixels, threshold: number): Box {
  let left = width;
  let top = height;
  let right = -1;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const differs =
        Math.abs(data[i]! - data[0]!) > threshold ||
        Math.abs(data[i + 1]! - data[1]!) > threshold ||
        Math.abs(data[i + 2]! - data[2]!) > threshold ||
        Math.abs(data[i + 3]! - data[3]!) > threshold;
      if (!differs) continue;
      if (x < left) left = x;
      if (x > right) right = x;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
    }
  }
  if (right < 0) return { left: 0, top: 0, width, height };
  return { left, top, width: right - left + 1, height: bottom - top + 1 };
}

/**
 * The pixels of a picture in a box of `width` × `height`: the whole picture
 * (or a part of it, `crop`) at the centre of the box, as large as the box
 * permits. The rest of the box is see-through.
 */
export function containToPixels(
  source: { uri: string; width: number; height: number },
  width: number,
  height: number,
  crop: Box = { left: 0, top: 0, width: source.width, height: source.height },
): Promise<Pixels> {
  return svgToPixels(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><svg width="${width}" height="${height}" viewBox="${crop.left} ${crop.top} ${crop.width} ${crop.height}" preserveAspectRatio="xMidYMid meet"><image href="${source.uri}" width="${source.width}" height="${source.height}"/></svg></svg>`,
  );
}

const CRC_TABLE = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function pngChunk(type: string, body: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + body.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, body.length);
  for (let i = 0; i < 4; i++) chunk[4 + i] = type.charCodeAt(i);
  chunk.set(body, 8);
  let crc = 0xffffffff;
  for (let i = 4; i < 8 + body.length; i++)
    crc = CRC_TABLE[(crc ^ chunk[i]!) & 0xff]! ^ (crc >>> 8);
  view.setUint32(8 + body.length, (crc ^ 0xffffffff) >>> 0);
  return chunk;
}

/** A PNG from pixels in RGB, 3 bytes for each pixel. */
export function rgbToPng(pixels: Uint8Array, width: number, height: number): Uint8Array {
  const header = new Uint8Array(13);
  const view = new DataView(header.buffer);
  view.setUint32(0, width);
  view.setUint32(4, height);
  header[8] = 8; // bits for each channel
  header[9] = 2; // colour type: RGB

  // Each line starts with the byte of its filter: 0, no filter.
  const stride = width * 3;
  const lines = new Uint8Array((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    lines.set(pixels.subarray(y * stride, (y + 1) * stride), y * (stride + 1) + 1);
  }

  const parts = [
    new Uint8Array(PNG_SIGNATURE),
    pngChunk('IHDR', header),
    pngChunk('IDAT', deflateSync(lines)),
    pngChunk('IEND', new Uint8Array(0)),
  ];
  const png = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    png.set(part, offset);
    offset += part.length;
  }
  return png;
}
