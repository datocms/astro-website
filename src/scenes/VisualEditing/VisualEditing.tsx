import {
  InfoAside,
  NavigationBar,
  PREVIEW_RELOAD_SEQUENCE,
  RecordEditorLayout,
  RecordForm,
  VISUAL_EDITING_SEQUENCE,
  VisualEditorLayout,
  WebPreview,
  type WebPreviewTargetProps,
} from '@datocms/product-scenes';
import type { ReactNode } from 'react';
import dawnImage from './dawn.jpg';
import coverImage from './cover.jpg';
import coastImage from './coast.jpg';
import portraitImage from './portrait.jpg';
// The favicon of Field Notes (SVG): an F on the night blue of the cover. The
// site uses it as its logo.
import logo from './logo.svg';
import type { EditorSceneOptions } from '../editor';
import { type FragmentSceneProps, Scene } from '../Scene';
import site from './site.module.css';
import {
  ARTICLE,
  ARTICLE_ICON,
  AUTHOR,
  BODY,
  BODY_MARKDOWN,
  BYLINE,
  COVER_CAPTION,
  PAGE_RECORDS,
  PREVIEW_LINK,
  PROJECT_NAME,
  SAVED_COVER_CAPTION,
  SAVED_EXCERPT,
  SAVED_TITLE,
  SITE,
  USER_NAME,
} from './story';

// The scenes of the chapter "Visual editing": the page of the article
// "Night trains are back" on the draft site of Field Notes, in the plugin
// Web Previews, with the article and its author in the cms. Read the scene
// rules in the README of @datocms/product-scenes. All the values are fixed,
// thus the markup is the same on each render.

/**
 * The width of the tab "Website preview" in the fragment, in px. The plugin
 * asks for 900px; the screen of the fragment has less space. The page gets
 * more of it than the form: the form shows only three fields.
 */
const ASIDE_WIDTH = 620;

/**
 * The width of the sidebar of the tab Visual in the main scene, in px: 10%
 * less than the smallest width of the cms (550px), thus the page has more
 * space for its desktop layout
 */
const SIDEBAR_WIDTH = 495;

/**
 * The smallest width of the screen of the main scene, in px: the sidebar
 * and a page of 765px, where the desktop layout of the site has room for
 * its title and its nav. On a narrower box the kit makes the zoom smaller.
 */
const SCENE_MIN_WIDTH = 1260;

const COVER = { src: coverImage.src, width: 1200, height: 630 };
const SAVED_COVER = { src: coastImage.src, width: 1200, height: 630 };
const PORTRAIT = { src: portraitImage.src, width: 800, height: 800 };

type ArticleVersion = {
  title: string;
  excerpt: string;
  cover: typeof COVER;
  caption: string;
};

const DRAFT: ArticleVersion = {
  title: ARTICLE.title,
  excerpt: ARTICLE.excerpt,
  cover: COVER,
  caption: COVER_CAPTION,
};

const SAVED: ArticleVersion = {
  title: SAVED_TITLE,
  excerpt: SAVED_EXCERPT,
  cover: SAVED_COVER,
  caption: SAVED_COVER_CAPTION,
};

const RECORD_IMAGES: Record<string, string> = {
  [ARTICLE.destination]: dawnImage.src,
  [ARTICLE.title]: coverImage.src,
};

/**
 * An element of the page that content link knows. On the page of the
 * fragment the edit mode is off, thus the element is plain.
 */
function Editable({ editable, ...target }: WebPreviewTargetProps & { editable: boolean }) {
  return editable ? <WebPreview.Target {...target} /> : target.children;
}

function Body() {
  return (
    <div className={site.body}>
      {BODY.map(({ kind, text }) =>
        kind === 'quote' ? (
          <blockquote key={text} className={site.quote}>
            {text}
          </blockquote>
        ) : kind === 'heading' ? (
          <h2 key={text} className={site.heading}>
            {text}
          </h2>
        ) : (
          <p key={text}>{text}</p>
        ),
      )}
    </div>
  );
}

/**
 * The page of the article on the draft site of Field Notes: the header of
 * the site, then the hero (the destination, the title, the byline with the
 * author, the excerpt, and the cover with its caption) and the body. With
 * `editable`, each text and image is a target of content link, in the
 * order of the page: the cover opens the article, and the name of the
 * author opens the author, a record that the article links. `article` is
 * the version of the article on the page. The site is
 * not the cms, thus its markup and its styles are here, in the website.
 * `layout` is the layout of the site: `narrow` is one column, as in a
 * small window; `desktop` has the hero in two columns. The picture
 * chooses it, not the width of the page: the page of the main scene is
 * narrower on phones than the page of the save fragment.
 */
function DraftSite({
  article = DRAFT,
  editable = false,
  layout = 'narrow',
}: {
  article?: ArticleVersion;
  editable?: boolean;
  layout?: 'narrow' | 'desktop';
}) {
  return (
    <div className={layout === 'desktop' ? `${site.page} ${site.desktop}` : site.page}>
      <header className={site.header}>
        <span className={site.brand}>
          <img src={logo.src} width={22} height={22} alt="" />
          {SITE.name}
        </span>
        <nav className={site.nav}>
          {SITE.nav.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </nav>
        <span className={site.subscribe}>{SITE.subscribe}</span>
        <span className={site.draft}>{SITE.exitDraft}</span>
      </header>
      <article className={site.article}>
        <div className={site.hero}>
          <div className={site.intro}>
            <p className={site.kicker}>
              <Editable editable={editable} order={0} inline narrow>
                {ARTICLE.destination}
              </Editable>
            </p>
            <Editable editable={editable} order={1}>
              <h1 className={site.title}>{article.title}</h1>
            </Editable>
            <p className={site.byline}>
              {BYLINE.before}
              <Editable editable={editable} order={2} click="linked" inline narrow>
                <span className={site.author}>{AUTHOR.name}</span>
              </Editable>
              {BYLINE.after}
            </p>
            <Editable editable={editable} order={3}>
              <p className={site.excerpt}>{article.excerpt}</p>
            </Editable>
          </div>
          <Editable editable={editable} order={4} click="record">
            <figure className={site.media}>
              <img
                className={site.cover}
                src={article.cover.src}
                width={article.cover.width}
                height={article.cover.height}
                alt=""
              />
              <figcaption className={site.caption}>{article.caption}</figcaption>
            </figure>
          </Editable>
        </div>
        {/* The column holds the target, thus the outline fits the text */}
        <div className={site.column}>
          <Editable editable={editable} order={5}>
            <Body />
          </Editable>
        </div>
      </article>
    </div>
  );
}

function SavedArticleFields(): ReactNode {
  return (
    <>
      <RecordForm.Field label="Title" required>
        <RecordForm.StringInput value={SAVED.title} large />
      </RecordForm.Field>
      <RecordForm.Field label="Excerpt">
        <RecordForm.TextareaInput value={SAVED.excerpt} rows={3} />
      </RecordForm.Field>
      <RecordForm.Field label="Cover">
        <RecordForm.FileInput image={SAVED.cover} caption={SAVED.caption} />
      </RecordForm.Field>
    </>
  );
}

/**
 * The tab Visual of the cms, with the page of the article in the plugin Web
 * Previews and the sidebar of the visual editing at the right. The scene
 * plays VISUAL_EDITING_SEQUENCE: the sidebar lists the records of the page;
 * the user turns on "Edit mode", and content link flashes the outline of
 * each text and image, one after the other; the user clicks the cover, and
 * the sidebar opens the article, scrolls the long form past the body to
 * the field Cover and highlights it; the user clicks the name of the author, and the
 * sidebar opens the author, scrolls past the portrait to the field Name and
 * highlights it, with the same motion.
 */
export function VisualEditingScene({
  appearance,
  chrome = 'editor',
  height = 900,
}: EditorSceneOptions) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={`The tab Visual of DatoCMS: on the left the page of the article “${ARTICLE.title}” on the draft site of ${SITE.name}, on the right the records of the page: ${PAGE_RECORDS.map(({ title }) => `“${title}”`).join(', ')}. The user turns on “Edit mode”, and a green outline flashes on each text and image of the page, one after the other. The user clicks the cover image: the outline frames it with the label “Open in DatoCMS”, and the right side opens the article, scrolls its form past the title, the slug, the excerpt and the long body, and highlights the field Cover under the body. Then the user clicks the name of the author in the byline, and the right side opens the author ${AUTHOR.name}, scrolls past the portrait, and highlights the field Name.`}
      sequence={VISUAL_EDITING_SEQUENCE}
      minWidth={SCENE_MIN_WIDTH}
      height={height}
    >
      <VisualEditorLayout
        sidebarWidth={SIDEBAR_WIDTH}
        // With the `app` chrome the navigation bar has the tab Visual
        // active. Without it the screen starts at the toolbar of the plugin.
        navigationBar={
          chrome === 'app' && (
            <NavigationBar
              user={{ name: USER_NAME }}
              project={{ name: PROJECT_NAME }}
              activeTab="visual"
            />
          )
        }
        preview={
          <WebPreview mode="visual" link={PREVIEW_LINK}>
            <DraftSite editable layout="desktop" />
          </WebPreview>
        }
        records={
          <VisualEditorLayout.Records
            records={PAGE_RECORDS.map((record) => ({
              ...record,
              image: RECORD_IMAGES[record.title],
            }))}
          />
        }
        record={
          <RecordForm title={ARTICLE.title} icon={ARTICLE_ICON}>
            {/* The cover is under the body, far below the fold of the
                form: the cms scrolls the form past the body to it. The body
                is as high as its text, as in the cms. */}
            <RecordForm.Above>
              <RecordForm.Field label="Title" required>
                <RecordForm.StringInput value={ARTICLE.title} large />
              </RecordForm.Field>
              <RecordForm.Field label="Slug" required>
                <RecordForm.SlugInput prefix={ARTICLE.slugPrefix} value={ARTICLE.slug} />
              </RecordForm.Field>
              <RecordForm.Field label="Excerpt">
                <RecordForm.TextareaInput value={ARTICLE.excerpt} rows={3} />
              </RecordForm.Field>
              <RecordForm.Field label="Body">
                <RecordForm.TextareaInput value={BODY_MARKDOWN} rows={5} grow />
              </RecordForm.Field>
            </RecordForm.Above>
            <RecordForm.Field label="Cover" highlighted>
              <RecordForm.FileInput image={COVER} caption={COVER_CAPTION} />
            </RecordForm.Field>
          </RecordForm>
        }
        linked={
          <RecordForm title={AUTHOR.name} icon={AUTHOR.icon}>
            {/* The portrait is above the name: the cms scrolls the form
                to the name as it scrolls to the cover of the article,
                thus both clicks land on their field the same way. */}
            <RecordForm.Above>
              <RecordForm.Field label="Portrait">
                <RecordForm.FileInput image={PORTRAIT} caption={AUTHOR.portraitCaption} />
              </RecordForm.Field>
            </RecordForm.Above>
            <RecordForm.Field label="Name" required highlighted>
              <RecordForm.StringInput value={AUTHOR.name} large />
            </RecordForm.Field>
            <RecordForm.Field label="Role">
              <RecordForm.StringInput value={AUTHOR.role} />
            </RecordForm.Field>
            <RecordForm.Field label="Bio">
              <RecordForm.TextareaInput value={AUTHOR.bio} rows={3} />
            </RecordForm.Field>
          </RecordForm>
        }
      />
    </Scene>
  );
}

/**
 * The record editor with the article and its page in the tab "Website
 * preview", with a new version of the article in the form: another title,
 * excerpt and cover. The scene plays PREVIEW_RELOAD_SEQUENCE: the form has
 * unsaved changes, thus the toolbar shows the button Save, and the page
 * has the old version; the user clicks Save, the plugin reloads the page,
 * and the page shows the new version. The model has no draft/publish
 * (`draftMode={false}`): the save publishes the article, thus it is
 * "Published", and after the save the button Save is disabled.
 * The edit mode is off: the user knows which field to edit.
 */
export function VisualEditingSaveScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme="green"
      appearance={appearance}
      description={`The record editor of DatoCMS with the article, and its page on the draft site of ${SITE.name} in the tab “Website preview”. The form has a new version of the article: the title “${SAVED.title}”, a new excerpt and a new cover, the coast in the morning. The toolbar tells that the article has unsaved changes, and the page still shows the old version: the title “${DRAFT.title}” and the night train under the moon. The user clicks Save: the article is saved and published, the preview reloads, and the page shows the new title, the new excerpt and the new cover.`}
      sequence={PREVIEW_RELOAD_SEQUENCE}
      width={width}
      height={height}
    >
      <RecordEditorLayout
        navigationBar={null}
        sidebar={null}
        asideWidth={ASIDE_WIDTH}
        aside={
          <InfoAside tab="websitePreview">
            <WebPreview link={PREVIEW_LINK} reloaded={<DraftSite article={SAVED} />}>
              <DraftSite />
            </WebPreview>
          </InfoAside>
        }
      >
        <RecordForm
          title={SAVED.title}
          icon={ARTICLE_ICON}
          status="published"
          draftMode={false}
          dirty="until-saved"
        >
          <SavedArticleFields />
        </RecordForm>
      </RecordEditorLayout>
    </Scene>
  );
}
