import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import type { ChapterLayoutData } from '~/components/ChapterLayout';
import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { StatementsSectionData } from '~/components/StatementsSection';
import type { StatementData } from '~/data/case-studies';
import type { CtaBannerData, HeroData } from '~/data/home';
import type { CategoryNavData } from '~/data/features';

/*
 * Route /ai: the AI pillar (src/data/AGENTS.md). Four chapters: Ask your
 * project, Build with an agent, Translate, Tags and captions. The docs
 * for machines are a fragment of Ask your project. The opinion sits
 * between Build with an agent and Translate.
 *
 * Every chapter is a ChapterLayout: its real copy, and a box with
 * the description of each picture until its scene exists. The copy is a
 * draft, for Ronak's pass. A "(check)" comment marks a
 * fact to verify before the copy is final. The "DatoCMS Agent" exists
 * today as the official plugin "Dato Agent (Beta)" in the marketplace; it
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
  headline: 'Your AI. Your way.',
  subheadline: 'We’ll make him/her/it feel right at home in the CMS, the CLI, or via MCP',
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
    { label: 'AI in the media area', href: '#media' },
    { label: 'Opt-in', href: '#opt-in' },
  ],
};

// Chapter 1: the MCP server.
export const mcp: ChapterLayoutData = {
  id: 'mcp',
  theme: 'blue',
  chapter: {
    label: 'DatoCMS MCP Server',
    headline: 'Your assistant knows',
    muted: 'your DatoCMS project',
    intro:
      'Connect our hosted DatoCMS MCP server in Claude, ChatGPT, Cursor, or Codex. It reads your schema, and our docs, and does what you ask for correctly on the first go.',
    link: docs('/docs/mcp-server'),
  },
  // The chat is a neutral one: no client's interface is drawn as real.
  // The chat is alone: the cms would not be beside it, the tool rows show
  // where the answer comes from.
  scene:
    'A neutral chat: “Which pages of the Marram project on DatoCMS still miss an SEO description?”, four tool rows of the MCP server, and the answer lists eight.',
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
      title: 'It learns before it does.',
      text: 'The MCP can do anything you can. But it always looks at your schema and our docs before writing any scripts.',
      picture:
        'The next turn of the chat: get_api_methods for items.update, the plan in a sentence for the eight pages, then the script and the question Run this script?, Allow highlighted.',
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
      title: 'Hallucinate? We don’t do that here.',
      text: 'Throw `/docs/llms-full.txt` at your LLM for up-to-date details on everything, so it never makes sh:bleep:t up.',
      picture:
        'llms-full.txt open, 3.8 MB, its Markdown at the section Automatic Retries of Webhooks, the lines of the retry schedule marked.',
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
    headline: 'Teaching your agent DatoCMS',
    muted: 'means one `$ npx`',
    intro:
      'Skills are DatoCMS playbooks your coding agent loads whenever the task needs them: modeling, queries, migrations, frontends, and plugins. They drive our CLI accurately, in Claude Code, Codex and Cursor.',
    link: docs('/docs/agent-skills'),
  },
  // The CLI is in the frame: the commands the agent runs are the same ones
  // you would type. The terminal is a neutral one. One task from start to
  // end: the schema, a migration on a fork, a script for the content, a
  // check with an API call.
  scene:
    'A neutral terminal: the install line, then the agent reads the schema, writes and runs a migration for the field Weight on a sandbox, fills it from a CSV with a script, and checks it with an API call; the migration and the script open beside it.',
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
  text: 'DatoCMS doesn’t come with any :sparkle:shiny hype‑y:sparkle: AI features enabled out of the box unless you enable them. We’d rather be the boring part of your AI stack that works just right. More on that below.',
};

// Chapter 3: the translations.
// /features/headless-cms-multi-language stays with Editing.
export const translations: ChapterLayoutData = {
  id: 'translations',
  theme: 'orange',
  chapter: {
    label: 'AI translations',
    headline: 'Translate a field, a whole model,',
    muted: 'or everything.',
    // The plugin page: DeepL, OpenAI, Google Gemini, Anthropic Claude or
    // Yandex Translate.
    intro:
      'The AI Translations plugin brings OpenAI, Gemini, Claude, or DeepL, straight into the record. Edit each record individually, or go at it in bulk. Editors always review before hitting Publish.',
    link: {
      label: 'See The Plugin',
      href: '/marketplace/plugins/i/datocms-plugin-ai-translations',
      appearance: 'deep-on-white',
      variant: 'soft',
    },
  },
  scene:
    'Rolltop pannier 20 L on the Italian tab, the panel AI Translations in the aside: one click on Translate all fields, nine jobs (Name, Slug and Body to Italian, German and French), the Italian fields fill one by one, the banner asks to review and save.',
  // The frame shows the whole record in one run, the sidebar panel of the
  // plugin: it says the headline, thus no fragments follow.
  fragments: [],
};

// Chapter 4: the AI of the media library.
// Built: src/scenes/MediaAi/ (the frame, fragments 1 and 2). The frame is
// in the grammar of the diagrams (src/scenes/diagram/).
export const media: ChapterLayoutData = {
  id: 'media',
  theme: 'green',
  chapter: {
    label: 'AI in the media area',
    headline: 'Automated image tagging.',
    muted: 'And video captions.',
    // (check) captions in more than one language.
    intro:
      'Images get suggested tags generated upon upload, so the library is searchable without the chore of manual tagging. Videos get captions in multiple languages that you can download, correct if needed, and upload again.',
    link: docs('/docs/asset-api/videos'),
  },
  scene:
    'Two rows. A photo of Marram goes in, a line goes through DatoCMS, and its tags come out; a video goes in, and its subtitles come out line by line.',
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
      text: 'The suggested tags sit beside yours, and the filters of the library take both.',
      picture:
        'The asset Loaded tourer on the Stelvio: the smart tags bicycle, mountain, road in Asset info, and the manual tags stelvio, tour-2026 that the editor typed, in Categorization.',
    },
    {
      title: 'Captions from the audio.',
      text: 'Choose the language, and the captions appear as a track of the video.',
      picture:
        'The dialog Generate subtitles from audio of the video Fitting a rolltop pannier, alone, on English.',
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
  headline: 'Bring your AI,',
  muted: 'we’ll take care of the rest.',
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
      text: 'Nothing with AI runs in your project until you turn it on and permit it to.',
    },
    // (check) the AI plugins run on the customer's own key.
    {
      title: 'Your keys.',
      text: 'Translations and captions run on your chosen provider with your own keys.',
    },
    {
      title: 'Your permissions.',
      text: 'An assistant gets the same permissions as the user. Nothing more. Maybe less.',
    },
    // (check) with legal, and the terms of each provider.
    {
      title: 'Your content.',
      text: 'We don’t share your content to train models on it, and nor do our tools.',
    },
  ],
};
