#!/bin/sh
# Writes src/scenes/kit-classes.json: the classes of the scene kit that
# each page uses (src/scenes/kitClasses.test.ts).
# The test loads the config of Astro, thus it needs the variables of the
# env schema. It reads .env.development of the main tree (a worktree has
# no copy of it) and the public values of cloudflare.build.env.
set -e
main=$(dirname "$(git rev-parse --path-format=absolute --git-common-dir)")
exec npx dotenv -e "$main/.env.development" -e cloudflare.build.env -- \
  npx vitest run src/scenes/kitClasses.test.ts --update
