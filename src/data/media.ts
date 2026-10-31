import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { QuoteData, StatementData } from '~/data/case-studies';
import type { CtaBannerData, HeroData } from '~/data/home';
import {
  assetQuery,
  assetResponse,
  metadataQuery,
  metadataResponse,
  responsiveQuery,
  responsiveResponse,
} from '~/data/media-code';
import type { CategoryNavData } from '~/data/features';

/*
 * Route /media: the Media pillar (src/data/AGENTS.md). Five
 * chapters: Media library, Asset fields, Images, Video, In your frontend.
 * The opinion sits between Images and Video.
 *
 * Every chapter is a ChapterLayout with its copy. The copy is a
 * draft, for Ronak's pass. A "(check)" comment marks a
 * fact to verify before the copy is final. Asset fields and In your
 * frontend are the thin chapters (src/data/AGENTS.md, "The pillars").
 *
 * The pictures of the page tell one story: Saltmarsh Museum, a museum of
 * textile and craft, and its exhibition "Light and Thread". The photo
 * "Tide Line (detail)", the portrait of the curator Amara Osei and the
 * video "Restoring Tide Line" run through the chapters. The `scene` and `picture`
 * strings describe each picture in one line.
 */

const docs = (href: string): ChapterHeaderData['link'] => ({
  label: 'Read The Docs',
  href,
  appearance: 'deep-on-white',
  variant: 'soft',
});

// New copy.
export const hero: HeroData = {
  label: 'Media',
  headline: 'Upload once. Every size, every screen.',
  subheadline: 'One library for every file, served in the size each page asks for',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    {
      label: 'Read The Docs',
      href: '/docs/asset-api/images',
      appearance: 'deep-on-white',
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

// Chapter 1: the asset management. Built: src/scenes/MediaLibrary. The copy
// follows the cms: the default metadata has a menu of the language (no
// locale tabs), the saved filters are a menu of the toolbar, the menu of
// the upload button lists the sources of the plugins, and fragment 3 is
// the panel of the records that use the asset.
export const library = {
  id: 'library',
  theme: 'pink',
  chapter: {
    label: 'Media library',
    headline: 'One library.',
    muted: 'Find it again.',
    intro:
      // The docs confirm it: a new version dropped on an asset replaces it
      // in every occurrence.
      'Images, video, audio and documents in one library that every record links. Replace a file once, and every page that uses it follows.',
    // The route of the docs of the media area, confirmed.
    link: docs('/docs/general-concepts/media-area'),
  },
  scene:
    'The media area of Saltmarsh Museum: the collections, the grid of Light and Thread, and the asset Vessel with dry grasses open. A click on the vase sets its focal point, and the previews of the crops follow it. Then the default title and alt, the tags.',
  fragments: [
    {
      // The default metadata is the fallback: a record that links the
      // asset can give its own alt and title.
      title: 'Alt text, in each language.',
      text: 'Write the alt and the title once on the asset, in each language. Every record that links it starts from them.',
      picture:
        'The default metadata of Vessel with dry grasses, the menu of the language open, Italian active, its alt text filled.',
    },
    {
      title: 'Collections and saved filters.',
      text: 'Nest collections for exhibitions, campaigns and clients, and save the filters you open every day, for you or for the team.',
      picture:
        'The tree of the collections, Exhibitions › 2026 › Light and Thread active, and the menu of the saved filters open on Press kit 2026.',
    },
    {
      // The cms opens the record on the field that holds the asset
      // (LinksToItems, the fieldPath of each row).
      title: 'See where it is used.',
      text: 'Each asset lists the records that link it. Click one, and the record opens on the field that holds the file.',
      picture:
        'The panel Records using this asset of Vessel with dry grasses: an object, the exhibition Light and Thread, an article and a press release, each with its status.',
    },
    {
      // (check) which DAM plugins are in the marketplace today (Sirv is;
      // Cloudinary is named on features.md). The source is named by the
      // plugin, thus the picture draws no third-party interface.
      title: 'Your DAM, if you have one.',
      text: 'A plugin adds its source to the upload menu, and brings the assets of Cloudinary or another DAM in without a second upload.',
      picture:
        'The menu of the upload button open: the sources the plugins add, Museum archive under the pointer, then Unsplash.',
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
      'Single asset and gallery fields, with rules on size, format and dimensions, and a required alt text if you want one. Embeds from YouTube or Vimeo have their own field.',
    link: docs('/docs/content-modelling'),
  },
  // The frame shows the three fields at rest. The picker of the library
  // went: a modal over the form hid the two fields the headline names.
  // Built: src/scenes/AssetFields. Its story is not the museum of the
  // other chapters: the trip Wadi Rum on foot of Far Track, a company of
  // walking holidays, with photos that go with the orange of the chapter.
  scene:
    'The trip Wadi Rum on foot: the cover, a gallery of six photos, and the external video field with the trailer’s thumbnail from YouTube.',
  fragments: [
    {
      // A zoom on the third field of the frame. With a video, the cms
      // shows the thumbnail and the title that it fetched, not the link.
      title: 'Video from elsewhere too.',
      text: 'An external video field takes a YouTube or Vimeo link and shows its preview.',
      picture:
        'The external video field zoomed in: the thumbnail and the title of the trailer, fetched from its YouTube link, with the actions of the card (play, open, remove) and the hint of the field.',
    },
    {
      title: 'Assets in your query.',
      text: 'One GraphQL query gets the cover with its focal point, the whole gallery and the trailer, with the alt text in the locale you ask for.',
      picture:
        'Code: the query of Wadi Rum on foot: the cover with url, alt and focal point, the URLs of the gallery, and the trailer with its provider, title and thumbnail, with the response in Italian.',
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
    headline: 'One original.',
    muted: 'Every size, from the URL.',
    intro:
      'Add parameters to the URL and the image is resized, cropped, compressed and converted on request, with imgix, then cached at the edge. Press the switches: each one is a parameter of the URL.',
    link: docs('/docs/asset-api/images'),
  },
  scene:
    'The image lab: the original photo, the URL of DatoCMS with its parameters, and the photo that the URL makes, with its weight. A switch for each parameter and each format.',
  fragments: [
    {
      title: 'Responsive in one field.',
      text: 'Ask for the responsive image in GraphQL, and get the sizes, the srcset and a blurred placeholder in one object.',
      picture:
        'Code: the query of responsiveImage of Tide Line, and the response with src, srcSet, sizes and the blurred base64 placeholder.',
      code: [responsiveQuery, responsiveResponse],
    },
    {
      title: 'Everything we know about it.',
      text: 'Dimensions, EXIF, dominant colours, a blurhash and the copyright are stored with the asset, and your query can ask for them.',
      picture:
        'Code: the metadata of the upload Tide Line in a response: colors, exifInfo, width, height, size, blurhash, copyright.',
      code: [metadataQuery, metadataResponse],
    },
  ],
};

// New copy. The one opinion of the page, between chapter 3 and chapter 4.
export const opinion: StatementData = {
  label: 'We don’t run our own pipeline.',
  text: 'imgix and Mux each do one thing, better than we would. Our job is to make them feel like one field in your schema and one library for your editors.',
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
      'Every video is transcoded on upload and streamed with adaptive bitrate from Mux. Thumbnails, captions and audio tracks come from the same upload.',
    link: docs('/docs/asset-api/videos'),
  },
  // Built: src/scenes/Video/. The frame and the pictures of the first two
  // fragments are scenes of the page of the video; the third is the two
  // players of Stream.astro; the fourth is the URL and the GIF of
  // Gif.astro.
  scene:
    'The media area of Saltmarsh Museum, and over it the dialog of the video Restoring Tide Line: the player on a frame at 2:40, and above the marker at 1:30 on the seek bar the card Thumbnail at 1:30.00 with the weaver’s hands that sew the linen. Beside the player, the tracks: German, uploaded; English, generated.',
  // The frame shows the card of the thumbnail and the tracks at rest in
  // the sidebar; the first fragment is a zoom on the tracks, with their
  // icons (download, delete) and the buttons of the slot.
  fragments: [
    {
      // The docs: captions can be generated only for videos uploaded in the
      // last 7 days, thus the sentence says "within a week".
      title: 'Captions, generated.',
      text: 'Pick the language within a week of the upload, and we turn the audio into captions. Download them, correct them, upload them again.',
      picture:
        'The sidebar of Restoring Tide Line zoomed in: the panels Info and Categorization closed, then the tracks German and English (generated), each with its icons Download and Delete, and under the tracks the buttons Browse and Generate subtitles from audio.',
    },
    {
      // The docs: extra audio tracks in M4A, MP3 or WAV, in the panel
      // "Additional audio tracks and subtitles"; the video players of
      // DatoCMS show the audio tracks.
      title: 'Add another voice.',
      text: 'Upload an audio track in M4A, MP3 or WAV: a dub in another language, or an audio description. Viewers pick it in the player.',
      picture:
        'The dialog Add new track over Restoring Tide Line: the file restoring-tide-line-it.m4a as it uploads, the language Italian and the track name Italiano (voce).',
    },
    {
      // From the chapter Streaming, which went: adaptive bitrate, as the
      // viewer sees it. (check) 270p and 4K: the old chapter had them, and
      // nobody has verified them against the docs of Mux.
      title: 'No spinning wheel.',
      text: 'The player picks the rendition each connection can carry, from 270p to 4K. On a train the picture gets softer, on fibre it gets sharp again, and it never stops to load.',
      picture:
        'Restoring Tide Line in two players at the same second, both playing: on a train the picture is soft, 270p; on fibre it is sharp, 1080p. The connection of the left player changes, and its picture with it.',
    },
    {
      // From the chapter Streaming, which went.
      title: 'A GIF, from the URL.',
      text: 'Ask for an animated GIF or WebP of any part of the video, for an email or a preview card.',
      picture:
        'The URL of an animated GIF of Restoring Tide Line from 1:30 to 1:34, and under it the GIF that it returns: the hands that sew, then the hands that smooth the linen.',
    },
  ],
};

// Chapter 5: the components for images and video.
// Built: src/scenes/MediaComponents (the exhibition Keepers of the Light
// of Harwick Maritime Museum, not Saltmarsh Museum): the frame, and the
// two fragments, Files.astro and Player.astro.
export const components: ChapterLayoutData = {
  id: 'components',
  theme: 'blue',
  chapter: {
    label: 'Image and video components',
    headline: 'One component for images.',
    muted: 'One for video.',
    intro:
      'Our React, Vue and Svelte packages ship an Image and a VideoPlayer that take the API response as it is. Lazy loading, placeholders and captions included.',
    link: docs('/docs/content-delivery-api/images-and-videos'),
  },
  // The frame shows the Image as it loads: the placeholders, no layout
  // jump. The fragments show what the frame cannot: the file that each
  // screen gets, and the player, the other half of the headline.
  scene:
    'Two windows: the code of the page of an exhibition with the Image of react-datocms, and the page in a browser, where each photo is a blurred placeholder until it arrives.',
  fragments: [
    {
      // The weights are imgix AVIF files of the cover, measured; the
      // original is the photo as Unsplash serves it
      // (src/scenes/MediaComponents/story.ts).
      title: 'Each screen gets its own file.',
      text: 'The Image writes the srcset for you. A phone downloads a small AVIF and a large screen a sharp one, from the same line of code.',
      picture:
        'The line of the Image, and under it the srcset: five copies of the whole photo of the cover in a cascade, each partly on the next larger one, from 960w and 22 KB to 3840w and 157 KB. The phone picks the file of 39 KB, the laptop the file of 101 KB. After them, in a shade, the original: 6000 × 4000, 3.5 MB, larger than the picture.',
    },
    {
      // The tracks are the ones of the chapter "Video API": the payoff of
      // that chapter. The player is the one of Mux, as the component
      // renders it.
      title: 'The player, in one line.',
      text: 'Pass the video from the query. The poster, the stream, the captions and the audio tracks come with it.',
      picture:
        'The line of code with the VideoPlayer, and under it the player of Restoring Tide Line: the English caption on the frame, and the menu of the captions open on the tracks of the Video API chapter, German and English (generated).',
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

// The closer: the quote of Grace Guzman. The page shows the quote of the CMS
// review (ID 39832305). This quote is the fallback, for when the review is
// gone.
export const closing: QuoteData = {
  quote:
    '“Thanks to DatoCMS we are able to serve massive spikes of terabytes of optimized images per day with zero operations and no upfront costs.”',
  name: 'Grace Guzman',
  role: 'Head of Web Marketing, Chatelaine Magazine',
};

// New copy.
export const ctaBuild: CtaBannerData = {
  variant: 'light',
  theme: 'green',
  headline: 'Upload one file',
  muted: 'and see what comes back.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    {
      label: 'Try The Demo',
      href: 'https://try.datocms.com',
      appearance: 'deep-on-light',
      variant: 'soft',
    },
  ],
};
