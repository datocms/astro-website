import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentData } from '~/components/FeatureFragments';
import type { CodeTab } from '~/components/CodeSnippetPreview';
import type { Theme } from '~/lib/theme';

/**
 * A chapter: the three parts of a chapter (ChapterHeader, SceneFrame,
 * FeatureFragments) with their real copy. In place of each picture that
 * does not exist yet, the page shows a box with its description. When the
 * picture is built, its description is removed.
 */
export interface ChapterLayoutData {
  /** The anchor of the chapter on the page. */
  id: string;
  theme: Theme;
  /**
   * Without a header and a frame (`chapter` and `scene`), the chapter is
   * only its fragments: more fragments for a chapter above it.
   */
  chapter?: ChapterHeaderData;
  /**
   * The SceneFrame: the description of the scene to make. When the frame is
   * built, it goes in the slot "scene" of the component (or `sceneCode` is
   * set), and this description is removed.
   */
  scene?: string;
  /**
   * The code of a frame that is code, once it is written: the frame shows
   * the tabs side by side (CodeSnippetPreview `columns`) in place of the box.
   * When a tab has notes, the frame is one card with tabs, and the notes
   * show next to the code from 1152px.
   */
  sceneCode?: CodeTab[];
  /**
   * 0, 2 or 4 fragments, each with a picture that adds a nuance or a point
   * of view to the frame. The sentence may overlap the intro. `picture` describes
   * a picture that does not exist yet; "Code: …" is a CodeSnippetPreview.
   * When the picture is built, it goes in the slot "visual-N" of the
   * component (N is the index of the fragment) (or `code` is set), and
   * `picture` is removed.
   */
  fragments: (FeatureFragmentData & {
    picture?: string;
    /**
     * The code of a "Code: …" picture, once it is written: the fragment
     * shows a CodeSnippetPreview with these tabs in place of the box.
     */
    code?: CodeTab[];
  })[];
}
