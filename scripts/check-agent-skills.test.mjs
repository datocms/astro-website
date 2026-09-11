import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { test } from 'vitest';
import { checkAgentSkills } from './check-agent-skills.mjs';

const revision = 'cf3d1bd2af63c95d657fa80f7c242827c689db7f';
const bytes = Buffer.from('fixture archive bytes');
function entry() {
  return {
    name: 'datocms',
    type: 'archive',
    url: `https://raw.githubusercontent.com/datocms/agent-skills/${revision}/zips/datocms.zip`,
    digest: `sha256:${createHash('sha256').update(bytes).digest('hex')}`,
  };
}
const ok = async () => new Response(bytes);

test('checks the digest of the bytes fetched from the pinned URL', async () => {
  const archive = entry();
  const seen = [];
  const result = await checkAgentSkills({ skills: [archive] }, async (url) => {
    seen.push(url);
    return new Response(bytes);
  });
  assert.deepEqual(seen, [archive.url]);
  assert.deepEqual(result, { count: 1, revision });
});

test('rejects mutable URLs before requesting an archive', async () => {
  const archive = entry();
  archive.url = archive.url.replace(revision, 'master');
  await assert.rejects(
    checkAgentSkills({ skills: [archive] }, () => {
      assert.fail('must validate the URL before fetching');
    }),
    /unpinned/,
  );
});

test('rejects a mismatched digest', async () => {
  await assert.rejects(
    checkAgentSkills({ skills: [entry()] }, async () => new Response('different archive bytes')),
    /digest mismatch/,
  );
});

test('rejects failed downloads', async () => {
  await assert.rejects(
    checkAgentSkills({ skills: [entry()] }, async () => new Response('', { status: 404 })),
    /HTTP 404/,
  );
});

test('rejects empty, duplicate, and legacy catalogs', async () => {
  for (const skills of [[], [entry(), entry()], [{ ...entry(), name: 'datocms-cma' }]]) {
    await assert.rejects(checkAgentSkills({ skills }, ok), /only the datocms skill/);
  }
});

test('rejects old archive names and malformed digests', async () => {
  const legacy = {
    ...entry(),
    url: entry().url.replace('zips/datocms.zip', 'zips/datocms-cma.zip'),
  };
  await assert.rejects(checkAgentSkills({ skills: [legacy] }, ok), /Invalid/);
  await assert.rejects(
    checkAgentSkills({ skills: [{ ...entry(), digest: 'sha256:bad' }] }, ok),
    /Invalid digest/,
  );
});

test('the checked-in catalog contains one pinned unified archive', async () => {
  const index = JSON.parse(
    await readFile(
      new URL('../src/documents/well-known/agent-skills/index.json', import.meta.url),
      'utf8',
    ),
  );
  assert.deepEqual(
    index.skills.map(({ name }) => name),
    ['datocms'],
  );
  assert.match(index.skills[0].url, /\/[a-f0-9]{40}\/zips\/datocms\.zip$/);
  assert.match(index.skills[0].digest, /^sha256:[a-f0-9]{64}$/);
});
