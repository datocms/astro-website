/*
 * The fake data of the frame of the Real-time chapter (Stream.astro): the
 * events that come from DatoCMS, the component that gets them, the live
 * blog that shows them, and the still picture. The code of the component
 * is liveBlogCode of src/data/developers-code.ts.
 */

/** The event on each pill. One kind only: the eye follows one cause. */
export const EVENT = 'Record created';

export const STREAM = 'text/event-stream';

/**
 * The address in the bar of the browser: the live blog of a news site
 * during a football final. A match is the most usual case of a page that
 * changes each minute, thus the eye knows it at once.
 */
export const ADDRESS = 'matchday.news/live/cup-final';

export const TITLE = 'Cup final: live';

/** The number of looks of a post (the widths of its bars, a picture or a video), in style.module.css */
export const VARIANTS = 5;

/**
 * The still picture (no JS, reduced motion, and the first frame): the
 * last posts of the live blog, the newest first, each with the time of
 * its event. The pills show the same times. The loop goes on from the
 * time of the first, one to four minutes for each new post.
 */
export const STILL = [
  { time: '21:41', variant: 0 },
  { time: '21:38', variant: 4 },
  { time: '21:32', variant: 1 },
  { time: '21:27', variant: 3 },
  { time: '21:20', variant: 2 },
];

export const DESCRIPTION =
  'DatoCMS keeps a stream open to the website. Each time a record is created, the event goes down the stream to the useQuerySubscription hook of the component, and the live blog of the cup final shows the new post at the top, with no refresh.';
