export { default as CarouselCard } from './Component.astro';

/*
 * The `sizes` of an image in the `image` slot. A card is 240px wide on a
 * phone, 260px from 768px, and at most 320px in a carousel that wraps.
 * A browser with no `sizes="auto"` (Safari) takes these values.
 */
export const carouselCardImageSizes = 'auto, (min-width: 768px) 320px, 240px';
