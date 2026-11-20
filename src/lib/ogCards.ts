import { stripStega } from '@datocms/astro';
import { render as toPlainText } from 'datocms-structured-text-to-plain-text';
import { buildGroupsFromHeadings } from '~/components/docs/ContentPlusToc/utils';
import { pixelCover, postTheme } from '~/components/PixelCover';
import { type FragmentOf, readFragment } from '~/lib/datocms/graphql';
import * as docPage from '~/layouts/docs/PageLayout/_graphql';
import * as academyChapterPage from '~/pages/academy/[courseSlug]/[chapterSlug]/_graphql';
import * as chatPage from '~/pages/blog/casual-chats/[slug]/_graphql';
import * as postPage from '~/pages/blog/[slug]/_graphql';
import * as caseStudyPage from '~/pages/case-studies/[slug]/_graphql';
import * as frameworkPage from '~/pages/cms/[slug]/_graphql';
import * as comparePage from '~/pages/compare/[slug]/_graphql';
import * as partnerPage from '~/pages/partners/[partnerSlug]/_graphql';
import * as showcasePage from '~/pages/partners/[partnerSlug]/showcase/[projectSlug]/_graphql';
import * as pluginPage from '~/pages/plugins/i/[...rest]/_graphql';
import * as productUpdatePage from '~/pages/product-updates/[slug]/_graphql';
import * as starterPage from '~/pages/starters/[slug]/_graphql';
import * as techPartnerPage from '~/pages/tech-partners/[slug]/_graphql';
import * as userGuidePage from '~/pages/user-guides/[chapterSlug]/[episodeSlug]/_graphql';
import type { AstroGlobal } from 'astro';
import { fetchDepartments } from '~/components/ContactCard';
import { joinWithAnd, shortNames } from './shortNames';
import type { OgCardData, OgProductScene } from './ogCardUrl';
import { type Theme, themeFromSlug } from './theme';

/*
 * The data of the OG card (`/og-card/index.png`) of each kind of page. Each
 * function takes the fragment of its record. The fragment is in the
 * `_graphql.ts` of the page, next to its query, with the same name in each
 * file: `OgCardFragment`, as the query is `query`. The query of the page and the query of
 * `/dev/og-gallery` spread it. The name of the fragment in GraphQL is
 * different in each file (`PluginOgCardFragment`): the gallery spreads all
 * of them in one query, and GraphQL refuses two fragments with one name. The
 * fragments ask imgix for the files that the card needs:
 * - a logo: a PNG of up to 720 × 320;
 * - a screenshot in a window: 960 × 777, the shape of the window (640 × 518
 *   on the card). imgix keeps its top left corner: the edge of the card cuts
 *   it at the right.
 * - the cover of a plugin: 960 × 640 (3:2), with its top left corner;
 * - the pixel cover of a post: the file (100 × 58), as a PNG;
 * - a portrait of a guest of a chat: 640 × 640.
 *
 * Some text of a card is not in the record: the name of the parent (the
 * chapter of a user guide, the group of a docs page), or the copy of
 * `src/data`. The page gives it as an argument.
 */

/** A plugin shows its installs from this number. A smaller number does not help the plugin. */
const MIN_INSTALLS = 100;

const number = (value: number) => value.toLocaleString('en-US');

/** The length of a video, as `m:ss`. */
function duration(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

/** The headings of a Structured Text document: its table of contents. */
const headingsOf = (value: unknown) =>
  buildGroupsFromHeadings(value)
    .flatMap((toc) => toc.entries)
    .map((entry) => entry.label);

/** The plain text of a Structured Text field. */
const plain = (field: { value: unknown } | null | undefined) =>
  field ? (toPlainText(field.value as Parameters<typeof toPlainText>[0]) ?? '') : '';

export function pluginCard(fragment: FragmentOf<typeof pluginPage.OgCardFragment>): OgCardData {
  const plugin = readFragment(pluginPage.OgCardFragment, fragment);
  const author = `by ${plugin.author.name}`;
  const version = `v${plugin.version}`;
  const installs = plugin.installs >= MIN_INSTALLS;
  return {
    kicker: 'Plugin',
    title: plugin.title,
    excerpt: plugin.description,
    theme: 'blue',
    wordmark: true,
    ...(plugin.coverImage
      ? {
          pills: plugin.author.official ? ['Official'] : [],
          picture: {
            kind: 'cover',
            imageUrl: plugin.coverImage.url,
            stat: installs ? { value: number(plugin.installs), label: 'installs' } : undefined,
            author,
            version,
          },
        }
      : {
          // No cover: the facts are chips under the title.
          pills: [...(plugin.author.official ? ['Official'] : [author]), version],
        }),
  };
}

export function starterCard(fragment: FragmentOf<typeof starterPage.OgCardFragment>): OgCardData {
  const starter = readFragment(starterPage.OgCardFragment, fragment);
  return {
    kicker: 'Starter',
    title: starter.name,
    pills: starter.technology ? [starter.technology.name] : [],
    // The logo of the framework (an SVG) takes the place of the chip of its name.
    techLogoUrl: starter.technology?.logo.url,
    theme: 'blue',
    wordmark: true,
    picture: { kind: 'window', imageUrl: starter.screenshot.url },
  };
}

export function caseStudyCard(
  fragment: FragmentOf<typeof caseStudyPage.OgCardFragment>,
): OgCardData {
  const story = readFragment(caseStudyPage.OgCardFragment, fragment);
  // The proof is the first number of the story.
  const first = story.numbers[0];
  return {
    kicker: `Case study: ${story.name}`,
    title: plain(story.title),
    logoPngUrl: story.logo.pngUrl,
    theme: 'orange',
    picture: first ? { kind: 'stat', value: first.number, label: first.label ?? '' } : null,
  };
}

export function showcaseCard(fragment: FragmentOf<typeof showcasePage.OgCardFragment>): OgCardData {
  const project = readFragment(showcasePage.OgCardFragment, fragment);
  return {
    kicker: `Showcase: ${project.partner.name}`,
    title: project.name,
    excerpt: plain(project.headline),
    theme: 'pink',
    picture: { kind: 'window', imageUrl: project.mainImage.url, half: true },
  };
}

function partnerData(
  kicker: string,
  partner: { name: string; shortDescription: { value: unknown }; logo: { pngUrl: string } },
  projects: number,
): OgCardData {
  return {
    kicker,
    title: partner.name,
    excerpt: plain(partner.shortDescription),
    // No chip for a partner with no projects in the showcase.
    pills: projects > 0 ? [`${projects} showcased project${projects === 1 ? '' : 's'}`] : [],
    logoPngUrl: partner.logo.pngUrl,
    theme: 'pink',
  };
}

/** The card of a partner. The kicker is the copy of `src/data/partners`. */
export function partnerCard(
  fragment: FragmentOf<typeof partnerPage.OgCardFragment>,
  kicker: string,
): OgCardData {
  const partner = readFragment(partnerPage.OgCardFragment, fragment);
  return partnerData(kicker, partner, partner.showcaseMeta.count);
}

/** The card of a technology partner: it has no projects in the showcase. */
export function techPartnerCard(
  fragment: FragmentOf<typeof techPartnerPage.OgCardFragment>,
  kicker: string,
): OgCardData {
  return partnerData(kicker, readFragment(techPartnerPage.OgCardFragment, fragment), 0);
}

export function productUpdateCard(
  fragment: FragmentOf<typeof productUpdatePage.OgCardFragment>,
): OgCardData {
  const entry = readFragment(productUpdatePage.OgCardFragment, fragment);
  return {
    kicker: 'Product update',
    title: entry.title,
    pills: entry.categories.map((category) => category.name),
    theme: 'green',
    picture: entry._firstPublishedAt ? { kind: 'date', iso: entry._firstPublishedAt } : null,
  };
}

/** The card of a comparison. The headline is the copy of `src/data/compare`. */
export function compareCard(
  fragment: FragmentOf<typeof comparePage.OgCardFragment>,
  headline: string,
): OgCardData {
  const comparison = readFragment(comparePage.OgCardFragment, fragment);
  return {
    kicker: 'Compare',
    title: headline,
    theme: 'blue',
    picture: { kind: 'versus', other: comparison.product },
  };
}

export function academyCard(
  fragment: FragmentOf<typeof academyChapterPage.OgCardFragment>,
): OgCardData {
  const chapter = readFragment(academyChapterPage.OgCardFragment, fragment);
  const headings = headingsOf(chapter.content.value);
  return {
    // Next to the wordmark: "DatoCMS Academy". The course name does not fit the row.
    kicker: 'Academy',
    title: chapter.title,
    theme: 'orange',
    wordmark: true,
    // The proof is the table of contents of the lesson, as on a docs page.
    picture: headings.length > 0 ? { kind: 'contents', entries: headings } : null,
  };
}

export function userGuideCard(
  fragment: FragmentOf<typeof userGuidePage.OgCardFragment>,
  chapter: string,
): OgCardData {
  const episode = readFragment(userGuidePage.OgCardFragment, fragment);
  const { duration: seconds, thumbnailUrl } = episode.video.video;
  // The frame at the width of the box of the card.
  const frame = new URL(thumbnailUrl);
  frame.searchParams.set('width', '1200');
  return {
    kicker: 'User guides',
    title: episode.title,
    theme: 'orange',
    picture: {
      kind: 'video',
      duration: seconds ? duration(seconds) : undefined,
      imageUrl: frame.toString(),
      series: chapter,
    },
  };
}

/**
 * The card of a docs page. The proof half is the table of contents of the
 * page: its headings, or the `headings` of a page with more entries in its
 * table of contents.
 */
export function docsCard(
  fragment: FragmentOf<typeof docPage.OgCardFragment>,
  options: { group?: string | null; headings?: string[] } = {},
): OgCardData {
  const page = readFragment(docPage.OgCardFragment, fragment);
  const headings = options.headings ?? headingsOf(page.content.value);
  return {
    // The theme of the docs says that the page is of the docs: the kicker is
    // the name of the group.
    kicker: options.group ?? 'Docs',
    title: page.title,
    excerpt: page.seo?.description,
    theme: 'docs',
    // The proof is the table of contents. A page with no headings has the
    // full width for its title.
    picture: headings.length > 0 ? { kind: 'contents', entries: headings } : null,
  };
}

/**
 * The card of a framework page (`/cms/<slug>`): the copy is in `src/data`,
 * the logo is the logo of the integration record of the framework.
 */
export function frameworkCard(
  fragment: FragmentOf<typeof frameworkPage.OgCardFragment> | undefined,
  page: {
    /** The title of the page, as "Headless CMS for Next.js". */
    seoTitle: string;
    headline: string;
    subheadline?: string | null;
    theme: Theme;
  },
): OgCardData {
  const integration = fragment ? readFragment(frameworkPage.OgCardFragment, fragment) : undefined;
  return {
    kicker: page.seoTitle,
    title: page.headline,
    excerpt: page.subheadline,
    logoPngUrl: integration?.logo.pngUrl,
    theme: page.theme,
  };
}

/**
 * The card of a blog post: the title, the category as the kicker, and the
 * subject of its pixel cover on the inverse. The theme is the theme of the
 * cover, else the theme from the slug, as on the page.
 */
export function postCard(fragment: FragmentOf<typeof postPage.OgCardFragment>): OgCardData {
  const post = readFragment(postPage.OgCardFragment, fragment);
  const cover = pixelCover(post);
  return {
    kicker: post.category?.name ?? 'Blog',
    title: post.title,
    theme: postTheme(post) ?? themeFromSlug(post.slug),
    picture: cover ? { kind: 'pixel', imageUrl: cover.url } : null,
  };
}

/** The card of a casual chat: the title, and the portraits of its guests on the inverse. */
export function chatCard(fragment: FragmentOf<typeof chatPage.OgCardFragment>): OgCardData {
  const chat = readFragment(chatPage.OgCardFragment, fragment);
  return {
    kicker: 'Casual chat',
    title: chat.title,
    theme: themeFromSlug(chat.slug),
    picture: { kind: 'portraits', imageUrls: chat.people.map((person) => person.portrait.url) },
  };
}

/**
 * The card of a page with a hero and no record of its own (a marketing
 * page, an index): the copy of the hero. The label is the kicker, the
 * subheadline (else the intro) is the muted run after the title. The proof
 * is a screen of the product in the theme of the page: the screen of its
 * pillar, else the editor.
 */
export function heroCard(
  hero: {
    label?: string | null;
    headline: string;
    subheadline?: string | null;
    intro?: string | null;
  },
  theme: Theme,
  scene: OgProductScene = 'editor',
): OgCardData {
  return {
    kicker: hero.label ?? undefined,
    title: hero.headline,
    excerpt: hero.subheadline ?? hero.intro ?? undefined,
    theme,
    picture: { kind: 'product', scene },
  };
}

/**
 * The card of a page that a team answers (contact, support, the programs):
 * the claim of the hero, and as the proof the photos of the people of the
 * departments (their slugs), their names and their team, as the row of
 * `ContactPeople`. The card shows the first three people, and `role`
 * replaces the name of the team. With no photos, the card is `heroCard`.
 */
export async function teamCard(
  Astro: AstroGlobal,
  hero: Parameters<typeof heroCard>[0],
  theme: Theme,
  departments: string[],
  role?: string,
): Promise<OgCardData> {
  const card = heroCard(hero, theme);
  const contact = await fetchDepartments(Astro, departments);
  if (!contact) return card;
  const people = contact.people.slice(0, 3);
  // The URL of the card carries the text: no stega of Content Link.
  const names =
    people.length === 1
      ? stripStega(people[0]!.name)
      : joinWithAnd(shortNames(people.map((person) => stripStega(person.name))));
  return {
    ...card,
    picture: {
      kind: 'team',
      imageUrls: people.map((person) => person.photo),
      names,
      role: stripStega(role ?? (people.length === 1 ? contact.role : contact.team)),
    },
  };
}
