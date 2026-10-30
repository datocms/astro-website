/** The lines under a product scene that tell its steps, one at a time. */
export interface SceneCaptionData {
  /**
   * One line for each step of the sequence of the scene, in the order of
   * the sequence. `step` is the name of the step in the kit.
   */
  lines: { step: string; text: string }[];
  /**
   * The step of the still picture (the scene without JS or with reduced
   * motion): its line shows when the sequence does not play.
   */
  still: string;
}
