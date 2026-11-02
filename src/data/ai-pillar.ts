import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { StatementData } from '~/components/Statement';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { CategoryNavData } from '~/components/CategoryNav';

/*
 * Route /ai: the AI pillar (src/data/AGENTS.md). Four chapters: Ask your
 * project, Build with an agent, Translate, Tags and captions. The docs
 * for machines are a fragment of Ask your project. The opinion sits
 * between Build with an agent and Translate.
 *
 * Every chapter is a ChapterLayout: its real copy, and a box with
 * the description of each picture that has no scene. A "(check)" comment
 * marks a fact to verify. The "DatoCMS Agent" exists
 * today as the official plugin "Dato Agent (Beta)" on /plugins; it
 * has no chapter until someone decides it is a product to show.
 *
 * The pictures of the page tell one story: Marram, a maker of bike bags
 * that sells in four markets (English, Italian, German, French). Its
 * product "Rolltop pannier 20 L", its pages without an SEO description,
 * its photos of loaded bikes and its how-to videos run through the
 * chapters. The assistants and terminals are neutral and unbranded. The
 * `scene` and `picture` strings describe each picture in one line.
 */

const docs = (href: string): ChapterHeaderData['link'] => ({
  label: 'Read The Docs',
  href,
  appearance: 'deep-on-white',
  variant: 'soft',
});

// New copy. The design of the hero has a row of logos (ChatGPT, Claude, Gemini,
// DeepSeek, Grok, Qwen). (check) DeepSeek, Grok and Qwen are models, not
// MCP clients: the row comes back only with the clients we support (the
// docs list Claude Code, Claude Desktop, ChatGPT, Cursor, Codex, VS Code,
// Windsurf).
export const hero: HeroData = {
  label: 'AI',
  headline: 'Bring your own AI. We’ll make it feel at home.',
  subheadline: 'Use it in the CMS, the CLI, or over MCP. Or don’t. It’s all opt-in',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    {
      label: 'Connect Your AI',
      href: '/docs/mcp-server',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  ],
};

// The chapter nav under the hero: one item for each chapter, in page order.
// The href is the id of the chapter.
export const chapterNav: CategoryNavData = {
  items: [
    { label: 'MCP server', href: '#mcp' },
    { label: 'Agent Skills', href: '#skills' },
    { label: 'AI translations', href: '#translations' },
    { label: 'AI in the media library', href: '#media' },
    { label: 'Opt-in', href: '#opt-in' },
  ],
};

// Chapter 1: the MCP server.
export const mcp: ChapterLayoutData = {
  id: 'mcp',
  theme: 'blue',
  chapter: {
    label: 'MCP server',
    headline: 'Your assistant knows',
    muted: 'your project.',
    intro:
      'Connect our hosted MCP server to Claude, ChatGPT, Cursor, or Codex using one URL and your login. You decide what it gets to touch.',
    link: docs('/docs/mcp-server'),
  },
  // The chat is a neutral one: no client's interface is drawn as real.
  // The chat is alone: the cms would not be beside it, the tool rows show
  // where the answer comes from.
  // One chapter for the MCP server: the chapter "MCP, in depth" is merged
  // in, and the chapter "LLM-ready docs" is its last fragment. Its script
  // and the tasks of the docs are here; the count of tools and the grid of
  // clients are not (the docs list nine tools, the hero and the intro name
  // the clients). The frame reads; the first fragment writes, the second
  // shows the docs it reads. Each picture is in another language: a zoom
  // of the chat, a file.
  fragments: [
    {
      // The docs: discovery and planning first, then a script; the
      // read-write script is confirmed before each run. The next turn of
      // the frame: the plan for its eight pages.
      title: 'It reads before it writes.',
      text: 'It looks at your schema and our docs, writes the changes as one script, and asks you before it runs it.',
    },
    {
      // Old chapter "LLM-ready docs" (/docs/llm-ready-docs). What the file
      // adds to MCP and the skills: every detail of the docs, the edge
      // cases and the reasons. Thus the picture is a section that only the
      // full docs have: the retry schedule of "Webhooks", "Automatic
      // Retries" (checked 2026-10-27). Do not use the block limits of a
      // record: they change soon. The single-page Markdown (the Copy page
      // menu, .md on a URL) is a second idea: not here.
      // :bleep: reads "*" (src/components/Emoji).
      title: 'All our docs, in one file.',
      text: 'Point your LLM at `/docs/llms-full.txt` for the full docs, always kept up to date, so it doesn’t hallucinate and make sh:bleep:t up.',
    },
  ],
};

// Chapter 2: the agent skills.
export const skills: ChapterLayoutData = {
  id: 'skills',
  theme: 'pink',
  chapter: {
    label: 'Agent Skills',
    // The backticks make a code chip (src/components/InlineText).
    headline: 'Make your agent fluent in DatoCMS.',
    muted: 'It’s one `npx` away.',
    intro:
      'Playbooks your coding agent loads when a task needs them: modeling, queries, migrations, frontends, plugins. They drive our CLI in Claude Code, Codex, and Cursor.',
    link: docs('/docs/agent-skills'),
  },
  // The CLI is in the frame: the commands the agent runs are the same ones
  // you would type. The terminal is a neutral one. One task from start to
  // end: the schema, a migration on a fork, a script for the content, a
  // check with an API call.
  fragments: [],
};

// New copy. The one opinion of the page, between chapter 2 and chapter 3.
// The label is the headline of the philosophy banner of the design.
// "The model you choose" holds: the translation plugin takes your key, MCP
// and skills run in the assistant you already pay for.
export const opinion: StatementData = {
  label: 'AI will keep changing. Our philosophy won’t.',
  // The sparkles around "shiny hype-y" are the irony (src/components/Emoji).
  // The hyphen of hype-y is a no-break hyphen (U+2011): the y stays on the line.
  text: 'We don’t switch on any AI features for you. You pick what runs and on which model, and a human gets the final say. We’re happy to be the :sparkle:boring:sparkle: part of your AI stack.',
};

// Chapter 3: the translations.
// /features/headless-cms-multi-language stays with Editing.
export const translations: ChapterLayoutData = {
  id: 'translations',
  theme: 'orange',
  chapter: {
    label: 'AI translations',
    headline: 'Translate a field,',
    muted: 'or the whole model.',
    // The plugin page: DeepL, OpenAI, Google Gemini, Anthropic Claude or
    // Yandex Translate.
    intro:
      'The AI Translations plugin brings OpenAI, Gemini, Claude, or DeepL to one field or a whole model. Nothing goes live until you hit Publish.',
    link: {
      label: 'See The Plugin',
      href: '/plugins/i/datocms-plugin-ai-translations',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  },
  // The frame shows the whole record in one run, the sidebar panel of the
  // plugin: it says the headline, thus no fragments follow.
  fragments: [],
};

// Chapter 4: the AI of the media library.
// The frame is in the grammar of the diagrams (src/scenes/diagram/).
export const media: ChapterLayoutData = {
  id: 'media',
  theme: 'green',
  chapter: {
    label: 'AI in the media library',
    headline: 'Images get tags.',
    muted: 'Videos get captions.',
    intro:
      'Uploads get suggested tags, so the library is searchable without an afternoon of tagging. Videos get captions you can download, correct, and upload again.',
    link: docs('/docs/asset-api/videos'),
  },
  // The frame is the headline as a picture: a photo gives tags, a video
  // gives subtitles. The first fragment shows where the tags are in the
  // cms, the second the dialog that makes the subtitles. The captions of
  // /media#video show the track and its download.
  fragments: [
    {
      // The cms shows the smart tags as a row of Asset info, and the tags of
      // the editor as "Manual tags" in Categorization. The filters of the
      // media area have one for each.
      title: 'Tags we suggest, tags you keep.',
      text: 'We suggest tags. Keep them, change them, and filter the library by them.',
    },
    {
      title: 'Captions from the audio.',
      text: 'Choose the language, and the captions generate as a track for the video.',
    },
  ],
};

// The SEO tags of the page. The page has no CMS record. The title gets the
// suffix of the site.
export const seo = {
  title: 'AI',
  description:
    'Connect your AI assistant with the MCP server, give your coding agent the Agent Skills, translate content with your own provider, and tag images and caption videos. Every AI feature is opt-in.',
};

export const ctaBuild: CtaBannerData = {
  variant: 'light',
  theme: 'blue',
  headline: 'The robots do the busy work.',
  muted: 'You keep the rhythm.',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-light',
      arrow: false,
    },
    { label: 'Book a Demo', href: '/contact', appearance: 'deep-on-light', variant: 'soft' },
  ],
};

// The section after the last chapter: the stance, in one place. Facts come
// from the live page /features/ai and the docs of the MCP
// server.
export const optIn: StatementsSectionData = {
  headline: 'Every AI feature is opt-in.',
  items: [
    {
      title: 'Off by default.',
      text: 'Nothing with AI runs in your project until you turn it on.',
    },
    {
      title: 'Your keys.',
      text: 'Translations and captions run on the provider you choose with your keys.',
    },
    {
      title: 'Your permissions.',
      text: 'An assistant can do what the person who connected it can do. Nothing more. Maybe less.',
    },
    { title: 'Your content.', text: 'We don’t train any AI models on your content.' },
  ],
};
