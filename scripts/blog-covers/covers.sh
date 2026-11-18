#!/bin/sh
# Run gen.ts with the datocms CLI. The CLI gives the script a client of the
# CMS with the login of the user (`npx datocms login`). The CLI passes no
# arguments to a script, thus the words of the command go in COVERS_ARGS.
#
#   scripts/blog-covers/covers.sh list
set -e
cd "$(dirname "$0")/../.."
COVERS_ARGS="$(node -e 'process.stdout.write(JSON.stringify(process.argv.slice(1)))' -- "$@")"
export COVERS_ARGS
exec npx datocms cma:script scripts/blog-covers/gen.ts
