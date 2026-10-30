import type { CodeTab } from '~/data/home';

/*
 * The code of the "Code:" fragments of /media (src/data/media.ts). The
 * fragment of Asset fields is on the story of its frame
 * (src/scenes/AssetFields/story.ts): the trip "Wadi Rum on foot" and its
 * cover. The others are on the story of Saltmarsh Museum
 * (src/scenes/AGENTS.md, "The stories"): the exhibition "Light and Thread" and its cover, the
 * photo Tide Line (detail), 4000 × 2667, 3.1 MB.
 * The fields follow the Content Delivery API: "Images and videos"
 * (/docs/content-delivery-api/images-and-videos) and "Localization".
 * Long strings are cut with "…" to keep the lines under ~66 characters.
 */

// Fragment "Assets in your query." (Asset fields). The three fields of the
// frame in one query: the cover with its focal point, the gallery, and the
// trailer with what YouTube gives for the link. The locale of the query and
// the Italian alt text are strong. The card shows about 13 lines, thus the
// gallery and the trailer are on one line each in the query, and the
// gallery shows its first photo, then "…", in the response.
export const assetQuery: CodeTab = {
  label: 'Query',
  lang: 'graphql',
  focus: [2, 5],
  code: `query {
  trip(locale: it) {
    cover {
      url
      alt
      focalPoint { x y }
    }
    gallery { url }
    trailer { provider title thumbnailUrl }
  }
}`,
};

export const assetResponse: CodeTab = {
  label: 'Response',
  lang: 'json',
  focus: [5],
  code: `{
  "trip": {
    "cover": {
      "url": "…/1741000000-wadi-rum-dune.jpg",
      "alt": "Una duna rossa del Wadi Rum al crepuscolo",
      "focalPoint": { "x": 0.42, "y": 0.61 }
    },
    "gallery": [{ "url": "…/wadi-rum-camp.jpg" }, …],
    "trailer": {
      "provider": "youtube",
      "title": "Wadi Rum on foot: four days in the desert",
      "thumbnailUrl": "…/vi/q8Rk2LwXa4E/hqdefault.jpg"
    }
  }
}`,
};

// Fragment "Responsive in one field." (Images API). The imgix parameters
// are the ones of the hero (1600 × 900, cropped); `srcSet` is the strong
// token, in the query and in the response. The `sizes` argument comes back
// as it was sent. The URLs and the placeholder are cut with "…".
export const responsiveQuery: CodeTab = {
  label: 'Query',
  lang: 'graphql',
  focus: [9],
  code: `query {
  exhibition {
    cover {
      responsiveImage(
        imgixParams: { w: 1600, h: 900, fit: crop }
        sizes: "(max-width: 800px) 100vw, 800px"
      ) {
        src
        srcSet
        sizes
        width
        height
        base64
        alt
      }
    }
  }
}`,
};

export const responsiveResponse: CodeTab = {
  label: 'Response',
  lang: 'json',
  focus: [6],
  code: `{
  "exhibition": {
    "cover": {
      "responsiveImage": {
        "src": "…/1741000000-tide-line-detail.jpg?…",
        "srcSet": "…w=400 400w, …w=800 800w, …w=1600 1600w",
        "sizes": "(max-width: 800px) 100vw, 800px",
        "width": 1600,
        "height": 900,
        "base64": "data:image/jpeg;base64,/9j/4AAQ…",
        "alt": "A knot of indigo thread in the tapestry Tide Line"
      }
    }
  }
}`,
};

// Fragment "Everything we know about it." (Images API). The dominant colours
// are strong: the eye lands on them. `exifInfo` is a JSON field: it is asked
// with no sub-selection and comes back as an object.
// The keys of `exifInfo` are the ones of the example of the CMA docs
// (resources/upload, `exif_info`): snake_case, typed values. The CMA client
// types it as an open object, with no list of keys.
export const metadataQuery: CodeTab = {
  label: 'Query',
  lang: 'graphql',
  focus: [4],
  code: `query {
  exhibition {
    cover {
      colors { hex }
      exifInfo
      width
      height
      size
      copyright
    }
  }
}`,
};

export const metadataResponse: CodeTab = {
  label: 'Response',
  lang: 'json',
  focus: [4],
  code: `{
  "exhibition": {
    "cover": {
      "colors": [{ "hex": "#1f3a5f" }, { "hex": "#d9c7a3" }],
      "exifInfo": { "model": "ILCE-7", "iso": 10000, "focal_length": 35 },
      "width": 4000,
      "height": 2667,
      "size": 3251200,
      "copyright": "Saltmarsh Museum"
    }
  }
}`,
};

// The frame of "Image and video components": the page of the exhibition in
// a Next.js app (App Router), with the Image of react-datocms. The query
// is in its own file: the page gives `responsiveImage` to the component as
// the API returns it. The two `data` props and the import are the lines to
// see; the cover has `priority`, thus only the gallery loads lazily. The
// longest line has ~52 characters: the editor of the frame is narrow.
export const componentsCode: CodeTab = {
  label: 'page.tsx',
  lang: 'tsx',
  focus: [2, 15, 21],
  code: `import { executeQuery } from '@datocms/cda-client';
import { Image } from 'react-datocms';
import { query } from './query';

export default async function Page({ params }) {
  const { slug } = await params;
  const { exhibition } = await executeQuery(query, {
    token: process.env.DATOCMS_TOKEN,
    variables: { slug },
  });
  const { title, dates, cover, gallery } = exhibition;

  return (
    <article>
      <Image data={cover.responsiveImage} priority />
      <h1>{title}</h1>
      <p>{dates}</p>
      <ul className="gallery">
        {gallery.map((photo) => (
          <li key={photo.id}>
            <Image data={photo.responsiveImage} />
          </li>
        ))}
      </ul>
    </article>
  );
}`,
};
