import binnacle from './binnacle.jpg';
import chart from './chart.jpg';
import coast from './coast.jpg';
import cover from './cover.jpg';
import lens from './lens.jpg';
import night from './night.jpg';
import original from './original.jpg';
import stairs from './stairs.jpg';

/*
 * The fake data of the frame of the chapter "Image and video components"
 * of /media (Frame.astro): the code of the page of an exhibition, and the
 * page on the website of Harwick Maritime Museum, a museum of the sea and
 * of the coast. The page is the exhibition "Keepers of the Light", on the
 * lighthouses of the coast: its cover, its title, its dates and a gallery
 * of six photos. The code is `componentsCode` in src/data/media-code.ts.
 */

export const DESCRIPTION =
  'Two windows side by side, a code editor and a browser. In the editor, the page of an exhibition in React: it imports Image from react-datocms and gives it the responsiveImage of the cover and of each photo of the gallery. In the browser, the page on harwickmaritime.org: the cover, the title Keepers of the Light, the dates and a gallery of six photos. Each photo shows first as a blurred placeholder, then the photos come in one by one, and the layout does not move.';

export const ADDRESS = 'harwickmaritime.org/exhibitions/keepers-of-the-light';

export const SITE = {
  brand: 'Harwick Maritime Museum',
  links: ['Exhibitions', 'Collection', 'Visit'],
};

export const EXHIBITION = {
  label: 'Exhibition',
  title: 'Keepers of the Light',
  dates: '2 May – 27 September 2026',
  cover: {
    src: cover.src,
    alt: 'A storm wave breaks over a pier, at its end a red lighthouse',
    delay: 300,
  },
};

/**
 * The gallery, in the order of the page: three photos on each row. `delay`
 * is the time from the start of the step "load" to the photo, in ms: the
 * cover has `priority` and comes first, then the photos of the gallery, in
 * the order of the network and not of the page.
 */
export const GALLERY = [
  { src: lens.src, alt: 'The glass lens at the top of a lighthouse, against the sky', delay: 900 },
  { src: stairs.src, alt: 'A spiral staircase in a lighthouse, from the top', delay: 1500 },
  { src: night.src, alt: 'A lighthouse on a cliff at night, its beam over the sea', delay: 2300 },
  { src: chart.src, alt: 'An old sea chart of the coast of Guinea', delay: 1200 },
  { src: coast.src, alt: 'A white lighthouse and its houses on a rocky coast', delay: 1900 },
  { src: binnacle.src, alt: 'The brass compass of a ship, under its glass dome', delay: 1600 },
];

/**
 * The steps of the sequence and their time on screen, in ms
 * (`data-scene-steps`, see src/lib/motion/sceneSequence.ts). Rest: the
 * page is there, but each photo is still its placeholder. Load: the
 * photos come in over their placeholders, each at its `delay`. Without the sequence the
 * scene is the still: the page with all its photos.
 */
export const STEPS = 'rest:1800 load:5200';

/**
 * The original of the cover, as the museum uploaded it: the photo as
 * Unsplash serves it, in KB. The fragment "Each screen gets its own file."
 * (Files.astro) draws it behind the srcset, with the files of the srcset as
 * rectangles on it. `src` is the whole photo at 3:2, not the crop of the
 * cover.
 */
export const ORIGINAL = {
  src: original.src,
  width: 6000,
  height: 4000,
  format: 'JPEG',
  weight: 3500,
  label: '3.5 MB',
};

/**
 * The srcset that the Image of react-datocms writes for the cover: the
 * query asks for `w: 1920`, thus the widths are 480, 960, 1440, 1920, 2880
 * and 3840. `weight` is the AVIF file that imgix makes of the cover at
 * that width, in KB, measured.
 */
export const SRCSET = [
  { width: 480, weight: 10 },
  { width: 960, weight: 22 },
  { width: 1440, weight: 39 },
  { width: 1920, weight: 58 },
  { width: 2880, weight: 101 },
  { width: 3840, weight: 157 },
];

/**
 * The two screens of the fragment, and the width in the srcset that the
 * browser of each picks: the width of the screen in CSS pixels times its
 * density, then the next width up (390 × 3 = 1170: 1440; 1440 × 2 = 2880).
 */
export const SCREENS = [
  { kind: 'phone', width: 390, density: 3, file: 1440 },
  { kind: 'laptop', width: 1440, density: 2, file: 2880 },
] as const;

export const FILES_DESCRIPTION = `The code <Image data={cover.responsiveImage} />, and under it the srcset that it writes: five copies of the whole photo of the cover, one for each AVIF file, in a cascade down to the right, each smaller copy partly on the next larger one, from 960 pixels wide and 22 KB to 3840 pixels and 157 KB. A phone, 390 pixels wide at 3×, takes the file of 1440 pixels, 39 KB; a laptop, 1440 pixels wide at 2×, the file of 2880 pixels, 101 KB. After the largest, in a shade, the original: 6000 by 4000 pixels, 3.5 MB, and it goes out of the picture.`;

/**
 * The fragment "The player, in one line." (Player.astro): the VideoPlayer
 * with the video of the chapter "Video API", at the frame of its
 * thumbnail, 1:30, with the English captions on. The tracks are the ones
 * of that chapter (../Video/story.ts).
 */
export const PLAYER = {
  code: { tag: 'VideoPlayer', prop: 'data', value: 'film.video' },
  caption: 'The warp is re-tensioned thread by thread.',
  active: 'English (generated)',
};
