import type { CodeTab } from '~/data/home';

/*
 * The code that the four pages of /cms/[slug] share (`src/data/cms.ts`):
 * the response of the query of the first chapter, and the query of the
 * field Sections. The story is Tidewater, a coastal journal
 * (tidewater.press).
 */

// Chapter 1: the response of the query of the frame. It is the same on the
// four pages: the API does not know the framework.
export const responseTab: CodeTab = {
  label: 'response.json',
  lang: 'json',
  code: `{
  "post": {
    "title": "Low tide at Harwick",
    "standfirst": "A walk out to the sands, with the ferry timetable in a pocket.",
    "cover": {
      "responsiveImage": {
        "src": "https://www.datocms-assets.com/…/harwick.jpg?w=1200&auto=format",
        "srcSet": "…?w=400 400w, …?w=800 800w, …?w=1200 1200w",
        "alt": "The sands at low tide, the ferry pier behind",
        "base64": "data:image/jpeg;base64,/9j/4AAQ…"
      }
    }
  }
}`,
};

// Chapter 3: the query of the field Sections, the second tab of the
// fragment of the switch on __typename.
export const sectionsQueryTab: CodeTab = {
  label: 'Query',
  lang: 'graphql',
  focus: [[3, 4]],
  code: `query Landing($slug: String!) {
  landingPage(filter: { slug: { eq: $slug } }) {
    sections {
      __typename
      ... on HeroSectionRecord { id title lede }
      ... on FeatureGridRecord { id title features { title text } }
      ... on QuoteSectionRecord { id quote author }
    }
  }
}`,
};
