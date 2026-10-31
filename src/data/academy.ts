// The pixel video of each course of the academy. The key is the slug of the
// course. A course without an entry gets the default video.

import type { PixelVideoSettings } from '~/lib/pixel-video/settings';

export interface CourseVideoData {
  src: string;
  settings?: Partial<PixelVideoSettings>;
}

export const courseVideos: Record<string, CourseVideoData> = {
  'headless-cms': { src: '/videos/loving-robot.pxv' },
  'frontend-frameworks': { src: '/videos/human-eyes.pxv' },
  'modern-web-development': { src: '/videos/spinning-globe.pxv' },
};

export const defaultCourseVideo: CourseVideoData = { src: '/videos/hand-waving.pxv' };

// The look is soft, as the page: dark pixels take the surface of the page,
// the midtones the theme colour, and the highlights the colour of the text.
// All are tokens of the theme, thus the look is right in both schemes.
export const courseVideoSettings: Partial<PixelVideoSettings> = {
  bgFill: 'var(--surface-default)',
  bgStroke: 'var(--surface-default)',
  bgStrokeDisabled: true,
  midFill: 'var(--surface-accent)',
  midStroke: 'var(--surface-default)',
  highFill: 'var(--text-primary)',
  highStroke: 'var(--surface-default)',
};
