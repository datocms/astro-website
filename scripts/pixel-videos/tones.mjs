// The three source tones for the pixel video.
// The component sorts each pixel by brightness (0–255): below 105 is the
// background, from 105 to 161 is the midtone, above 161 is the highlight.
// Use one flat tone for each layer, so that the result is clean.
export const BG = '#000';
export const MID = '#848484';
export const HIGH = '#fff';
