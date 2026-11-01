// The pixel video of each course of the academy. The key is the slug of the
// course. A course without an entry gets the default video.

// `palette` replaces the palette of the file (`palettes` in
// src/lib/pixel-video/styles.ts).
interface CourseVideoData {
  src: string;
  palette?: string;
}

export const courseVideos: Record<string, CourseVideoData> = {
  'headless-cms': { src: '/videos/academy-headless-cms.pxv' },
  'frontend-frameworks': { src: '/videos/academy-frontend-frameworks.pxv' },
  'modern-web-development': { src: '/videos/academy-modern-web-development.pxv' },
};

export const defaultCourseVideo: CourseVideoData = {
  src: '/videos/hand-waving.pxv',
  palette: 'soft',
};
