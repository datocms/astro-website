# Blog covers

Tools for the covers of the blog (`src/assets/blog-covers/`, drawn by
`src/components/PixelCover`). The PNG is the only copy that we keep: its
record (the animal, the source of the photo, the licence, the spec) is in a
text chunk of the file. The rules and the process are in
`src/components/PixelCover/AGENTS.md`.

The work files are in `tmp/blog-covers/` (Git ignores it):

```
tmp/blog-covers/
  photos/<file>.jpg          the photos of the specs
  specs/<slug>.json          the specs
  preview/<slug>.png         the previews of `render`
  candidates/                the previews that you saved from Envato
  sheet.png                  the output of `sheet`
```

## Commands

```bash
# Draw a cover from tmp/blog-covers/specs/<slug>.json. It prints the checks and
# writes tmp/blog-covers/preview/<slug>.png. With --try it writes only the
# preview. With no --try it also writes src/assets/blog-covers/<slug>.png, but
# only when all the checks say ok.
npx tsx scripts/blog-covers/gen.ts render <slug>... [--try]

# All the covers: the animal, the theme, the licence, the source. It marks an
# animal in use two times, a file with no theme, and a file with the colours of
# a different theme.
npx tsx scripts/blog-covers/gen.ts list

# Change the record of a cover: animal=<words>, source=<url> (empty removes
# it), licensed=true|false. The cells do not change.
npx tsx scripts/blog-covers/gen.ts set <slug> licensed=true

# Give a cover the colours of its theme in src/data/blogCoverThemes.ts, after a
# change of the theme or of the colours in THEMES. No photo is necessary.
# With no slug: all the covers.
npx tsx scripts/blog-covers/gen.ts recolor [<slug>...]

# All the covers at feed size on a 2× screen, three in each row:
# tmp/blog-covers/sheet.png. /dev/cover-gallery shows the same in the browser.
npx tsx scripts/blog-covers/gen.ts sheet
```

`render` keeps `licensed` when the photos of the spec do not change. A new
photo sets `licensed=false`.
