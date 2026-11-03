#!/usr/bin/env node
// Uploads UI fonts to the `datocms-ui-fonts` bucket, then deploys the Worker.
//
//     node upload.mjs geist-mono                    # the subsets from npm
//     node upload.mjs ~/Downloads/ABCOracleVariable.woff2
//     node upload.mjs ~/Downloads/ABCOracle-Regular.otf ~/Downloads/ABCOracle-Medium.otf
//     node upload.mjs geist-mono --dry-run          # shows the uploads only
//
// A local file keeps its name as the key, thus the name must be in `FILES`
// (`src/files.js`). The Worker deploy sends a new `FILES` list too.
//
// www.datocms.com caches each file for one day. The file names have no
// version, thus a new file gets to the plugins in one day at the latest.

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { FILES, GEIST_MONO, geistMonoKey } from './src/files.js';

// The same name as `bucket_name` in `wrangler.jsonc`
const BUCKET = 'datocms-ui-fonts';

const workerDir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sources = args.filter((arg) => arg !== '--dry-run');

if (sources.length === 0) {
  console.error('Usage: node upload.mjs <geist-mono | path/to/file.woff2>... [--dry-run]');
  process.exit(1);
}

const run = (file, commandArgs, cwd = workerDir) => {
  console.log(`$ ${file} ${commandArgs.join(' ')}`);
  if (!dryRun) {
    execFileSync(file, commandArgs, { cwd, stdio: 'inherit' });
  }
};

const tempDirs = [];

// Returns the files of the Geist Mono subsets in the npm package.
function geistMonoUploads() {
  const dir = mkdtempSync(path.join(tmpdir(), 'ui-fonts-'));
  tempDirs.push(dir);
  const spec = `${GEIST_MONO.package}@${GEIST_MONO.version}`;
  const tarball = execFileSync('npm', ['pack', spec, '--pack-destination', dir, '--silent'], {
    encoding: 'utf8',
  }).trim();
  execFileSync('tar', ['xzf', path.join(dir, tarball), '-C', dir]);

  return GEIST_MONO.subsets.map((subset) => ({
    key: geistMonoKey(subset),
    file: path.join(dir, 'package', 'files', `geist-mono-${subset}-wght-normal.woff2`),
  }));
}

function localUpload(file) {
  const key = path.basename(file);
  if (!FILES.has(key)) {
    throw new Error(`${key} is not in FILES (src/files.js): the Worker would not serve it`);
  }
  return { key, file: path.resolve(file) };
}

// The content type and the first four bytes of each file format
const FORMATS = {
  '.woff2': { contentType: 'font/woff2', signature: 'wOF2' },
  '.ttf': { contentType: 'font/ttf', signature: '\0\x01\0\0' },
  '.otf': { contentType: 'font/otf', signature: 'OTTO' },
};

function formatOf(key) {
  const format = FORMATS[path.extname(key)];
  if (!format) {
    throw new Error(`${key} has no known format (${Object.keys(FORMATS).join(', ')})`);
  }
  return format;
}

function assertSignature({ key, file }) {
  const signature = readFileSync(file).subarray(0, 4).toString('latin1');
  if (signature !== formatOf(key).signature) {
    throw new Error(`${file} is not a ${path.extname(key)} file, thus it cannot go to ${key}`);
  }
}

try {
  const uploads = sources.flatMap((source) =>
    source === 'geist-mono' ? geistMonoUploads() : [localUpload(source)],
  );

  uploads.forEach(assertSignature);

  for (const { key, file } of uploads) {
    run('npx', [
      'wrangler',
      'r2',
      'object',
      'put',
      `${BUCKET}/${key}`,
      '--file',
      file,
      '--content-type',
      formatOf(key).contentType,
      '--remote',
    ]);
  }

  run('npx', ['wrangler', 'deploy']);

  console.log(
    `\n${dryRun ? 'Would upload' : 'Uploaded'}: ${uploads.map(({ key }) => key).join(', ')}`,
  );
  console.log('Check one with: curl -I https://www.datocms.com/fonts/<key>');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  for (const dir of tempDirs) {
    rmSync(dir, { recursive: true, force: true });
  }
}
