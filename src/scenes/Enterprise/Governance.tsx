import { RolePermissions, WorkflowStages } from '@datocms/product-scenes';
import { type FragmentSceneProps, Scene, type SceneAppearance } from '../Scene';
import { BRAND_WORKFLOW, GROUP_NAME, ROLES } from './story';

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
