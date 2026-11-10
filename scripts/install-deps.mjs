// Runs npm in the root of the repository with FONTAWESOME_PACKAGE_TOKEN in its
// environment. `.npmrc` reads this variable to get the Font Awesome Pro packages.
// npm does not read the .env files, thus this script gives the variable to npm.
//
//     node scripts/install-deps.mjs [npm arguments]    (default: ci)
//
// The script uses only the modules of Node: it runs on a fresh clone, before the
// install. It takes the variable from the environment, else from
// .env.development (run `npm run decrypt-env` first).

import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const VARIABLE = 'FONTAWESOME_PACKAGE_TOKEN';
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envFile = path.join(rootDir, '.env.development');

function readToken() {
  if (process.env[VARIABLE]) return process.env[VARIABLE];
  if (!existsSync(envFile)) return undefined;
  // Read only this variable. The other variables of the file (NODE_ENV) change
  // what npm installs.
  return parseEnv(readFileSync(envFile, 'utf8'))[VARIABLE];
}

const token = readToken();
if (!token) {
  console.error(
    `${VARIABLE} is not in the environment or in .env.development. Run \`npm run decrypt-env\` first.`,
  );
  process.exit(1);
}

const args = process.argv.slice(2);
const result = spawnSync('npm', args.length > 0 ? args : ['ci'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: { ...process.env, [VARIABLE]: token },
});
process.exit(result.status ?? 1);
