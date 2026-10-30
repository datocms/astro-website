import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';
import type { CodeTab } from '~/data/home';

/*
 * The Visual editing chapter of the Editing pillar
 * (`/editor-experience#visual-editing`). New copy. Old page:
 * /features/visual-editing, now a redirect to this chapter.
 *
 * The scene shows the page of the article "Night trains are back" of Field
 * Notes, a travel magazine, on its draft site, in the tab Visual of the cms
 * with the plugin Web Previews: a click on the cover opens the article, a
 * click on the name of the author opens the author. The first fragment
 * shows the tab "Website preview" of the record editor: a save reloads the
 * page (src/scenes/VisualEditing/story.ts). The snippet
 * follows the docs of `<ContentLink />` in react-datocms: the query asks for
 * the stega metadata with two headers, and the root layout mounts the
 * component.
 */

export const chapter: ChapterHeaderData = {
  label: 'Visual editing',
  headline: 'Click the page.',
  muted: 'Land on the field.',
  intro:
    'Editors click any text or image on the draft site, and we open the field that holds it. Developers set it up once.',
  link: {
    label: 'Read The Docs',
    href: '/docs/visual-editing',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// The root layout of a Next.js site. The line of the component is strong:
// it is the one line to add.
export const layout: CodeTab = {
  label: 'app/layout.tsx',
  lang: 'tsx',
  focus: [7],
  code: `import { ContentLink } from 'react-datocms';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ContentLink />
        {children}
      </body>
    </html>
  );
}`,
};

// The request of the content: the two headers of content link are strong.
// The first one asks for the stega metadata in the texts, the second one
// gives the address of the project, for the links to its fields.
export const request: CodeTab = {
  label: 'lib/datocms.ts',
  lang: 'ts',
  focus: [6, 7],
  code: `const response = await fetch('https://graphql.datocms.com/', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${token}\`,
    'X-Include-Drafts': 'true',
    'X-Visual-Editing': 'v1',
    'X-Base-Editing-Url': 'https://field-notes.admin.datocms.com',
  },
  body: JSON.stringify({ query }),
});`,
};

// The second fragment: the layout, and the request in a second tab

// Part 3: two fragments, one for the editor and one for the developer. The
// scene starts from the page; the first fragment starts from the form, for
// an editor that knows which field to change.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'Save, and see the page.',
      text: 'When you know which field to change, stay in the form. The Web Previews sidebar keeps the draft page next to it, and can reload it after each save.',
    },
    {
      title: 'Two headers and one component.',
      text: 'Add two headers to your queries and <ContentLink /> to your layout. Blocks and linked records work with no mapping, on every plan.',
    },
  ],
};
