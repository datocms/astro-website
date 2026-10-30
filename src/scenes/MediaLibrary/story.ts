// The fake content of the chapter "Media library" of /media. The scenes
// show the media area of Saltmarsh Museum, a museum of textiles: the
// collection "Light and Thread", the exhibition of 2026, and its asset
// "Vessel with dry grasses", a clay vase in the afternoon light. Do not
// change a text here without a change to the copy (src/data/media.ts).

export const PROJECT_NAME = 'Saltmarsh Museum';

export const USER_NAME = 'Demo User';

/**
 * The collections of the sidebar. The scenes show "Light and Thread",
 * under Exhibitions › 2026.
 */
export const COLLECTIONS = [
  {
    id: 'exhibitions',
    name: '🖼️ Exhibitions',
    open: true,
    children: [
      { id: '2025', name: '2025' },
      {
        id: '2026',
        name: '2026',
        open: true,
        children: [{ id: 'light-and-thread', name: 'Light and Thread', active: true }],
      },
    ],
  },
  { id: 'press', name: '📰 Press' },
  { id: 'objects', name: '🧵 Objects' },
];

export const COLLECTION = 'Light and Thread';

/**
 * The assets of the collection, in the order of the grid. The images are
 * in this folder; the first one is the asset that the scenes open.
 */
export const ASSETS = [
  { filename: 'clay-vessel.jpg', image: 'clayVessel', width: 1600, height: 1200 },
  { filename: 'tide-line.jpg', image: 'tideLine', width: 1200, height: 1600 },
  { filename: 'loom-room.jpg', image: 'loomRoom', width: 1600, height: 1067 },
  { filename: 'thread-spools.jpg', image: 'threadSpools', width: 1400, height: 1400 },
  { filename: 'opening-night.jpg', image: 'openingNight', width: 1600, height: 900 },
  { filename: 'catalogue-cover.jpg', image: 'catalogueCover', width: 1240, height: 1754 },
  { filename: 'indigo-vats.jpg', image: 'indigoVats', width: 1600, height: 1200 },
  { filename: 'weaver-hands.jpg', image: 'weaverHands', width: 1600, height: 1067 },
  { filename: 'embroidery-hoop.jpg', image: 'embroideryHoop', width: 1400, height: 1400 },
  { filename: 'linen-bolts.jpg', image: 'linenBolts', width: 1600, height: 1067 },
  { filename: 'madder-dye.jpg', image: 'madderDye', width: 1200, height: 1600 },
  { filename: 'textile-gallery.jpg', image: 'textileGallery', width: 1600, height: 1200 },
] as const;

/** The saved filters of the toolbar. "Press kit 2026" is active. */
export const SAVED_FILTERS = {
  active: 'Press kit 2026',
  shared: ['Press kit 2026', 'Missing alt text', 'Loans from other museums'],
  personal: ['My uploads this week'],
};

/**
 * The asset sources of the plugins, in the menu of the upload button,
 * sorted by name as in the cms. "Museum archive" is the DAM of the museum.
 */
export const SOURCES = [
  { name: 'Museum archive', icon: '🏛️' },
  { name: 'Unsplash', icon: '📷' },
] as const;

export const ASSET = {
  title: 'Vessel with dry grasses',
  filename: 'clay-vessel.jpg',
  id: 'Sm26TlDtKn4oT9rWq3xVb',
  url: 'www.datocms-assets.com/142857/1761553200-clay-vessel.jpg',
  createdAt: '03/02/2026, 10:15',
  updatedAt: '10/26/2026, 16:48',
  createdBy: 'Demo User',
  smartTags: ['vase', 'pottery', 'plant', 'brown'],
  /** The vase, low and right of the centre */
  focalPoint: { x: 0.68, y: 0.8 },
  details: { mime_type: 'image/jpeg', size: 3_640_000, width: 1600, height: 1200 },
  categorization: {
    author: 'Ines Carvalho',
    copyright: '© Saltmarsh Museum',
    tags: ['ceramics', 'light-and-thread', 'press'],
  },
} as const;

export const LOCALES = ['English', 'Italian'];

export const METADATA = {
  English: {
    title: 'Vessel with dry grasses',
    alt: 'A clay vase with dry grasses in the afternoon light',
  },
  Italian: {
    title: 'Vaso con erbe secche',
    alt: 'Un vaso di terracotta con erbe secche nella luce del pomeriggio',
  },
} as const;

/**
 * The records that use the asset, in the panel "Records using this asset".
 * The cms shows the first image of each record: the vase, or the cover of
 * the exhibition.
 */
export const LINKING_RECORDS = [
  {
    title: 'Vessel with dry grasses',
    model: '🧵 Object',
    status: 'published',
    image: 'clayVessel',
  },
  { title: 'Light and Thread', model: '🖼️ Exhibition', status: 'published', image: 'tideLine' },
  {
    title: 'Clay that holds the light',
    model: '📰 Article',
    status: 'updated',
    image: 'clayVessel',
  },
  {
    title: 'Light and Thread opens on 14 March',
    model: '📣 Press release',
    status: 'draft',
    image: 'clayVessel',
  },
  { title: 'Talk: Clay and light', model: '🗓️ Event', status: 'published', image: 'clayVessel' },
] as const;
