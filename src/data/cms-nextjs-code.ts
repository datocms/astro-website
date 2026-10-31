import { responseTab, sectionsQueryTab } from '~/data/cms-code';
import type { CodeTab } from '~/data/home';
import { dast, renderers } from '~/data/structured-content';

/*
 * The code of the pictures of /cms/nextjs-cms (`src/data/cms-nextjs.ts`).
 * The story is Tidewater, a coastal journal (tidewater.press): posts with a
 * cover, a standfirst, a body and a video, and landing pages made of
 * sections. Next.js 16 and the App Router. The names of the helpers are
 * the ones of datocms/nextjs-starter-kit and of
 * datocms/nextjs-with-cache-tags-starter.
 */

// Chapter 1, the frame: the page file and the response, side by side.
export const pageTab: CodeTab = {
  label: 'app/posts/[slug]/page.tsx',
  lang: 'tsx',
  code: `import { executeQuery } from '@datocms/cda-client';

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

export default async function Page({ params }) {
  const { slug } = await params;
  const { post } = await executeQuery(POST_QUERY, {
    token: process.env.DATOCMS_TOKEN,
    variables: { slug },
  });

  return <Post {...post} />;
}`,
};

export const fetchCode: CodeTab[] = [pageTab, responseTab];

// Chapter 1, fragment 1: the helper that all the pages call.
export const clientCode: CodeTab[] = [
  {
    label: 'lib/datocms.ts',
    lang: 'ts',
    focus: [[5, 9]],
    code: `import { executeQuery as cdaExecuteQuery } from '@datocms/cda-client';

export function executeQuery(query, options = {}) {
  return cdaExecuteQuery(query, {
    ...options,
    token: process.env.DATOCMS_TOKEN,
    environment: process.env.DATOCMS_ENVIRONMENT,
    // Records that fail a validation stay out of the response
    excludeInvalid: true,
  });
}`,
  },
];

// Chapter 2, fragment 1: the image.
export const imageCode: CodeTab[] = [
  {
    label: 'components/Cover.tsx',
    lang: 'tsx',
    code: `import { SRCImage } from 'react-datocms';

export function Cover({ cover }) {
  // A Server Component: one <picture>, no JS, native lazy loading
  return <SRCImage data={cover.responsiveImage} />;
}`,
  },
];

// Chapter 2, fragment 2: the video. The player is a Client Component.
export const videoCode: CodeTab[] = [
  {
    label: 'components/Film.tsx',
    lang: 'tsx',
    code: `import { VideoPlayer } from 'react-datocms/video-player';

// The query: video { video { muxPlaybackId title width height blurUpThumb } }
export function Film({ video }) {
  return <VideoPlayer data={video.video} />;
}`,
  },
];

// Chapter 3, fragment 1: the switch on __typename, and the query of the
// field Sections.
export const sectionsCode: CodeTab[] = [
  {
    label: 'components/Sections.tsx',
    lang: 'tsx',
    code: `const components = {
  HeroSectionRecord: Hero,
  FeatureGridRecord: FeatureGrid,
  QuoteSectionRecord: PullQuote,
};

export function Sections({ sections }) {
  return sections.map((section) => {
    const Section = components[section.__typename];
    return <Section key={section.id} {...section} />;
  });
}`,
  },
  sectionsQueryTab,
];

// Chapter 3, fragment 2: the renderer of the Structured content chapter
// of /editor-experience, and the DAST that it renders.
export const bodyCode: CodeTab[] = [{ ...renderers[0]!, label: 'components/GuideBody.tsx' }, dast];

// Chapter 4, fragment 1: the route that turns draft mode on. The Web
// Previews plugin calls it with the token and the path of the record.
export const draftCode: CodeTab[] = [
  {
    label: 'app/api/draft-mode/enable/route.ts',
    lang: 'ts',
    focus: [
      [9, 10],
      [14, 19],
    ],
    code: `import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
  const { searchParams } = request.nextUrl;
  if (searchParams.get('token') !== process.env.SECRET_API_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }
  const draft = await draftMode();
  draft.enable();
  redirect(searchParams.get('redirect') || '/');
}

// In the page: includeDrafts follows the cookie
const { isEnabled } = await draftMode();
const { post } = await executeQuery(POST_QUERY, {
  variables: { slug },
  includeDrafts: isEnabled,
});`,
  },
];

// Chapter 4, fragment 2: Content Link. The layout renders it in draft mode
// only; a Client Component gives it the router of Next.js.
export const contentLinkCode: CodeTab[] = [
  {
    label: 'app/layout.tsx',
    lang: 'tsx',
    focus: [5, 9, [16, 21]],
    code: `import { draftMode } from 'next/headers';
import { ContentLink } from '@/components/ContentLink';

export default async function RootLayout({ children }) {
  const { isEnabled } = await draftMode();
  return (
    <html>
      <body>
        {isEnabled && <ContentLink />}
        {children}
      </body>
    </html>
  );
}

// In the request: the two options of Content Link
executeQuery(POST_QUERY, {
  includeDrafts: isEnabled,
  contentLink: isEnabled ? 'v1' : undefined,
  baseEditingUrl: 'https://tidewater.admin.datocms.com',
});`,
  },
  {
    label: 'components/ContentLink.tsx',
    lang: 'tsx',
    code: `'use client';

import { ContentLink as DatoCMSContentLink } from 'react-datocms/content-link';
import { usePathname, useRouter } from 'next/navigation';

export function ContentLink() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <DatoCMSContentLink
      onNavigateTo={(path) => router.push(path)}
      currentPath={pathname}
      enableClickToEdit={{ hoverOnly: true }}
    />
  );
}`,
  },
];

// Chapter 5: the card of the frame. Five lines of 39 characters at most;
// the first range of `focus` is the subscription.
export const liveCode: CodeTab = {
  label: 'LiveBlog.tsx',
  lang: 'tsx',
  focus: [[1, 4]],
  code: `const { data } = useQuerySubscription({
  query: LIVE_BLOG_QUERY,
  token,
});
return <Blog posts={data?.posts} />;`,
};

// Chapter 6, fragment 1: the helper of datocms/nextjs-with-cache-tags-starter.
// Next.js accepts at most 128 tags on a fetch, and a query of DatoCMS can
// give more: thus the fetch gets one tag, the id of the query, and a table
// (query_cache_tags) keeps the cache tags of DatoCMS beside it.
export const tagsCode: CodeTab[] = [
  {
    label: 'lib/datocms.ts',
    lang: 'ts',
    focus: [9, [11, 12], [14, 16]],
    code: `import { rawExecuteQuery } from '@datocms/cda-client';
import { storeQueryCacheTags } from '@/lib/cache-tags';

export async function executeQuery(query, options = {}) {
  const queryId = hash([query, options.variables]);
  const [data, response] = await rawExecuteQuery(query, {
    token: process.env.DATOCMS_TOKEN,
    excludeInvalid: true,
    returnCacheTags: true,
    variables: options.variables,
    // Next.js caches the fetch under one tag: the id of the query
    requestInitOptions: { cache: 'force-cache', next: { tags: [queryId] } },
  });
  // The records the response used, as cache tags of DatoCMS
  const cacheTags = response.headers.get('x-cache-tags')?.split(' ') ?? [];
  await storeQueryCacheTags(queryId, cacheTags);
  return data;
}`,
  },
];

// Chapter 6, fragment 2: the route of the invalidation webhook.
export const webhookCode: CodeTab[] = [
  {
    label: 'app/api/invalidate-cache-tags/route.ts',
    lang: 'ts',
    focus: [[10, 15]],
    code: `import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { deleteQueries, queriesReferencingCacheTags } from '@/lib/cache-tags';

export async function POST(request) {
  if (request.headers.get('Webhook-Token') !== process.env.WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await request.json();
  // The tags of the records that changed
  const cacheTags = data.entity.attributes.tags;
  // The queries whose response used one of these tags
  const queryIds = await queriesReferencingCacheTags(cacheTags);
  await deleteQueries(queryIds);
  for (const queryId of queryIds) revalidateTag(queryId, { expire: 0 });
  return NextResponse.json({ cacheTags, queryIds });
}`,
  },
];
