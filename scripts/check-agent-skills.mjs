import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const archiveUrl =
  /^https:\/\/raw\.githubusercontent\.com\/datocms\/agent-skills\/([a-f0-9]{40})\/zips\/datocms\.zip$/;

export async function checkAgentSkills(index, fetchArchive = fetch) {
  if (
    !Array.isArray(index.skills) ||
    index.skills.length !== 1 ||
    index.skills[0]?.name !== 'datocms'
  ) {
    throw new Error('The discovery index must advertise only the datocms skill.');
  }
  const entry = index.skills[0];
  const match = typeof entry.url === 'string' && entry.url.match(archiveUrl);
  if (!match || entry.type !== 'archive') {
    throw new Error('Invalid or unpinned datocms archive URL.');
  }
  if (!/^sha256:[a-f0-9]{64}$/.test(entry.digest || '')) {
    throw new Error('Invalid digest for datocms.');
  }
  const response = await fetchArchive(entry.url, { signal: AbortSignal.timeout(30_000) });
  if (!response.ok) throw new Error(`Cannot fetch datocms: HTTP ${response.status}.`);
  const bytes = Buffer.from(await response.arrayBuffer());
  const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
  if (digest !== entry.digest) throw new Error('Archive digest mismatch for datocms.');
  return { count: 1, revision: match[1] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const index = JSON.parse(
      await readFile(
        new URL('../src/documents/well-known/agent-skills/index.json', import.meta.url),
        'utf8',
      ),
    );
    const { count, revision } = await checkAgentSkills(index);
    console.log(`Verified ${count} skill archive(s) at ${revision}.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
