import type { APIRoute } from 'astro';
import { SECRET_API_TOKEN } from 'astro:env/server';
import { maybeInvalidateFetchPluginSdkManifest } from '~/components/legacy/docs/blocks/PluginSdkHookGroup';
import { maybeInvalidateCmaHyperschema } from '~/components/legacy/docs/cmaApi/fetchSchema';
import { maybeInvalidateCloudflareDatacenters } from '~/components/legacy/featureAnimations/CdnMap/utils';
import { maybeInvalidateFavicon } from '~/layouts/BaseLayout/fetchFavicon';
import { maybeInvalidateNavbar } from '~/layouts/LegacyLayout/Navbar/fetchNavbar';
import {
  maybeInvalidateCdaIntrospectionFieldFilters,
  maybeInvalidateCdaIntrospectionUploadFilters,
} from '~/pages/docs/content-delivery-api/_utils';
import { maybeInvalidateSiteApiErrorCodes } from '~/pages/docs/content-management-api/_utils';
import { maybeInvalidateDastSchema } from '~/pages/docs/structured-text/_utils';
import { maybeInvalidatePerOwnerPricingPlans } from '~/lib/pricing/perOwnerPricingPlans';
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
      maybeInvalidateCmaHyperschema(),
      maybeInvalidatePerOwnerPricingPlans(),
      maybeInvalidateDastSchema(),
      maybeInvalidateCloudflareDatacenters(),
      maybeInvalidateFavicon(),
      maybeInvalidateCdaIntrospectionUploadFilters(),
      maybeInvalidateCdaIntrospectionFieldFilters(),
      maybeInvalidateSiteApiErrorCodes(),
      maybeInvalidateNavbar(),
    ]);

    return json({ invalidatedSurrogateKeys: results.filter(Boolean) });
  } catch (error) {
    return handleUnexpectedError(request, error);
  }
};
