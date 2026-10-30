// The fake content of the chapter "AI in the media library" of /ai. The
// scenes show the media area of Marram, the maker of bike bags of the
// page: the photos and the videos that go into the frame with their tags
// and their subtitles, the photo "Loaded tourer on the Stelvio" with its
// tags, and the video "Fitting a rolltop pannier".
// Do not change a text here without a change to the copy
// (src/data/ai-pillar.ts).

export const PHOTO = {
  title: 'Loaded tourer on the Stelvio',
  filename: 'loaded-tourer-stelvio.jpg',
  id: 'Mr26LtStV9qK3wXp7YbZc',
  url: 'www.datocms-assets.com/162534/1761900000-loaded-tourer-stelvio.jpg',
  createdAt: '07/14/2026, 18:22',
  updatedAt: '10/21/2026, 09:05',
  createdBy: 'Demo User',
  /** The tags that the upload got: Marram did not type them */
  smartTags: ['bicycle', 'mountain', 'road'],
  /** The tags that the editor typed */
  tags: ['stelvio', 'tour-2026'],
  focalPoint: { x: 0.52, y: 0.72 },
  details: { mime_type: 'image/jpeg', size: 4_120_000, width: 1600, height: 1200 },
};

/** The video of the second fragment, 2:40, with no track before the generate */
export const VIDEO = {
  title: 'Fitting a rolltop pannier',
  filename: 'fitting-rolltop-pannier.mp4',
  id: 'Mr26FrPnV4tL8sQd2WcHx',
  url: 'stream.mux.com/Mr26FrPnV4tL8sQd.m3u8',
  createdAt: '10/23/2026, 15:10',
  updatedAt: '10/23/2026, 15:12',
  createdBy: 'Demo User',
  duration: 160,
  time: 38,
  details: { mime_type: 'video/mp4', size: 186_400_000, width: 1920, height: 1080, duration: 160 },
};

export const LANGUAGE = { name: 'English', code: 'en' };

/**
 * The frame (Pipeline.astro): what the alt text of the picture says. It
 * tells the still: the first photo with its tags, the first video with its
 * subtitles.
 */
export const DESCRIPTION = `Two rows. In the first, the photo “${PHOTO.title}” goes into DatoCMS, and the smart tags ${PHOTO.smartTags.join(', ')} come out. In the second, the video “${VIDEO.title}” goes into DatoCMS, and its English subtitles come out, line by line, each with its time.`;

/**
 * The labels of the pill of DatoCMS in the middle of each row of the frame:
 * what DatoCMS does with the upload of that row. Literal case: a value,
 * not a label in capitals.
 */
export const WORK = {
  photo: 'Tagging image',
  video: 'Writing subtitles',
} as const;

export const TAGS_LABEL = 'Smart tags';

export const CAPTIONS_LABEL = `Subtitles: ${LANGUAGE.name} (generated)`;

/**
 * The photos that go into the first row of the frame, one after the
 * other. `image` is the name of a picture of this folder. The first is the
 * still.
 */
export const PHOTOS = [
  { filename: PHOTO.filename, image: 'loadedTourerStelvio', tags: PHOTO.smartTags },
  {
    filename: 'gravel-morning-mist.jpg',
    image: 'gravelSunrise',
    tags: ['gravel', 'bicycle', 'mist', 'forest'],
  },
  { filename: 'handlebar-bag.jpg', image: 'handlebarBag', tags: ['bag', 'handlebar', 'bicycle'] },
] as const;

/**
 * The videos that go into the second row, one after the other, with the
 * first lines of their subtitles. The first is the still.
 */
export const VIDEOS = [
  {
    filename: VIDEO.filename,
    image: 'fittingRolltopPannier',
    duration: '2:40',
    captions: [
      ['00:03', 'Unroll the top and empty the bag first.'],
      ['00:11', 'Hang both hooks on the top rail of the rack.'],
      ['00:19', 'Turn the lower hook until it holds the stay.'],
    ],
  },
  {
    filename: 'coast-road-day-three.mp4',
    image: 'coastalRoad',
    duration: '4:12',
    captions: [
      ['00:02', 'Day three, and the wind comes from the sea.'],
      ['00:09', 'Sixty kilometres to Porto, all on the coast.'],
      ['00:17', 'The bags stayed dry through the night.'],
    ],
  },
] as const;
