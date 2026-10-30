import { dashboardUrl } from '~/lib/datocms/dashboardUrl';
import chatgptLogo from '~/assets/ai/chatgpt.svg?raw';
import claudeLogo from '~/assets/ai/claude.svg?raw';
import deepseekLogo from '~/assets/ai/deepseek.svg?raw';
import geminiLogo from '~/assets/ai/gemini.svg?raw';
import grokLogo from '~/assets/ai/grok.svg?raw';
import qwenLogo from '~/assets/ai/qwen.svg?raw';
import type { DocsPreviewData } from '~/data/developers';
import type { HighlightsData } from '~/data/editor-experience-figma';
import type { ButtonData, CtaBannerData, HeroData, QuestionAnswerData } from '~/data/home';
import { questionAnswer as homeQuestionAnswer, svgLogo } from '~/data/home';

export interface Language {
  name: string;
  flag: string;
  selected?: boolean;
}

export interface LanguageGridData {
  languages: Language[];
}

/** A headline with a body line and a button, next to a visual. */
export interface FeatureIntro {
  title: string;
  tagline: string;
  button: ButtonData;
}

const learnMore = (href: string): ButtonData => ({
  label: 'Learn More',
  href,
  appearance: 'deep-on-white',
  variant: 'soft',
});

export const hero: HeroData = {
  label: 'AI Integration',
  headline: 'Bring Your Own AI.',
  subheadline:
    "Claude Code, Codex, Gemini, or whatever else you like, we're friendly with them all",
  face: '[•ᴥ•]',
  buttons: [
    {
      label: 'Get Started',
      href: dashboardUrl('/signup'),
      appearance: 'deep-on-white',
      arrow: false,
    },
    { label: 'Explore Pricing', href: '/pricing', appearance: 'deep-on-white', variant: 'soft' },
  ],
  logos: [
    svgLogo(chatgptLogo, 'ChatGPT'),
    svgLogo(claudeLogo, 'Claude'),
    svgLogo(geminiLogo, 'Gemini'),
    svgLogo(deepseekLogo, 'DeepSeek'),
    svgLogo(grokLogo, 'Grok'),
    svgLogo(qwenLogo, 'Qwen'),
  ],
};

export const questionAnswer: QuestionAnswerData = {
  ...homeQuestionAnswer,
  headline: 'Choose your path.',
};

export const highlights: HighlightsData = {
  items: [
    { title: 'BYO-AI.', text: "Keep using the tools you're used to." },
    { title: "You're in charge.", text: 'No AI or all the AI you want. Up to you, really.' },
    { title: 'The long game.', text: 'Whatever AI looks like next, we’re ready for it.' },
  ],
};

export const philosophy: CtaBannerData = {
  variant: 'light',
  theme: 'purple',
  headline: 'AI will keep changing.\nOur philosophy won’t.',
  muted: 'Bring your AI and keep building.',
  buttons: [{ label: 'MCP', href: '/docs/mcp', appearance: 'deep-on-light', arrow: false }],
};

export const agent: FeatureIntro = {
  title: 'Content operations on autopilot.',
  tagline:
    'The DatoCMS Agent plugs into our MCP to take care of all the boring (or not) manual work from inside the CMS itself.',
  button: learnMore('/docs/agent'),
};

export const llmDocs: FeatureIntro = {
  title: 'LLM-ready Docs.',
  tagline:
    'LLM friendly docs for your agent to consume a single markdown file and never hallucinate again.',
  button: learnMore('/docs'),
};

export const llmDocsPreview: DocsPreviewData = {
  items: [
    { title: 'Agent Skills' },
    {
      title: 'MCP Server',
      tag: 'New',
      description: 'One connection. Every AI assistant can read and update your content.',
      button: {
        label: 'Copy For Agent',
        href: '/docs/mcp',
        appearance: 'deep-on-white',
        arrow: false,
      },
    },
    { title: 'Webhooks' },
    { title: 'SSO & Security' },
  ],
};

export const translate: FeatureIntro = {
  title: 'Translate Your Way.',
  tagline:
    'Connect OpenAI, Claude, Gemini or DeepL to DatoCMS and translate your content without changing the way you work.',
  button: learnMore('/docs/ai-translations'),
};

const language = (name: string, code: string, selected = false): Language => ({
  name,
  flag: `/images/ai/flags/${code}.svg`,
  selected,
});

export const languages: LanguageGridData = {
  languages: [
    language('Italian', 'it', true),
    language('French', 'fr'),
    language('Spanish', 'es'),
    language('German', 'de', true),
    language('Japanese', 'jp'),
    language('Arabic', 'ar'),
    language('Mandarin', 'cn', true),
    language('Portuguese', 'pt'),
    language('Korean', 'kr'),
    language('Hindi', 'in', true),
  ],
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
