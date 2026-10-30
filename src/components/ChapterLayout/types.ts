import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentData } from '~/components/FeatureFragments';
import type { CodeTab } from '~/data/home';
import type { Theme } from '~/lib/theme';

/**
 * A chapter whose pictures do not exist yet: the three parts of a chapter
 * (ChapterHeader, SceneFrame, FeatureFragments) with their real copy. In
 * place of each picture, the page shows a box with its description. The
 * design phase replaces each box with a scene.
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
   * The SceneFrame: the description of the scene to make. A frame that is
   * built goes in the slot "scene" of the component, and this is its
   * summary.
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
   * of view to the frame. The sentence may overlap the intro. `picture` describes the picture to make; "Code: …"
   * is a CodeSnippetPreview. A picture that is built goes in the slot
   * "visual-N" of the component (N is the index of the fragment), and
   * `picture` is its summary.
   */
  fragments: (FeatureFragmentData & {
    picture: string;
    /**
     * The code of a "Code: …" picture, once it is written: the fragment
     * shows a CodeSnippetPreview with these tabs in place of the box.
     */
    code?: CodeTab[];
  })[];
}
