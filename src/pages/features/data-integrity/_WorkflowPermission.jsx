import WorkflowPermissions from '~/components/featureAnimations/WorkflowPermissions';

export default function SpecializedWorkflowPermission() {
  return (
    <WorkflowPermissions>
      <>
        <p>
          Can <strong>perform all actions</strong> on <strong>Articles</strong>
        </p>
        <p>
          Can <strong>create</strong> new <strong>Products</strong>
        </p>
        <p>
          Can <strong>publish</strong> existing <strong>Products</strong>
        </p>
        <p>
          Cannot <strong>delete</strong> existing <strong>Products</strong>
        </p>
      </>
    </WorkflowPermissions>
  );
}
