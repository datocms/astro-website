/*
 * The data of the fragment "No spinning wheel." of the chapter "Video
 * API" (Stream.astro): two players of Restoring Tide Line on two
 * connections. The fast connection always gets 1080p. The slow one
 * changes, and the player picks the rendition that it can carry. The
 * pictures of the renditions are real smaller copies of the frame
 * (scripts/unsplash-photos.mjs, `renditions`).
 */
import { VIDEO } from './story';

export interface Connection {
  label: string;
  bars: number;
  rendition: '270p' | '480p' | '720p' | '1080p';
}

/** The connection of the right player: it does not change */
export const FAST: Connection = { label: 'Fibre', bars: 4, rendition: '1080p' };

/** The connections of the left player, in this order, again and again. The first is the still. */
export const CYCLE: Connection[] = [
  { label: 'On a train', bars: 1, rendition: '270p' },
  { label: 'Café wi-fi', bars: 2, rendition: '480p' },
  { label: 'Hotel wi-fi', bars: 3, rendition: '720p' },
];

/** The connection of the still (no JS, reduced motion): the first of the cycle */
export const STILL = CYCLE[0]!;

/** The renditions of the slow player, one picture each */
export const RENDITIONS = CYCLE.map(({ rendition }) => rendition);

export const START = VIDEO.time;

export const DURATION = VIDEO.duration;

export const clock = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

export const DESCRIPTION = `The video “${VIDEO.title}” in two players at the same second, ${clock(START)}, both playing. The left player is on a train: its picture is softer, 270p. The right player is on fibre: its picture is sharp, 1080p. When the left connection gets better, its picture gets sharper; it never stops to load.`;
