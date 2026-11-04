// The pixel video of each course of the academy. The key is the slug of the
// course. A course without an entry gets the default video. `CourseVideo`
// shows each one in the palette tonal, on the inverse surface.
interface CourseVideoData {
  src: string;
}

//
// The three videos come from one shoot: a person in a green suit, keyed
// with the suit, thus only the clothes show. Each file has a height in
// cells for the same scale (approximately 21 pixels of the footage for each
// cell). Thus the clothes have the same size in each row. Keep this scale
// when you add a video of the same shoot.
export const courseVideos: Record<string, CourseVideoData> = {
  'headless-cms': { src: '/videos/invisible-jump.pxv' },
  'modern-web-development': { src: '/videos/invisible-walk.pxv' },
  'frontend-frameworks': { src: '/videos/invisible-dress.pxv' },
};

export const defaultCourseVideo: CourseVideoData = {
  src: '/videos/person-dance-2.pxv',
};

/** The video of a course. */
export const courseVideo = (slug: string): CourseVideoData =>
  courseVideos[slug] ?? defaultCourseVideo;
