// The fake content of the chapter "Video API" of /media. The scenes show
// the video "Restoring Tide Line" of Saltmarsh Museum, the museum of the
// chapter "Media library": a film of the restoration of the tapestry Tide
// Line, paused at 2:40 on the hands of the weaver that smooth the linen,
// with its thumbnail at 1:30 on the hands that sew. Do not change a text
// here without a change to the copy (src/data/media.ts).

export const COLLECTION = 'Light and Thread';

/** The video that the scenes open */
export const VIDEO = {
  title: 'Restoring Tide Line',
  filename: 'restoring-tide-line.mp4',
  id: 'Vt8qL2nR5sXc7HdWm4pZa',
  url: 'stream.mux.com/Vt8qL2nR5sXc7Hd.m3u8',
  createdAt: '10/22/2026, 10:02',
  updatedAt: '10/26/2026, 16:40',
  createdBy: 'Demo User',
  duration: 252,
  /** The frame of the thumbnail: 1:30, the hands of the weaver that sew the linen */
  time: 90,
  /** The frame of the player: 2:40, a hand that smooths the linen and a hand that pulls the thread */
  playerTime: 160,
  details: { mime_type: 'video/mp4', size: 412_600_000, width: 1920, height: 1080, duration: 252 },
};

/** The playback ID of the video at Mux, in the URLs of its stream and of its GIF */
export const PLAYBACK_ID = 'Vt8qL2nR5sXc7Hd';

/**
 * The GIF of the fragment "A GIF, from the URL.": 1:30 to 1:34, from the
 * frame of the thumbnail (restoring-tide-line-clip.gif), 160px wide
 */
export const GIF = { start: 90, end: 94, width: 160 };

/**
 * The tracks of the video, in the order of the cms (by kind, then by
 * name): the German subtitles that the museum uploaded, and the English
 * captions that Mux generated from the audio.
 */
export const TRACKS = [
  { type: 'subtitles' as const, name: 'Deutsch', languageCode: 'de' },
  { type: 'subtitles' as const, name: 'English (generated)', languageCode: 'en' },
];

/** The new audio track of the last fragment: the Italian voice-over, as it uploads */
export const AUDIO_TRACK = {
  file: { filename: 'restoring-tide-line-it.m4a', format: 'm4a', percent: 72 },
  language: { name: 'Italian', code: 'it' },
  trackName: 'Italiano (voce)',
};
