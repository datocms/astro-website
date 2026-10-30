export interface FeatureFragmentData {
  /** 6 words at most. */
  title: string;
  /** One idea, 25 words at most. */
  text: string;
}

export interface FeatureFragmentsData {
  /** 2 or 4 items, each with a picture that adds a nuance or a point of view to the frame. */
  items: FeatureFragmentData[];
}
