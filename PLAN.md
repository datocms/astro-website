# PLAN: finish the redesign

All the pages are on the new layout (`src/REDESIGN.md`). This file lists only the work that is still open before `redesign` goes to `main`. When a point is done, delete it. The history is in `git log`.

## Rules

- All the work is on the branch `redesign`. Rebase it on `main` from time to time.
- Do not push and do not deploy without the approval of a human. One approval is for one deploy and one environment. The review deploy is `staging1` or `staging2`; the user runs `cubo`.
- Checks for each change: `npx astro check` (0 errors), `npm run lint:css` (0 errors), `npm run build`. Do not run them while `astro dev` runs on the repo. For a dev check, use `astro dev --ignore-lock --port <a free port>`, and stop only your own process (by PID).
- A visible removal needs the OK of the user.

## Open work

### 1. CMS pass: use cases

The `/use-cases/*` pages are deleted (2026-10-31), and `/use-cases/*` redirects to `/`. The CMS still has the model `use_case_page`, and the code still reads it. Do this pass in four steps.

1. **Find the references.** Run the scan below (`npx datocms cma:script`, from the repo root, Node 22). It reads all the records (`rawListPagedIterator` with `nested: true`, so the blocks inside Structured Text and Modular Content are in the JSON), walks all the JSON, and prints each string that is the ID of a use case or a URL with `/use-cases`. `cma:script` rejects `any` and `unknown` annotations and `export default`: keep the `Json` type alias.
   <details><summary>The scan script</summary>

   ```ts
   type Json = string | number | boolean | null | Json[] | { [k: string]: Json };

   const itemTypes = await client.itemTypes.list();
   const typeName = new Map(itemTypes.map((t) => [t.id, t.api_key]));
   const useCaseType = itemTypes.find((t) => t.api_key === 'use_case_page');
   if (!useCaseType) throw new Error('no use_case_page model');

   const useCases = new Map<string, string>();
   for await (const uc of client.items.listPagedIterator({
     filter: { type: useCaseType.id },
     version: 'current',
   })) {
     useCases.set(uc.id, String(uc['slug']));
   }
   console.log('use cases:', JSON.stringify([...useCases]));

   const hits: string[] = [];

   function walk(value: Json, path: string, push: (path: string, what: string) => void) {
     if (typeof value === 'string') {
       if (useCases.has(value)) push(path, `id ${value} (${useCases.get(value)})`);
       else if (value.includes('/use-cases'))
         push(path, `url ${value.match(/[^\s"')]*\/use-cases[^\s"')]*/)?.[0]}`);
       return;
     }
     if (Array.isArray(value)) {
       value.forEach((v, i) => walk(v, `${path}[${i}]`, push));
       return;
     }
     if (value && typeof value === 'object') {
       const rel = value['relationships'];
       let label = path;
       if (rel && typeof rel === 'object' && !Array.isArray(rel)) {
         const it = rel['item_type'];
         if (it && typeof it === 'object' && !Array.isArray(it)) {
           const data = it['data'];
           if (
             data &&
             typeof data === 'object' &&
             !Array.isArray(data) &&
             typeof data['id'] === 'string'
           ) {
             label = `${path}<${typeName.get(data['id'])}>`;
           }
         }
       }
       for (const [k, v] of Object.entries(value)) {
         if (k === 'relationships' || k === 'meta' || k === 'id' || k === 'type') continue;
         walk(v, k === 'attributes' ? label : `${label}.${k}`, push);
       }
     }
   }

   let count = 0;
   for await (const record of client.items.rawListPagedIterator({
     version: 'current',
     nested: true,
   })) {
     count++;
     const modelId = record.relationships.item_type.data.id;
     if (modelId === useCaseType.id) continue;
     const attrs = JSON.parse(JSON.stringify(record.attributes)) as Json;
     walk(attrs, '', (path, what) =>
       hits.push(
         `${typeName.get(modelId)} ${record.id} [${record.meta.status}] ${path} -> ${what}`,
       ),
     );
   }
   console.log('records scanned:', count, 'hits:', hits.length);
   for (const h of hits) console.log(h);
   ```

   </details>

   The result on 2026-10-31: 6680 records, 24 hits, no URL with `/use-cases` in the text.
   - **The use cases:** `aDG8B7RkQjy5K7mTLCt55A` knowledge-management, `KAC1JLzvQTuYXMGieFWRoA` ecommerce, `E_EW9kRdTqWZjmUgavUaaA` modern-websites, `BLPuwFNNQBeX4Sca_068dQ` digital-publishing, `FKzat0oFQP6-N-2IhDOuhQ` headless-cms-travel (no references).
   - **7 links in Structured Text** (`content`, record links inside paragraphs):
     - `blog_post` `Mydyi8GsRS-mCSg90uz63Q`: 4 links, "modern websites" (modern-websites), "eCommerce sites" (ecommerce), "Headless CMS for editors" (digital-publishing), "Headless CMS that's optimized for knowledge management" (knowledge-management).
     - `success_story` `PHEWXlVTQiO8--K2tswoZg` (eurac-research): "\"Content Hub\" as a Headless CMS use case" (knowledge-management).
     - `customer_story` `f3sxrDyQQ7Cjwc6IYR0nyA`: "e-commerce site's brand directory" (ecommerce).
     - `customer_story` `E_gVe2ztT-ynZnLT0XKMrQ`: "headless CMS like DatoCMS" (modern-websites).
   - **`success_story.use_case`:** 13 records (`PHEWXlVTQiO8--K2tswoZg`, `IbMGpSSJRMmsXpjaVyWv2Q`, `SmZ0ksbnR6y6lrmTYldS8A` [updated], `QUgOr8B9SSWM7cv4dd5FiQ`, `fYeF2yIDTiqD2JFud3e5pg` [draft], `39832551`, `39832553`, `39832554`, `39832555`, `39832556`, `39832557`, `39832558`, `120368987`). `CaseStudyBody` shows it as the row "Use case" of the facts, with a link to `/use-cases/<slug>`.
   - **`navigation_bar.use_cases`:** `navigation_bar` `dhVR2HqgRVCTGFi0bWqLqA`, 4 references. The site does not read `navigation_bar`.

2. **Decide (the user):** for the 7 links, remove the link and keep the text, or point it to a different page. For the row "Use case" of the success stories: remove it, or keep the text without the link.
3. **The migration** (`datocms migrations:new removeUseCases --schema=all`, then `--dry-run` first). In this order: change the 7 links (a DAST walk that replaces the `itemLink` node with its children, or changes its `item`); remove the record-link validators on `use_case_page` from the Structured Text fields (the `item_types` of the validators `structured_text_links` and `structured_text_blocks`); destroy the fields `success_story.use_case` and `navigation_bar.use_cases`; destroy the 5 records; destroy the model `use_case_page`. It is destructive: make it idempotent (look up each field and model by `api_key`, skip it if absent) and confirm before the run on primary. A record with status `updated` gets a new published version only if the migration publishes it: check `SmZ0ksbnR6y6lrmTYldS8A`.
4. **The code**, after the migration: delete `src/lib/datocms/gqlUrlBuilder/useCasePage*`, `StructuredText/inlineRecords/UseCasePageInline`, `StructuredText/linkToRecords/UseCasePageLink`, `docs/inlineRecords/UseCasePageInline`, `docs/linkToRecords/UseCasePageLink`, and their entries in the `index.ts` files and in the graphql fragments that list them (`git grep -n UseCasePage -- src`). Remove `useCase` from `CaseStudyBody` (`graphql.ts` and `Component.astro`). Then `npm run generate-cma-schema`, `npm run generate-schema`, `npx astro check`. **Do not touch** the field `useCase` of the sales form (`src/data/contact.ts`, `src/actions/forms/submitSalesRequest.ts`, `src/actions/pipedrive/utils.ts`): it is a Pipedrive custom field, not the CMS model.

### 2. CMS pass: course illustrations

The site does not show `academy_course.illustration` (3 records: `growing`, `dato-svg-4-02`, `zen`). Its editor is the Tile Picker plugin (124545, used only by this field), with previews from `https://www.datocms.com/svg/illustrations/*.svg`, which no longer exist. Write a migration that destroys the field, then uninstall the plugin. No page and no record links to `/svg/`.

### 3. Other CMS cleanup (optional)

- The `landingPage` records of the dropped `/cms/*` pages (React, Vue, Gatsby) and the unused fields of the other four.
- The old `Feature` records that no page reads (the `/features/*` detail pages redirect).
- The hero title, subtitle and images of the features page record (not read).
- The two persona links of the CMS navbar record, and the `navigation_bar` model (the site does not read it).

### 4. Docs

- The datocms-react-ui docs move to react-ui.datocms.com: `ReactUiLiveExample` is a placeholder. Decide which pages go, and add their redirects.
- Swap the docs to the StructuredText blocks of the site, and delete the copies in `src/components/docs/` (Card, Carousel, Code, Search, `DocsStructuredText`, inlineRecords, linkToRecords). The docs `Markdown` (tabs, callouts) stays separate.
- Search popup: the Ask AI, answer and filter screens need a visual pass.
- Visual review in both schemes: content images with a white background in dark, the community tutorial tiles, the docs index hero in light, the sidebar and TOC active state, the long CMA/CDA tables and callouts, the mobile drawer, the scheme toggle, the "Copy page" menu.
- Check that the search indexer maps `casual-chats` by URL prefix (the chats are now under `/blog`).

### 5. Copy and facts to confirm

- The `(check)` comments in `src/data/` (`git grep -n '(check)' -- src/data`: `ai-pillar.ts`, `developers-code.ts`, `developers-pillar.ts`, `media.ts`), and the status numbers ("40 ms", "99.99%", "6B", "74").
- The copy marked `// New copy.` (`git grep -l 'New copy' -- src/data`); on `/cms/*`, check the snippets against the starters.
- `/wall-of-love`: principles 07 (a copy of 05) and 08 ("European.") need copy.
- `/compare/*`: the "When to choose" texts are TODO placeholders; the intro repeats the product name.
- The new SEO descriptions (`/features/*` pages, `/developers`, `/media`, `/ai`, `/wall-of-love`, `/contact`, `/contact/thanks`) and the share image (the old pages had generated cards). The legal pages have no meta description.
- The partner form error text names support@datocms.com: check the address.
- The fallback quote of `src/data/case-studies.ts` points to `/images/case-studies/tim-chesney.png`, which does not exist.
- Roles in the CMS: the Marc Ammann and Grace Guzman reviews, the "Code Computerlove" partner testimonials.

### 6. Product decisions

- The header has no signed-in "Enter dashboard" state and no "Contact sales" link. `src/data/navigation.ts` has `#` links. The SearchPopup uses the static `src/data/search.ts`.
- `/features`: the 8 badges (free text) and the emoji in most titles.
- `/plugins`, `/starters`: the menu column title "Ecosystem"; add a `PageCloser` or not.
- `/contact`: put the most common countries first or not.
- Enterprise: the closing `ChapterHeader`; the stats link only the number.
- Partners and tech partners: the logo chip and white plate in dark, the "[••]" face in the hero, the hydrated map.
- `/support` and the thanks pages: show the title "We power experiences…" or not; the empty area under the topic select.
- Case studies: the `mark` highlights of CMS titles are plain text; a short metric field for the CaseStudies cards.
- Prose tables: a designer looks at the style.
- `PageNav` lists every route on staging: list only some or not.

### 7. Staging QA

On staging, in both schemes, at 1320 and 390:

- Send a real request with each form: sales (Pipedrive deal, Front message, country as ISO code), support (with attachments), Slack invite, partner program. Check Turnstile in each.
- The Mux player of the academy and user guides (quality and subtitle menus).
- A look at every page; in particular the 4 Enterprise strip themes, `/partners` (logos, map on pink, filters at 768, empty states), `/cms/*` (carousel images, Stream code card), the iubenda boxes on the privacy policy.

### 8. Ship

1. A clean `astro check`, `lint:css` and `build` on the final tree.
2. Rebase on `main`, deploy to staging, QA (point 7).
3. Merge to `main` and deploy to production, with the approval of a human.

### Loose ends

- No importer: `src/scenes/ThemedScene.astro`, `src/assets/logo/dato-logo-{long,no-space,pascal-case}.svg`. Keep or delete.
