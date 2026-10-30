import {
  ContentSidebar,
  type ContentSidebarItem,
  InfoAside,
  NavigationBar,
  RecordEditorLayout,
  RecordForm,
  StructuredTextInput,
} from '@datocms/product-scenes';
import { Scene, type SceneAppearance } from '../Scene';
import cover from './cover.jpg';

const folder = (id: string, name: string): ContentSidebarItem => ({
  kind: 'folder',
  id,
  name,
});

const MENU: ContentSidebarItem[] = [
  folder('home', 'Home page'),
  folder('marketing', 'Marketing pages'),
  folder('product', 'Product pages'),
  folder('customers', 'Customer stories'),
  {
    kind: 'folder',
    id: 'blog',
    name: 'Blog',
    open: true,
    items: [
      { kind: 'model', id: 'blog-home', name: '📰 Home', singleton: true },
      { kind: 'model', id: 'blog-posts', name: '📝 Posts', active: true },
      { kind: 'model', id: 'blog-authors', name: '✍️ Authors' },
      { kind: 'model', id: 'blog-tags', name: '🏷️ Tags' },
    ],
  },
  folder('docs', 'Docs'),
  folder('academy', 'Academy'),
  folder('updates', 'Product updates'),
  folder('partners', 'Partners'),
  folder('marketplace', 'Marketplace'),
  folder('support', 'Support'),
  folder('legal', 'Legal'),
];

const TITLE = 'One content model, every channel';

function PostForm() {
  return (
    <RecordForm title={TITLE} icon="📝">
      <RecordForm.Field label="Title" required localized>
        <RecordForm.StringInput value={TITLE} large />
      </RecordForm.Field>
      <RecordForm.Field label="Content" required localized>
        <StructuredTextInput>
          <StructuredTextInput.Paragraph>
            Your editors write once. Your website, your app and your AI agents read the same
            structured content through one API, with no copy and paste between tools.
          </StructuredTextInput.Paragraph>
          <StructuredTextInput.Heading>Structure first, layout later</StructuredTextInput.Heading>
          <StructuredTextInput.Paragraph>
            A post is not a page. It is a title, an author, a few tags and a body made of blocks.
            Each frontend decides how it looks: the{' '}
            <StructuredTextInput.Link>Content Delivery API</StructuredTextInput.Link> gives every
            channel exactly the fields it asks for.
          </StructuredTextInput.Paragraph>
          <StructuredTextInput.Paragraph>
            When the marketing team changes the copy, nobody opens a ticket. When the developers add
            a channel, nobody moves the content.
          </StructuredTextInput.Paragraph>
        </StructuredTextInput>
      </RecordForm.Field>
      {/* A tall window shows this field under the content. */}
      <RecordForm.Field label="Cover image (5:3)" required>
        <RecordForm.FileInput
          image={{ src: cover.src, width: 300, height: 180 }}
          caption="A soft gradient in the brand colours"
        />
      </RecordForm.Field>
      <RecordForm.Field label="Slug" required>
        <RecordForm.SlugInput
          prefix="https://www.datocms.com/blog/"
          value="one-content-model-every-channel"
        />
      </RecordForm.Field>
    </RecordForm>
  );
}

type HomeHeroSceneProps = {
  /**
   * The scene is on an inverse surface: the dark cms, with the tint of
   * an inverse surface (see Scene.tsx).
   * @default { surface: 'inverse' }
   */
  appearance?: SceneAppearance;
  height?: number;
  /** The width of the screen in px. With it, the box cuts the screen, and the screen does not get smaller. */
  width?: number;
};

export function HomeHeroScene({
  appearance = { surface: 'inverse' },
  height,
  width,
}: HomeHeroSceneProps) {
  return (
    <Scene
      theme="purple"
      appearance={appearance}
      description="The record editor of DatoCMS: the menu of the models, a blog post with its structured text content, and the panel with the record info."
      height={height}
      width={width}
    >
      <RecordEditorLayout
        navigationBar={
          <NavigationBar user={{ name: 'Demo User' }} project={{ name: 'Larkspur' }} />
        }
        sidebar={<ContentSidebar items={MENU} />}
        aside={
          <InfoAside>
            <InfoAside.RecordInfo
              id="Gd8Qnm7pRUKPjnCVhCYOZw"
              status="published"
              createdAt="09/21/2025, 13:34"
              updatedAt="09/21/2025, 15:39"
              createdBy={{ name: 'Ronak Ganatra' }}
            />
            <InfoAside.PublishingSchedule />
            <InfoAside.WebsitePages
              pages={[
                {
                  environment: 'Production',
                  label: 'Published version',
                  path: '/blog/one-content-model-every-channel',
                  visualEditing: true,
                },
              ]}
            />
          </InfoAside>
        }
      >
        <PostForm />
      </RecordEditorLayout>
    </Scene>
  );
}
