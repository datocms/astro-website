export interface SplitPoint {
  title: string;
  /** The marks of InlineText work here. */
  text: string;
}

export interface SplitPointsData {
  kicker: string;
  title: string;
  /** The marks of InlineText work here, for example `**bold**`. */
  description: string;
  points: SplitPoint[];
}
