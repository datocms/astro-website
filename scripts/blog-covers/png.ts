// Read and write one text chunk (tEXt) of a PNG file. A cover keeps its
// record (the animal, the photo, the spec) in the chunk `datocms-cover`.

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buffer: Buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) c = CRC_TABLE[(c ^ byte) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

type Chunk = { type: string; data: Buffer };

function chunks(png: Buffer): Chunk[] {
  if (!png.subarray(0, 8).equals(SIGNATURE)) throw new Error('This file is not a PNG');
  const list: Chunk[] = [];
  let at = 8;
  while (at < png.length) {
    const length = png.readUInt32BE(at);
    const type = png.toString('latin1', at + 4, at + 8);
    list.push({ type, data: png.subarray(at + 8, at + 8 + length) });
    at += 12 + length;
  }
  return list;
}

function encodeChunk({ type, data }: Chunk) {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(data.length, 0);
  head.write(type, 4, 'latin1');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([head.subarray(4), data])), 0);
  return Buffer.concat([head, data, crc]);
}

/** The text of the chunk with this keyword, or undefined. */
export function readText(png: Buffer, keyword: string): string | undefined {
  for (const { type, data } of chunks(png)) {
    if (type !== 'tEXt') continue;
    const zero = data.indexOf(0);
    if (data.toString('latin1', 0, zero) === keyword) return data.toString('latin1', zero + 1);
  }
  return undefined;
}

/**
 * The PNG with the text in the chunk with this keyword. The text must be
 * Latin-1: JSON with `\u` escapes is safe.
 */
export function writeText(png: Buffer, keyword: string, text: string): Buffer {
  const list = chunks(png).filter(({ type, data }) => {
    if (type !== 'tEXt') return true;
    return data.toString('latin1', 0, data.indexOf(0)) !== keyword;
  });
  const chunk = { type: 'tEXt', data: Buffer.from(`${keyword}\0${text}`, 'latin1') };
  // The chunk goes after IHDR, the first chunk.
  list.splice(1, 0, chunk);
  return Buffer.concat([SIGNATURE, ...list.map(encodeChunk)]);
}

/** JSON with only ASCII characters: other characters become `\u` escapes. */
export function asciiJson(value: unknown) {
  return JSON.stringify(value).replace(
    /[^\x20-\x7e]/g,
    (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`,
  );
}
