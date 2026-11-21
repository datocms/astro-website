#!/bin/sh
# The pre-commit hook (simple-git-hooks in package.json).
# 1. When the commit changes a page, a component, a scene or the tarball
#    of the scene kit, it writes src/scenes/kit-classes.json again and adds
#    it to the commit. If the test fails, the commit stops.
# 2. Prettier formats the files of the commit.
set -e
FILES=$(git diff --cached --name-only --diff-filter=ACMR)
if git diff --cached --name-only | grep -qE '^(src/(scenes|pages|components)/.*\.(astro|tsx|ts)$|vendor/)'; then
  if ! npm run --silent scene-classes > /dev/null 2>&1; then
    echo 'pre-commit: npm run scene-classes failed. Run it to see the error.' >&2
    exit 1
  fi
  FILES="$FILES
src/scenes/kit-classes.json"
fi
# A commit that only deletes files has nothing to format.
[ -z "$FILES" ] && exit 0
echo "$FILES" | xargs npx prettier --ignore-unknown --write
echo "$FILES" | xargs git add
