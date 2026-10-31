import { responseTab, sectionsQueryTab } from '~/data/cms-code';
import type { CodeTab } from '~/data/home';
import { dast, renderers } from '~/data/structured-content';

/*
 * The code of the pictures of /cms/nuxtjs-cms (`src/data/cms-nuxt.ts`).
 * The story is Tidewater, a coastal journal (tidewater.press). Nuxt 4. The
 * names of the composables, of the routes and of the cookie are the ones
 * of datocms/nuxt-starter-kit; the snippets are shorter than its files.
 */

// Chapter 1, the frame: the page file and the response, side by side.
export const pageTab: CodeTab = {
  label: 'pages/posts/[slug].vue',
  lang: 'vue',
  code: `<script setup>
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

const route = useRoute();
const data = await useQuery(POST_QUERY, {
  variables: { slug: route.params.slug },
});
</script>

<template>
  <Post v-bind="data?.post" />
</template>`,
};

export const fetchCode: CodeTab[] = [pageTab, responseTab];

// Chapter 1, fragment 1: the composable that all the pages call. In draft
// mode the starter also subscribes to the query: chapter 5.
export const clientCode: CodeTab[] = [
  {
    label: 'composables/useQuery.ts',
    lang: 'ts',
    focus: [[12, 18]],
    code: `import { buildRequestInit } from '@datocms/cda-client';

export async function useQuery(query, { variables } = {}) {
  const config = useRuntimeConfig();
  const draftMode = useDraftMode();
  // A token that reads drafts in draft mode, a published one otherwise
  const token = draftMode
    ? draftMode.datocmsDraftContentCdaToken
    : config.public.datocmsPublishedContentCdaToken;

  const { data } = await useFetch('https://graphql.datocms.com/', {
    ...buildRequestInit(query, {
      token,
      variables,
      includeDrafts: Boolean(draftMode),
      // Records that fail a validation stay out of the response
      excludeInvalid: true,
    }),
    key: hash([query, variables]),
    transform: (response) => {
      if (response.errors) throw new Error(JSON.stringify(response.errors));
      return response.data;
    },
  });

  return data;
}`,
  },
];

// Chapter 2, fragment 1: the image.
export const imageCode: CodeTab[] = [
  {
    label: 'components/Cover.vue',
    lang: 'vue',
    code: `<script setup>
import { Image as DatocmsImage } from 'vue-datocms';

defineProps(['cover']);
</script>

<template>
  <DatocmsImage :data="cover.responsiveImage" />
</template>`,
  },
];

// Chapter 2, fragment 2: the video.
export const videoCode: CodeTab[] = [
  {
    label: 'components/Film.vue',
    lang: 'vue',
    code: `<script setup>
import { VideoPlayer } from 'vue-datocms';

// The query: video { video { muxPlaybackId title width height blurUpThumb } }
defineProps(['video']);
</script>

<template>
  <VideoPlayer :data="video.video" />
</template>`,
  },
];

// Chapter 3, fragment 1: the switch on __typename, and the query of the
// field Sections.
export const sectionsCode: CodeTab[] = [
  {
    label: 'components/Sections.vue',
    lang: 'vue',
    code: `<script setup>
defineProps(['sections']);

const components = {
  HeroSectionRecord: Hero,
  FeatureGridRecord: FeatureGrid,
  QuoteSectionRecord: PullQuote,
};
</script>

<template>
  <component
    v-for="section in sections"
    :key="section.id"
    :is="components[section.__typename]"
    v-bind="section"
  />
</template>`,
  },
  sectionsQueryTab,
];

// Chapter 3, fragment 2: the renderer of the Structured content chapter
// of /editor-experience, and the DAST that it renders.
export const bodyCode: CodeTab[] = [{ ...renderers[1]!, label: 'components/Body.vue' }, dast];

// Chapter 4, fragment 1: the route that turns draft mode on. The Web
// Previews plugin calls it with the token and the path of the record. The
// cookie (__draftMode by default) holds a signed JWT; useDraftMode()
// reads it.
export const draftCode: CodeTab[] = [
  {
    label: 'server/api/draft-mode/enable.ts',
    lang: 'ts',
    focus: [
      [9, 10],
      [14, 20],
    ],
    code: `import { enableDraftMode } from '~~/lib/api/draftMode';

export default eventHandler(async (event) => {
  const config = useRuntimeConfig();
  const query = getQuery(event);
  if (query.token !== config.secretApiToken) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }
  // Sets the signed cookie of draft mode
  enableDraftMode(event);
  await sendRedirect(event, query.redirect || '/');
});

// In useQuery: includeDrafts follows the cookie
const draftMode = useDraftMode();
buildRequestInit(query, {
  token,
  variables,
  includeDrafts: Boolean(draftMode),
});`,
  },
];

// Chapter 4, fragment 2: Content Link. app.vue renders it in draft mode
// only; a wrapper gives it the router of Nuxt.
export const contentLinkCode: CodeTab[] = [
  {
    label: 'app.vue',
    lang: 'vue',
    focus: [[6, 8]],
    code: `<script setup>
const draftMode = useDraftMode();
</script>

<template>
  <ClientOnly>
    <ContentLink v-if="draftMode" />
  </ClientOnly>
  <NuxtPage />
</template>`,
  },
  {
    label: 'components/ContentLink.vue',
    lang: 'vue',
    code: `<script setup>
import { ContentLink as DatocmsContentLink } from 'vue-datocms';

const router = useRouter();
const route = useRoute();
</script>

<template>
  <DatocmsContentLink
    :on-navigate-to="(path) => router.push(path)"
    :current-path="route.path"
    :enable-click-to-edit="{ hoverOnly: true }"
  />
</template>`,
  },
  {
    label: 'composables/useQuery.ts',
    lang: 'ts',
    focus: [[6, 7]],
    code: `// In the request: the two options of Content Link
buildRequestInit(query, {
  token,
  variables,
  includeDrafts: Boolean(draftMode),
  contentLink: draftMode ? 'v1' : undefined,
  baseEditingUrl: draftMode ? config.public.datocmsBaseEditingUrl : undefined,
});`,
  },
];

// Chapter 5: the card of the frame. Five lines of 42 characters at most;
// the first range of `focus` is the subscription. useQuerySubscription of
// vue-datocms returns { data, status, error }, each a ref: `data` is
// { posts }, and v-bind gives it to the blog.
export const liveCode: CodeTab = {
  label: 'LiveBlog.vue',
  lang: 'vue',
  focus: [[2, 3]],
  code: `<script setup>
const { data } = useQuerySubscription({
  query: LIVE_BLOG_QUERY, token });
</script>
<template><Blog v-bind="data" /></template>`,
};
