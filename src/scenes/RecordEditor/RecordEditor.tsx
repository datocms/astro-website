import {
  ContentSidebar,
  type ContentSidebarItem,
  InfoAside,
  NavigationBar,
  type NavigationBarProps,
  RecordEditorLayout,
  type RecordEditorLayoutProps,
  RecordForm,
  StructuredTextInput,
} from '@datocms/product-scenes';
import { Scene, type SceneAppearance } from '../Scene';
import cover from './cover.svg';

// The record editor of DatoCMS, composed from the parts of
// @datocms/product-scenes. Read the scene rules in the README of the
// package. The dates are fixed, thus the markup is the same on each render.

const folder = (id: string, name: string): ContentSidebarItem => ({
  kind: 'folder',
  id,
  name,
});

const MENU: ContentSidebarItem[] = [
  folder('home', 'Home page'),
  folder('marketing', 'Marketing pages'),
  folder('glossary', 'Glossary'),
  folder('product', 'Product Pages'),
  folder('success', 'Success stories'),
  folder('about', 'About page'),
  folder('customers', 'Customer Stories'),
  {
    kind: 'folder',
    id: 'blog',
    name: 'Blog',
    open: true,
    items: [
      { kind: 'model', id: 'blog-home', name: '📰 Home', singleton: true },
      { kind: 'model', id: 'blog-posts', name: '📝 Posts', active: true },
      { kind: 'model', id: 'blog-authors', name: '✍️ Authors' },
    ],
  },
  folder('in-app', 'In-app'),
  { kind: 'model', id: 'docs', name: 'Docs', singleton: true },
  folder('support', 'Support'),
  folder('updates', 'Product updates'),
  folder('academy', 'Academy'),
  folder('guides', 'User Guides'),
  folder('marketplace', 'Marketplace'),
  folder('partners', 'Partner Program'),
  folder('tech-partners', 'Tech Partners'),
];

const TITLE = 'Back to Basics: Headless CMS for Dummies';

type RecordEditorSceneProps = {
  /** The kit hue, purple, without a theme */
  appearance?: SceneAppearance;
  /** The project in the navigation bar. With `logoUrl`, the bar shows the logo. */
  project?: NavigationBarProps['project'];
  /** The columns that the user closed: only their rail shows. */
  collapsed?: RecordEditorLayoutProps['collapsed'];
};

export function RecordEditorScene({
  appearance,
  project = { name: 'Larkspur' },
  collapsed,
}: RecordEditorSceneProps) {
  return (
    <Scene
      theme="purple"
      appearance={appearance}
      description="The record editor of DatoCMS: the menu of the models, the fields of a blog post, and the panel with the record info."
    >
      <RecordEditorLayout
        navigationBar={<NavigationBar user={{ name: 'Demo User' }} project={project} />}
        sidebar={<ContentSidebar items={MENU} />}
        collapsed={collapsed}
        aside={
          <InfoAside>
            <InfoAside.RecordInfo
              id="Gd8Qnm7pRUKPjnCVhCYOZw"
              status="draft"
              createdAt="09/21/2025, 13:34"
              updatedAt="09/21/2025, 15:39"
              blocks="0/10000 (0%)"
              createdBy={{ name: 'Ronak Ganatra' }}
            />
            <InfoAside.PublishingSchedule />
            <InfoAside.WebsitePages
              pages={[
                {
                  environment: 'Production',
                  label: 'Draft version',
                  path: '/blog/headless-cms-for-dummies',
                  visualEditing: true,
                },
                {
                  environment: 'Staging',
                  label: 'Draft version',
                  path: '/api/enter-draft-mode?token=wv2x8f1c&url=/blog/headless-cms-for-dummies',
                },
              ]}
            />
            <InfoAside.Links />
          </InfoAside>
        }
      >
        <RecordForm title={TITLE} icon="📝">
          <RecordForm.Field label="Cover image (5:3)" required>
            <RecordForm.FileInput
              image={{ src: cover.src, width: 300, height: 180 }}
              caption="No metadata set"
            />
          </RecordForm.Field>
          <RecordForm.Field label="Title" required>
            <RecordForm.StringInput value={TITLE} large />
          </RecordForm.Field>
          <RecordForm.Field label="Slug" required>
            <RecordForm.SlugInput
              prefix="https://www.datocms.com/blog/"
              value="headless-cms-for-dummies"
            />
          </RecordForm.Field>
          <RecordForm.Field label="Excerpt" required>
            <StructuredTextInput>
              <StructuredTextInput.Paragraph>
                New to headless CMS? Here’s a super-beginner-friendly guide to what it is, how it
                compares to traditional CMS, and when it makes sense to use one.
              </StructuredTextInput.Paragraph>
            </StructuredTextInput>
          </RecordForm.Field>
          <RecordForm.Field label="Content" required>
            <StructuredTextInput>
              <StructuredTextInput.Paragraph>
                ⚠️ Disclaimer: When I say Dummies, I mean Marketing. Why can I say that? I’m
                Marketing, and I can confirm I’m a dummy. Also, we’ll be going over this post as a
                to-the-point coverage for editors. We’ve written some pretty in-depth deep-dive
                comprehensive posts on all the concepts around Headless CMS on the{' '}
                <StructuredTextInput.Link>DatoCMS Academy</StructuredTextInput.Link>, so if you’re
                looking for proper literature, I’d recommend you check that out!
              </StructuredTextInput.Paragraph>
              <StructuredTextInput.Heading>
                Che confusione: Addressing the confusion
              </StructuredTextInput.Heading>
              <StructuredTextInput.Paragraph>
                If you’ve only known web builders or traditional CMSs, “headless” sounds like
                jargon. Why is this so bleak? Why’re we chopping heads? What in the Hydra is going
                on? Why would I want a CMS that gives me less out of the box?
              </StructuredTextInput.Paragraph>
              <StructuredTextInput.Paragraph>
                Here’s the deal: headless isn’t about giving you less, it’s about giving you only
                what you need, and leaving the rest flexible.
              </StructuredTextInput.Paragraph>
            </StructuredTextInput>
          </RecordForm.Field>
        </RecordForm>
      </RecordEditorLayout>
    </Scene>
  );
}
