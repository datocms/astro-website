import { responseTab, sectionsQueryTab } from '~/data/cms-code';
import type { CodeTab } from '~/data/home';
import { dast, renderers } from '~/data/structured-content';

/*
 * The code of the pictures of /cms/svelte-cms (`src/data/cms-sveltekit.ts`).
 * The story is Tidewater, a coastal journal (tidewater.press). SvelteKit 2
 * and Svelte 5 with runes. The names of the helpers and of the routes are
 * the ones of datocms/sveltekit-starter-kit; the snippets are shorter than
 * its files.
 */

// Chapter 1, the frame: the load function and the response, side by side.
export const pageTab: CodeTab = {
  label: 'src/routes/posts/[slug]/+page.server.ts',
  lang: 'ts',
  code: `import { executeQuery } from '$lib/datocms';

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

export const load = ({ params }) =>
  executeQuery(POST_QUERY, {
    variables: { slug: params.slug },
  });`,
};

export const fetchCode: CodeTab[] = [pageTab, responseTab];

// Chapter 1, fragment 1: the helper that all the load functions call.
export const clientCode: CodeTab[] = [
  {
    label: 'src/lib/datocms.ts',
    lang: 'ts',
    focus: [[6, 9]],
    code: `import { env } from '$env/dynamic/private';
import { executeQuery as cdaExecuteQuery } from '@datocms/cda-client';

export const executeQuery = (query, options = {}) =>
  cdaExecuteQuery(query, {
    ...options,
    token: env.DATOCMS_CDA_TOKEN,
    // Records that fail a validation stay out of the response
    excludeInvalid: true,
  });`,
  },
];

// Chapter 2, fragment 1: the image.
export const imageCode: CodeTab[] = [
  {
    label: 'src/lib/Cover.svelte',
    lang: 'svelte',
    code: `<script>
  import { Image } from '@datocms/svelte';

  let { cover } = $props();
</script>

<Image data={cover.responsiveImage} />`,
  },
];

// Chapter 2, fragment 2: the video.
export const videoCode: CodeTab[] = [
  {
    label: 'src/lib/Film.svelte',
    lang: 'svelte',
    code: `<script>
  import { VideoPlayer } from '@datocms/svelte';

  // The query: video { video { muxPlaybackId title width height blurUpThumb } }
  let { video } = $props();
</script>

<VideoPlayer data={video.video} />`,
  },
];

// Chapter 3, fragment 1: the switch on __typename, and the query of the
// field Sections.
export const sectionsCode: CodeTab[] = [
  {
    label: 'src/lib/Sections.svelte',
    lang: 'svelte',
    code: `<script>
  let { sections } = $props();

  const components = {
    HeroSectionRecord: Hero,
    FeatureGridRecord: FeatureGrid,
    QuoteSectionRecord: PullQuote,
  };
</script>

{#each sections as section (section.id)}
  {@const Section = components[section.__typename]}
  <Section {...section} />
{/each}`,
  },
  sectionsQueryTab,
];

// Chapter 3, fragment 2: the renderer of the Structured content chapter
// of /editor-experience, and the DAST that it renders.
export const bodyCode: CodeTab[] = [{ ...renderers[2]!, label: 'src/lib/Body.svelte' }, dast];

// Chapter 4, fragment 1: the route that turns draft mode on. The Web
// Previews plugin calls it with the token and the path of the record. The
// cookie holds a signed JWT; isDraftModeEnabled(event) reads it.
export const draftCode: CodeTab[] = [
  {
    label: 'src/routes/api/draft-mode/enable/+server.ts',
    lang: 'ts',
    focus: [
      [10, 11],
      [14, 22],
    ],
    code: `import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { enableDraftMode } from '$lib/draftMode.server';

export const GET = (event) => {
  const { searchParams } = event.url;
  if (searchParams.get('token') !== env.PRIVATE_SECRET_API_TOKEN) {
    return new Response('Invalid token', { status: 401 });
  }
  enableDraftMode(event);
  redirect(307, searchParams.get('redirect') || '/');
};

// In +page.server.ts: includeDrafts follows the cookie
export const load = async (event) => {
  const draftModeEnabled = isDraftModeEnabled(event);
  const { post } = await executeQuery(POST_QUERY, {
    variables: { slug: event.params.slug },
    includeDrafts: draftModeEnabled,
  });
  return { post, draftModeEnabled };
};`,
  },
];

// Chapter 4, fragment 2: Content Link. The layout renders it in draft mode
// only, with the router of SvelteKit.
export const contentLinkCode: CodeTab[] = [
  {
    label: 'src/routes/+layout.svelte',
    lang: 'svelte',
    focus: [[9, 15]],
    code: `<script>
  import { ContentLink } from '@datocms/svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let { data, children } = $props();
</script>

{#if data.draftModeEnabled}
  <ContentLink
    onNavigateTo={(path) => goto(path)}
    currentPath={$page.url.pathname}
    enableClickToEdit={{ hoverOnly: true }}
  />
{/if}
{@render children()}`,
  },
  {
    label: 'src/lib/datocms/queries.ts',
    lang: 'ts',
    focus: [[5, 6]],
    code: `// In generateRealtimeSubscription: the two options of Content Link
executeQuery(query, {
  includeDrafts: draftModeEnabled,
  excludeInvalid: true,
  contentLink: draftModeEnabled ? 'v1' : undefined,
  baseEditingUrl: 'https://tidewater.admin.datocms.com',
});`,
  },
];

// Chapter 5: the card of the frame. Five lines of 39 characters at most;
// the first range of `focus` is the subscription. querySubscription of
// @datocms/svelte is a store, and its value is { data, status, error }.
export const liveCode: CodeTab = {
  label: 'LiveBlog.svelte',
  lang: 'svelte',
  focus: [[2, 3]],
  code: `<script>
  const live = querySubscription({
    query: LIVE_BLOG_QUERY, token });
</script>
<Blog posts={$live.data?.posts} />`,
};
