import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { StatementData } from '~/components/Statement';
import type { CtaBannerData, HeroData } from '~/data/home';
import {
  assetQuery,
  assetResponse,
  metadataQuery,
  metadataResponse,
  responsiveQuery,
  responsiveResponse,
} from '~/data/media-code';
import type { CategoryNavData } from '~/components/CategoryNav';

/*
 * Route /media: the Media pillar (src/data/AGENTS.md). Five
 * chapters: Media library, Asset fields, Images, Video, In your frontend.
 * The opinion sits between Images and Video.
 *
 * Every chapter is a ChapterLayout with its copy. Asset fields and In your
 * frontend are the thin chapters (src/data/AGENTS.md, "The pillars").
 *
 * The pictures of the page tell one story: Saltmarsh Museum, a museum of
 * textile and craft, and its exhibition "Light and Thread". The photo
 * "Tide Line (detail)", the portrait of the curator Amara Osei and the
 * video "Restoring Tide Line" run through the chapters. The `scene` and `picture`
 * strings describe each picture in one line.
 */

const docs = (href: string): ChapterHeaderData['link'] => ({
  label: 'Read the docs',
  href,
  variant: 'soft',
});

export const hero: HeroData = {
  label: 'Media',
  headline: 'Upload once. Optimized for every size, every screen.',
  subheadline: 'Images, video, audio and documents, all in one library',
  face: 'surprised',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    {
      label: 'Read the docs',
      href: '/docs/asset-api/images',
      variant: 'soft',
    },
  ],
};

// The chapter nav under the hero: one item for each chapter, in page order.
// The href is the id of the chapter.
export const chapterNav: CategoryNavData = {
  items: [
    { label: 'Media library', href: '#library' },
    { label: 'Asset fields', href: '#fields' },
    { label: 'Images API', href: '#images' },
    { label: 'Video API', href: '#video' },
    { label: 'Image and video components', href: '#components' },
  ],
};

// Chapter 1: the asset management. The copy
// follows the cms: the default metadata has a menu of the language (no
// locale tabs), the saved filters are a menu of the toolbar, the menu of
// the upload button lists the sources of the plugins, and fragment 3 is
// the panel of the records that use the asset.
export const library = {
  id: 'library',
  theme: 'pink',
  chapter: {
    label: 'Media library',
    headline: 'One library,',
    muted: 'organized your way.',
    intro:
      // The docs confirm it: a new version dropped on an asset replaces it
      // in every occurrence.
      'Images, video, audio, and documents in one library that every record links to. Replace a file once, and every record that uses it follows.',
    // The route of the docs of the media area, confirmed.
    link: docs('/docs/general-concepts/media-area'),
  },
  fragments: [
    {
      // The default metadata is the fallback: a record that links the
      // asset can give its own alt and title.
      title: 'Alt text for every language.',
      text: 'Write the alt text and title of an asset once, in each language. Every record that links it starts from them.',
    },
    {
      title: 'Collections and saved filters.',
      text: 'Nest collections by category, campaign, or client, and save the filters you use every day, for yourself or for the team.',
    },
    {
      // The cms opens the record on the field that holds the asset
      // (LinksToItems, the fieldPath of each row).
      title: 'See where it is used.',
      text: 'Each asset lists the records that link to it. Click one, and the record opens to that specific field.',
    },
    {
      // The DAM plugins on /plugins: Cloudinary, Bynder, Sirv. The source is named by the
      // plugin, thus the picture draws no third-party interface.
      title: 'Bring your own DAM.',
      text: 'Already using Cloudinary, Bynder, or another DAM? A plugin adds it to the upload menu, so you don’t upload twice.',
    },
  ],
} satisfies ChapterLayoutData;

// Chapter 2: the asset fields.
export const fields: ChapterLayoutData = {
  id: 'fields',
  theme: 'orange',
  chapter: {
    label: 'Asset fields',
    headline: 'A field for one image,',
    muted: 'a gallery for twenty.',
    intro:
      'Single asset and gallery fields, with rules for size, format, and dimensions, and required alt text if you want it.',
    link: docs('/docs/content-modelling'),
  },
  // The frame shows the three fields at rest. The picker of the library
  // went: a modal over the form hid the two fields the headline names.
  // The story is not the museum of the other chapters: the trip Wadi Rum
  // on foot of Far Track, a company of walking holidays, with photos that
  // go with the orange of the chapter.
  fragments: [
    {
      // A zoom on the third field of the frame. With a video, the cms
      // shows the thumbnail and the title that it fetched, not the link.
      title: 'Already uploaded video elsewhere?',
      text: 'An external video field takes a YouTube or Vimeo link and generates its preview.',
    },
    {
      title: 'Assets in your query, optimized.',
      text: 'One GraphQL query gets your images, video, audio, and documents, with the optimizations, sizes, and formats you ask for.',
      code: [assetQuery, assetResponse],
    },
  ],
};

// Chapter 3: the Images API and its optimization. The frame is the lab of
// src/scenes/Images (the parameters, the formats and the weight), thus the
// fragments keep only what the lab does not show.
export const images: ChapterLayoutData = {
  id: 'images',
  theme: 'green',
  chapter: {
    label: 'Images API',
    headline: 'Upload the original.',
    muted: 'Not every version.',
    intro:
      'Add parameters to the URL, and imgix resizes, crops, compresses, and converts the image on request. The result is cached at the edge.',
    link: docs('/docs/asset-api/images'),
  },
  fragments: [
    {
      title: 'Responsive images in one query.',
      text: 'Query for the responsive image in GraphQL, and get the srcset, the dimensions, and a blurred placeholder in one object.',
      code: [responsiveQuery, responsiveResponse],
    },
    {
      title: 'We keep all the metadata.',
      text: 'Dimensions, EXIF, dominant colors, a blurhash, and the copyright stay with the asset. Query them with any other custom metadata you add.',
      code: [metadataQuery, metadataResponse],
    },
  ],
};

// The one opinion of the page, between chapter 3 and chapter 4.
export const opinion: StatementData = {
  label: 'We don’t run our own pipeline.',
  text: 'imgix has done images for years, and Mux has done video. Our job is to make them feel like one field in your schema and one library for your editors.',
};

// Chapter 4: the Video API.
export const video: ChapterLayoutData = {
  id: 'video',
  theme: 'purple',
  chapter: {
    label: 'Video API',
    headline: 'Upload any codec.',
    muted: 'Stream the right size.',
    // The docs do not tell about storyboards, thus the intro does not
    // name them.
    intro:
      'Every video is transcoded on upload and streamed with adaptive bitrate from Mux. Thumbnails, captions, and audio tracks come from the same upload.',
    link: docs('/docs/asset-api/videos'),
  },
  // The frame and the pictures of the first two fragments are scenes of
  // the page of the video; the third is the two players of Stream.astro;
  // the fourth is the URL and the GIF of Gif.astro.
  // The frame shows the card of the thumbnail and the tracks at rest in
  // the sidebar; the first fragment is a zoom on the tracks, with their
  // icons (download, delete) and the buttons of the slot.
  fragments: [
    {
      // The docs: captions can be generated only for videos uploaded in the
      // last 7 days, thus the sentence says "within a week".
      title: 'Captions, generated.',
      text: 'Pick a language within a week of the upload, and we turn the audio into captions. Not perfect? Download them, correct them, upload them again.',
    },
    {
      // The docs: extra audio tracks in M4A, MP3 or WAV, in the panel
      // "Additional audio tracks and subtitles"; the video players of
      // DatoCMS show the audio tracks.
      title: 'Add another voice.',
      text: 'Upload an audio track in M4A, MP3, or WAV: a dub in another language, or an audio description. Viewers pick it in the player.',
    },
    {
      // From the chapter Streaming, which went: adaptive bitrate, as the
      // viewer sees it. No resolutions: 4K is only on some plans.
      title: 'No spinning wheel.',
      text: 'The player picks the rendition each connection can carry. On a train? Lighter. Back on fiber? Sharp again.',
    },
    {
      // From the chapter Streaming, which went.
      title: 'A GIF, from the URL.',
      text: 'Ask for an animated GIF or WebP of any part of the video, for an email or a preview card.',
    },
  ],
};

// Chapter 5: the components for images and video.
// The story is the exhibition Keepers of the Light of Harwick Maritime
// Museum, not Saltmarsh Museum. The fragments are Files.astro and
// Player.astro.
export const components: ChapterLayoutData = {
  id: 'components',
  theme: 'blue',
  chapter: {
    label: 'Image and video components',
    headline: 'One component for images.',
    muted: 'One for video.',
    intro:
      'Our React, Vue, and Svelte packages ship an Image and a VideoPlayer that take the API response. Lazy loading, placeholders, and captions included.',
    link: docs('/docs/content-delivery-api/images-and-videos'),
  },
  // The frame shows the Image as it loads: the placeholders, no layout
  // jump. The fragments show what the frame cannot: the file that each
  // screen gets, and the player, the other half of the headline.
  fragments: [
    {
      // The weights are imgix AVIF files of the cover, measured; the
      // original is the photo as Unsplash serves it
      // (src/scenes/MediaComponents/story.ts).
      title: 'Each screen gets its own file.',
      text: 'The Image writes the srcset for you. A phone gets a small AVIF, a big screen a sharp one, from the same line of code.',
    },
    {
      // The tracks are the ones of the chapter "Video API": the payoff of
      // that chapter. The player is the one of Mux, as the component
      // renders it.
      title: 'Video player. In one line of code.',
      text: 'Pass the video from the query. The poster, the stream, the captions, and the audio tracks come with it.',
    },
  ],
};

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'Media',
  description:
    'One library for every file. Resize, crop and convert images from the URL, stream video with captions, and ship both to the frontend with ready-made components.',
};

export const ctaBuild: CtaBannerData = {
  variant: 'light',
  theme: 'green',
  headline: 'Upload one file',
  muted: 'and see what comes back.',
  buttons: [
    {
      label: 'Get started',
      href: dashboardUrl('/signup'),
      arrow: false,
    },
    {
      label: 'Try the demo',
      href: 'https://try.datocms.com',
      variant: 'soft',
    },
  ],
};
