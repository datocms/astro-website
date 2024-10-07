import WorkflowPermissions from '~/components/featureAnimations/WorkflowPermissions';

export default function SpecializedWorkflowPermission() {
  return (
    <WorkflowPermissions>
      <>
        <p>
          Can <strong>create</strong> new <strong>Articles</strong>
        </p>

        <p>
          Can move new <strong>Articles</strong> from <strong>Draft</strong> stage to{' '}
          <strong>In review</strong>
        </p>

        <p>
          Can publish <strong>Articles</strong> in <strong>Approved</strong> stage
        </p>
      </>
    </WorkflowPermissions>
  );
}
