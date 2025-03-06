import { Client } from '@datocms/cli/lib/cma-client-node';

export default async function (client: Client) {
  console.log('Create new models/block models');

  console.log('Create model "\uD83C\uDF70 Recipes Page" (`recipes_page`)');
  await client.itemTypes.create(
    {
      id: 'Ye9qbJIORQuaI3oHPNuuwQ',
      name: '\uD83C\uDF70 Recipes Page',
      singleton: true,
      api_key: 'recipes_page',
      draft_mode_active: true,
      draft_saving_active: false,
      collection_appearance: 'table',
      inverse_relationships_enabled: false,
    },
    { skip_menu_item_creation: true, schema_menu_item_id: 'Mxa-4JdoTwGy3UBeydqDMA' },
  );

  console.log('Create model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.itemTypes.create(
    {
      id: 'KqL8W3bSSSCZIZJgUEWPqQ',
      name: '\uD83C\uDF55 Recipe',
      api_key: 'recipe',
      draft_mode_active: true,
      draft_saving_active: true,
      all_locales_required: true,
      collection_appearance: 'table',
      inverse_relationships_enabled: false,
    },
    { skip_menu_item_creation: true, schema_menu_item_id: 'Y6ON8L07Rj-KX48uEaR9WA' },
  );

  console.log('Creating new fields/fieldsets');

  console.log(
    'Create SEO meta tags field "SEO" (`seo`) in model "\uD83C\uDF70 Recipes Page" (`recipes_page`)',
  );
  await client.fields.create('Ye9qbJIORQuaI3oHPNuuwQ', {
    id: 'LxZdxtgpR4ONCLdLWZxlzQ',
    label: 'SEO',
    field_type: 'seo',
    api_key: 'seo',
    validators: { title_length: { max: 60 }, description_length: { max: 160 } },
    appearance: {
      addons: [],
      editor: 'seo',
      parameters: {
        fields: ['title', 'description', 'image', 'no_index', 'twitter_card'],
        previews: ['google', 'twitter', 'facebook', 'linkedin', 'slack', 'telegram', 'whatsapp'],
      },
    },
  });

  console.log('Create fieldset "\uD83C\uDCCF Page Card" in model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.fieldsets.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'LzSZy6duT6e7fkNWsA4yUw',
    title: '\uD83C\uDCCF Page Card',
  });

  console.log(
    'Create fieldset "\uD83D\uDCC3 Details page" in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fieldsets.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'EpaLRx7lRYaKkmiyD5DGGQ',
    title: '\uD83D\uDCC3 Details page',
  });

  console.log('Create fieldset "\uD83E\uDDA6 Other" in model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.fieldsets.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'Emyo8pHARTKs38TPXn8oKQ',
    title: '\uD83E\uDDA6 Other',
    collapsible: true,
    start_collapsed: true,
  });

  console.log(
    'Create Single asset field "Card Image" (`card_image`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'UNwd0iDUTd6Vne0wwDRvsw',
    label: 'Card Image',
    field_type: 'file',
    api_key: 'card_image',
    validators: {
      required: {},
      extension: { extensions: [], predefined_list: 'transformable_image' },
      image_aspect_ratio: { eq_ar_numerator: 3, eq_ar_denominator: 2 },
    },
    appearance: { addons: [], editor: 'file', parameters: {} },
    fieldset: { id: 'LzSZy6duT6e7fkNWsA4yUw', type: 'fieldset' },
  });

  console.log(
    'Create Single-line string field "Title" (`title`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'DwB5WvggR0Kq9Lmtr0wbag',
    label: 'Title',
    field_type: 'string',
    api_key: 'title',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: true, placeholder: null },
      type: 'title',
    },
  });

  console.log(
    'Create Single asset field "Featured Image" (`featured_image`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'ebE7s5BBQ1C7w8wXtZpgkA',
    label: 'Featured Image',
    field_type: 'file',
    api_key: 'featured_image',
    validators: {
      required: {},
      extension: { extensions: ['png', 'mp4', 'jpg', 'jpeg', 'webp', 'gif', 'mov'] },
    },
    appearance: { addons: [], editor: 'file', parameters: {} },
    fieldset: { id: 'EpaLRx7lRYaKkmiyD5DGGQ', type: 'fieldset' },
  });

  console.log(
    'Create Single-line string field "Card Description" (`card_description`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'eK2glAC0Qi6HvE2yyC0MiA',
    label: 'Card Description',
    field_type: 'string',
    api_key: 'card_description',
    validators: { required: {} },
    appearance: {
      addons: [],
      editor: 'single_line',
      parameters: { heading: false, placeholder: null },
    },
    fieldset: { id: 'LzSZy6duT6e7fkNWsA4yUw', type: 'fieldset' },
  });

  console.log(
    'Create SEO meta tags field "SEO settings" (`seo_settings`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'FtzAmuoFS92eD35c4F9N3g',
    label: 'SEO settings',
    field_type: 'seo',
    api_key: 'seo_settings',
    validators: { title_length: { max: 160 }, description_length: { max: 320 } },
    appearance: {
      addons: [],
      editor: 'seo',
      parameters: {
        fields: ['title', 'description', 'image', 'twitter_card'],
        previews: ['google', 'twitter', 'facebook'],
      },
    },
    fieldset: { id: 'Emyo8pHARTKs38TPXn8oKQ', type: 'fieldset' },
  });

  console.log(
    'Create Structured text field "Content" (`content`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'A0rLr8QZRKaoEB9ssyENvw',
    label: 'Content',
    field_type: 'structured_text',
    api_key: 'content',
    validators: {
      required: {},
      structured_text_blocks: { item_types: ['810933', '810948'] },
      structured_text_inline_blocks: { item_types: [] },
      structured_text_links: {
        on_publish_with_unpublished_references_strategy: 'fail',
        on_reference_unpublish_strategy: 'delete_references',
        on_reference_delete_strategy: 'delete_references',
        item_types: [],
      },
    },
    appearance: {
      addons: [],
      editor: 'structured_text',
      parameters: {
        marks: ['strong', 'code', 'emphasis', 'underline', 'strikethrough', 'highlight'],
        nodes: ['blockquote', 'code', 'heading', 'link', 'list', 'thematicBreak'],
        heading_levels: [2, 3, 4, 5, 6],
        blocks_start_collapsed: false,
        show_links_meta_editor: false,
        show_links_target_blank: true,
      },
    },
    fieldset: { id: 'EpaLRx7lRYaKkmiyD5DGGQ', type: 'fieldset' },
  });

  console.log(
    'Create JSON field "Recipe JSON" (`recipe_json`) in model "\uD83C\uDF55 Recipe" (`recipe`)',
  );
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'H4smuSbJS7WjcSsjhV3LJQ',
    label: 'Recipe JSON',
    field_type: 'json',
    api_key: 'recipe_json',
    validators: { required: {} },
    appearance: { addons: [], editor: 'json', parameters: {} },
    fieldset: { id: 'EpaLRx7lRYaKkmiyD5DGGQ', type: 'fieldset' },
  });

  console.log('Create Slug field "Slug" (`slug`) in model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.fields.create('KqL8W3bSSSCZIZJgUEWPqQ', {
    id: 'Z7efKLxWQb270emBT6YMDw',
    label: 'Slug',
    field_type: 'slug',
    api_key: 'slug',
    validators: {
      slug_title_field: { title_field_id: 'DwB5WvggR0Kq9Lmtr0wbag' },
      slug_format: { predefined_pattern: 'webpage_slug' },
      required: {},
      unique: {},
    },
    appearance: { addons: [], editor: 'slug', parameters: { url_prefix: null, placeholder: null } },
    fieldset: { id: 'Emyo8pHARTKs38TPXn8oKQ', type: 'fieldset' },
  });

  console.log('Finalize models/block models');

  console.log('Update model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.itemTypes.update('KqL8W3bSSSCZIZJgUEWPqQ', {
    presentation_title_field: { id: 'DwB5WvggR0Kq9Lmtr0wbag', type: 'field' },
    presentation_image_field: { id: 'UNwd0iDUTd6Vne0wwDRvsw', type: 'field' },
    title_field: { id: 'DwB5WvggR0Kq9Lmtr0wbag', type: 'field' },
    image_preview_field: { id: 'ebE7s5BBQ1C7w8wXtZpgkA', type: 'field' },
    excerpt_field: { id: 'eK2glAC0Qi6HvE2yyC0MiA', type: 'field' },
  });

  console.log('Manage menu items');

  console.log('Create menu item "\uD83E\uDD58 Recipes"');
  await client.menuItems.create({
    id: 'QrKM4zE_SXCzd0LTMDmKzg',
    label: '\uD83E\uDD58 Recipes',
    parent: { id: '558709', type: 'menu_item' },
  });

  console.log('Create menu item "\uD83C\uDF55 Recipe"');
  await client.menuItems.create({
    id: 'B19B5pcIQru-tXlQibk7CA',
    label: '\uD83C\uDF55 Recipe',
    item_type: { id: 'KqL8W3bSSSCZIZJgUEWPqQ', type: 'item_type' },
    parent: { id: 'QrKM4zE_SXCzd0LTMDmKzg', type: 'menu_item' },
  });

  console.log('Create menu item "\uD83C\uDF70 Recipes Page"');
  await client.menuItems.create({
    id: 'd-jjOrJuSmeL5wx85vb5PQ',
    label: '\uD83C\uDF70 Recipes Page',
    item_type: { id: 'Ye9qbJIORQuaI3oHPNuuwQ', type: 'item_type' },
    parent: { id: 'QrKM4zE_SXCzd0LTMDmKzg', type: 'menu_item' },
  });

  console.log('Update menu item "\uD83E\uDD58 Recipes"');
  await client.menuItems.update('QrKM4zE_SXCzd0LTMDmKzg', { position: 4 });

  console.log('Manage schema menu items');

  console.log('Create model schema menu item "\uD83E\uDD58 Recipes"');
  await client.schemaMenuItems.create({
    id: 'LlvR7isSTjOBZVIwaFXxTw',
    label: '\uD83E\uDD58 Recipes',
    kind: 'item_type',
    parent: { id: 'EYSg5f1yTyazsKiloVhy6A', type: 'schema_menu_item' },
  });

  console.log('Update model schema menu item "\uD83E\uDD58 Recipes"');
  await client.schemaMenuItems.update('LlvR7isSTjOBZVIwaFXxTw', {
    position: 1,
    parent: { id: 'EYSg5f1yTyazsKiloVhy6A', type: 'schema_menu_item' },
  });

  console.log(
    'Update model schema menu item for model "\uD83C\uDF70 Recipes Page" (`recipes_page`)',
  );
  await client.schemaMenuItems.update('Mxa-4JdoTwGy3UBeydqDMA', {
    position: 0,
    parent: { id: 'LlvR7isSTjOBZVIwaFXxTw', type: 'schema_menu_item' },
  });

  console.log('Update model schema menu item for model "\uD83C\uDF55 Recipe" (`recipe`)');
  await client.schemaMenuItems.update('Y6ON8L07Rj-KX48uEaR9WA', {
    position: 1,
    parent: { id: 'LlvR7isSTjOBZVIwaFXxTw', type: 'schema_menu_item' },
  });

  console.log('Update model schema menu item "Home page"');
  await client.schemaMenuItems.update('fM3I50MPR4CbibZv4Ughrg', { position: 1 });

  console.log('Update model schema menu item "Marketing Pages"');
  await client.schemaMenuItems.update('cuYqIOhXTTOf4_C01YH_ag', { position: 1 });

  console.log('Update model schema menu item "User Guides"');
  await client.schemaMenuItems.update('LAtbiqIRTQ2niaPdQPUBSA', { position: 15 });

  console.log('Update block schema menu item "Support area"');
  await client.schemaMenuItems.update('TorsAxM3Qm6ZXHiy8NLYag', { position: 37 });

  console.log('Update model schema menu item "Academy"');
  await client.schemaMenuItems.update('YX44cuOyQDet-c_dvmh9AA', { position: 9 });

  console.log('Update model schema menu item "Product updates"');
  await client.schemaMenuItems.update('K566OISlTWeWf2D7TGTgSQ', { position: 10 });

  console.log('Update block schema menu item "Product Comparison"');
  await client.schemaMenuItems.update('dfR4ZCSpRryC2E9VCdD_Bw', { position: 40 });

  console.log('Update model schema menu item "Support"');
  await client.schemaMenuItems.update('fn-VthW0SfeFkFFjSIXkQw', { position: 33 });

  console.log('Update block schema menu item "Plugins"');
  await client.schemaMenuItems.update('DVmHQbFaTsy8BsnukQbilQ', { position: 35 });

  console.log('Update block schema menu item "Success Story"');
  await client.schemaMenuItems.update('d9GlMCJJTyiDDnayC7K67w', { position: 36 });

  console.log('Update model schema menu item "Other"');
  await client.schemaMenuItems.update('CE3IKvNvSfG-KwypZUGVxA', { position: 42 });

  console.log('Update model schema menu item "DatoCMS vs"');
  await client.schemaMenuItems.update('alSoq73DTOCoc5VpeDKDzg', { position: 38 });

  console.log('Update block schema menu item "Marketing Pages"');
  await client.schemaMenuItems.update('Mw-efacVQO2pAK-89B8Ijg', { position: 41 });

  console.log('Update model schema menu item "Dictionaries"');
  await client.schemaMenuItems.update('Lc3WERr8SKy_v3Hj8Itj6w', { position: 28 });

  console.log('Update model schema menu item "Pricing"');
  await client.schemaMenuItems.update('Z-UIOBnpQYSiGvC6BBd-qA', { position: 27 });

  console.log('Update model schema menu item "Docs"');
  await client.schemaMenuItems.update('KKEzicAKSoaYQcaSYFRS5g', { position: 17 });

  console.log('Update model schema menu item "Glossary"');
  await client.schemaMenuItems.update('OEo1PRcUT_OIiF6i2C7Stw', { position: 4 });

  console.log('Update model schema menu item "Customer Stories"');
  await client.schemaMenuItems.update('J4hGmYd-SBSgSyNRspS6-g', { position: 43 });

  console.log('Update block schema menu item for block model "\uD83C\uDF05 Image" (`image`)');
  await client.schemaMenuItems.update('RubCaBHgQeqtTltERyQ6nQ', { position: 12 });

  console.log('Update model schema menu item "Tech Partners"');
  await client.schemaMenuItems.update('YkYijh97Qqy7lM9I6-eyWw', { position: 31 });

  console.log('Update model schema menu item "Partner Program"');
  await client.schemaMenuItems.update('a4GEqu8QRyS4cyWY2K3oyw', { position: 30 });

  console.log('Update model schema menu item "Blog"');
  await client.schemaMenuItems.update('DQbbc4BdQqmSTw6R2kbssg', { position: 6 });

  console.log('Update model schema menu item "In-app"');
  await client.schemaMenuItems.update('Hk7gOCIfSue2P5ykFysBnw', { position: 8 });

  console.log('Update model schema menu item "Marketplace"');
  await client.schemaMenuItems.update('EYSg5f1yTyazsKiloVhy6A', { position: 32 });

  console.log('Update model schema menu item "Success stories"');
  await client.schemaMenuItems.update('Lgkm6VGjTG6nAvlwfjGXPw', { position: 5 });

  console.log('Update block schema menu item "Landing page"');
  await client.schemaMenuItems.update('SncAKty9Tmm3jjzkb3f6CA', { position: 34 });

  console.log('Update block schema menu item "Blog and Docs"');
  await client.schemaMenuItems.update('f6WUX53NQaGnMIUZR5oR9Q', { position: 18 });

  console.log('Update model schema menu item "About page"');
  await client.schemaMenuItems.update('Cgq0SMW5RJmf5ESiOMhhrA', { position: 7 });

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCF9 Video" (`internal_video`)',
  );
  await client.schemaMenuItems.update('cNyKXs9oR-KW-8wRxbmH4A', { position: 13 });

  console.log(
    'Update block schema menu item for block model "\uD83D\uDCF9 YouTube/Vimeo embed" (`video`)',
  );
  await client.schemaMenuItems.update('TxHTSyghR0SwIzFraNnK1g', { position: 14 });

  console.log(
    'Update model schema menu item for model "\u270F\uFE0F Doc Feedback" (`doc_feedback`)',
  );
  await client.schemaMenuItems.update('JPs9u3iIT8KdemduWDQqzw', { position: 44 });
}
