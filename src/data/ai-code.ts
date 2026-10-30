import type { CodeTab } from '~/data/home';

/*
 * The code snippets of the /ai pillar (`src/data/ai-pillar.ts`), checked
 * against the docs, fetched on 2026-10-25.
 */

// LLM-ready docs, fragment "Add .md to any URL." The request, with `.md` as
// the strong token, and the first lines of the answer. The lines are the
// real start of https://www.datocms.com/docs/content-delivery-api.md,
// re-wrapped to fit the box. The brief says the heading is
// "# Content Delivery API"; the real page says "# Content Delivery API
// Overview", so the snippet follows the page.
export const markdownTab: CodeTab = {
  label: 'Terminal',
  lang: 'shell',
  focus: [[1, 2]],
  code: `$ curl \\
    https://www.datocms.com/docs/content-delivery-api.md

# Content Delivery API Overview

This section offers a detailed reference to
DatoCMS's Content Delivery API.

The Content Delivery API is used to retrieve content
from one of your DatoCMS projects and deliver it to
your web or mobile projects.`,
};
