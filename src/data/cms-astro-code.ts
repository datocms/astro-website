import { responseTab, sectionsQueryTab } from '~/data/cms-code';
import type { CodeTab } from '~/data/home';
import { dast, renderers } from '~/data/structured-content';

/*
 * The code of the pictures of /cms/astro-cms (`src/data/cms-astro.ts`).
 * The story is Tidewater, a coastal journal (tidewater.press). The names
 * of the helpers and of the routes are the ones of
 * datocms/astro-starter-kit and of the docs page "Using cache tags"
 * (Astro 7 or later, with output: 'server').
 */

// Chapter 1, the frame: the page file and the response, side by side.
export const pageTab: CodeTab = {
  label: 'src/pages/posts/[slug].astro',
  lang: 'astro',
  code: `---
import { executeQuery } from '~/lib/datocms';

const POST_QUERY = /* GraphQL */ \`
query Post($slug: String!) {
  post(filter: { slug: { eq: $slug } }) {
    title
    standfirst
    cover {
      responsiveImage(imgixParams: { w: 1200, auto: format }) {
        src srcSet alt base64
      }
    }
  }
}
\`;

const { post } = await executeQuery(POST_QUERY, {
  variables: { slug: Astro.params.slug },
});
---

<article>
  <h1>{post.title}</h1>
  <p>{post.standfirst}</p>
</article>`,
};

export const fetchCode: CodeTab[] = [pageTab, responseTab];

// Chapter 1, fragment 1: the helper that all the pages call.
export const clientCode: CodeTab[] = [
  {
    label: 'src/lib/datocms.ts',
    lang: 'ts',
    focus: [[6, 9]],
    code: `import { executeQuery as cdaExecuteQuery } from '@datocms/cda-client';
import { DATOCMS_CDA_TOKEN } from 'astro:env/server';

export const executeQuery = (query, options = {}) =>
  cdaExecuteQuery(query, {
    ...options,
    token: DATOCMS_CDA_TOKEN,
    // Records that fail a validation stay out of the response
    excludeInvalid: true,
  });`,
  },
];

// Chapter 2, fragment 1: the image.
export const imageCode: CodeTab[] = [
  {
    label: 'src/components/Cover.astro',
    lang: 'astro',
    code: `---
import { Image } from '@datocms/astro';

const { cover } = Astro.props;
---

<Image data={cover.responsiveImage} />`,
  },
];

// Chapter 2, fragment 2: the video. @datocms/astro has no video player:
// the page uses the one of react-datocms, as an island, as the starter
// does.
export const videoCode: CodeTab[] = [
  {
    label: 'src/components/Film.astro',
    lang: 'astro',
    focus: [9],
    code: `---
import { VideoPlayer } from 'react-datocms/video-player';

// The query: video { video { muxPlaybackId title width height blurUpThumb } }
const { video } = Astro.props;
---

<!-- One React component, hydrated when it comes into view -->
<VideoPlayer data={video.video} client:visible />`,
  },
];

// Chapter 3, fragment 1: the switch on __typename, and the query of the
// field Sections.
export const sectionsCode: CodeTab[] = [
  {
    label: 'src/components/Sections.astro',
    lang: 'astro',
    code: `---
const { sections } = Astro.props;

const components = {
  HeroSectionRecord: Hero,
  FeatureGridRecord: FeatureGrid,
  QuoteSectionRecord: PullQuote,
};
---

{sections.map((section) => {
  const Section = components[section.__typename];
  return <Section {...section} />;
})}`,
  },
  sectionsQueryTab,
];

// Chapter 3, fragment 2: the renderer of the Structured content chapter
// of /editor-experience, and the DAST that it renders.
export const bodyCode: CodeTab[] = [{ ...renderers[3]!, label: 'src/components/Body.astro' }, dast];

// Chapter 4, fragment 1: the route that turns draft mode on. The Web
// Previews plugin calls it with the token and the path of the record.
export const draftCode: CodeTab[] = [
  {
    label: 'src/pages/api/draft-mode/enable/index.ts',
    lang: 'ts',
    focus: [
      [10, 11],
      [14, 19],
    ],
    code: `import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { enableDraftMode } from '~/lib/draftMode';

export const GET: APIRoute = (context) => {
  const { searchParams } = context.url;
  if (searchParams.get('token') !== SECRET_API_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }
  enableDraftMode(context);
  return context.redirect(searchParams.get('redirect') || '/', 307);
};

// In the page: includeDrafts follows the cookie
const draftModeEnabled = isDraftModeEnabled(Astro.cookies);
const { post } = await executeQuery(POST_QUERY, {
  variables: { slug },
  includeDrafts: draftModeEnabled,
});`,
  },
];

// Chapter 4, fragment 2: Content Link, in the layout, in draft mode only.
export const contentLinkCode: CodeTab[] = [
  {
    label: 'src/layouts/Layout.astro',
    lang: 'astro',
    focus: [5, 10, [15, 20]],
    code: `---
import { ContentLink } from '@datocms/astro/ContentLink';
import { isDraftModeEnabled } from '~/lib/draftMode';

const draftModeEnabled = isDraftModeEnabled(Astro.cookies);
---

<html>
  <body>
    {draftModeEnabled && <ContentLink enableClickToEdit={{ hoverOnly: true }} />}
    <slot />
  </body>
</html>

// In the request: the two options of Content Link
executeQuery(POST_QUERY, {
  includeDrafts: draftModeEnabled,
  contentLink: draftModeEnabled ? 'v1' : undefined,
  baseEditingUrl: 'https://tidewater.admin.datocms.com',
});`,
  },
];

// Chapter 5: the card of the frame. Five lines of 39 characters at most;
// the first range of `focus` is the listener. QueryListener reloads the
// page when the result of the query changes; the page renders it in draft
// mode only.
export const liveCode: CodeTab = {
  label: 'live.astro',
  lang: 'astro',
  focus: [[2, 5]],
  code: `<Blog posts={data.posts} />
<QueryListener
  query={LIVE_BLOG_QUERY}
  token={token}
/>`,
};

// Chapter 6, fragment 1: the helper of the docs page "Using cache tags".
// The pages give it Astro as the context.
export const tagsCode: CodeTab[] = [
  {
    label: 'src/lib/datocms.ts',
    lang: 'ts',
    focus: [9, [12, 17]],
    code: `import { rawExecuteQuery } from '@datocms/cda-client';
import { DATOCMS_CDA_TOKEN } from 'astro:env/server';

const ONE_YEAR = 60 * 60 * 24 * 365;

export async function executeQuery(context, query, variables) {
  const [result, response] = await rawExecuteQuery(query, {
    token: DATOCMS_CDA_TOKEN,
    returnCacheTags: true,
    variables,
  });
  const rawTags = response.headers.get('x-cache-tags');
  const cacheTags = rawTags ? rawTags.split(' ') : [];
  // The page is cached under the tags of every query it ran
  if (cacheTags.length > 0) {
    context.cache.set({ maxAge: ONE_YEAR, tags: cacheTags });
  }
  return result;
}`,
  },
];

// Chapter 6, fragment 2: the route of the invalidation webhook. The
// provider of the cache (cacheCloudflare(), cacheNetlify() or
// cacheVercel()) is set in astro.config.
export const webhookCode: CodeTab[] = [
  {
    label: 'src/pages/api/invalidate-cache.ts',
    lang: 'ts',
    focus: [[8, 11]],
    code: `import { CACHE_INVALIDATION_WEBHOOK_SECRET } from 'astro:env/server';

export const POST = async ({ request, cache }) => {
  const auth = request.headers.get('Authorization');
  if (auth !== \`Bearer \${CACHE_INVALIDATION_WEBHOOK_SECRET}\`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await request.json();
  // The tags of the records that changed
  const tags = body.entity.attributes.tags;
  await cache.invalidate({ tags });
  return Response.json({ invalidated: tags.length });
};`,
  },
];
