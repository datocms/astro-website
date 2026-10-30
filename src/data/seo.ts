import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';
import type { CodeTab } from '~/data/home';
import { EVENT, FAVICON_URL, SEO, SHARE_IMAGE_URL, SITE } from '~/scenes/Seo/story';

/*
 * The SEO chapter of the Editing pillar (`/editor-experience#seo`). Old
 * page: /features/seo.
 *
 * The scene and the GraphQL snippet show one record: the event "Jazz on
 * the pier at sunset" of Harbourfest, with its SEO field filled
 * (src/scenes/Seo/story.ts).
 */

// Part 1 of the chapter: the header. New copy.
export const chapter: ChapterHeaderData = {
  label: 'SEO',
  headline: 'SEO is content.',
  muted: 'Editors write it.',
  intro:
    'One field holds the title, description and share image, with a preview of the result. Your code gets the meta tags ready to render.',
  link: {
    label: 'Read The Docs',
    href: '/docs/content-modelling/seo-fields',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// The query of the event and its meta tags, then the favicon tags of the
// site: _seoMetaTags and faviconMetaTags are the focus
export const query: CodeTab = {
  label: 'GraphQL',
  lang: 'graphql',
  focus: [
    [5, 9],
    [12, 16],
  ],
  code: `query {
  event(
    filter: { slug: { eq: "${EVENT.slug}" } }
  ) {
    _seoMetaTags {
      tag
      attributes
      content
    }
  }
  _site {
    faviconMetaTags {
      tag
      attributes
      content
    }
  }
}`,
};

// The response: the title with the suffix of the site, then the meta tags,
// eight lines each. The contents are the focus. The box cuts it at the
// bottom edge, after the Open Graph tags, thus the favicon tags of the site
// do not show.
const metaTag = (attribute: string, name: string, content: string) => `      {
        "tag": "meta",
        "attributes": {
          "${attribute}": "${name}",
          "content": "${content}"
        },
        "content": null
      },`;

export const response: CodeTab = {
  label: 'Response',
  lang: 'json',
  focus: [7, 13, 21, 29],
  code: `{
  "event": {
    "_seoMetaTags": [
      {
        "tag": "title",
        "attributes": null,
        "content": "${SEO.title}${SITE.titleSuffix}"
      },
${metaTag('name', 'description', SEO.description)}
${metaTag('property', 'og:title', SEO.title)}
${metaTag('property', 'og:image', SHARE_IMAGE_URL)}
    ]
  },
  "_site": {
    "faviconMetaTags": [
      {
        "tag": "link",
        "attributes": {
          "rel": "icon",
          "type": "image/png",
          "sizes": "32x32",
          "href": "${FAVICON_URL}"
        },
        "content": null
      }
    ]
  }
}`,
};

// Part 3: two fragments, one for the editor and one for the developer. The
// scene already shows the Google preview, and the validations are a detail.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Every link card, before sharing.',
      text: 'The same field previews the link card on social networks and chat apps, image included, so the first share looks right.',
    },
    {
      title: 'Tags, ready to render.',
      text: 'Your query asks for _seoMetaTags and faviconMetaTags, and gets the title, the description, the Open Graph tags and the favicons, ready for the head of the page.',
    },
  ],
};
