import { RecordForm, RolePermissions, WorkflowStages } from '@datocms/product-scenes';
import { EditorScene, type EditorStory } from '../editor';
import { type FragmentSceneProps, Scene, type SceneAppearance } from '../Scene';
import logoUrl from './northwind-logo.svg?url';
import { BRAND_WORKFLOW, GROUP_NAME, LANDING_PAGE_ICON, ROLES, WHITE_LABEL } from './story';

// The scenes of the chapter "Governance" of the enterprise page. Read the
// scene rules in the README of @datocms/product-scenes. All the values are
// fixed, thus the markup is the same on each render.

const THEME = 'purple';

/**
 * The record permissions of one of the two custom roles of the frame
 * (ROLES in story.ts). The screen takes the width of its half of the
 * frame, and it is `minWidth` wide at least.
 */
export function RoleScene({
  role,
  appearance,
  height,
  minWidth,
}: {
  role: (typeof ROLES)[number];
  appearance?: SceneAppearance;
  height: number;
  minWidth: number;
}) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The record permissions of the custom role ${role.name} in DatoCMS, for ${GROUP_NAME}. ${role.summary}`}
      height={height}
      minWidth={minWidth}
    >
      <RolePermissions>
        {role.ruleSets.map((set) => (
          <RolePermissions.RuleSet
            key={set.apiKey}
            emoji={set.emoji}
            title={set.title}
            apiKey={set.apiKey}
          >
            {set.rules.map((rule) => (
              <RolePermissions.Rule key={JSON.stringify(rule)} {...rule} />
            ))}
          </RolePermissions.RuleSet>
        ))}
      </RolePermissions>
    </Scene>
  );
}

/**
 * The stages of the workflow of one brand in its settings: Draft, Legal,
 * Brand and Approved
 */
export function BrandWorkflowScene({ width, height, appearance }: FragmentSceneProps) {
  return (
    <Scene
      theme={THEME}
      appearance={appearance}
      description={`The settings of a workflow in DatoCMS, the one of a brand of ${GROUP_NAME}. It has four stages, in this order: ${BRAND_WORKFLOW.map((stage) => `${stage.name} (${stage.description})`).join(', ')}.`}
      width={width}
      height={height}
    >
      <WorkflowStages stages={BRAND_WORKFLOW.map((stage) => ({ ...stage }))} />
    </Scene>
  );
}

const WHITE_LABEL_STORY: EditorStory = {
  project: GROUP_NAME,
  logoUrl,
  user: 'Lena Vogel',
  menu: {
    folder: 'Germany',
    models: [`${LANDING_PAGE_ICON} Landing pages`, '📰 Blog posts'],
    closed: ['France', 'Italy', 'Spain'],
  },
  record: {
    id: 'Wq4nT8bLz2KcR7vHe1MaPd',
    status: 'draft',
    createdAt: '10/02/2026, 10:12',
    updatedAt: '10/14/2026, 16:40',
    createdBy: 'Lena Vogel',
  },
};

/**
 * The cms of the group, white-labelled: the logo of Northwind in the
 * navigation bar and the interface in the brand colour of the group. The
 * browser window around it (WhiteLabel.astro) shows the address of the
 * group. It is the picture of the fragment "Your brand on the CMS".
 */
export function WhiteLabelScene({ height }: { height: number }) {
  const page = WHITE_LABEL.landingPage;
  return (
    <EditorScene
      theme={WHITE_LABEL.brandTheme}
      appearance={{ theme: WHITE_LABEL.brandTheme }}
      chrome="app"
      height={height}
      story={WHITE_LABEL_STORY}
      description={`The record editor of DatoCMS at ${WHITE_LABEL.address}, white-labelled for ${GROUP_NAME}: the logo of Northwind in the navigation bar, and the interface in the green of the brand. A landing page of the German market is open, “${page.title}”.`}
    >
      <RecordForm title={page.title} icon={LANDING_PAGE_ICON}>
        <RecordForm.Field label="Title" required localized>
          <RecordForm.StringInput value={page.title} large />
        </RecordForm.Field>
        <RecordForm.Field label="Slug" required>
          <RecordForm.SlugInput prefix={page.slugPrefix} value={page.slug} />
        </RecordForm.Field>
        <RecordForm.Field label="Intro" localized>
          <RecordForm.TextareaInput value={page.intro} rows={2} />
        </RecordForm.Field>
      </RecordForm>
    </EditorScene>
  );
}
