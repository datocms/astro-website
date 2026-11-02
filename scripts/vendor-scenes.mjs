// Builds @datocms/product-scenes from the web repository and puts it in
// vendor/, with the commit of the kit in its version.
// Usage: npm run vendor-scenes
//
// The kit is at ../../private/web/packages/product-scenes, or at the path in the
// variable KIT_DIR. The version of the tarball is the version of the kit,
// then "local", then the short sha of the kit commit, then "dirty" when the
// kit has changes that are not committed. Thus package.json tells which
// kit the website uses. The script deletes the old tarball, writes the new
// name in package.json and in the lock file, installs it and clears the
// cache of Vite. Restart `astro dev` after it.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const kitDir = path.resolve(
  root,
  process.env.KIT_DIR ?? '../../private/web/packages/product-scenes',
);
const vendorDir = path.join(root, 'vendor');
const NAME = '@datocms/product-scenes';

const run = (file, args, cwd) => execFileSync(file, args, { cwd, stdio: 'inherit' });
const read = (file, args, cwd) => execFileSync(file, args, { cwd, encoding: 'utf8' }).trim();

const sha = read('git', ['rev-parse', '--short', 'HEAD'], kitDir);
const dirty = read('git', ['status', '--porcelain', '--', '.'], kitDir) !== '';
const manifest = JSON.parse(readFileSync(path.join(kitDir, 'package.json'), 'utf8'));
const version = `${manifest.version}-local.${sha}${dirty ? '.dirty' : ''}`;

run('npm', ['run', 'build'], kitDir);

// The same public manifest as bin/publish.mjs of the kit: the build has ui,
// ui-app and their libraries in it, thus the package has only peers.
const publicManifest = {
  name: manifest.name,
  version,
  description: manifest.description,
  license: manifest.license,
  type: manifest.type,
  exports: manifest.exports,
  files: manifest.files,
  sideEffects: manifest.sideEffects,
  peerDependencies: manifest.peerDependencies,
};

const stageDir = mkdtempSync(path.join(tmpdir(), 'product-scenes-'));
cpSync(path.join(kitDir, 'dist'), path.join(stageDir, 'dist'), { recursive: true });
cpSync(path.join(kitDir, 'README.md'), path.join(stageDir, 'README.md'));
writeFileSync(path.join(stageDir, 'package.json'), `${JSON.stringify(publicManifest, null, 2)}\n`);

for (const file of readdirSync(vendorDir)) {
  if (file.startsWith('datocms-product-scenes-')) rmSync(path.join(vendorDir, file));
}
const tarball = read('npm', ['pack', '--silent', '--pack-destination', vendorDir], stageDir);
rmSync(stageDir, { recursive: true });

const packageFile = path.join(root, 'package.json');
const pkg = JSON.parse(readFileSync(packageFile, 'utf8'));
pkg.dependencies[NAME] = `file:vendor/${tarball}`;
writeFileSync(packageFile, `${JSON.stringify(pkg, null, 2)}\n`);

// The script writes the new tarball in the lock file itself, and `npm ci`
// installs it. `npm install` would also write again the other entries of
// the lock file, with the format of the local npm.
const lockFile = path.join(root, 'package-lock.json');
const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
const integrity = `sha512-${createHash('sha512')
  .update(readFileSync(path.join(vendorDir, tarball)))
  .digest('base64')}`;
lock.packages[''].dependencies[NAME] = pkg.dependencies[NAME];
Object.assign(lock.packages[`node_modules/${NAME}`], {
  version,
  resolved: pkg.dependencies[NAME],
  integrity,
});
writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);

rmSync(path.join(root, 'node_modules', '.vite'), { recursive: true, force: true });
run('npm', ['ci', '--no-audit', '--no-fund'], root);

console.log(`Vendored ${NAME} ${version} (vendor/${tarball}). Restart astro dev.`);
