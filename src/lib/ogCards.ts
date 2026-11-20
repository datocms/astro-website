import type { OgCardData } from './ogCardUrl';

/*
 * The data of the OG card of each kind of page (`/og-card/index.png`). A
 * page gives the fields of its record, and the function gives the card. The
 * page `/dev/og-gallery` shows the cards of the records of the CMS with the
 * same functions.
 *
 * The URLs of the images come from the query of the page, with these imgix
 * parameters:
 * - a logo: `{ fm: png, w: 720, h: 320, fit: max }`;
 * - a screenshot in a window: `{ w: 900, h: 600, fit: crop, crop: top, fm: jpg }`;
 * - the cover of a plugin: `{ w: 960, h: 640, fit: crop, fm: jpg }`.
 */

/** A plugin shows its installs from this number. A smaller number does not help the plugin. */
const MIN_INSTALLS = 100;

const number = (value: number) => value.toLocaleString('en-US');

/** The length of a video, as `m:ss`. */
function duration(seconds: number): string {
  const s = Math.round(seconds);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}

export function pluginCard(plugin: {
  title: string;
  description?: string | null;
  coverUrl?: string | null;
  installs: number;
  version: string;
  author: { name: string; official: boolean };
}): OgCardData {
  const author = `by ${plugin.author.name}`;
  const version = `v${plugin.version}`;
  const installs = plugin.installs >= MIN_INSTALLS;
  return {
    kicker: 'Plugin',
    title: plugin.title,
    excerpt: plugin.description,
    theme: 'blue',
    wordmark: true,
    ...(plugin.coverUrl
      ? {
          pills: plugin.author.official ? ['Official'] : [],
          picture: {
            kind: 'cover',
            imageUrl: plugin.coverUrl,
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

export function starterCard(starter: {
  name: string;
  technology?: string | null;
  screenshotUrl: string;
}): OgCardData {
  return {
    kicker: 'Starter',
    title: starter.name,
    pills: starter.technology ? [starter.technology] : [],
    theme: 'blue',
    picture: { kind: 'window', imageUrl: starter.screenshotUrl },
  };
}

export function caseStudyCard(story: {
  name: string;
  title: string;
  logoPngUrl: string;
  /** The first number of the story, with its label. */
  number?: { number: string; label?: string | null } | null;
}): OgCardData {
  return {
    kicker: `Case study: ${story.name}`,
    title: story.title,
    logoPngUrl: story.logoPngUrl,
    theme: 'orange',
    picture: story.number
      ? { kind: 'stat', value: story.number.number, label: story.number.label ?? '' }
      : null,
  };
}

export function showcaseCard(project: {
  name: string;
  headline: string;
  partner: string;
  imageUrl: string;
}): OgCardData {
  return {
    kicker: `Showcase: ${project.partner}`,
    title: project.name,
    excerpt: project.headline,
    theme: 'pink',
    picture: { kind: 'window', imageUrl: project.imageUrl },
  };
}

export function partnerCard(partner: {
  kicker: string;
  name: string;
  description: string;
  logoPngUrl: string;
  /** The number of projects in the showcase: a technology partner has none. */
  projects?: number;
}): OgCardData {
  const projects = partner.projects ?? 0;
  return {
    kicker: partner.kicker,
    title: partner.name,
    excerpt: partner.description,
    // No chip for a partner with no projects in the showcase.
    pills: projects > 0 ? [`${projects} showcased project${projects === 1 ? '' : 's'}`] : [],
    logoPngUrl: partner.logoPngUrl,
    theme: 'pink',
  };
}

export function productUpdateCard(entry: {
  title: string;
  categories: string[];
  publishedAt: string;
}): OgCardData {
  return {
    kicker: 'Product update',
    title: entry.title,
    pills: entry.categories,
    theme: 'green',
    picture: { kind: 'date', iso: entry.publishedAt },
  };
}

export function compareCard(comparison: { headline: string; product: string }): OgCardData {
  return {
    kicker: 'Compare',
    title: comparison.headline,
    excerpt: `Here’s what you should know when comparing it to ${comparison.product}.`,
    theme: 'blue',
    picture: { kind: 'versus', other: comparison.product },
  };
}

export function academyCard(chapter: { title: string; course: string }): OgCardData {
  return {
    kicker: `Academy: ${chapter.course}`,
    title: chapter.title,
    theme: 'orange',
    wordmark: true,
  };
}

export function userGuideCard(episode: {
  title: string;
  chapter: string;
  /** The length of the video, in seconds. */
  duration?: number | null;
}): OgCardData {
  return {
    kicker: `User guides: ${episode.chapter}`,
    title: episode.title,
    theme: 'orange',
    picture: {
      kind: 'video',
      duration: episode.duration ? duration(episode.duration) : undefined,
    },
  };
}
