import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { maybeInvalidateFetchPluginSdkManifest } from '~/components/docs/blocks/PluginSdkHookGroup';
import { maybeInvalidateReactUiExamples } from '~/components/docs/blocks/ReactUiLiveExample/utils';
import { maybeInvalidateSiteApiHyperschema } from '~/components/docs/restApi/fetchSchema';
import { maybeInvalidateFastlyDatacenters } from '~/components/featureAnimations/CdnMap/utils';
import { maybeInvalidateDastSchema } from '~/pages/docs/structured-text/_utils';
import { maybeInvalidatePerOwnerPricingPlans } from '~/pages/pricing/_sub/perOwnerPricingPlans';
import { handleUnexpectedError, invalidRequestResponse, json } from '../_utils';

export const POST: APIRoute = async ({ url, request }) => {
  try {
    // Parse query string parameters
    const token = url.searchParams.get('token');

    // Ensure that the request is coming from a trusted source
    if (token !== SECRET_API_TOKEN) {
      return invalidRequestResponse('Invalid token', 401);
    }

    const results = await Promise.all([
      maybeInvalidateFetchPluginSdkManifest(),
      maybeInvalidateSiteApiHyperschema(),
      maybeInvalidatePerOwnerPricingPlans(),
      maybeInvalidateReactUiExamples(),
      maybeInvalidateDastSchema(),
      maybeInvalidateFastlyDatacenters(),
    ]);

    return json({ invalidatedSurrogateKeys: results.filter(Boolean) });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
