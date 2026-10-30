/*
 * The fake data of the fragment "500 pages of docs, one file." of the MCP
 * chapter of /ai (Doc.astro): llms-full.txt, open at the section that
 * answers an edge case of Marram, "did we lose the publish webhooks while
 * the build server was down?". The story of the page is Marram
 * (src/scenes/AGENTS.md, "The stories").
 *
 * The lines of the file are the real ones of
 * https://www.datocms.com/docs/llms-full.txt, with their numbers, on
 * 2026-10-27. The file is rebuilt with every change to the docs: check the
 * numbers, the size and the lines the day the page ships.
 */

export const DESCRIPTION =
  'The file llms-full.txt, 3.8 MB, 86,417 lines: all the docs of DatoCMS in Markdown. It is open at the section Automatic Retries of Webhooks, and the lines of the retry schedule are marked.';

export const FILE = {
  name: 'llms-full.txt',
  size: '3.8 MB',
  lines: '86,417 lines',
};

export interface FileLine {
  n: number;
  text: string;
  marked?: boolean;
}

export const SECTION: FileLine[] = [
  { n: 1385, text: '## Automatic Retries' },
  { n: 1386, text: '' },
  {
    n: 1387,
    text: 'Optionally, you can activate the **Automatic Retry** option in your webhook settings, so that in case of delivery failure, DatoCMS will attempt to resend the request up to 7 times, with increasing intervals between each attempt.',
    marked: true,
  },
  { n: 1388, text: '' },
  { n: 1389, text: '(Video content)' },
  { n: 1390, text: '' },
  {
    n: 1391,
    text: 'Each retry will use the most recent webhook settings, and the retry schedule is as follows:',
    marked: true,
  },
  { n: 1392, text: '' },
  { n: 1393, text: '| Retry | Time |' },
  { n: 1394, text: '| --- | --- |' },
  { n: 1395, text: '| 1 | 2 minutes after the failure |', marked: true },
  { n: 1396, text: '| 2 | 6 minutes after the previous retry |', marked: true },
  { n: 1397, text: '| 3 | 30 minutes after the previous retry |', marked: true },
  { n: 1398, text: '| 4 | 1 hour after the previous retry |', marked: true },
  { n: 1399, text: '| 5 | 5 hours after the previous retry |' },
  { n: 1400, text: '| 6 | 1 day after the previous retry |' },
  { n: 1401, text: '| 7 | 2 days after the previous retry |' },
  { n: 1402, text: '' },
  { n: 1403, text: '## Understanding webhook statuses' },
];
