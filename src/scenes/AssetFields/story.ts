// The fake content of the chapter "Asset fields" of /media. The scenes
// show one record: the trip "Wadi Rum on foot" of Far Track, a company of
// walking holidays, with its three media fields. Do not change a text here
// without a change to the copy (src/data/media.ts, src/data/media-code.ts).

export const PROJECT_NAME = 'Far Track';

export const USER_NAME = 'Demo User';

export const TRIP_ICON = '🧭';

export const SIDEBAR_TRIP_MODELS = ['🧭 Trips', '🗺️ Destinations', '🥾 Guides'] as const;

export const SIDEBAR_OTHER_FOLDERS = ['Pages', 'Journal', 'Legal'] as const;

export const TRIP = {
  title: 'Wadi Rum on foot',
  slug: 'wadi-rum-on-foot',
  slugPrefix: 'https://fartrack.com/trips/',
} as const;

/**
 * The cover: a single asset field. The card shows the alt text of the
 * upload, because the record gives no title.
 */
export const COVER = {
  // The Italian alt is in the code fragment (src/data/media-code.ts)
  alt: 'A red dune of Wadi Rum at dusk',
} as const;

/**
 * The gallery: six uploads, in the order of the trip. Each card shows the
 * alt text of its upload. The `photo` is the name of the JPG in the folder.
 */
export const GALLERY = [
  { photo: 'camp', alt: 'The camp below Jebel Umm Ishrin' },
  { photo: 'camels', alt: 'Camels on the way to Burdah' },
  { photo: 'rock', alt: 'The Mushroom Rock' },
  { photo: 'dunes', alt: 'A walker on the dunes' },
  { photo: 'tea', alt: 'Tea by the camels at sunset' },
  { photo: 'stars', alt: 'The Milky Way over the camp' },
] as const;

export const TRAILER = {
  url: 'https://www.youtube.com/watch?v=q8Rk2LwXa4E',
  title: 'Wadi Rum on foot: four days in the desert',
  hint: 'The YouTube or Vimeo link of the trailer.',
} as const;

export const RECORD_INFO = {
  id: 'Ft4wRmDsQp2Lx8KcVn6TaZ',
  status: 'published',
  createdAt: '03/02/2026, 10:12',
  updatedAt: '03/09/2026, 16:47',
  createdBy: 'Ronak Ganatra',
} as const;
