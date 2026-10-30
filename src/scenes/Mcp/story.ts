/*
 * The fake data of the frame of the MCP chapter of /ai (Chat.astro): a
 * neutral chat where the assistant, connected to the MCP server of
 * DatoCMS, finds the pages of Marram with no SEO description. The story
 * of the page is Marram (src/scenes/AGENTS.md, "The stories").
 */

export const DESCRIPTION =
  'The window of a chat app with an AI assistant. The question: “Which pages of the Marram project on DatoCMS still miss an SEO description?” The assistant calls four tools of the DatoCMS MCP server, the last one a read-only script, and answers: 8 pages have no description, each a link to its record: Panniers, Handlebar bags, Repairs, Stockists, About, Journal, Warranty, Careers.';

/**
 * The steps of the sequence and their time on screen, in ms
 * (`data-scene-steps`, see src/lib/motion/sceneSequence.ts). Rest: the
 * question. Tools: the tool rows come one by one. Answer: the answer
 * streams in, line by line. Without the sequence the scene is the still:
 * all of it.
 */
export const STEPS = 'rest:1600 tools:2400 answer:5600';

export const QUESTION =
  'Which pages of the Marram project on DatoCMS still miss an SEO description?';

/**
 * The window of the chat app around the transcript, as the desktop apps
 * of the assistants lay it out: the list of the chats at the left, the
 * title of the chat above, the box to write in below. No client is named:
 * the app stays neutral. The other chats are tasks of Marram that the
 * chapter shows, or could show.
 */
export const APP = {
  newChat: 'New chat',
  recents: 'Recents',
  chats: [
    { title: 'SEO descriptions on Marram', current: true },
    { title: 'A guide for the rolltop pannier' },
    { title: 'Alt text for the lookbook' },
    { title: 'Translate the Careers page' },
    { title: 'Fields of the Journal model' },
  ],
  title: 'SEO descriptions on Marram',
  composer: 'Reply…',
  server: 'DatoCMS',
};

/**
 * The tools the assistant calls, in the order the docs give
 * (/docs/mcp-server, "Layered tools, not raw endpoints"): it finds the
 * project, reads the schema, gets the methods it will call (a script
 * must cite the verification token of each), then runs a script against
 * a read-only client. The chat shows the summary of each call; the name
 * is the tool of the server.
 */
export const TOOLS = [
  { name: 'search_projects', summary: 'Find the project Marram' },
  { name: 'get_schema', summary: 'Read the schema of Pages' },
  { name: 'get_api_methods', summary: 'Look up the method items.list' },
  { name: 'upsert_and_execute_safe_script', summary: 'Run a read-only script' },
];

export const ANSWER = {
  lead: '8 pages have no description:',
  pages: [
    'Panniers',
    'Handlebar bags',
    'Repairs',
    'Stockists',
    'About',
    'Journal',
    'Warranty',
    'Careers',
  ],
  // The first fragment of the chapter is the next turn: the plan and the
  // confirmation before the write.
  offer: 'Want me to write them from the first paragraph of each page?',
};

/**
 * The next turn of the chat, for the first fragment: the person said yes
 * to the offer. The schema is read in the frame; the assistant gets the
 * method it will write with (a script cites its verification token), says
 * its plan, and the app asks before the read-write script runs
 * (/docs/mcp-server, "Execution layer (read-write)"). The ask is the card
 * of a tool permission, as the chat apps show it: the server, the tool,
 * the start of the script, and the choices.
 */
export const CONFIRM = {
  description:
    'The next turn of the chat: the assistant gets the API method items.update and says “I’ll fill the SEO description of the 8 pages from their first paragraph.” The app asks “Run this script?” for the tool upsert_and_execute_unsafe_script of DatoCMS, with the start of the script. The button Allow once is highlighted, next to Always allow and Deny.',
  tool: { name: 'get_api_methods', summary: 'Look up the method items.update' },
  plan: 'I’ll fill the SEO description of the 8 pages from their first paragraph.',
  server: 'DatoCMS',
  script: 'upsert_and_execute_unsafe_script',
  question: 'Run this script?',
  code: [
    'for (const page of pages) {',
    '  const seo = { description: summary(page) };',
    '  await client.items.update(page.id, { seo });',
    '}',
  ],
  allowOnce: 'Allow once',
  allowAlways: 'Always allow',
  deny: 'Deny',
};

/**
 * The thread of the home page (Thread.astro): the chat of the frame and
 * its next turn, in a narrow column for a portrait box. The person asks,
 * the assistant lists the pages with no description, the person says yes
 * to its offer, and the app asks before the read-write script runs (the
 * card of CONFIRM). The answer gives four pages and the count of the
 * others, thus the thread fits in the box.
 */
export const THREAD = {
  description:
    'A chat with an assistant connected to DatoCMS. The person asks which pages of the Marram project still miss an SEO description. The assistant runs a read-only script and answers that 8 pages have none, among them Panniers, Handlebar bags, Repairs and Stockists, and offers to write them. The person answers “Yes, from the first paragraph.” The assistant gets the API method items.update, and the app asks “Run this script?” for the tool upsert_and_execute_unsafe_script of DatoCMS, with the start of the script. The button Allow once is highlighted, next to Always allow and Deny.',
  tool: TOOLS[3]!,
  pages: ANSWER.pages.slice(0, 4),
  more: `and ${ANSWER.pages.length - 4} more`,
  offer: 'Want me to write them?',
  reply: 'Yes, from the first paragraph.',
};
