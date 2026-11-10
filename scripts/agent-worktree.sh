#!/bin/zsh
# Make a git worktree of astro-website that can run dev, check and build.
#
# Usage:
#   scripts/agent-worktree.sh DIR [REF] [--clone]
#     DIR      The new worktree. Put it outside the main tree.
#     REF      The commit to check out (detached). Default: HEAD of the main tree.
#     --clone  Make node_modules as an APFS clone of the main tree's node_modules
#              (no network). Default: `npm ci` from package-lock.json.
#
# The script does not copy .env files. Commands read the env file of the main
# tree through an absolute path.
# The script never makes node_modules a symlink: Vite resolves the symlink to
# a path outside the project root, and then dev gives 500 or 403 errors.

set -e
setopt pipefail

# Find the main tree from the git directory that all worktrees share.
# Try the directory of the script first, then the current directory.
GIT_COMMON=$(git -C "${0:A:h}" rev-parse --path-format=absolute --git-common-dir 2>/dev/null ||
  git rev-parse --path-format=absolute --git-common-dir)
MAIN=${GIT_COMMON:h}
ENV_FILE=$MAIN/.env.development

DIR=$1; REF=${2:-HEAD}; MODE=npmci
[[ $2 == --clone ]] && REF=HEAD
[[ $2 == --clone || $3 == --clone ]] && MODE=clone
[[ -n $DIR ]] || { echo "Usage: $0 DIR [REF] [--clone]"; exit 2; }
[[ -e $DIR ]] && { echo "$DIR exists. Use a new directory."; exit 2; }
[[ -f $ENV_FILE ]] || { echo "Missing $ENV_FILE in the main tree."; exit 2; }

source ~/.nvm/nvm.sh >/dev/null
nvm use 22 >/dev/null

git -C "$MAIN" worktree add --detach "$DIR" "$REF"
DIR=${DIR:A}

t0=$(date +%s)
if [[ $MODE == clone ]]; then
  cp -cR "$MAIN/node_modules" "$DIR/node_modules"
  # The Vite cache of the main tree has the wrong root for this tree.
  rm -rf "$DIR/node_modules/.vite" "$DIR/node_modules/.astro"
else
  # INSIDE_DOCKER=1 stops the "prepare" script. It does not install the git
  # hooks again into the .git directory that all worktrees share.
  (cd "$DIR" && INSIDE_DOCKER=1 npm ci --no-audit --no-fund --loglevel=error)
fi
echo "node_modules ($MODE) ready in $(( $(date +%s) - t0 ))s"

cat <<EOF

Worktree: $DIR
Start a dev server (pick a free port first, then use the Bash tool's run_in_background):
  cd $DIR && npx dotenv -e $ENV_FILE -- npx astro dev --ignore-lock --port PORT
Check and build:
  cd $DIR && npx dotenv -e $ENV_FILE -- npx astro check
  cd $DIR && npx dotenv -e $ENV_FILE -- npx astro build
Remove:
  git -C $MAIN worktree remove --force $DIR
EOF
