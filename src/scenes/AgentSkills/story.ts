/*
 * The fake data of the Agent Skills frame of /ai (Terminal.astro). The
 * output lines are the ones of the CLI (datocms 4.2.0).
 */

export const DESCRIPTION =
  'A terminal and a code editor side by side. In the terminal: the skills of DatoCMS installed, then the request “Add a weight field to Products and fill it from weights.csv”. The agent loads the skill datocms-cli, reads the schema of Products with npx datocms schema:inspect, writes a migration with migrations:new, and runs it on a new sandbox environment, add-weight. It loads the skill datocms-cma, writes a script that reads the CSV and runs it with cma:script: 64 products updated. A cma:call finds no product without a weight. At right, the editor shows the migration that creates the field Weight, then the script.';

export const CWD = '~/marram';

/**
 * The install, done before the scene starts. The command is the one of
 * /docs/agent-skills ("Other agents"). (check) the count the day the page
 * ships.
 */
export const INSTALL = {
  command: "npx skills add datocms/agent-skills --skill '*'",
  output: 'Installed 9 skills',
};

export const PROMPT = 'Add a weight field to Products and fill it from weights.csv';

const SANDBOX = 'add-weight';

/**
 * The migration file. The name is the one the CLI gives it: the Unix time,
 * then the name of the script in camel case. 1742290800 is
 * 2025-03-18 09:40 UTC.
 */
const MIGRATION = 'migrations/1742290800_addWeight.ts';

/**
 * The script that fills the field. It is not a migration: it changes
 * content, not the schema. The skill puts such a script in a scratch
 * folder that git ignores, not in `migrations/`.
 */
const SCRIPT = 'tmp/scripts/fillWeights.ts';

/**
 * A line of the terminal:
 * - `say`: the agent tells what it does next, or what it did;
 * - `skill`: the agent loads a skill;
 * - `run`: the agent runs a shell command;
 * - `note`: the agent writes a file (the editor opens it);
 * - `out`: what a command prints.
 * `at` is the step from which the line shows. `delay` is the time from
 * the start of the step to the line, in ms (see `PAUSE`).
 */
export type TerminalLine = {
  kind: 'say' | 'skill' | 'run' | 'note' | 'out';
  text: string;
  at: string;
  delay: number;
};

/**
 * The work of the agent, after the request. Each step starts with a
 * sentence of the agent, thus the eye can follow the story without the
 * commands. The output lines are the ones of the CLI:
 * - `schema:inspect` prints the schema in TOON (one line for each field,
 *   in a table). The terminal of the agent cuts the output after a few
 *   lines, and the header of the table at `…`.
 * - `migrations:new` writes its template (a model Article) with the line
 *   of its spinner. The agent replaces the example with the field.
 * - `migrations:run` with no `--in-place` forks the primary environment
 *   and runs the migration on the fork. The model `schema_migration` is
 *   in the project already: Marram uses migrations.
 * - `cma:script` prints only what the script logs.
 * - `cma:call` prints the JSON of the response: an empty list, no product
 *   without a weight.
 */
const LINES: Omit<TerminalLine, 'delay'>[] = [
  { kind: 'say', text: 'First, I read the schema of Product.', at: 'inspect' },
  { kind: 'skill', text: 'datocms-cli', at: 'inspect' },
  { kind: 'run', text: 'npx datocms schema:inspect product', at: 'inspect' },
  { kind: 'out', text: 'name: Product', at: 'inspect' },
  { kind: 'out', text: 'fields[6]{id,type,label,field_type,api_key,…}:', at: 'inspect' },
  { kind: 'out', text: '… 6 more lines', at: 'inspect' },
  { kind: 'say', text: 'No weight field yet. I add one with a migration.', at: 'migration' },
  { kind: 'run', text: 'npx datocms migrations:new addWeight', at: 'migration' },
  { kind: 'out', text: `Writing "${MIGRATION}"... done`, at: 'migration' },
  { kind: 'note', text: `Edited ${MIGRATION}`, at: 'migration' },
  { kind: 'say', text: `I run it on a sandbox copy of main, "${SANDBOX}".`, at: 'run' },
  { kind: 'run', text: `npx datocms migrations:run --destination=${SANDBOX}`, at: 'run' },
  { kind: 'out', text: `Migrations will be run in "${SANDBOX}" sandbox environment`, at: 'run' },
  {
    kind: 'out',
    text: `Creating a fork of "main" environment called "${SANDBOX}"... done`,
    at: 'run',
  },
  { kind: 'out', text: 'Running migration "1742290800_addWeight.ts"... done', at: 'run' },
  { kind: 'out', text: 'Successfully run 1 migration scripts', at: 'run' },
  { kind: 'say', text: 'Now the content: a script fills the weights from the CSV.', at: 'script' },
  { kind: 'skill', text: 'datocms-cma', at: 'script' },
  { kind: 'note', text: `Wrote ${SCRIPT}`, at: 'script' },
  { kind: 'run', text: `npx datocms cma:script ${SCRIPT} -e ${SANDBOX}`, at: 'script' },
  { kind: 'out', text: 'Updated 64 products', at: 'script' },
  { kind: 'say', text: 'Last, I look for a product with no weight.', at: 'check' },
  {
    kind: 'run',
    text: `npx datocms cma:call items list -e ${SANDBOX} --params '{filter: {type: "product", fields: {weight: {exists: false}}}}'`,
    at: 'check',
  },
  { kind: 'out', text: '[]', at: 'check' },
  {
    kind: 'say',
    text: `Done. All 64 products have a weight, in the sandbox ${SANDBOX}. Promote it to main when you have checked it.`,
    at: 'done',
  },
];

/**
 * The time before a line, in ms, after the line before it in its step:
 * the agent thinks before it acts, and the lines of one output come
 * together. The first line of a step waits `FIRST_MS`; the first output
 * of a command waits `RUN_MS`, the time the command runs.
 */
const PAUSE: Record<TerminalLine['kind'], number> = {
  say: 700,
  skill: 800,
  run: 900,
  note: 1000,
  out: 150,
};
const FIRST_MS = 300;
const RUN_MS = 1000;

/**
 * The time to read a step after its last line, in ms. A step that opens a
 * file has more time: the eye goes to the code too. The last step stays
 * longest, before the loop starts again.
 */
const READ_MS = 2200;
const FILE_READ_MS = 1800;
const DONE_READ_MS = 5000;

export const WORK: TerminalLine[] = LINES.map((line) => ({ ...line, delay: 0 }));
WORK.forEach((line, i) => {
  const before = WORK[i - 1];
  if (!before || before.at !== line.at) line.delay = FIRST_MS;
  else if (line.kind === 'out' && before.kind === 'run') line.delay = before.delay + RUN_MS;
  else line.delay = before.delay + PAUSE[line.kind];
});

/**
 * The steps of the sequence and their time on screen, in ms
 * (`data-scene-steps`, see src/lib/motion/sceneSequence.ts). Rest: the
 * install is done. Prompt: the request types (Terminal.astro). Then a
 * step for each thing the agent does, as long as its lines and the time
 * to read them. Without the sequence the scene is the still: all of it.
 */
export const STEPS = [
  'rest:1600',
  'prompt:3400',
  ...[...new Set(WORK.map((line) => line.at))].map((step) => {
    const lines = WORK.filter((line) => line.at === step);
    const read =
      step === 'done'
        ? DONE_READ_MS
        : lines.some((line) => line.kind === 'note')
          ? READ_MS + FILE_READ_MS
          : READ_MS;
    return `${step}:${lines[lines.length - 1]!.delay + read}`;
  }),
].join(' ');

/**
 * The migration at right: the TypeScript template of `migrations:new`, its
 * import and its signature as the CLI writes them, with the example
 * replaced by the field. The CMA client takes the API key of a model in
 * place of its ID. The field is the one of the story: Weight,
 * Floating-point, on Products, with the settings an editor would set in
 * the field dialog, checked against /docs/content-management-api
 * (resources/field): a hint, a range (`number_range`, the validators of
 * a Float are `required` and `number_range`) and the appearance of the
 * built-in editor `float`, whose one parameter is a placeholder. No
 * `required`: the products that exist have no weight yet.
 */
const MIGRATION_CODE = `import { Client } from 'datocms/lib/cma-client-node';

export default async function(client: Client): Promise<void> {
  await client.fields.create('product', {
    label: 'Weight',
    api_key: 'weight',
    field_type: 'float',
    hint: 'Packed weight, in kg',
    validators: {
      number_range: { min: 0, max: 20 },
    },
    appearance: {
      editor: 'float',
      parameters: { placeholder: '1.2' },
      addons: [],
    },
  });
}`;

/**
 * The script at right: the file mode of `cma:script`, a default export
 * that gets the client, with the same signature as a migration. It reads
 * the CSV (a slug and a weight on each line, under a header), then goes
 * through the products page by page and updates each one with a weight.
 */
const SCRIPT_CODE = `import { readFileSync } from 'node:fs';
import { Client } from 'datocms/lib/cma-client-node';

export default async function(client: Client): Promise<void> {
  const rows = readFileSync('weights.csv', 'utf8').trim().split('\\n');
  const weights = new Map(
    rows.slice(1).map((row) => {
      const [slug, kg] = row.split(',');
      return [slug, Number(kg)];
    }),
  );

  let count = 0;
  for await (const product of client.items.listPagedIterator({
    filter: { type: 'product' },
  })) {
    const weight = weights.get(String(product.slug));
    if (weight === undefined) continue;
    await client.items.update(product.id, { weight });
    count++;
  }
  console.log(\`Updated \${count} products\`);
}`;

/**
 * A file of the editor:
 * - `at`: the step in which the agent writes it; it opens with the
 *   `note` line of that step (`delay`);
 * - `focus`: the lines that the eye lands on (1-based, inclusive);
 * - `scroll`: on phones the editor is under the terminal, near the fade,
 *   thus it is scrolled to this line.
 * The editor shows the last file that is open.
 */
export const FILES = [
  { path: MIGRATION, code: MIGRATION_CODE, at: 'migration', focus: [4, 16], scroll: 6 },
  { path: SCRIPT, code: SCRIPT_CODE, at: 'script', focus: [13, 21], scroll: 13 },
].map((file) => ({
  ...file,
  delay: WORK.find((line) => line.kind === 'note' && line.text.endsWith(file.path))?.delay ?? 0,
}));
