// Makes the WebP files that the scenes show, from the JPG photos in
// src/scenes. The JPG stays the source; the scenes import the WebP.
//
// Usage: npm run scene-photos
//
// Each photo gets one WebP, `<name>-<W>w.webp`, next to its JPG. W is the
// largest CSS width at which the site shows the photo, times 2 for retina
// screens, times 1.15 for widths that we did not measure, rounded up to a
// multiple of 80, and never more than the width of the JPG. The widths come
// from the browser at 390, 650, 768, 820, 1152, 1320 and 1440 px. When the
// size of a photo in its box changes, measure it again and change SHOWN.
//
// The script removes an old WebP of the same photo with a different W.
// After a change of W, change the import in the scene.
import { readdirSync, rmSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scenes = path.join(root, 'src/scenes');

// The largest CSS width (px) of each photo on the site. `full` keeps the
// width of the JPG: the photo shows large in a step of a sequence (a dialog,
// a form that opens), thus the still does not give its size.
const SHOWN = {
  'AssetFields/camels.jpg': 120,
  'AssetFields/camp.jpg': 120,
  'AssetFields/cover.jpg': 270,
  'AssetFields/dunes.jpg': 120,
  'AssetFields/rock.jpg': 120,
  'AssetFields/stars.jpg': 120,
  'AssetFields/tea.jpg': 120,
  'AssetFields/trailer.jpg': 423,
  'Collaboration/ines.jpg': 29,
  'Collaboration/tom.jpg': 29,
  'DynamicLayouts/hero.jpg': 'full',
  'HomeHero/cover.jpg': 250,
  'Images/fiat-500.jpg': 'full',
  'Localization/product.jpg': 291,
  'MediaAi/coastal-road.jpg': 224,
  'MediaAi/fitting-rolltop-pannier.jpg': 224,
  'MediaAi/gravel-sunrise.jpg': 224,
  'MediaAi/handlebar-bag.jpg': 224,
  'MediaAi/loaded-tourer-stelvio.jpg': 224,
  'MediaComponents/binnacle.jpg': 170,
  'MediaComponents/chart.jpg': 170,
  'MediaComponents/coast.jpg': 170,
  'MediaComponents/cover.jpg': 573,
  'MediaComponents/lens.jpg': 170,
  'MediaComponents/night.jpg': 170,
  'MediaComponents/original.jpg': 539,
  'MediaComponents/stairs.jpg': 170,
  'MediaLibrary/catalogue-cover.jpg': 131,
  'MediaLibrary/clay-vessel.jpg': 'full',
  'MediaLibrary/embroidery-hoop.jpg': 181,
  'MediaLibrary/indigo-vats.jpg': 181,
  'MediaLibrary/linen-bolts.jpg': 181,
  'MediaLibrary/loom-room.jpg': 181,
  'MediaLibrary/madder-dye.jpg': 131,
  'MediaLibrary/opening-night.jpg': 181,
  'MediaLibrary/textile-gallery.jpg': 181,
  'MediaLibrary/thread-spools.jpg': 181,
  'MediaLibrary/tide-line.jpg': 131,
  'MediaLibrary/weaver-hands.jpg': 181,
  'Seo/share.jpg': 626,
  'StructuredContent/cover.jpg': 'full',
  'StructuredContent/gallery-1.jpg': 96,
  'StructuredContent/gallery-2.jpg': 96,
  'StructuredContent/gallery-3.jpg': 96,
  'Video/restoring-tide-line-later.jpg': 575,
  'Video/restoring-tide-line.jpg': 575,
  'VisualEditing/coast.jpg': 'full',
  'VisualEditing/cover.jpg': 'full',
  'VisualEditing/dawn.jpg': 'full',
  'VisualEditing/portrait.jpg': 'full',
};

// The largest width of a WebP. A wider file gives no visible gain in a scene.
const MAX_WIDTH = 1200;

function targetWidth(shown, sourceWidth) {
  if (shown === 'full') return Math.min(sourceWidth, MAX_WIDTH);
  const width = Math.ceil((shown * 2 * 1.15) / 80) * 80;
  return Math.min(width, sourceWidth, MAX_WIDTH);
}

let before = 0;
let after = 0;

for (const [file, shown] of Object.entries(SHOWN)) {
  const source = path.join(scenes, file);
  const { width: sourceWidth } = await sharp(source).metadata();
  const { size } = statSync(source);
  const width = targetWidth(shown, sourceWidth);
  const dir = path.dirname(source);
  const base = path.basename(file, path.extname(file));
  const target = path.join(dir, `${base}-${width}w.webp`);

  // Remove the WebP files of an old width
  for (const name of readdirSync(dir)) {
    if (new RegExp(`^${base}-\\d+w\\.webp$`).test(name) && path.join(dir, name) !== target) {
      rmSync(path.join(dir, name));
    }
  }

  const info = await sharp(source)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 78, effort: 6 })
    .toFile(target);

  before += size;
  after += info.size;
  console.log(
    `${file} → ${path.basename(target)} (${Math.round(size / 1024)} KB → ${Math.round(info.size / 1024)} KB)`,
  );
}

console.log(`Total: ${Math.round(before / 1024)} KB → ${Math.round(after / 1024)} KB`);
