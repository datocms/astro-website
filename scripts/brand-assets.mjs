// Makes the logo files that the /brand page offers, in public/brand/.
// Usage: npm run brand-assets
//
// The source is the two master files: src/assets/logo/wordmark.svg and
// src/assets/logo/symbol.svg. Each file of public/brand/ comes from them,
// thus no copy of the logo can be different. The colours come from
// src/styles/tokens.css. Run the script again when a master file or a
// colour changes, and commit the result.
//
// The script also writes the icons of the site in public/: favicon.svg,
// favicon.ico and apple-touch-icon.png. The other apps (cms, dashboard,
// api) use copies of these three files. It also writes
// public/images/full_logo.svg, the dark wordmark: the READMEs of old repos
// and pages of other people link to this URL.
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const outDir = path.join(root, 'public/brand');

const tokens = readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');

/** The hex value of a primitive colour of tokens.css. */
function token(name) {
  const match = tokens.match(new RegExp(`${name}:\\s*(#[0-9a-f]{6})\\s*;`, 'i'));
  if (!match) throw new Error(`No colour ${name} in tokens.css`);
  return match[1];
}

// The dark version is the deep tone of the purple theme. The purple is its accent.
const COLORS = {
  dark: token('--color-purple-deep-5'),
  white: '#ffffff',
  purple: token('--color-purple-light-5'),
};

/** The view box and the paths of a master file. */
function master(file) {
  const svg = readFileSync(path.join(root, 'src/assets/logo', file), 'utf8');
  const [x, y, width, height] = svg
    .match(/viewBox="([^"]+)"/)[1]
    .split(/\s+/)
    .map(Number);
  // Each path keeps its own fill rule: the symbol is `evenodd`, the letters are not.
  const paths = [...svg.matchAll(/<path([^>]*?) d="([^"]+)"/g)].map((match) => ({
    evenodd: match[1].includes('fill-rule="evenodd"'),
    d: match[2],
  }));
  return { x, y, width, height, paths };
}

const wordmark = master('wordmark.svg');
const symbol = master('symbol.svg');

const pathTags = (logo, fill, transform) =>
  logo.paths
    .map(
      ({ evenodd, d }) =>
        `<path fill="${fill}"${evenodd ? ' fill-rule="evenodd"' : ''}${transform ? ` transform="${transform}"` : ''} d="${d}"/>`,
    )
    .join('');

/** The logo alone, in one colour, on a transparent ground. */
function plain(logo, fill) {
  const { x, y, width, height } = logo;
  return {
    width,
    height,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}">${pathTags(logo, fill)}</svg>\n`,
  };
}

/*
 * The dark symbol on a full square of purple, for a place that cuts the
 * picture.
 *
 * The D has two sharp corners on the left and a round side on the right.
 * Thus its weight is on the left: its centre of mass is 6% of its width
 * to the left of the centre of its box. And the centre of the smallest
 * circle around it is 12.7% to the left. A D with its box in the centre
 * of a circle looks too far to the left, and its corners are near the
 * edge. Thus `shift` moves the D to the right, in parts of its width.
 *
 * `size` is the height of the D, in parts of the side of the square.
 * `radius` is the radius of the corners, in parts of the side: with no
 * radius the square is full, and the place that shows it cuts it.
 */
function badge({ size, shift, side = 1024, radius = 0 }) {
  const scale = (size * side) / symbol.height;
  const x = side / 2 - (symbol.width * scale) / 2 + shift * symbol.width * scale;
  const y = side / 2 - (symbol.height * scale) / 2;
  const transform = `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(4)})`;
  return {
    width: side,
    height: side,
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}"><rect width="${side}" height="${side}"${radius ? ` rx="${radius * side}"` : ''} fill="${COLORS.purple}"/>${pathTags(symbol, COLORS.dark, transform)}</svg>\n`,
  };
}

// The name of each file, its drawing, and the width of its PNG.
const files = {
  'datocms-wordmark-dark': { ...plain(wordmark, COLORS.dark), pngWidth: 2000 },
  'datocms-wordmark-white': { ...plain(wordmark, COLORS.white), pngWidth: 2000 },
  'datocms-symbol-dark': { ...plain(symbol, COLORS.dark), pngWidth: 1024 },
  'datocms-symbol-white': { ...plain(symbol, COLORS.white), pngWidth: 1024 },
  'datocms-symbol-purple': { ...plain(symbol, COLORS.purple), pngWidth: 1024 },
  // For a circle: a profile picture.
  'datocms-avatar': { ...badge({ size: 0.5, shift: 0.09 }), pngWidth: 1024 },
  // For a square with round corners: an app icon. The cut is smaller, thus the D is larger.
  'datocms-app-icon': { ...badge({ size: 0.56, shift: 0.06 }), pngWidth: 1024 },
};

/*
 * The favicon: the app icon for a browser tab. A tab does not cut the
 * picture, thus the square has its own round corners. A tab shows the
 * picture at 16px, thus the D is larger than in the app icon: 11px tall at
 * 16px. A larger D hides the purple, and the picture then looks dark.
 * With this shift the left edge of the D is on a full pixel at 16px and
 * at 32px, thus the edge is sharp.
 */
const favicon = badge({ size: 0.6875, shift: 0.0425, side: 64, radius: 0.22 });

const png = (file, width) =>
  sharp(Buffer.from(file.svg), { density: (72 * width) / file.width })
    .resize({ width })
    .png()
    .toBuffer();

/**
 * An ICO file that holds PNG pictures. Each picture is a square of 255px
 * at most. The file is a header, one entry of 16 bytes for each picture,
 * then the PNG files.
 */
function ico(pngs) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2); // The type: an icon.
  header.writeUInt16LE(pngs.length, 4);
  let offset = 6 + 16 * pngs.length;
  const entries = pngs.map((data) => {
    // Bytes 16 to 19 of a PNG file are its width.
    const size = data.readUInt32BE(16);
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0);
    entry.writeUInt8(size, 1);
    entry.writeUInt16LE(1, 4); // The colour planes.
    entry.writeUInt16LE(32, 6); // The bits for each pixel.
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const [name, file] of Object.entries(files)) {
  writeFileSync(path.join(outDir, `${name}.svg`), file.svg);
  writeFileSync(path.join(outDir, `${name}.png`), await png(file, file.pngWidth));
}

writeFileSync(
  path.join(root, 'public/apple-touch-icon.png'),
  await png(files['datocms-app-icon'], 180),
);
writeFileSync(path.join(root, 'public/favicon.svg'), favicon.svg);
writeFileSync(path.join(root, 'public/images/full_logo.svg'), files['datocms-wordmark-dark'].svg);
writeFileSync(
  path.join(root, 'public/favicon.ico'),
  ico(await Promise.all([16, 32, 48].map((size) => png(favicon, size)))),
);

writeFileSync(
  path.join(outDir, 'README.txt'),
  [
    'DatoCMS logo files',
    '',
    'wordmark    The symbol and the name. Use this one first.',
    'symbol      The D alone, where the wordmark does not fit.',
    'avatar      The dark symbol on purple, for a profile picture that a circle cuts.',
    'app-icon    The dark symbol on purple, for a square with round corners.',
    '',
    'dark is for a light ground. white is for a dark ground.',
    'purple is for the symbol alone, on a dark ground.',
    'Do not put the symbol alone in a circle: use the avatar.',
    '',
    'The rules: https://www.datocms.com/brand',
    '',
  ].join('\n'),
);

// The zip has all the files. -X leaves out the file attributes of this computer.
const zipName = 'datocms-brand-assets.zip';
const names = [
  ...Object.keys(files).flatMap((name) => [`${name}.svg`, `${name}.png`]),
  'README.txt',
];
execFileSync('zip', ['-q', '-X', zipName, ...names.sort()], { cwd: outDir });
rmSync(path.join(outDir, 'README.txt'));

console.log(`${names.length - 1} files and ${zipName} in public/brand/`);
