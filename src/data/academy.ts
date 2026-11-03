// The pixel video of each course of the academy. The key is the slug of the
// course. A course without an entry gets the default video. `CourseVideo`
// shows each one in the palette tonal, on the inverse surface.
interface CourseVideoData {
  src: string;
}

export const courseVideos: Record<string, CourseVideoData> = {
  'headless-cms': { src: '/videos/robot-dance.pxv' },
  'modern-web-development': { src: '/videos/robot-dance-2.pxv' },
  'frontend-frameworks': { src: '/videos/robot-dance-3.pxv' },
};

export const defaultCourseVideo: CourseVideoData = {
  src: '/videos/person-dance-2.pxv',
};

/** The video of a course. */
export const courseVideo = (slug: string): CourseVideoData =>
  courseVideos[slug] ?? defaultCourseVideo;
