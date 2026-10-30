import type { ChapterHeaderData } from '~/components/ChapterHeader';
import type { FeatureFragmentsData } from '~/components/FeatureFragments';
import type { CodeTab } from '~/data/home';

/*
 * The Structured content chapter of the Editing pillar
 * (`/editor-experience#structured-content`). A chapter is a typed object that
 * the pillar page imports.
 *
 * All the pictures show one record: the guide "Three days in Lisbon on foot"
 * of the project "Terra Guides". The code snippets quote the same record, word
 * for word.
 */

export const chapter: ChapterHeaderData = {
  label: 'Structured Text',
  headline: 'Rich text,',
  muted: 'stored as JSON.',
  intro:
    'Headings, links, blocks and references to other records, all in one field. Editors see a document. Your code sees a typed tree.',
  link: {
    label: 'Read The Docs',
    href: '/docs/structured-text/dast',
    appearance: 'deep-on-white',
    variant: 'soft',
  },
};

// The `value` of the Body field, cut to the café paragraph and the heading after it.
// The ids are sample ids.
export const dast: CodeTab = {
  label: 'DAST',
  lang: 'json',
  focus: [2, 10],
  code: `{
  "schema": "dast",
  "document": {
    "type": "root",
    "children": [
      {
        "type": "paragraph",
        "children": [
          { "type": "span", "value": "Stop for a bica at " },
          { "type": "inlineItem", "item": "UZyfjdBES8y2W2ruMEHSoA" },
          { "type": "span", "value": " before the queue forms. Order at the counter, it is half the price of a table." }
        ]
      },
      { "type": "heading", "level": 2, "children": [{ "type": "span", "value": "Day two: the river and Belém" }] }
    ]
  }
}`,
};

// The same field, rendered with the component of each framework: the café
// is the inline record, the gallery is a block of the field. No line is
// dim: all the code is the point. No imports: the box shows about 15 lines,
// and the call of the component must show.
export const renderers: CodeTab[] = [
  {
    label: 'React',
    lang: 'tsx',
    code: `export function GuideBody({ body }) {
  return (
    <StructuredText
      data={body}
      // A record in the text: a link to its page
      renderInlineRecord={({ record }) => (
        <a href={\`/places/\${record.slug}\`}>{record.title}</a>
      )}
      // A block between two paragraphs: your own component
      renderBlock={({ record }) => <Gallery {...record} />}
    />
  );
}`,
  },
  {
    label: 'Vue',
    lang: 'vue',
    code: `<script setup>
defineProps(['body']);
// A record in the text: a link to its page
const renderInlineRecord = ({ record }) =>
  h('a', { href: \`/places/\${record.slug}\` }, record.title);
// A block between two paragraphs: your own component
const renderBlock = ({ record }) => h(Gallery, record);
</script>

<template>
  <StructuredText
    :data="body"
    :renderInlineRecord="renderInlineRecord"
    :renderBlock="renderBlock"
  />
</template>`,
  },
  {
    label: 'Svelte',
    lang: 'svelte',
    code: `<script>
  let { body } = $props();
</script>

<StructuredText
  data={body}
  components={[
    // A record in the text: a link to its page
    [isInlineItem, PlaceLink],
    // A block between two paragraphs: your own component
    [isBlock, Gallery],
  ]}
/>`,
  },
  {
    label: 'Astro',
    lang: 'astro',
    code: `---
const { body } = Astro.props;

// A record in the text: a link to its page
const inlineRecordComponents = { PlaceRecord: PlaceLink };
// A block between two paragraphs: your own component
const blockComponents = { GalleryRecord: Gallery };
---

<StructuredText
  data={body}
  {inlineRecordComponents}
  {blockComponents}
/>`,
  },
];

// The fourth fragment: the DAST of the café paragraph, and the code that
// renders it.

// Part 3: one fragment for each picture, in the order of the pictures.
export const fragments: FeatureFragmentsData = {
  items: [
    {
      title: 'An editor that knows the shortcuts.',
      text: 'Editors type a slash to add any element, write markdown that turns into formatting, use familiar shortcuts and drag things where they belong.',
    },
    {
      title: 'A gallery between two paragraphs.',
      text: 'Galleries, calls to action, polls, embeds: you define the blocks, editors drop them into the text and move them around like any paragraph.',
    },
    {
      title: 'A record, not a URL.',
      text: 'Cervejaria Ramiro is a record of its own. Change its name or its slug, and every guide that mentions it is up to date.',
    },
    {
      title: 'JSON in, your components out.',
      text: 'Your code gets the café paragraph as a tree of typed nodes, with nothing to parse. Hand it to one component and say how each record and block looks.',
    },
  ],
};
