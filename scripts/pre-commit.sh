#!/bin/sh
# The pre-commit hook (simple-git-hooks in package.json).
# 1. When the commit changes a page, a component, a scene or the tarball
#    of the scene kit, it writes src/scenes/kit-classes.json again and adds
#    it to the commit. If the test fails, the commit stops.
# 2. Prettier formats the files of the commit. The hook adds again only the
#    files that Prettier changes. Thus a file with a part in the commit
#    keeps the other part out of the commit. When Prettier must change a
#    file that also has changes out of the commit, the commit stops: the
#    hook cannot format only the part in the commit.
set -e

# Each command gets one file in each line, also a name with spaces.
each() {
  tr '\n' '\0' | xargs -0 "$@"
}

FILES=$(git diff --cached --name-only --diff-filter=ACMR)
if git diff --cached --name-only | grep -qE '^(src/(scenes|pages|components)/.*\.(astro|tsx|ts)$|vendor/)'; then
  if ! npm run --silent scene-classes > /dev/null 2>&1; then
    echo 'pre-commit: npm run scene-classes failed. Run it to see the error.' >&2
    exit 1
  fi
  git add src/scenes/kit-classes.json
  FILES=$(git diff --cached --name-only --diff-filter=ACMR)
fi

# A commit that only deletes files has nothing to format.
[ -z "$FILES" ] && exit 0

# Prettier gives 1 when it must change a file, and 2 when it cannot read
# one. xargs of macOS gives 1 for the two, thus the files are arguments.
set --
while IFS= read -r file; do set -- "$@" "$file"; done <<EOF
$FILES
EOF
status=0
CHANGED=$(npx prettier --ignore-unknown --list-different "$@") || status=$?
if [ "$status" -gt 1 ]; then
  echo 'pre-commit: Prettier failed. Run npx prettier --check on the staged files to see the error.' >&2
  exit 1
fi
[ -z "$CHANGED" ] && exit 0

UNSTAGED=$(git diff --name-only)
PARTIAL=$(printf '%s\n' "$CHANGED" | while IFS= read -r file; do
  if printf '%s\n' "$UNSTAGED" | grep -Fxq -- "$file"; then echo "$file"; fi
done)
if [ -n "$PARTIAL" ]; then
  echo 'pre-commit: Prettier must change these files, which also have changes that are not staged:' >&2
  echo "$PARTIAL" | sed 's/^/  /' >&2
  echo 'Format them (npx prettier --write), stage them, and commit again.' >&2
  exit 1
fi

echo "$CHANGED" | each npx prettier --write --log-level warn
echo "$CHANGED" | each git add
