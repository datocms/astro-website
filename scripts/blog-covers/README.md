# Blog covers

Tools for the covers of the blog (drawn by `src/components/PixelCover`). The
CMS keeps a cover in two fields of a blog post: `pixel_cover` (the file) and
`theme`. The file is the only copy that we keep: its record (the subject, the
source of the photo, the licence, the spec) is in a text chunk of the file.
`render` and `set` also write the subject, the source and the licence in the
custom data of the asset (`subject`, `source`, `licensed`): an editor reads
them in the media area of the CMS.
The rules and the process are in `src/components/PixelCover/AGENTS.md`.

The work files are in `tmp/blog-covers/` (Git ignores it):

```
tmp/blog-covers/
  photos/<file>.jpg          the photos of the specs
  specs/<slug>.json          the specs
  preview/<slug>.png         the previews of `render`
  covers/<slug>.png          the cover files that `render` and `set` wrote
  candidates/                the previews that you saved from Envato
  sheet.png                  the output of `sheet`
```

## Commands

All the commands read the CMS, and `render` and `set` write to it.
`covers.sh` runs `gen.ts` with the datocms CLI, which gives the script a
client of the CMS with your login (`npx datocms login`). The token of
`.env.development` cannot write.

```bash
alias covers=scripts/blog-covers/covers.sh
```

```bash
# Draw a cover from tmp/blog-covers/specs/<slug>.json. It prints the checks and
# writes tmp/blog-covers/preview/<slug>.png. When all the checks say ok, it
# writes the cover file tmp/blog-covers/covers/<slug>.png and sends it to the
# CMS. With --try it does not send the file: a person can put the file in the
# field "Pixel cover" of the post, and see the draft with the Web Previews
# plugin of the CMS. --theme sets the theme of the post. Without it, the post
# keeps its theme. With --try and --theme, the command does not use the post:
# the post can be absent. A published post with no other changes is published
# again. A draft, or a post with other changes, stays as it is: the command
# says so, and an editor publishes it.
covers render <slug>... [--try] [--theme=<theme>] [--variant=<name>]

# A variant is a second spec of the same post, to compare two photos:
# specs/<slug>.<name>.json gives preview/<slug>.<name>.png and
# covers/<slug>.<name>.png. A variant never goes to the CMS.

# All the covers: the subject, the theme, the licence, the source. It marks an
# subject in use two times and a cover with no theme. At the end: the featured
# row of each feed (its three newest posts) with the theme of each post, and a
# mark on a row that has the same theme two times.
covers list

# Change the record of a cover or the theme of its post: subject=<words>,
# source=<url> (empty removes it), licensed=true|false, theme=<theme>. The
# cells do not change.
covers set <slug> licensed=true

# All the covers at feed size on a 2× screen, three in each row, the newest
# first: tmp/blog-covers/sheet.png. /dev/cover-gallery shows the same in the
# browser.
covers sheet
```

`render` keeps `licensed` when the photos of the spec do not change. A new
photo sets `licensed=false`.
