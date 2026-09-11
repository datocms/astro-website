import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { test } from 'vitest';
import { checkAgentSkills } from './check-agent-skills.mjs';

const revision = '86c533b74c2913e590797eb0b2622d2cdfe5cf68';
const bytes = Buffer.from('fixture archive bytes');
function entry(name = 'datocms-cma') {
  return {
    name,
    type: 'archive',
    url: `https://raw.githubusercontent.com/datocms/agent-skills/${revision}/zips/${name}.zip`,
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

test('rejects empty and duplicate catalogs', async () => {
  await assert.rejects(checkAgentSkills({ skills: [] }, ok), /at least one/);
  await assert.rejects(checkAgentSkills({ skills: [entry(), entry()] }, ok), /Duplicate/);
});

test('rejects mismatched archive names and mixed revisions', async () => {
  const mismatched = { ...entry(), name: 'datocms-cli' };
  await assert.rejects(checkAgentSkills({ skills: [mismatched] }, ok), /Invalid/);
  const another = entry('datocms-cli');
  another.url = another.url.replace(revision, 'a'.repeat(40));
  await assert.rejects(checkAgentSkills({ skills: [entry(), another] }, ok), /same immutable/);
});
