import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const archiveUrl =
  /^https:\/\/raw\.githubusercontent\.com\/datocms\/agent-skills\/([a-f0-9]{40})\/zips\/(datocms(?:-[a-z0-9]+)*)\.zip$/;

export async function checkAgentSkills(index, fetchArchive = fetch) {
  if (!Array.isArray(index.skills) || index.skills.length === 0) {
    throw new Error('The skill index must contain at least one archive.');
  }
  const names = new Set();
  let revision;
  for (const entry of index.skills) {
    const match = typeof entry.url === 'string' && entry.url.match(archiveUrl);
    if (!match || entry.type !== 'archive' || match[2] !== entry.name) {
      throw new Error(`Invalid or unpinned archive URL for ${entry.name}.`);
    }
    if (names.has(entry.name)) throw new Error(`Duplicate skill: ${entry.name}.`);
    names.add(entry.name);
    if (revision && revision !== match[1]) {
      throw new Error('All skill archives must use the same immutable revision.');
    }
    revision = match[1];
    if (!/^sha256:[a-f0-9]{64}$/.test(entry.digest || '')) {
      throw new Error(`Invalid digest for ${entry.name}.`);
    }
    const response = await fetchArchive(entry.url, {
      signal: AbortSignal.timeout(30_000),
    });
    if (!response.ok) {
      throw new Error(`Cannot fetch ${entry.name}: HTTP ${response.status}.`);
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    const digest = `sha256:${createHash('sha256').update(bytes).digest('hex')}`;
    if (digest !== entry.digest) {
      throw new Error(`Archive digest mismatch for ${entry.name}.`);
    }
  }
  return { count: names.size, revision };
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
